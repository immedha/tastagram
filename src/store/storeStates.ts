export interface allSlicesState {
  global: globalSliceState;
  user: userSliceState;
}

export interface globalSliceState {
  displayedComponent: string | null;
}

export interface userSliceState {
  userId: string | null,
  username: string | null,
}