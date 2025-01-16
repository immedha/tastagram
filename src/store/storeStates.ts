export interface allSlicesState {
  global: globalSliceState;
  user: userSliceState;
}

export interface globalSliceState {
  displayedComponent: string | null;
}

export interface userSliceState extends userDbState {
  userId: string | null,
}

export interface userDbState {
  username: string | null,
  photos: string[] | null,
  likedTags: string[] | null,
  dislikedTags: string[] | null,
  recentlyViewedPhotos: string[] | null,
  feed: string[] | null,
}