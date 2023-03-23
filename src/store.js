import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/user/userSlice"
import singleListingReducer from "./features/singleListing/singleListingSlice"
import listingReducer from "./features/listing/listingSlice"
import reviewReducer from "./features/review/reviewSlice"
import filterReducer from "./features/filter/filterSlice"
import favoriteReducer from "./features/favorite/favoriteSlice"
import generalReducer from "./features/general/generalSlice"
import chatReducer from "./features/chat/chatSlice"
import storage from "redux-persist/lib/storage"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist/"
import { combineReducers } from "@reduxjs/toolkit"

const persistConfig = {
  key: "root",
  whitelist: ["favorite"],
  version: 1,
  storage,
}

const reducer = combineReducers({
  user: userReducer,
  singleListing: singleListingReducer,
  listing: listingReducer,
  filter: filterReducer,
  favorite: favoriteReducer,
  review: reviewReducer,
  general: generalReducer,
  chat: chatReducer,
})

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
})
