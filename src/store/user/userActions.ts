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
