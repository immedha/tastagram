import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga.ts';
import globalReducer from './global/globalSlice.ts';
import userReducer from './user/userSlice.ts';
import { addUserPhotoAction } from './user/userActions.ts';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware]

const store = configureStore({
  reducer: {
    global: globalReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [addUserPhotoAction.type],
        ignoredPaths: ["payload.file"],
      },
    })
    .concat(middleware),
    // getDefaultMiddleware().concat(middleware),
})

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;

export default store