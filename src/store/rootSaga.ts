// src/sagas/rootSaga.ts
import { all } from 'redux-saga/effects';
import globalSaga from './global/globalSaga.ts';
import userSaga from './user/userSaga.ts';

export default function* rootSaga() {
  yield all([
    globalSaga(),
    userSaga(),
  ]);
}
