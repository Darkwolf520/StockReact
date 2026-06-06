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
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

import GhostIcon from "@/components/GhostIcon";
import {
  caseInsensitiveEqualsFilterFn,
  dateRangeFilterFn,
  numberRangeFilterFn,
} from "@/components/table/ColumnFilterControls";
import FilterBar from "@/components/table/FilterBar";
import { Button } from "@/components/ui/button";
import { getTransactionCategoryStyle } from "@/lib/transaction-category-styles";
import { getContrastTextColor } from "@/lib/utils";
import { Asset, Transaction } from "@/types/domain";

import TransactionModal from "./TransactionModal";

export default function AssetTransactions({
  asset,
  transactions,
  buttonColor,
}: {
  asset: Asset;
  transactions: Transaction[];
  buttonColor?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [localTransactions, setLocalTransactions] = useState(transactions);

  const openModal = (transaction: Transaction | null = null) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleTransactionUpdate = (updated: Transaction) => {
    setLocalTransactions((prev) => {
      const updatedList = prev.map((t) =>
        t.id === updated.id ? { ...t, ...updated } : t,
      );

      return prev.some((t) => t.id === updated.id)
        ? updatedList
        : [updated, ...prev];
    });
  };

  const handleTransactionDelete = (id: number) => {
    setLocalTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const currencySymbol =
    typeof asset.currency === "string" ? asset.currency : asset.currency.symbol;

  const availableCategories = useMemo(() => {
    return Array.from(
      new Set(
        localTransactions
          .map((transaction) => transaction.categoryName)
          .filter(Boolean),
      ),
    ) as string[];
  }, [localTransactions]);

  const categoryFilterOptions = useMemo(
    () => availableCategories.map((cat) => ({ value: cat, label: cat })),
    [availableCategories],
  );

  const filterColumns = useMemo(
    () => [
      {
        id: "categoryName",
        label: "Category",
        type: "select" as const,
        options: categoryFilterOptions,
      },
      { id: "name", label: "Name", type: "text" as const },
      { id: "amount", label: "Amount", type: "number-range" as const },
      { id: "date", label: "Transaction date", type: "date-range" as const },
    ],
    [categoryFilterOptions],
  );

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

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "categoryName",
        filterFn: caseInsensitiveEqualsFilterFn<Transaction>(),
        header: ({ column }) => (
          <SortableHeader column={column} label="Category" />
        ),
        cell: ({ row }) => {
          const name = row.original.categoryName;
          if (!name) return "-";
          const style = getTransactionCategoryStyle(name);

          return (
            <div className="flex items-center gap-2">
              <GhostIcon
                icon={style.icon || undefined}
                fallback={name[0].toUpperCase()}
                color={style.color}
                size="md"
              />
              <span className="hidden md:inline-block">{name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} label="Name" />,
      },
      {
        accessorKey: "amount",
        filterFn: numberRangeFilterFn<Transaction>(),
        sortingFn: (rowA, rowB) => {
          const signA = rowA.original.type.toLowerCase() === "income" ? 1 : -1;
          const signB = rowB.original.type.toLowerCase() === "income" ? 1 : -1;
          return rowA.original.amount * signA - rowB.original.amount * signB;
        },
        header: ({ column }) => (
          <SortableHeader column={column} label="Amount" />
        ),
        cell: ({ row }) => {
          const prefix =
            row.original.type.toLowerCase() === "income" ? "+" : "-";
          return `${prefix}${row.original.amount} ${currencySymbol}`;
        },
      },
      {
        accessorKey: "date",
        filterFn: dateRangeFilterFn<Transaction>(),
        header: ({ column }) => (
          <SortableHeader column={column} label="Transaction date" />
        ),
      },
    ],
    [currencySymbol],
  );

  const table = useReactTable({
    data: localTransactions,
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

  const getCellValueClassName = (row: Transaction, columnId: string) => {
    switch (columnId) {
      case "name":
        return "text-lg font-medium sm:text-base sm:font-normal";
      case "amount":
        return clsx("text-lg font-medium sm:text-base sm:font-normal", {
          "text-emerald-700": row.type.toLowerCase() === "income",
          "text-rose-700": row.type.toLowerCase() === "expense",
        });
      case "date":
        return "text-gray-600 sm:text-black";

      case "categoryName":
        return "";
      default:
        return "";
    }
  };

  const primaryButtonTextColor = buttonColor
    ? getContrastTextColor(buttonColor)
    : undefined;
  const primaryButtonShadowStyle = {
    boxShadow: "4px 4px 0 rgba(0,0,0,0.28)",
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => openModal()}
          style={
            buttonColor
              ? {
                  backgroundColor: buttonColor,
                  color: primaryButtonTextColor,
                  ...primaryButtonShadowStyle,
                }
              : undefined
          }
        >
          Add Transaction
        </Button>
      </div>

      <div className="mb-4">
        <div className="overflow-hidden rounded-lg glass">
          <div className="px-4 py-3 text-sm font-semibold">Transactions</div>

          <FilterBar table={table} columns={filterColumns} />

          <div className="text-sm">
            {/* Desktop headers */}
            <div className="hidden sm:block">
              {table.getHeaderGroups().map((headerGroup) => (
                <div key={headerGroup.id} className="grid grid-cols-4">
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

            <div className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((tableRow) => {
                const row = tableRow.original;
                const style = getTransactionCategoryStyle(
                  row.categoryName ?? "",
                );
                const prefix = row.type.toLowerCase() === "income" ? "+" : "-";

                return (
                  <div
                    key={tableRow.id}
                    onClick={() => openModal(row)}
                    className="cursor-pointer"
                  >
                    {/* Mobile card */}
                    <div className="flex items-center gap-3 px-4 py-3 sm:hidden">
                      <GhostIcon
                        icon={style.icon || undefined}
                        fallback={row.categoryName?.[0]?.toUpperCase() ?? "?"}
                        color={style.color}
                        size="md"
                      />
                      <div className="flex flex-1 flex-col min-w-0">
                        <span className="truncate font-medium">{row.name}</span>
                        <span className="text-xs text-gray-500">
                          {row.date}
                        </span>
                      </div>
                      <span
                        className={clsx(
                          "shrink-0 font-medium",
                          row.type.toLowerCase() === "income"
                            ? "text-emerald-700"
                            : "text-rose-700",
                        )}
                      >
                        {prefix}
                        {row.amount} {currencySymbol}
                      </span>
                    </div>

                    {/* Desktop grid */}
                    <div className="hidden sm:grid sm:grid-cols-4 sm:items-center sm:py-2">
                      {tableRow.getVisibleCells().map((cell) => (
                        <div key={cell.id} className={clsx("px-4 flex")}>
                          <div
                            className={getCellValueClassName(
                              row,
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
                );
              })}

              {table.getRowModel().rows.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  No transactions yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <TransactionModal
          transaction={selectedTransaction}
          assetId={asset.id}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={handleTransactionUpdate}
          onDelete={handleTransactionDelete}
        />
      </div>
    </div>
  );
}
