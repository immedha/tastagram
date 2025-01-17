/* eslint-disable @typescript-eslint/no-explicit-any */
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchInitialDataAction, fetchInitialDataActionFormat, generateFeedAction, loginAction, loginActionFormat, logoutAction, signUpAction, signUpActionFormat, swipePhotoAction, swipePhotoActionFormat, addUserPhotoActionFormat, addUserPhotoAction } from './userActions';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import Cookies from 'universal-cookie';
import { incrFeedIdx, resetFeedIdx, selectDislikedTags, selectFeedIdx, selectLikedTags, selectPhotos, selectUserId, setDislikedTags, setFeed, setLikedTags, setPhotos, setUserData, setUserId } from './userSlice';
import { addPhotoToTags, addPhotoToUser, fetchUserData, generateNewFeed, initializeUserInDb, savePhotoToDb, savePhotoToStorage, setDislikedTagsInDb, setLikedTagsInDb } from '../../dbQueries';
import { FEED_SIZE, FeedPhotoData, userDbState, UserPhoto } from '../storeStates';
import { select } from 'redux-saga/effects';

function* logIn(action: loginActionFormat) {
  try {
    const {email, password} = action.payload;
    const auth: Auth = yield call(getAuth);
    const result: UserCredential = yield call(signInWithEmailAndPassword, auth, email, password)
    console.log("User logged in:", result.user);
    new Cookies().set("userId", "" + result.user.uid);
    yield put(setUserId("" + result.user.uid));
  } catch (error: any) {
    console.error("Error logging in:", error.message);
  }
}

function* logOut() {
  try {
    const auth: Auth = yield call(getAuth);
    auth.signOut();
    new Cookies().remove("userId");
    yield put(setUserId(null));
  } catch (error: any) {
    console.error(error);
    console.error("Error logging out:", error.message);
  }
}

function* signUp(action: signUpActionFormat) {
  // QUESTION: why does POST error display in console when signing up even though sign up is successful?
  try {
    const auth: Auth = yield call(getAuth);
    const { email, username, password } = action.payload;
    const result: UserCredential = yield call(createUserWithEmailAndPassword, auth, email, password);
    yield call(initializeUserInDb, username, result.user.uid);
    // add user to db
    console.log("User signed up:", result.user);
    new Cookies().set("userId", "" + result.user.uid);
    // set user data to redux store
    yield put(setUserId("" + result.user.uid));
  } catch (error: any) {
    console.error("Error signing up:", error.message);
  }
}

function* fetchInitialData(action: fetchInitialDataActionFormat) {
  try {
    const { userId } = action.payload;
    // call a fetch function to get user data from db and load it into the redux store
    const userData: userDbState = yield call(fetchUserData, userId);
    const { username, photos, likedTags, dislikedTags } = userData;
    yield put(setUserData({userId, username, photos, likedTags, dislikedTags}));
    yield put(generateFeedAction());
  } catch (error: any) {
    console.error("Error fetching initial data:", error.message);
  }
}

function* generateFeed() {
  const likedTags: string[] = yield select(selectLikedTags);
  const feed: FeedPhotoData[] = yield call(generateNewFeed, likedTags);
  yield put(setFeed(feed));
  yield put(resetFeedIdx());
}

function* swipePhoto(action: swipePhotoActionFormat) {
  // get specific photo based on feedIdx
  const feedIdx: number = yield select(selectFeedIdx);
  const feed: FeedPhotoData[] = yield select(state => state.user.feed);
  // get tags of photo
  const tags: string[] = feed[feedIdx].tags;
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
  // generate new feed if feedIdx is at end
  if (feedIdx + 1 === FEED_SIZE) {
    console.log("Generating new feed at end...");
    yield put(generateFeedAction());
  }
}

function* addUserPhoto(action: addUserPhotoActionFormat) {
  const { file, name, tags } = action.payload;
  // save photo to firebase storage and get photoUrl
  console.log('saving to storage');
  const photoUrl: string = yield call(savePhotoToStorage, file);
  // create doc in photos collection in db and save data
  console.log('saving photo to db');
  const photoId: string = yield call(savePhotoToDb, name, photoUrl, tags);
  // add photoId+Url to user's photos array in db
  console.log('adding photo to user');
  const userId: string = yield select(selectUserId);
  yield call(addPhotoToUser, userId, photoId, photoUrl);
  // loop through tags for photo and add to array in corresponding tag document in tags collection
  console.log('adding photo to tags');
  yield call(addPhotoToTags, tags, photoId);
  // add photoId+Url to user's photos array in redux store
  console.log('adding photo to store');
  const origUserPhotos: UserPhoto[] = yield select(selectPhotos) || [];
  const newPhotos: UserPhoto[] = [...origUserPhotos, {photoId, photoUrl}];
  yield put(setPhotos(newPhotos));
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