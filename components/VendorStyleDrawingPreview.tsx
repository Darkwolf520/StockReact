"use client";

import { hexToRgb } from "@/lib/utils";

type Props = {
  vendorName?: string;
  blobFirst?: string;
  blobSecond?: string;
  blobThird?: string;
  bgFirst?: string;
  bgSecond?: string;
  bgThird?: string;
};

const DEFAULTS = {
  blobFirst: "#533483",
  blobSecond: "#E94560",
  blobThird: "#0F3460",
  bgFirst: "#1A1A2E",
  bgSecond: "#16213E",
  bgThird: "#0F3460",
};

const resolve = (value: string | undefined, fallback: string) =>
  value && /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback;

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.18)",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: 6,
};

export default function VendorStyleDrawingPreview({
  vendorName,
  blobFirst,
  blobSecond,
  blobThird,
  bgFirst,
  bgSecond,
  bgThird,
}: Props) {
  const bg1 = hexToRgb(resolve(bgFirst, DEFAULTS.bgFirst));
  const bg2 = hexToRgb(resolve(bgSecond, DEFAULTS.bgSecond));
  const bg3 = hexToRgb(resolve(bgThird, DEFAULTS.bgThird));
  const b1 = resolve(blobFirst, DEFAULTS.blobFirst);
  const b2 = resolve(blobSecond, DEFAULTS.blobSecond);
  const b3 = resolve(blobThird, DEFAULTS.blobThird);

  const displayName = vendorName?.trim() || "Vendor";

  const blobBase: React.CSSProperties = {
    position: "absolute",
    width: "60%",
    height: "60%",
    borderRadius: "50%",
    filter: "blur(24px)",
    opacity: 0.75,
  };

  return (
    <div
      className="relative w-full max-w-[360px] rounded-md border overflow-hidden select-none"
      style={{
        background: `linear-gradient(145deg, ${bg1}, ${bg2}, ${bg3})`,
        color: "#fff",
        fontSize: 10,
      }}
    >
      {/* Blobs */}
      <div style={{ ...blobBase, background: b1, top: "10%", left: "-10%" }} />
      <div style={{ ...blobBase, background: b2, top: "30%", right: "-10%" }} />
      <div style={{ ...blobBase, background: b3, left: "20%", bottom: "5%" }} />

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col gap-2 p-3">
        {/* Header card */}
        <div style={glass} className="p-2">
          <div
            style={{ fontSize: 7, letterSpacing: 1 }}
            className="uppercase opacity-70"
          >
            Portfolio Value
          </div>
          <div style={{ fontSize: 14 }} className="font-bold">
            635 003 Ft
          </div>
          <div className="mt-1 opacity-80">{displayName}</div>
        </div>

        {/* Chart card */}
        <div style={glass} className="p-2">
          <div className="flex items-center justify-between mb-1">
            <div
              style={{
                ...glass,
                padding: "1px 5px",
                fontSize: 9,
                cursor: "default",
              }}
            >
              {"<"}
            </div>
            <div className="text-center">
              <div style={{ fontSize: 9 }} className="font-medium">
                Monthly Sales
              </div>
              <div style={{ fontSize: 7 }} className="opacity-50">
                2026-06-01 — 2026-06-30
              </div>
            </div>
            <div
              style={{
                ...glass,
                padding: "1px 5px",
                fontSize: 9,
                cursor: "default",
              }}
            >
              {">"}
            </div>
          </div>

          {/* Chart area placeholder */}
          <div
            className="rounded"
            style={{
              height: 56,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          />

          {/* Period buttons */}
          <div className="flex gap-1 mt-2">
            {["1m", "3m", "6m", "1y", "All"].map((label) => (
              <div
                key={label}
                style={{
                  ...glass,
                  padding: "1px 5px",
                  fontSize: 8,
                  cursor: "default",
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Add Transaction button */}
        <div className="flex justify-end">
          <div
            style={{
              ...glass,
              width: 20,
              height: 20,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            +
          </div>
        </div>

        {/* Transactions card */}
        <div style={glass} className="p-2">
          <div className="font-semibold mb-1" style={{ fontSize: 10 }}>
            Transactions
          </div>
          <div
            className="flex gap-1 items-center mb-1.5"
            style={{ fontSize: 8 }}
          >
            <div
              style={{
                ...glass,
                padding: "0px 4px",
                fontSize: 7,
              }}
            >
              + Filter
            </div>
          </div>

          {/* Table header */}
          <div
            className="grid opacity-60"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              fontSize: 7,
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              paddingBottom: 2,
              marginBottom: 3,
            }}
          >
            <span>Category</span>
            <span>Name</span>
            <span>Amount</span>
            <span>Date</span>
          </div>

          {/* Row 1 */}
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              fontSize: 8,
              paddingBottom: 2,
              marginBottom: 2,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="opacity-80">Other</span>
            <span>w213e</span>
            <span style={{ color: "#f87171" }}>-1000 Ft</span>
            <span className="opacity-70">2026-05-19</span>
          </div>

          {/* Row 2 */}
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              fontSize: 8,
            }}
          >
            <span className="opacity-80">Investment</span>
            <span>Transaction 6</span>
            <span style={{ color: "#34d399" }}>+632445 Ft</span>
            <span className="opacity-70">2026-05-09</span>
          </div>
        </div>
      </div>
    </div>
  );
}
