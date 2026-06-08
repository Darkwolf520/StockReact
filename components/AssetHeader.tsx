"use client";

import { useEffect, useState } from "react";

import AssetEditButton from "@/components/AssetEditButton";
import Card from "@/components/Card";
import { Asset, AssetVendor, Category } from "@/types/domain";

function sanitizeImageUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

type AssetHeaderProps = {
  asset: Asset;
  categories: Category[];
  vendors: AssetVendor[];
  textColor?: string;
};

export default function AssetHeader({
  asset,
  categories,
  vendors,
  textColor,
}: AssetHeaderProps) {
  const [currentAsset, setCurrentAsset] = useState(asset);

  useEffect(() => {
    setCurrentAsset(asset);
  }, [asset]);

  const vendorImage = sanitizeImageUrl(currentAsset.vendor.style?.image);
  const currencySymbol =
    typeof currentAsset.currency === "string"
      ? currentAsset.currency
      : currentAsset.currency.symbol;
  const formattedValue = Intl.NumberFormat("hu-HU").format(currentAsset.value);

  return (
    <>
      <Card variant="strong" className={textColor}>
        <div className="flex justify-between items-start">
          <div>
            <div>PORTFOLIO VALUE</div>
            <h1>
              {formattedValue} {currencySymbol}
            </h1>

            {vendorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vendorImage}
                alt={`${currentAsset.vendor.name} image`}
                className="h-14 max-w-[180px] object-contain rounded px-1 py-0.5"
              />
            ) : (
              <div className="text-2xl">{currentAsset.vendor.name}</div>
            )}
          </div>

          <AssetEditButton
            asset={currentAsset}
            categories={categories}
            vendors={vendors}
            onSuccess={setCurrentAsset}
          />
        </div>
      </Card>
    </>
  );
}
