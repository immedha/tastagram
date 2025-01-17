import { createSlice } from "@reduxjs/toolkit";
import { allSlicesState, globalSliceState } from "../storeStates";

const initialState: globalSliceState = {
  displayedComponent: null,
  pageState: 'idle',
  errorMessage: null,
}

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setDisplayedComponent: (state, action) => { // action.payload is just a string
      state.displayedComponent = action.payload;
    },
    setPageState: (state, action) => { // action.payload is just a string
      state.pageState = action.payload;
    },
    setErrorMessage: (state, action) => { // action.payload is just a string
      state.errorMessage = action.payload;
    },
  }
});

export const { setDisplayedComponent, setErrorMessage, setPageState } = globalSlice.actions;

export const selectDisplayedComponent = (state: allSlicesState) => state.global.displayedComponent;
export const selectPageState = (state: allSlicesState) => state.global.pageState;
export const selectErrorMessage = (state: allSlicesState) => state.global.errorMessage;

export default globalSlice.reducer;