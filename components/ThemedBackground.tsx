"use client";

import { useEffect, useState } from "react";

import { useAppSelector } from "@/lib/store/store";

const DEFAULT_VENDOR_THEME = {
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
};

function isDefaultVendorTheme(theme: typeof DEFAULT_VENDOR_THEME) {
  return (
    theme.blobs.first === DEFAULT_VENDOR_THEME.blobs.first &&
    theme.blobs.second === DEFAULT_VENDOR_THEME.blobs.second &&
    theme.blobs.third === DEFAULT_VENDOR_THEME.blobs.third &&
    theme.background.first === DEFAULT_VENDOR_THEME.background.first &&
    theme.background.second === DEFAULT_VENDOR_THEME.background.second &&
    theme.background.third === DEFAULT_VENDOR_THEME.background.third
  );
}

export default function ThemedBackground() {
  const userTheme = useAppSelector((state) => state.userPreferences.theme);
  const vendorTheme = useAppSelector((state) => state.vendors.theme);
  const theme = isDefaultVendorTheme(vendorTheme) ? userTheme : vendorTheme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 h-[100lvh] overflow-hidden" />;
  }

  return (
    <div
      className="fixed inset-0 h-[100lvh] overflow-hidden bg-theme-gradient"
      style={
        {
          "--theme-bg-first": theme.background.first,
          "--theme-bg-second": theme.background.second,
          "--theme-bg-third": theme.background.third,
        } as React.CSSProperties
      }
    >
      <div
        className="blob"
        id="b1"
        style={{
          width: "60%",
          height: "60%",
          background: theme.blobs.first,
          borderRadius: "50%",
          top: "10%",
          left: "-10%",
        }}
      ></div>
      <div
        className="blob"
        id="b2"
        style={{
          width: "60%",
          height: "60%",
          background: theme.blobs.second,
          borderRadius: "50%",
          top: "30%",
          right: "-10%",
        }}
      ></div>
      <div
        className="blob"
        id="b3"
        style={{
          width: "60%",
          height: "60%",
          background: theme.blobs.third,
          borderRadius: "50%",
          left: "20%",
          bottom: "5%",
        }}
      ></div>
    </div>
  );
}
