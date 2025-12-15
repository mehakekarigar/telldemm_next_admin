// channels/[id]/members/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { DataTable } from "@/components/ui/data-table/data-table";
import { fetchChannelMembers, ChannelMembersResponse } from "../../../services/apiService";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type TableMember = {
  id: number; // maps from member_id
  channel_id: number;
  user_id: number;
  role_id: number;
  joined_at: string;
  is_active: number;
  removed_at: string | null;
  name: string;
  email: string | null;
};

export default function ChannelMembersPage() {
  const params = useParams();
  const channelId = parseInt(params.id as string, 10);

  const [members, setMembers] = useState<TableMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // channel info for UI (name + dp)
  const [channelName, setChannelName] = useState<string | null>(null);
  const [channelDp, setChannelDp] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const loadChannelMembers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: ChannelMembersResponse = await fetchChannelMembers(channelId, 1, 15);

        // set channel info for UI
        if (!cancelled) {
          setChannelName(response.channelInfo?.channel_name ?? null);
          setChannelDp(response.channelInfo?.channel_dp ?? null);
        }

        // Map API members to TableMember shape
        const mappedMembers: TableMember[] = (response.members || []).map((apiMember) => ({
          id: apiMember.member_id,
          channel_id: response.channelInfo?.channel_id ?? channelId,
          user_id: apiMember.user_id,
          role_id: apiMember.role_id,
           role_name: apiMember.role_name,
          joined_at: apiMember.joined_at,
          is_active: apiMember.is_active,
          removed_at: apiMember.removed_at,
          name: apiMember.name,
          email: apiMember.email,
        }));

        if (!cancelled) {
          setMembers(mappedMembers);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to fetch channel members.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (channelId && !Number.isNaN(channelId)) {
      loadChannelMembers();
    } else {
      setLoading(false);
      setError("Invalid channel id.");
    }

    return () => {
      cancelled = true;
    };
  }, [channelId]);

  type CellProps = {
  row: {
    index: number;
    original: TableMember;
  };
};

const memberColumns = [
  {
    id: "sequential_id",
    header: "S.No",
    cell: ({ row }: CellProps) => row.index + 1,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    accessorKey: "role_id",
    header: "Role ID",
  },
  {
    accessorKey: "role_name",
    header: "Role Name",
  },
  {
    accessorKey: "channel_id",
    header: "Channel ID",
  },
  {
    accessorKey: "joined_at",
    header: "Joined At",
    cell: ({ row }: CellProps) => {
      const ts = row.original.joined_at;
      const d = ts ? new Date(ts) : null;
      if (!d) return "Never";
      try {
        return d.toLocaleString();
      } catch {
        return "Invalid date";
      }
    },
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }: CellProps) => (row.original.is_active ? "Yes" : "No"),
  },
    {
    accessorKey: "removed_at",
    header: "Removed At",
  },
];

  return (
    <div>
      <button
  onClick={() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/channels");
    }
  }}
  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
>
  <ArrowLeft className="h-4 w-4" />
  Back
</button>

      {/* <PageBreadcrumb pageTitle="Channel Members" /> */}
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1440px]">
          <h3 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Channel Members
          </h3>

        
<div className="mb-6 flex items-center gap-3">
  {channelDp ? (
    <div className="h-16 w-16 overflow-hidden rounded-full border">
      <Image
        src={channelDp}
        alt="Channel DP"
        width={64}
        height={64}
        className="h-full w-full object-cover"
      />
    </div>
  ) : (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-gray-100 text-sm">
      {channelName ? channelName.slice(0, 2).toUpperCase() : "CH"}
    </div>
  )}

  <div>
    <div className="text-lg font-medium text-gray-700 dark:text-white">
      {channelName ?? `Channel #${channelId}`}
    </div>
    <div className="text-sm text-gray-500">{members.length} member(s)</div>
  </div>
</div>



          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <DataTable columns={memberColumns} data={members} />
          )}
        </div>
      </div>
    </div>
  );
}
