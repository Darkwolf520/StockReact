import RawChart from "@/components/AssetChart";
import AssetHeader from "@/components/AssetHeader";
import AssetTransactions from "@/components/AssetTransactions";
import VendorThemeApplier from "@/components/VendorThemeApplier";
import { assetCategoryService } from "@/lib/services/asset-category.service";
import { assetVendorService } from "@/lib/services/asset-vendor.service";
import { assetService } from "@/lib/services/asset.service";
import { transactionService } from "@/lib/services/transaction.service";

export default async function Asset({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [asset, transactions, categories, vendors] = await Promise.all([
    assetService.getById(id),
    transactionService.getByAssetId(id),
    assetCategoryService.getAll(),
    assetVendorService.getAll(),
  ]);

  const textColor = "text-white";
  const vendorTheme = asset.vendor.style?.theme ?? null;

  return (
    <div className="space-y-4">
      {vendorTheme && <VendorThemeApplier theme={vendorTheme} />}

      <AssetHeader
        textColor={textColor}
        asset={asset}
        categories={categories}
        vendors={vendors}
      />

      <RawChart
        title="Monthly Sales (raw Chart.js)"
        transactions={transactions}
      />
      <AssetTransactions asset={asset} transactions={transactions} />
    </div>
  );
}
