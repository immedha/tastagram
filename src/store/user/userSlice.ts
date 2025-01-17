import { createSlice } from "@reduxjs/toolkit";
import { allSlicesState, userSliceState } from "../storeStates";

const initialState: userSliceState = {
  userId: null,
  username: null,
  photos: null,
  likedTags: null,
  dislikedTags: null,
  feed: null,
  nextFeed: null,
  feedIdx: 0,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action) => { // action.payload is just a string
      state.userId = action.payload;
    },
    setUsername: (state, action) => { // action.payload is just a string
      state.username = action.payload;
    },
    setPhotos: (state, action) => { // action.payload is just a string[]
      state.photos = action.payload;
    },
    setLikedTags: (state, action) => { // action.payload is just a string[]
      state.likedTags = action.payload;
    },
    setDislikedTags: (state, action) => { // action.payload is just a string[]
      state.dislikedTags = action.payload;
    },
    setFeed: (state, action) => { // action.payload is just a string[]
      state.feed = action.payload;
    },
    setNextFeed: (state, action) => { // action.payload is just a string[]
      state.nextFeed = action.payload;
    },
    incrFeedIdx: (state) => {
      state.feedIdx++;
    },
    resetFeedIdx: (state) => {
      state.feedIdx = 0;
    },
    setUserData: (state, action) => { // action.payload is a userSliceState
      const { userId, username, photos, likedTags, dislikedTags } = action.payload;
      state.userId = userId;
      state.username = username;
      state.photos = photos;
      state.likedTags = likedTags;
      state.dislikedTags = dislikedTags;
    },
  }
});

export const { setNextFeed, incrFeedIdx, resetFeedIdx, setUsername, setUserId, setPhotos, setLikedTags, setDislikedTags, setFeed, setUserData } = userSlice.actions;

export const selectUsername = (state: allSlicesState) => state.user.username;
export const selectUserId = (state: allSlicesState) => state.user.userId;
export const selectFeed = (state: allSlicesState) => state.user.feed;
export const selectFeedIdx = (state: allSlicesState) => state.user.feedIdx;
export const selectLikedTags = (state: allSlicesState) => state.user.likedTags;
export const selectDislikedTags = (state: allSlicesState) => state.user.dislikedTags;
export const selectPhotos = (state: allSlicesState) => state.user.photos;
export const selectNextFeed = (state: allSlicesState) => state.user.nextFeed;

export default userSlice.reducer;