import { createSlice } from "@reduxjs/toolkit";
import { allSlicesState, userSliceState } from "../storeStates";

const initialState: userSliceState = {
  userId: null,
  username: null,
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
  }
});

export const { setUsername, setUserId } = userSlice.actions;

export const selectUsername = (state: allSlicesState) => state.user.username;
export const selectUserId = (state: allSlicesState) => state.user.userId;


export default userSlice.reducer;