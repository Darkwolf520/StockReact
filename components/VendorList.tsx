"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import FilterableDataTable from "@/components/table/FilterableDataTable";
import { AssetVendor } from "@/types/domain";

import VendorModal from "./VendorModal";

export default function VendorList({
  vendors: initialVendors,
}: {
  vendors: AssetVendor[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<AssetVendor | null>(
    null,
  );
  const [vendors, setVendors] = useState(initialVendors);

  const openModal = (vendor: AssetVendor | null = null) => {
    setSelectedVendor(vendor);
    setIsModalOpen(true);
  };

  const handleVendorUpdate = (updated: AssetVendor) => {
    setVendors((prev) => {
      const updatedList = prev.map((v) =>
        v.id === updated.id ? { ...v, ...updated } : v,
      );
      return prev.some((v) => v.id === updated.id)
        ? updatedList
        : [updated, ...prev];
    });
  };

  const handleVendorDelete = (id: number) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const SortableHeader = ({
    column,
    label,
  }: {
    column: {
      toggleSorting: (asc: boolean) => void;
      clearSorting: () => void;
      getIsSorted: () => false | "asc" | "desc";
    };
    label: string;
  }) => (
    <button
      type="button"
      className="cursor-pointer font-medium"
      onClick={() => {
        const current = column.getIsSorted();
        if (current === "desc") {
          column.clearSorting();
        } else {
          column.toggleSorting(current === "asc");
        }
      }}
    >
      {label}{" "}
      {column.getIsSorted() === "asc"
        ? "↑"
        : column.getIsSorted() === "desc"
          ? "↓"
          : ""}
    </button>
  );

  const columns = useMemo<ColumnDef<AssetVendor>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} label="Name" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.style?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.original.style.image}
                alt={row.original.name}
                className="size-7 shrink-0 rounded object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : row.original.style?.color ? (
              <span
                className="inline-block size-7 shrink-0 rounded"
                style={{ backgroundColor: row.original.style.color }}
              />
            ) : null}
            {row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <SortableHeader column={column} label="Description" />
        ),
        cell: ({ row }) => row.original.description ?? "-",
      },
    ],
    [],
  );

  const filterColumns = useMemo(
    () => [
      { id: "name", label: "Name", type: "text" as const },
      { id: "description", label: "Description", type: "text" as const },
    ],
    [],
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => openModal()}
          className="cursor-pointer inline-flex items-center justify-center size-10 rounded-full bg-white/30 border border-white/45 shadow-[0_4px_14px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-white/45 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="size-5 text-white" />
        </button>
      </div>

      <div className="mb-4">
        <FilterableDataTable
          title="Vendors"
          columns={columns}
          data={vendors}
          gridClassName="grid-cols-2"
          filterColumns={filterColumns}
          emptyText="No vendors yet. Create your first one!"
          onRowClick={openModal}
          renderMobileCard={(vendor) => (
            <div className="flex items-center gap-3">
              {vendor.style?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vendor.style.image}
                  alt={vendor.name}
                  className="size-10 shrink-0 rounded object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : vendor.style?.color ? (
                <span
                  className="inline-block size-10 shrink-0 rounded"
                  style={{ backgroundColor: vendor.style.color }}
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded bg-white/20 text-sm font-semibold">
                  {vendor.name[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="flex flex-1 flex-col min-w-0">
                <span className="truncate font-medium">{vendor.name}</span>
                <span className="text-xs text-white/50 truncate">
                  {vendor.description ?? "-"}
                </span>
              </div>
            </div>
          )}
          getCellValueClassName={(_, columnId) =>
            columnId === "description" ? "text-white/70" : ""
          }
        />
      </div>

      <VendorModal
        vendor={selectedVendor}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleVendorUpdate}
        onDelete={handleVendorDelete}
      />
    </div>
  );
}
