"use client";

import { useEffect, useState } from "react";

import { useAppSelector } from "@/lib/store/store";

export default function ThemedBackground() {
  const theme = useAppSelector((state) => state.userPreferences.theme);
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
