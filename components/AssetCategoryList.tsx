"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import GhostIcon from "@/components/GhostIcon";
import FilterableDataTable from "@/components/table/FilterableDataTable";
import { Category } from "@/types/domain";

import AssetCategoryModal from "./AssetCategoryModal";

export default function AssetCategoryList({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categories, setCategories] = useState(initialCategories);

  const openModal = (category: Category | null = null) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCategoryUpdate = (updated: Category) => {
    setCategories((prev) => {
      const updatedList = prev.map((category) =>
        category.id === updated.id ? { ...category, ...updated } : category,
      );

      return prev.some((category) => category.id === updated.id)
        ? updatedList
        : [updated, ...prev];
    });
  };

  const handleCategoryDelete = (id: number) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
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

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} label="Name" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <GhostIcon
              icon={row.original.style?.icon}
              fallback={row.original.name[0].toUpperCase()}
              color={row.original.style?.color}
            />
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
          title="Categories"
          columns={columns}
          data={categories}
          gridClassName="grid-cols-2"
          filterColumns={filterColumns}
          emptyText="No categories yet. Create your first one!"
          onRowClick={openModal}
          renderMobileCard={(category) => (
            <div className="flex items-center gap-3">
              <GhostIcon
                icon={category.style?.icon}
                fallback={category.name[0]?.toUpperCase() ?? "?"}
                color={category.style?.color}
                size="md"
              />
              <div className="flex flex-1 flex-col min-w-0">
                <span className="truncate font-medium">{category.name}</span>
                <span className="text-xs text-white/50 truncate">
                  {category.description ?? "-"}
                </span>
              </div>
            </div>
          )}
          getCellValueClassName={(_, columnId) =>
            columnId === "description" ? "text-white/70" : ""
          }
        />
      </div>

      <AssetCategoryModal
        category={selectedCategory}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleCategoryUpdate}
        onDelete={handleCategoryDelete}
      />
    </div>
  );
}
