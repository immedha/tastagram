import { createAction } from "@reduxjs/toolkit";

export interface loginActionPayload {
  email: string;
  password: string;
}

export interface loginActionFormat {
  type: string;
  payload: loginActionPayload
}

export const loginAction = createAction<loginActionPayload>('user/loginAction');

export interface signUpActionPayload {
  email: string;
  username: string;
  password: string;
}

export interface signUpActionFormat {
  type: string;
  payload: signUpActionPayload
}

export const signUpAction = createAction<signUpActionPayload>('user/signUpAction');

export const logoutAction = createAction('user/logoutAction');

export interface fetchInitialDataActionPayload {
  userId: string;
}

export interface fetchInitialDataActionFormat {
  type: string;
  payload: fetchInitialDataActionPayload
}

export const fetchInitialDataAction = createAction<fetchInitialDataActionPayload>('user/fetchInitialDataAction');

export interface generateFeedActionPayload {
  prefetch: boolean;
}

export interface generateFeedActionFormat {
  type: string;
  payload: generateFeedActionPayload
}

export const generateFeedAction = createAction<generateFeedActionPayload>('user/generateFeedAction');

export interface swipePhotoActionPayload {
  liked: boolean;
}

export interface swipePhotoActionFormat {
  type: string;
  payload: swipePhotoActionPayload
}
export const swipePhotoAction = createAction<swipePhotoActionPayload>('user/likePhotoAction');

export interface addUserPhotoActionPayload {
  file: File;
  name: string;
  tags: string[];
}

export interface addUserPhotoActionFormat {
  type: string;
  payload: addUserPhotoActionPayload
}
export const addUserPhotoAction = createAction<addUserPhotoActionPayload>('user/addUserPhotoAction');


