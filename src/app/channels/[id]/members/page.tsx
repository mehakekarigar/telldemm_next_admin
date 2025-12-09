// channels/[id]/members/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Row } from "@tanstack/react-table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ChannelMember } from "../../manage/columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { fetchChannelMembers } from "../../../services/apiService";

export default function ChannelMembersPage() {
  const params = useParams();
  const channelId = parseInt(params.id as string, 10);

  const [members, setMembers] = useState<ChannelMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadChannelMembers = async () => {
      setLoading(true);
      try {
        const response = await fetchChannelMembers(channelId, 1, 15); // Fetch first page with limit 15

        const mappedMembers: ChannelMember[] = response.members.map((apiMember) => ({
          id: apiMember.id,
          channel_id: apiMember.channel_id,
          user_id: apiMember.user_id,
          role_id: apiMember.role_id,
          joined_at: apiMember.joined_at,
          is_active: apiMember.is_active,
          removed_at: apiMember.removed_at,
          name: apiMember.name,
          email: apiMember.email,
        })) as ChannelMember[];

        if (!cancelled) setMembers(mappedMembers);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to fetch channel members.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (channelId) {
      loadChannelMembers();
    }

    return () => {
      cancelled = true;
    };
  }, [channelId]);

  const memberColumns = [
    {
      id: "sequential_id",
      header: "S.No",
      cell: ({ row }: { row: Row<ChannelMember> }) => row.index + 1,
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
      accessorKey: "channel_id",
      header: "Channel ID",
    },
     {
      accessorKey: "removed_at",
      header: "Removed At",
    },

    {
      accessorKey: "joined_at",
      header: "Joined At",
      cell: ({ row }: { row: Row<ChannelMember> }) => {
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
      cell: ({ row }: { row: Row<ChannelMember> }) => (row.original.is_active ? "Yes" : "No"),
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Channel Members" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1440px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Channel Members
          </h3>
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
