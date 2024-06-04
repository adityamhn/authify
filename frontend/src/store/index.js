import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "./user.slice";

import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const isClient = typeof window !== "undefined";

const reducers = combineReducers({
  user: userReducer,
});

let store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk,
    }),
  devTools: true,
});

if (isClient) {
  const storage = require("redux-persist/lib/storage").default;

  const persistConfig = {
    key: "root",
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk,
      }),
  });
}

export default store;
