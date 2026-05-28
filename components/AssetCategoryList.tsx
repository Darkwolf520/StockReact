"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import GhostIcon from "@/components/GhostIcon";
import {
  ColumnHeaderWithFilter,
  TextColumnFilter,
} from "@/components/table/ColumnFilterControls";
import FilterableDataTable from "@/components/table/FilterableDataTable";
import { Button } from "@/components/ui/button";
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

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Name">
            <TextColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3 font-semibold sm:font-normal">
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
          <ColumnHeaderWithFilter column={column} label="Description">
            <TextColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
        cell: ({ row }) => row.original.description ?? "-",
      },
    ],
    [],
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>Create new category</Button>
      </div>

      <div className="mb-4">
        <FilterableDataTable
          title="Categories"
          columns={columns}
          data={categories}
          gridClassName="grid-cols-1 sm:grid-cols-2"
          emptyText="No categories yet. Create your first one!"
          onRowClick={openModal}
          getMobileLabel={(columnId) => columnId}
          getCellValueClassName={(_, columnId) =>
            columnId === "description" ? "text-gray-600" : ""
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
