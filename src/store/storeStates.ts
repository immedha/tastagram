export interface allSlicesState {
  global: globalSliceState;
  user: userSliceState;
}

export interface globalSliceState {
  displayedComponent: string | null;
}

export interface userSliceState extends userDbState{
  userId: string | null,
  feed: FeedPhotoData[] | null,
  nextFeed: FeedPhotoData[] | null,
  feedIdx: number,
}

export interface FeedPhotoData {
  photoId: string,
  photoUrl: string,
  userId: string,
  username: string,
  name: string,
}

export interface UserPhoto {
  photoId: string,
  photoUrl: string,
}

export interface userDbState {
  username: string | null,
  photos: UserPhoto[] | null,
  likedTags: string[] | null,
  dislikedTags: string[] | null,
}

export const FEED_SIZE: number = 10;