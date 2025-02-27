/* eslint-disable @typescript-eslint/no-explicit-any */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { fetchInitialDataAction, fetchInitialDataActionFormat, generateFeedAction, loginAction, loginActionFormat, logoutAction, signUpAction, signUpActionFormat, swipePhotoAction, swipePhotoActionFormat, addUserPhotoActionFormat, addUserPhotoAction, generateFeedActionFormat } from './userActions';
import { Auth, browserLocalPersistence, createUserWithEmailAndPassword, getAuth, setPersistence, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { incrFeedIdx, resetFeedIdx, selectDislikedTags, selectFeedIdx, selectLikedTags, selectNextFeed, selectPhotos, selectUserId, selectUsername, setDislikedTags, setFeed, setLikedTags, setNextFeed, setPhotos, setUserData, setUserId } from './userSlice';
import { addPhotoToTags, addPhotoToUser, fetchUserData, generateNewFeed, getTagsOfPhoto, initializeUserInDb, savePhotoToDb, savePhotoToStorage, setDislikedTagsInDb, setLikedTagsInDb } from '../../dbQueries';
import { FEED_SIZE, FeedPhotoData, userDbState, UserPhoto } from '../storeStates';
import { select } from 'redux-saga/effects';
import { setErrorMessage, setPageState } from '../global/globalSlice';

function* logIn(action: loginActionFormat) {
  try {
    yield put(setPageState("loading"));
    const {email, password} = action.payload;
    const auth: Auth = yield call(getAuth);
    yield call(setPersistence, auth, browserLocalPersistence);
    const result: UserCredential = yield call(signInWithEmailAndPassword, auth, email, password)
    yield put(setUserId("" + result.user.uid));
    yield put(setPageState("idle"));
  } catch (error: any) {
    yield put(setPageState("error"));
    yield put(setErrorMessage(error.message));
    console.error("Error logging in:", error.message);
  }
}

function* logOut() {
  try {
    yield put(setPageState("loading"));
    const auth: Auth = yield call(getAuth);
    auth.signOut();
    yield put(setUserId(null));
    yield put(setPageState("idle"));
  } catch (error: any) {
    yield put(setPageState("error"));
    yield put(setErrorMessage(error.message));
    console.error("Error logging out:", error.message);
  }
}

function* signUp(action: signUpActionFormat) {
  // QUESTION: why does POST error display in console when signing up even though sign up is successful?
  try {
    yield put(setPageState("loading"));
    const auth: Auth = yield call(getAuth);
    const { email, username, password } = action.payload;
    yield call(setPersistence, auth, browserLocalPersistence);
    const result: UserCredential = yield call(createUserWithEmailAndPassword, auth, email, password);
    yield call(initializeUserInDb, username, result.user.uid);
    // add user to db
    // set user data to redux store
    yield put(setUserId("" + result.user.uid));
    yield put(setPageState("idle"));
  } catch (error: any) {
    yield put(setPageState("error"));
    yield put(setErrorMessage(error.message));
    console.error("Error signing up:", error.message);
  }
}

function* fetchInitialData(action: fetchInitialDataActionFormat) {
  try {
    yield put(setPageState("loading"));
    const { userId } = action.payload;
    // call a fetch function to get user data from db and load it into the redux store
    const userData: userDbState = yield call(fetchUserData, userId);
    const { username, photos, likedTags, dislikedTags } = userData;
    yield put(setUserData({userId, username, photos, likedTags, dislikedTags}));
    yield put(generateFeedAction({prefetch: false}));
    yield put(setPageState("idle"));
  } catch (error: any) {
    yield put(setPageState("error"));
    yield put(setErrorMessage(error.message));
    console.error("Error fetching initial data:", error.message);
  }
}

function* generateFeed(action: generateFeedActionFormat) {
  try {
    yield put(setPageState("loading"));
    const { prefetch } = action.payload;
    const likedTags: string[] = yield select(selectLikedTags);
    const feed: FeedPhotoData[] = yield call(generateNewFeed, likedTags);
    yield put(setPageState("idle"));
    if (prefetch) {
      yield put(setNextFeed(feed));
    } else {
      yield put(setFeed(feed));
      yield put(resetFeedIdx());
    }
  } catch (error: any) {
    yield put(setPageState("error"));
    yield put(setErrorMessage(error.message));
  }
}

function* swipePhoto(action: swipePhotoActionFormat) {
  try {
    // yield put(setPageState("loading"));
    // get specific photo based on feedIdx
    const feedIdx: number = yield select(selectFeedIdx);
    const feed: FeedPhotoData[] = yield select(state => state.user.feed);
    // get tags of photo
    const tags: string[] = yield call(getTagsOfPhoto, feed[feedIdx].photoId); //feed[feedIdx].tags;
    const {liked} = action.payload;
    // add tags to likedTags/dislikedTags in db+store
    const userId: string = yield select(selectUserId);
    if (liked) {
      const likedTags: string[] = yield select(selectLikedTags);
      const likedTagsSet = new Set<string>(likedTags);
      tags.forEach((item) => likedTagsSet.add(item));
      yield call(setLikedTagsInDb, userId, Array.from(likedTagsSet));
      yield put(setLikedTags(Array.from(likedTagsSet)));
    } else {
      const dislikedTags: string[] = yield select(selectDislikedTags);
      const dislikedTagsSet = new Set(dislikedTags);
      tags.forEach((item) => dislikedTagsSet.add(item));
      yield call(setDislikedTagsInDb, userId, Array.from(dislikedTagsSet));
      yield put(setDislikedTags(Array.from(dislikedTagsSet)));
    }
    // increment feedIdx
    yield put(incrFeedIdx());
    const newFeedIdx: number = feedIdx + 1;
    
    // pre-fetch new feed if feedIdx is almost at end
    if (newFeedIdx === Math.floor(0.75 * FEED_SIZE)) {
      yield fork(prefetchNextFeed);
    } else if (newFeedIdx === FEED_SIZE) { // completed the feed
      const nextFeed: FeedPhotoData[] = yield select(selectNextFeed);
      yield put(setFeed([...nextFeed]));
      yield put(resetFeedIdx());
      yield put(setNextFeed(null));
    }
    // yield put(setPageState("idle"));
  } catch (error: any) {
    yield put(setPageState("error"));
    yield put(setErrorMessage(error.message));
  }
}

function* prefetchNextFeed() {
  yield put(generateFeedAction({prefetch: true}));
}

function* addUserPhoto(action: addUserPhotoActionFormat) {
  try {
    yield put(setPageState("loading"));
    const { file, name, tags } = action.payload;
    // save photo to firebase storage and get photoUrl
    const photoUrl: string = yield call(savePhotoToStorage, file);
    // create doc in photos collection in db and save data
    const userId: string = yield select(selectUserId);
    const username: string = yield select(selectUsername);
    const photoId: string = yield call(savePhotoToDb, userId, username, name, photoUrl, tags);
    // add photoId+Url to user's photos array in db
    yield call(addPhotoToUser, userId, photoId, photoUrl);
    // loop through tags for photo and add doc in photos collection of corresponding tag document in tags collection
    yield call(addPhotoToTags, userId, username, name, photoUrl, tags, photoId);
    // add photoId+Url to user's photos array in redux store
    const origUserPhotos: UserPhoto[] = yield select(selectPhotos) || [];
    const newPhotos: UserPhoto[] = [...origUserPhotos, {photoId, photoUrl}];
    yield put(setPhotos(newPhotos));
    yield put(setPageState("idle"));
  } catch (error: any) {
    yield put(setPageState("error"));
    yield put(setErrorMessage(error.message));
  }
}


export default function* userSaga() {
  yield all([
    takeEvery(loginAction.type, logIn),
    takeEvery(logoutAction.type, logOut),
    takeEvery(signUpAction.type, signUp),
    takeEvery(fetchInitialDataAction.type, fetchInitialData),
    takeEvery(generateFeedAction.type, generateFeed),
    takeEvery(swipePhotoAction.type, swipePhoto),
    takeEvery(addUserPhotoAction.type, addUserPhoto),
  ]);
}