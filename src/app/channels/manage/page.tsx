// channels/manage/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { columns, Channel } from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { fetchChannels } from "../../services/apiService";
import router from "next/router";

export default function ChannelTablePage() {
  const [data, setData] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadChannels = async () => {
      setLoading(true);
      try {
        const response = await fetchChannels(1, 10); // Fetch first page with limit 10

        const mappedChannels: Channel[] = response.channels.map((apiChannel) => ({
          channel_id: apiChannel.channel_id,
          channel_name: apiChannel.channel_name,
          creator_name: apiChannel.creator_name, 
          description: apiChannel.description,
          created_by: parseInt(apiChannel.created_by, 10),
          created_at: apiChannel.created_at,
          firebase_channel_id: apiChannel.firebase_channel_id,
          channel_dp: apiChannel.channel_dp,
          is_public: apiChannel.is_public,
          max_members: apiChannel.max_members,
          delete_status: apiChannel.delete_status,
          deleted_at: apiChannel.deleted_at,
        })) as Channel[];

        if (!cancelled) setData(mappedChannels);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to fetch channels.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadChannels();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleMemberCountClick = (channelId: number) => {
    router.push(`/channels/${channelId}/members`);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Channel Table" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1440px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">Channels</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              onMemberCountClick={handleMemberCountClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
