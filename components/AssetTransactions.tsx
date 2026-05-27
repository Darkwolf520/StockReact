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

import {
  ColumnHeaderWithFilter,
  DateRangeColumnFilter,
  NumberRangeColumnFilter,
  SelectColumnFilter,
  TextColumnFilter,
  caseInsensitiveEqualsFilterFn,
  dateRangeFilterFn,
  numberRangeFilterFn,
} from "@/components/table/ColumnFilterControls";
import { Button } from "@/components/ui/button";
import { getContrastTextColor } from "@/lib/utils";
import { Asset, Transaction } from "@/types/domain";

import TransactionModal from "./TransactionModal";

export default function AssetTransactions({
  asset,
  transactions,
  accentColor,
  backgroundColor,
  buttonColor,
}: {
  asset: Asset;
  transactions: Transaction[];
  accentColor?: string;
  backgroundColor?: string;
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

  const availableTypes = useMemo(() => {
    return Array.from(
      new Set(localTransactions.map((transaction) => transaction.type)),
    );
  }, [localTransactions]);

  const typeFilterOptions = useMemo(
    () => availableTypes.map((type) => ({ value: type, label: type })),
    [availableTypes],
  );

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Name">
            <TextColumnFilter column={column} placeholder="Filter" />
          </ColumnHeaderWithFilter>
        ),
      },
      {
        accessorKey: "amount",
        filterFn: numberRangeFilterFn<Transaction>(),
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Amount">
            <NumberRangeColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
        cell: ({ row }) => `${row.original.amount} ${currencySymbol}`,
      },
      {
        accessorKey: "date",
        filterFn: dateRangeFilterFn<Transaction>(),
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Transaction date">
            <DateRangeColumnFilter column={column} />
          </ColumnHeaderWithFilter>
        ),
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <ColumnHeaderWithFilter column={column} label="Type">
            <SelectColumnFilter
              column={column}
              options={typeFilterOptions}
              allLabel="All"
            />
          </ColumnHeaderWithFilter>
        ),
        filterFn: caseInsensitiveEqualsFilterFn<Transaction>(),
      },
    ],
    [currencySymbol, typeFilterOptions],
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
        return "text-lg font-medium sm:text-base sm:font-normal";
      case "date":
        return "text-gray-600 sm:text-black";

      case "type": {
        const normalizedType = row.type.toLowerCase();

        return clsx(
          "w-fit rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
          {
            "bg-emerald-100 text-emerald-800": normalizedType === "income",
            "bg-rose-100 text-rose-800": normalizedType === "expense",
          },
        );
      }
      default:
        return "";
    }
  };

  const tableBackground = backgroundColor ?? accentColor ?? "#FFFFFF";
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
        <div
          className="overflow-hidden rounded-lg border border-gray-300 shadow-lg ring-1 ring-black/5"
          style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
        >
          <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold">
            Transactions
          </div>

          <div className="text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <div
                key={headerGroup.id}
                className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-200"
                style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
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
                  onClick={() => openModal(tableRow.original)}
                  className="cursor-pointer py-3 sm:grid sm:grid-cols-4 sm:items-center sm:py-2 grid grid-cols-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
                >
                  {tableRow.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className={clsx(
                        "py-1 px-4 sm:py-0 flex sm:block",
                        cell.column.id === "amount" || cell.column.id === "type"
                          ? "justify-end"
                          : "",
                      )}
                    >
                      <div
                        className={getCellValueClassName(
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
              ))}

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
