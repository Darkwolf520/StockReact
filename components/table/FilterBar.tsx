"use client";

import { Table } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { DateRangeFilter, NumberRangeFilter } from "./ColumnFilterControls";

type FilterColumnConfig = {
  id: string;
  label: string;
  type: "text" | "number-range" | "date-range" | "select";
  options?: { value: string; label: string }[];
};

type FilterBarProps<TData> = {
  table: Table<TData>;
  columns: FilterColumnConfig[];
};

function formatFilterValue(config: FilterColumnConfig, value: unknown): string {
  switch (config.type) {
    case "text":
      return `contains "${value}"`;
    case "number-range": {
      const range = value as NumberRangeFilter;
      if (range.min !== undefined && range.max !== undefined)
        return `${range.min} - ${range.max}`;
      if (range.min !== undefined) return `>= ${range.min}`;
      if (range.max !== undefined) return `<= ${range.max}`;
      return "";
    }
    case "date-range": {
      const range = value as DateRangeFilter;
      if (range.from && range.to) return `${range.from} - ${range.to}`;
      if (range.from) return `from ${range.from}`;
      if (range.to) return `until ${range.to}`;
      return "";
    }
    case "select":
      return `is ${value}`;
    default:
      return String(value);
  }
}

function FilterChip({
  config,
  value,
  onRemove,
  onEdit,
}: {
  config: FilterColumnConfig;
  value: unknown;
  onRemove: () => void;
  onEdit: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-black/15 bg-white/60 px-3 py-1 text-xs font-medium backdrop-blur-sm">
      <button type="button" onClick={onEdit} className="cursor-pointer">
        {config.label} {formatFilterValue(config, value)}
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-0.5 cursor-pointer rounded-full p-0.5 hover:bg-black/10"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

function TextFilterEditor({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose?: () => void;
}) {
  return (
    <Input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClose?.();
      }}
      placeholder="Type to filter..."
      className="h-8 bg-white"
    />
  );
}

function NumberRangeFilterEditor({
  value,
  onChange,
  onClose,
}: {
  value: NumberRangeFilter;
  onChange: (v: NumberRangeFilter | undefined) => void;
  onClose?: () => void;
}) {
  const update = (key: "min" | "max", raw: string) => {
    const num = raw === "" ? undefined : Number(raw);
    const next = {
      ...value,
      [key]: Number.isNaN(num) ? undefined : num,
    };
    onChange(
      next.min === undefined && next.max === undefined ? undefined : next,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onClose?.();
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <Input
        type="number"
        autoFocus
        value={value.min ?? ""}
        onChange={(e) => update("min", e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Min"
        className="h-8 bg-white"
      />
      <Input
        type="number"
        value={value.max ?? ""}
        onChange={(e) => update("max", e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Max"
        className="h-8 bg-white"
      />
    </div>
  );
}

function DateRangeFilterEditor({
  value,
  onChange,
  onClose,
}: {
  value: DateRangeFilter;
  onChange: (v: DateRangeFilter | undefined) => void;
  onClose?: () => void;
}) {
  const [draft, setDraft] = useState<DateRangeFilter>(value);

  const updateDraft = (key: "from" | "to", raw: string) => {
    setDraft((prev) => ({ ...prev, [key]: raw || undefined }));
  };

  const apply = () => {
    onChange(!draft.from && !draft.to ? undefined : draft);
    onClose?.();
  };

  const hasValue = draft.from || draft.to;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="date"
          autoFocus
          value={draft.from ?? ""}
          onChange={(e) => updateDraft("from", e.target.value)}
          className="h-8 bg-white w-fit"
        />
        <Input
          type="date"
          value={draft.to ?? ""}
          onChange={(e) => updateDraft("to", e.target.value)}
          className="h-8 bg-white w-fit0"
        />
      </div>
      <button
        type="button"
        disabled={!hasValue}
        onClick={apply}
        className="w-full cursor-pointer rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Apply
      </button>
    </div>
  );
}

function SelectFilterEditor({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string | undefined) => void;
}) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(v) => onChange(v === "all" ? undefined : v)}
    >
      <SelectTrigger className="h-8 bg-white">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FilterEditor({
  config,
  value,
  onChange,
  onClose,
}: {
  config: FilterColumnConfig;
  value: unknown;
  onChange: (v: unknown) => void;
  onClose?: () => void;
}) {
  switch (config.type) {
    case "text":
      return (
        <TextFilterEditor
          value={(value as string) ?? ""}
          onChange={onChange}
          onClose={onClose}
        />
      );
    case "number-range":
      return (
        <NumberRangeFilterEditor
          value={(value as NumberRangeFilter) ?? {}}
          onChange={onChange}
          onClose={onClose}
        />
      );
    case "date-range":
      return (
        <DateRangeFilterEditor
          value={(value as DateRangeFilter) ?? {}}
          onChange={onChange}
          onClose={onClose}
        />
      );
    case "select":
      return (
        <SelectFilterEditor
          value={(value as string) ?? ""}
          options={config.options ?? []}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

export default function FilterBar<TData>({
  table,
  columns,
}: FilterBarProps<TData>) {
  const [addOpen, setAddOpen] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const activeFilters = columns.filter((col) => {
    const value = table.getColumn(col.id)?.getFilterValue();
    return value !== undefined && value !== "";
  });

  const availableColumns = columns.filter((col) => {
    const value = table.getColumn(col.id)?.getFilterValue();
    if (value === undefined || value === "") return true;

    if (col.type === "number-range") {
      const range = value as NumberRangeFilter;
      return range.min === undefined || range.max === undefined;
    }

    if (col.type === "date-range") {
      const range = value as DateRangeFilter;
      return !range.from || !range.to;
    }

    return false;
  });

  const handleRemove = (columnId: string) => {
    table.getColumn(columnId)?.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
      {activeFilters.map((config) => {
        const column = table.getColumn(config.id);
        const value = column?.getFilterValue();

        return (
          <Popover
            key={config.id}
            open={editingColumnId === config.id}
            onOpenChange={(open) => setEditingColumnId(open ? config.id : null)}
          >
            <PopoverTrigger asChild>
              <span>
                <FilterChip
                  config={config}
                  value={value}
                  onRemove={() => handleRemove(config.id)}
                  onEdit={() => setEditingColumnId(config.id)}
                />
              </span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">
                  {config.label}
                </div>
                <FilterEditor
                  config={config}
                  value={value}
                  onChange={(v) => column?.setFilterValue(v)}
                  onClose={() => setEditingColumnId(null)}
                />
              </div>
            </PopoverContent>
          </Popover>
        );
      })}

      <Popover
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setSelectedColumn(null);
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded-full border border-dashed border-black/20 px-2 py-1 text-xs font-medium text-black/60 transition-colors hover:border-black/40 hover:text-black/80",
            )}
          >
            <Plus className="size-3" />
            Filter
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 w-auto min-w-[120px]">
          {!selectedColumn ? (
            <div className="py-1">
              {availableColumns.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedColumn(col.id)}
                  className="w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-accent"
                >
                  {col.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2 p-4">
              <div className="text-xs font-medium text-muted-foreground">
                {columns.find((c) => c.id === selectedColumn)?.label}
              </div>
              <FilterEditor
                config={columns.find((c) => c.id === selectedColumn)!}
                value={
                  table.getColumn(selectedColumn)?.getFilterValue() ?? undefined
                }
                onChange={(v) => {
                  table.getColumn(selectedColumn)?.setFilterValue(v);
                }}
                onClose={() => {
                  setAddOpen(false);
                  setSelectedColumn(null);
                }}
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
