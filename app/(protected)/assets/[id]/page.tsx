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

  const vendorAccentColor =
    getSafeHexColor(asset.vendor.style?.accentColor) ?? "#FFFFFF";
  const vendorColor = getSafeHexColor(asset.vendor.style?.color) ?? "#000000";
  const vendorSecondaryButtonColor =
    getSafeHexColor(asset.vendor.style?.secondaryButtonColor) ?? "#FFFFFF";

  return (
    <div className="mb-[-20px] min-h-[calc(100dvh-65px)] px-4 pb-[20px] pt-4 sm:mb-0 sm:min-h-full">
      <div className="space-y-4 opacity-100 relative">
        <AssetHeader textColor={textColor} asset={asset} />

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
          buttonColor={vendorColor}
        />
      </div>
    </div>
  );
}
