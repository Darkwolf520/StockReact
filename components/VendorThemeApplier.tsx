"use client";

import { useEffect } from "react";

import {
  resetVendorTheme,
  setVendorTheme,
} from "@/lib/store/slices/vendorsSlice";
import { useAppDispatch } from "@/lib/store/store";
import { Theme } from "@/types/domain";

export default function VendorThemeApplier({ theme }: { theme: Theme }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setVendorTheme(theme));
    return () => {
      dispatch(resetVendorTheme());
    };
  }, [dispatch, theme]);

  return null;
}
