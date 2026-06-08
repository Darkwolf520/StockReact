import VendorList from "@/components/VendorList";
import { assetVendorService } from "@/lib/services/asset-vendor.service";

export default async function VendorsPage() {
  const vendors = await assetVendorService.getAll();

  return (
    <div>
      <h1 className="text-white">Vendors</h1>
      <VendorList vendors={vendors} />
    </div>
  );
}
