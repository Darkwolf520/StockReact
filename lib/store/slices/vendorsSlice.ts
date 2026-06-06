import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RgbColor, RgbTheme } from "./userPreferencesSlice";

type VendorsState = {
  theme: RgbTheme;
};

const initialState: VendorsState = {
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

const vendorsSlice = createSlice({
  name: "vendors",
  initialState,
  reducers: {
    setVendorTheme(state, action: PayloadAction<RgbTheme>) {
      state.theme = action.payload;
    },
    setVendorThemeColor(
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
    resetVendorTheme(state) {
      state.theme = initialState.theme;
    },
  },
});

export const { setVendorTheme, setVendorThemeColor, resetVendorTheme } =
  vendorsSlice.actions;
export default vendorsSlice.reducer;
