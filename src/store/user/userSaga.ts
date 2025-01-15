/* eslint-disable @typescript-eslint/no-explicit-any */
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchInitialDataAction, fetchInitialDataActionFormat, loginAction, loginActionFormat, logoutAction, signUpAction, signUpActionFormat } from './userActions';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import Cookies from 'universal-cookie';
import { setUserId } from './userSlice';
import { setDisplayedComponent } from '../global/globalSlice';

function* logIn(action: loginActionFormat) {
  try {
    const {email, password} = action.payload;
    const auth: Auth = yield call(getAuth);
    const result: UserCredential = yield call(signInWithEmailAndPassword, auth, email, password)
    console.log("User logged in:", result.user);
    new Cookies().set("userId", "" + result.user.uid);
    yield put(setUserId("" + result.user.uid));
    yield put(setDisplayedComponent("login"));
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
    yield put(setDisplayedComponent("home"));
  } catch (error: any) {
    console.error(error);
    console.error("Error logging out:", error.message);
  }
}

function* signUp(action: signUpActionFormat) {
  // QUESTION: why does POST error display in console when signing up even though sign up is successful?
  try {
    const auth: Auth = yield call(getAuth);
    const { email, password } = action.payload;
    const result: UserCredential = yield call(createUserWithEmailAndPassword, auth, email, password);
    console.log("User signed up:", result.user);
    new Cookies().set("userId", "" + result.user.uid);
    yield put(setUserId("" + result.user.uid));
    yield put(setDisplayedComponent("home"));
  } catch (error: any) {
    console.error("Error signing up:", error.message);
  }
}

function* fetchInitialData(action: fetchInitialDataActionFormat) {
  try {
    const { userId } = action.payload;
    yield put(setUserId(userId));
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