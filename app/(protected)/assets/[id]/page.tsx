import RawChart from "@/components/AssetChart";
import AssetHeader from "@/components/AssetHeader";
import AssetTransactions from "@/components/AssetTransactions";
import { assetCategoryService } from "@/lib/services/asset-category.service";
import { assetVendorService } from "@/lib/services/asset-vendor.service";
import { assetService } from "@/lib/services/asset.service";
import { transactionService } from "@/lib/services/transaction.service";

export default async function Asset({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  function getSafeHexColor(value?: string | null) {
    if (!value) {
      return undefined;
    }

    return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : undefined;
  }

  const { id } = await params;

  const [asset, transactions, categories, vendors] = await Promise.all([
    assetService.getById(id),
    transactionService.getByAssetId(id),
    assetCategoryService.getAll(),
    assetVendorService.getAll(),
  ]);

  const textColor = "text-white";
  const defaultGradientBackground =
    "linear-gradient(145deg, rgb(26, 26, 46), rgb(22, 33, 62), rgb(15, 52, 96))";

  const vendorBgColor = getSafeHexColor(asset.vendor.style?.bgColor);
  const vendorAccentColor =
    getSafeHexColor(asset.vendor.style?.accentColor) ?? "#FFFFFF";
  const vendorColor = getSafeHexColor(asset.vendor.style?.color) ?? "#000000";
  const vendorSecondaryButtonColor =
    getSafeHexColor(asset.vendor.style?.secondaryButtonColor) ?? "#FFFFFF";

  return (
    <div className="-mx-4 -mt-4 mb-[-20px] min-h-[calc(100dvh-65px)] px-4 pb-[20px] pt-4 sm:mb-0 sm:min-h-full relative">
      <div
        className="bg-layer inset-0 absolute"
        id="bgLayer"
        style={{
          background:
            "linear-gradient(145deg, rgb(255, 107, 107), rgb(254, 202, 87), rgb(255, 159, 243))",
        }}
      >
        <div
          className="blob"
          id="b1"
          style={{
            width: "60%",
            height: "60%",
            background: "rgb(255, 107, 107)",
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
            background: "rgb(254, 202, 87)",
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
            background: "rgb(255, 159, 243)",
            borderRadius: "50%",
            left: "20%",
            bottom: "5%",
          }}
        ></div>
      </div>
      <div className="space-y-4 opacity-100 relative">
        <AssetHeader
          textColor={textColor}
          opacity={0.2}
          asset={asset}
          categories={categories}
          vendors={vendors}
        />

        <RawChart
          title="Monthly Sales (raw Chart.js)"
          transactions={transactions}
          accentColor={vendorAccentColor}
          lineColor={vendorColor}
          buttonColor={vendorColor}
          secondaryButtonColor={vendorSecondaryButtonColor}
        />
        <AssetTransactions
          asset={asset}
          transactions={transactions}
          accentColor={vendorAccentColor}
          buttonColor={vendorColor}
        />
      </div>
    </div>
  );
}
