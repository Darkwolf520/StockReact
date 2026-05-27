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
import { useState } from "react";

import { cn } from "@/lib/utils";

type FilterableDataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyText: string;
  title?: string;
  gridClassName: string;
  onRowClick?: (row: TData) => void;
  getCellClassName?: (row: TData, columnId: string) => string;
  getCellValueClassName?: (row: TData, columnId: string) => string;
  getMobileLabel?: (columnId: string) => string;
  backgroundColor?: string;
};

export default function FilterableDataTable<TData>({
  columns,
  data,
  emptyText,
  title,
  gridClassName,
  onRowClick,
  getCellClassName,
  getCellValueClassName,
  getMobileLabel,
  backgroundColor,
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
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-gray-300",
        !backgroundColor && "bg-white",
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {title && (
        <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold">
          {title}
        </div>
      )}

      <div className="text-sm">
        {table.getHeaderGroups().map((headerGroup) => (
          <div
            key={headerGroup.id}
            className={cn(
              "grid border-b border-gray-200 bg-gray-50",
              gridClassName,
            )}
          >
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

        <div className="divide-y divide-gray-100">
          {table.getRowModel().rows.map((tableRow) => (
            <div
              key={tableRow.id}
              onClick={() => onRowClick?.(tableRow.original)}
              className={cn(
                "grid items-start py-3 transition hover:bg-gray-50",
                onRowClick && "cursor-pointer",
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
                  {getMobileLabel && (
                    <div className="mb-1 text-xs capitalize text-gray-500 sm:hidden">
                      {getMobileLabel(cell.column.id)}
                    </div>
                  )}
                  <div
                    className={getCellValueClassName?.(
                      tableRow.original,
                      cell.column.id,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {table.getRowModel().rows.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              {emptyText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
