// channels/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { fetchChannelDetail, Channel } from "../../services/apiService";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

export default function ChannelDetailPage() {
  const params = useParams();
  const channelId = parseInt(params.id as string, 10);

  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadChannelDetail = async () => {
      setLoading(true);
      try {
        const channelData = await fetchChannelDetail(channelId);
        if (!cancelled) setChannel(channelData);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to fetch channel details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (channelId) {
      loadChannelDetail();
    }

    return () => {
      cancelled = true;
    };
  }, [channelId]);

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Channel Detail" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Channel Detail" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Channel Detail" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
          <p>Channel not found.</p>
        </div>
      </div>
    );
  }

  const channelColumns: ColumnDef<Channel>[] = [
    {
      id: "sequential_id",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
    },
    {
      accessorKey: "channel_dp",
      header: "Channel DP",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.channel_dp ? (
                  <Image src={row.original.channel_dp} alt="Channel DP" width={64} height={64} className="rounded-full" />
                ) : (
            "No DP"
          )}
        </div>
      ),
    },
    {
      accessorKey: "channel_id",
      header: "Channel ID",
    },
    {
      accessorKey: "channel_name",
      header: "Channel Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "creator_name",
      header: "Creator Name",
    },
    {
      accessorKey: "created_by",
      header: "Created By",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const ts = row.original.created_at;
        const d = ts ? new Date(ts) : null;
        if (!d) return "N/A";
        try {
          const relative = formatDistanceToNow(d, { addSuffix: true });
          return relative;
        } catch {
          return "Invalid date";
        }
      },
    },
    {
      accessorKey: "firebase_channel_id",
      header: "Firebase Channel ID",
    },
    {
      accessorKey: "is_public",
      header: "Is Public",
      cell: ({ row }) => (row.original.is_public ? "Yes" : "No"),
    },
    {
      accessorKey: "max_members",
      header: "Max Members",
    },
    {
      accessorKey: "delete_status",
      header: "Delete Status",
      cell: ({ row }) => (row.original.delete_status ? "Deleted" : "Active"),
    },
    {
      accessorKey: "deleted_at",
      header: "Deleted At",
      cell: ({ row }) => {
        const ts = row.original.deleted_at;
        const d = ts ? new Date(ts) : null;
        if (!d) return "N/A";
        try {
          const relative = formatDistanceToNow(d, { addSuffix: true });
          return relative;
        } catch {
          return "Invalid date";
        }
      },
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Channel Detail" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <DataTable columns={channelColumns} data={[channel]} />
      </div>
    </div>
  );
}
    
