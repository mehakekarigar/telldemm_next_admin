"use client";

// import Badge from "@/components/ui/badge/Badge";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/ui/button/Button";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateGroup?: (groupId: number, updatedGroup: TData) => void;
  }
}

// Type definitions
export type Group = {
  group_id: number;
  group_name: string;
  creator_name: string; // Updated from created_by to creator_name
  member_count: number;
  created_at: string | null;
  group_dp: string | null;
  creator_id: number | null;
  creator_dp: string | null;
};

export type Member = {
  user_id: number;
  member_name: string;
  phone_number: string;
  email: string | null;
  role_name: string;
  added_on: string;
  is_active: number;
};

const istFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

function safeParseDate(ts: string | null): Date | null {
  if (!ts) return null;
  return new Date(ts);
}

export const columns: ColumnDef<Group>[] = [
  {
    id: "sequential_id",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
  },
  {
    accessorKey: "group_id",
    header: "Group ID",
  },
  {
    accessorKey: "group_name",
    header: "Group Name",
  },
  {
    accessorKey: "creator_name",
    header: "Created By",
  },
  {
    accessorKey: "member_count",
    header: "Member Count",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const ts = row.original.created_at;
      const d = safeParseDate(ts);
      if (!d) return "Never";
      try {
        const relative = formatDistanceToNow(d, { addSuffix: true });
        const absoluteIST = istFormatter.format(d) + " IST";
        return (
          <div className="flex flex-col">
            <span>{relative}</span>
            <small className="text-sm text-gray-500">{absoluteIST}</small>
          </div>
        );
      } catch {
        return "Invalid date";
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="classic"
        onClick={() => alert(`Manage group ${row.original.group_id}`)}
      >
        Manage
      </Button>
    ),
  },
];