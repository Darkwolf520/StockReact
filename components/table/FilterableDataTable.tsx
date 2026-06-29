"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import FilterBar from "./FilterBar";

type FilterColumnConfig = {
  id: string;
  label: string;
  type: "text" | "number-range" | "date-range" | "select";
  options?: { value: string; label: string }[];
};

type FilterableDataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyText: string;
  title?: string;
  gridClassName: string;
  filterColumns?: FilterColumnConfig[];
  onRowClick?: (row: TData) => void;
  getCellClassName?: (row: TData, columnId: string) => string;
  getCellValueClassName?: (row: TData, columnId: string) => string;
  renderMobileCard?: (row: TData) => ReactNode;
};

export default function FilterableDataTable<TData>({
  columns,
  data,
  emptyText,
  title,
  gridClassName,
  filterColumns,
  onRowClick,
  getCellClassName,
  getCellValueClassName,
  renderMobileCard,
}: FilterableDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-lg glass text-white">
      {title && <div className="px-4 py-3 text-sm font-semibold">{title}</div>}

      {filterColumns && <FilterBar table={table} columns={filterColumns} />}

      <div className="text-sm">
        {/* Desktop headers */}
        <div className="hidden sm:block">
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className={cn("grid", gridClassName)}>
              {headerGroup.headers.map((header) => (
                <div key={header.id} className="px-4 py-2 font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="divide-y divide-white/10">
          {table.getRowModel().rows.map((tableRow) => (
            <div
              key={tableRow.id}
              onClick={() => onRowClick?.(tableRow.original)}
              className={cn(
                "transition hover:bg-white/10",
                onRowClick && "cursor-pointer",
              )}
            >
              {/* Mobile card */}
              {renderMobileCard && (
                <div className="sm:hidden px-4 py-3">
                  {renderMobileCard(tableRow.original)}
                </div>
              )}

              {/* Desktop grid */}
              <div
                className={cn(
                  "items-center py-2",
                  renderMobileCard ? "hidden sm:grid" : "grid",
                  gridClassName,
                )}
              >
                {tableRow.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className={cn(
                      "px-4 py-1 sm:py-0",
                      getCellClassName?.(tableRow.original, cell.column.id),
                    )}
                  >
                    <div
                      className={getCellValueClassName?.(
                        tableRow.original,
                        cell.column.id,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <div className="px-4 py-6 text-center text-white/50">
              {emptyText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
