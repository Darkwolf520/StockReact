import clsx from "clsx";
import Link from "next/link";

import AssetCategoryLabel from "@/components/AssetCategoryLabel";
import Card from "@/components/Card";
import { Asset } from "@/types/domain";

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

export default function StockCard({
  className,
  ...asset
}: Asset & { className?: string }) {
  const vendor = asset.vendor;
  const category = asset.category;
  const vendorColor = vendor.style?.color || "";
  const vendorImage = sanitizeImageUrl(vendor.style?.image);
  const categoryBackgroundImage = sanitizeImageUrl(category.style?.image);
  const href = `/assets/${asset.id}`;
  const cardStyle =
    category.style?.bgColor || categoryBackgroundImage
      ? {
          backgroundImage: categoryBackgroundImage
            ? `linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), url("${categoryBackgroundImage}")`
            : undefined,
          backgroundPosition: categoryBackgroundImage ? "center" : undefined,
          backgroundRepeat: categoryBackgroundImage ? "no-repeat" : undefined,
          backgroundSize: categoryBackgroundImage ? "cover" : undefined,
        }
      : undefined;

  return (
    <Card
      className={clsx("sm:max-w-[750px] cursor-pointer", className)}
      style={cardStyle}
    >
      <Link href={href}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-y-4">
          <div className={clsx("flex items-center")}>
            {vendorImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vendorImage}
                alt={`${vendor.name} image`}
                className={clsx(
                  "h-[44px] max-w-[180px] object-contain",
                  !asset.name ? "w-[165px]" : undefined,
                )}
              />
            )}
            {asset.name && !vendorImage && (
              <div
                style={{ color: vendorColor }}
                className="text-4xl font-bold"
              >
                {vendor.name}
              </div>
            )}
          </div>
          <div style={{ color: vendorColor }} className={`text-3xl font-bold`}>
            {Intl.NumberFormat("hu-HU").format(asset.value)}{" "}
            {typeof asset.currency === "string"
              ? asset.currency
              : asset.currency.code}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div style={{ color: vendorColor }} className="text-2xl font-bold">
            {asset.name}
          </div>
          <AssetCategoryLabel category={category} />
        </div>
      </Link>
    </Card>
  );
}
