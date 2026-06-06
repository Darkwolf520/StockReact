import Card from "@/components/Card";
import StockCard from "@/components/StockCard";
import { assetService } from "@/lib/services/asset.service";
import { userService } from "@/lib/services/user.service";

export default async function Home() {
  const user = await userService.getCurrentUser();
  const assets = await assetService.getAll();

  return (
    <div>
      <Card className="mb-8 flex justify-between items-center sm:w-[400px] text-white">
        <div className="text-2xl">Balance:</div>
        <div className="text-xl font-bold">
          {Intl.NumberFormat("hu-HU").format(user.totalValue)} Ft
        </div>
      </Card>
      <div className="flex flex-col gap-y-4">
        {assets.map((asset) => {
          return <StockCard className="text-white" key={asset.id} {...asset} />;
        })}
      </div>
    </div>
  );
}
