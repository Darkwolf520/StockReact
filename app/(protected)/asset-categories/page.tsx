import AssetCategoryList from "@/components/AssetCategoryList";
import { assetCategoryService } from "@/lib/services/asset-category.service";

export default async function AssetCategoriesPage() {
  const categories = await assetCategoryService.getAll();

  return (
    <div>
      <h1 className="text-white">Asset categories</h1>
      <AssetCategoryList categories={categories} />
    </div>
  );
}
