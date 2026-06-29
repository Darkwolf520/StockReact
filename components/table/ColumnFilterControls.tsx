"use client";

import { FilterFn } from "@tanstack/react-table";

export type NumberRangeFilter = {
  min?: number;
  max?: number;
};

export type DateRangeFilter = {
  from?: string;
  to?: string;
};

export const numberRangeFilterFn = <TData,>(): FilterFn<TData> => {
  return (row, columnId, filterValue) => {
    const numericValue = Number(row.getValue(columnId));
    const range = (filterValue as NumberRangeFilter | undefined) ?? {};

    if (Number.isNaN(numericValue)) {
      return false;
    }

    if (typeof range.min === "number" && numericValue < range.min) {
      return false;
    }

    if (typeof range.max === "number" && numericValue > range.max) {
      return false;
    }

    return true;
  };
};

export const dateRangeFilterFn = <TData,>(): FilterFn<TData> => {
  return (row, columnId, filterValue) => {
    const range = (filterValue as DateRangeFilter | undefined) ?? {};
    const rawValue = String(row.getValue(columnId));
    const rowDate = new Date(rawValue);

    if (Number.isNaN(rowDate.getTime())) {
      return false;
    }

    if (range.from) {
      const fromDate = new Date(range.from);
      if (!Number.isNaN(fromDate.getTime()) && rowDate < fromDate) {
        return false;
      }
    }

    if (range.to) {
      const toDate = new Date(range.to);
      if (!Number.isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        if (rowDate > toDate) {
          return false;
        }
      }
    }

    return true;
  };
};

export const caseInsensitiveEqualsFilterFn = <TData,>(): FilterFn<TData> => {
  return (row, columnId, filterValue) => {
    if (!filterValue) {
      return true;
    }

    return (
      String(row.getValue(columnId)).toLowerCase() ===
      String(filterValue).toLowerCase()
    );
  };
};
