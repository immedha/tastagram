import { createSlice } from "@reduxjs/toolkit";
import { allSlicesState, userSliceState } from "../storeStates";

const initialState: userSliceState = {
  userId: null,
  username: null,
  photos: null,
  likedTags: null,
  dislikedTags: null,
  recentlyViewedPhotos: null,
  feed: null,

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
    setRecentlyViewedPhotos: (state, action) => { // action.payload is just a string[]
      state.recentlyViewedPhotos = action.payload;
    },
    setFeed: (state, action) => { // action.payload is just a string[]
      state.feed = action.payload;
    },
    setUserData: (state, action) => { // action.payload is a userSliceState
      const { userId, username, photos, likedTags, dislikedTags, recentlyViewedPhotos, feed } = action.payload;
      state.userId = userId;
      state.username = username;
      state.photos = photos;
      state.likedTags = likedTags;
      state.dislikedTags = dislikedTags;
      state.recentlyViewedPhotos = recentlyViewedPhotos;
      state.feed = feed;
    },
  }
});

export const { setUsername, setUserId, setPhotos, setLikedTags, setDislikedTags, setRecentlyViewedPhotos, setFeed, setUserData } = userSlice.actions;

export const selectUsername = (state: allSlicesState) => state.user.username;
export const selectUserId = (state: allSlicesState) => state.user.userId;


export default userSlice.reducer;