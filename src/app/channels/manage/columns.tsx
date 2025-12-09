"use client";

import { ColumnDef, RowData } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/ui/button/Button";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateChannel?: (channelId: number, updatedChannel: TData) => void;
    onMemberCountClick?: (channelId: number) => void;
    onChannelNameClick?: (channelId: number) => void;
  }
}

export type Channel = {
  channel_id: number;
  channel_name: string;
  description: string;
  created_by: number;
  created_at: string | null;
  firebase_channel_id: string;
  channel_dp: string | null;
  is_public: number;
  max_members: number;
  delete_status: number;
  deleted_at: string | null;
  creator_name: string;
};

export type ChannelMember = {
  id: number;
  channel_id: number;
  user_id: number;
  role_id: number;
  joined_at: string;
  is_active: number;
  removed_at: string | null;
  name: string;
  email: string | null;
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

export const columns: ColumnDef<Channel>[] = [
  {
    id: "sequential_id",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
  },
  {
    accessorKey: "channel_id",
    header: "Channel ID",
  },
  {
    accessorKey: "channel_name",
    header: "Channel Name",
    cell: ({ row }) => {
      const channelId = row.original.channel_id;
      const channelName = row.original.channel_name;
      return (
        <a
          href={`/channels/${channelId}`}
          className="text-blue-500 hover:underline"
        >
          {channelName}
        </a>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "creator_name",
    header: "Created By",
  },
  {
    accessorKey: "max_members",
    header: "Max Members",
    cell: ({ row, table }) => {
      const channelId = row.original.channel_id;
      const maxMembers = row.original.max_members;
      const onMemberCountClick = table.options.meta?.onMemberCountClick;

      return (
        <button
          type="button"
          className="text-blue-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            console.log("Member count clicked for channelId:", channelId); // Debug log
            onMemberCountClick?.(channelId);
          }}
          disabled={!onMemberCountClick}
        >
          {maxMembers}
        </button>
      );
    },
  },
  {
    accessorKey: "is_public",
    header: "Public",
    cell: ({ row }) => (row.original.is_public ? "Yes" : "No"),
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
        onClick={() => alert(`Manage channel ${row.original.channel_id}`)}
      >
        Manage
      </Button>
    ),
  },
];
