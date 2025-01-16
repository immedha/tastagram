/* eslint-disable @typescript-eslint/no-explicit-any */
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchInitialDataAction, fetchInitialDataActionFormat, loginAction, loginActionFormat, logoutAction, signUpAction, signUpActionFormat } from './userActions';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import Cookies from 'universal-cookie';
import { setUserData, setUserId } from './userSlice';
import { fetchUserData, initializeUser } from '../../dbQueries';
import { userDbState } from '../storeStates';

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
    yield call(initializeUser, username, result.user.uid);
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
    yield put(setUserData({...userData, userId}));
  } catch (error: any) {
    console.error("Error fetching initial data:", error.message);
  }
}

export default function* userSaga() {
  yield all([
    takeEvery(loginAction.type, logIn),
    takeEvery(logoutAction.type, logOut),
    takeEvery(signUpAction.type, signUp),
    takeEvery(fetchInitialDataAction.type, fetchInitialData),
  ]);
}