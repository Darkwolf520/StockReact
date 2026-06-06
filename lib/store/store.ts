import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import userPreferencesReducer from "./slices/userPreferencesSlice";
import vendorsReducer from "./slices/vendorsSlice";

export const store = configureStore({
  reducer: {
    userPreferences: userPreferencesReducer,
    vendors: vendorsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
