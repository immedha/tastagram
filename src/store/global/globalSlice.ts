import { createSlice } from "@reduxjs/toolkit";
import { allSlicesState, globalSliceState } from "../storeStates";

const initialState: globalSliceState = {
  displayedComponent: null,
}

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setDisplayedComponent: (state, action) => { // action.payload is just a string
      state.displayedComponent = action.payload;
    },
  }
});

export const { setDisplayedComponent } = globalSlice.actions;

export const selectDisplayedComponent = (state: allSlicesState) => state.global.displayedComponent;

export default globalSlice.reducer;