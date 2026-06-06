import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RgbColor = {
  first: string;
  second: string;
  third: string;
};

export type RgbTheme = {
  blobs: RgbColor;
  background: RgbColor;
};

type UserPreferencesState = {
  theme: RgbTheme;
};

const initialState: UserPreferencesState = {
  theme: {
    blobs: {
      first: "rgb(83, 52, 131)",
      second: "rgb(233, 69, 96)",
      third: "rgb(15, 52, 96)",
    },
    background: {
      first: "rgb(26, 26, 46)",
      second: "rgb(22, 33, 62)",
      third: "rgb(15, 52, 96)",
    },
  },
};

const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<RgbTheme>) {
      state.theme = action.payload;
    },
    setThemeColor(
      state,
      action: PayloadAction<{
        group: keyof RgbTheme;
        key: keyof RgbColor;
        value: string;
      }>,
    ) {
      state.theme[action.payload.group][action.payload.key] =
        action.payload.value;
    },
    resetTheme(state) {
      state.theme = initialState.theme;
    },
  },
});

export const { setTheme, setThemeColor, resetTheme } =
  userPreferencesSlice.actions;
export default userPreferencesSlice.reducer;
