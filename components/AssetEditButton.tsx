"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

import AssetEditModal from "@/components/AssetEditModal";
import { Asset, AssetVendor, Category } from "@/types/domain";

type Props = {
  asset: Asset;
  categories: Category[];
  vendors: AssetVendor[];
  onSuccess?: (asset: Asset) => void;
};

export default function AssetEditButton({
  asset,
  categories,
  vendors,
  onSuccess,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Edit asset"
        onClick={() => setOpen(true)}
        className="cursor-pointer inline-flex items-center justify-center size-10 rounded-full bg-white/30 border border-white/45 shadow-[0_4px_14px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-white/45 hover:scale-105 active:scale-95 transition-all"
      >
        <Pencil className="size-5 text-white" />
      </button>

      <AssetEditModal
        asset={asset}
        categories={categories}
        vendors={vendors}
        open={open}
        onOpenChange={setOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}
