"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { numberRangeFilterFn } from "@/components/table/ColumnFilterControls";
import FilterableDataTable from "@/components/table/FilterableDataTable";
import { User } from "@/types/domain";

import UserModal from "./UserModal";

export default function UserList({ users: initialUsers }: { users: User[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState(initialUsers);

  const openModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUserUpdate = (updated: User) => {
    setUsers((prev) => {
      const updatedList = prev.map((user) =>
        user.id === updated.id ? { ...user, ...updated } : user,
      );

      return prev.some((user) => user.id === updated.id)
        ? updatedList
        : [updated, ...prev];
    });
  };

  const handleUserDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
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

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} label="Name" />,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <SortableHeader column={column} label="Email" />
        ),
      },
      {
        accessorKey: "totalValue",
        filterFn: numberRangeFilterFn<User>(),
        header: ({ column }) => (
          <SortableHeader column={column} label="Balance" />
        ),
        cell: ({ row }) =>
          `${Intl.NumberFormat("hu-HU").format(row.original.totalValue)} Ft`,
      },
    ],
    [],
  );

  const filterColumns = useMemo(
    () => [
      { id: "name", label: "Name", type: "text" as const },
      { id: "email", label: "Email", type: "text" as const },
      { id: "totalValue", label: "Balance", type: "number-range" as const },
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
          title="Users"
          columns={columns}
          data={users}
          gridClassName="grid-cols-3"
          filterColumns={filterColumns}
          emptyText="No users yet. Create your first one!"
          onRowClick={openModal}
          renderMobileCard={(user) => (
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                {user.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex flex-1 flex-col min-w-0">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-xs text-white/50">{user.email}</span>
              </div>
              <span className="shrink-0 text-sm font-medium text-white/70">
                {Intl.NumberFormat("hu-HU").format(user.totalValue)} Ft
              </span>
            </div>
          )}
          getCellValueClassName={(_, columnId) => {
            if (columnId === "email" || columnId === "totalValue") {
              return "text-white/70";
            }
            return "";
          }}
        />
      </div>

      <UserModal
        user={selectedUser}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleUserUpdate}
        onDelete={handleUserDelete}
      />
    </div>
  );
}
