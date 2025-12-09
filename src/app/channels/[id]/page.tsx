// channels/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { fetchChannelDetail, Channel } from "../../services/apiService";

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

  return (
    <div>
      <PageBreadcrumb pageTitle="Channel Detail" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1440px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Channel Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Channel DP
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {channel.channel_dp ? (
                  <img src={channel.channel_dp} alt="Channel DP" className="w-16 h-16 rounded-full" />
                ) : (
                  "No DP"
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Channel ID
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.channel_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Channel Name
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.channel_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.description}</p>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Creator Name
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.creator_name
}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Created By
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.created_by}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Created At
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {channel.created_at ? new Date(channel.created_at).toLocaleString() : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Firebase Channel ID
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.firebase_channel_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Is Public
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.is_public ? "Yes" : "No"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Members
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.max_members}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Delete Status
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.delete_status ? "Deleted" : "Active"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Deleted At
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {channel.deleted_at ? new Date(channel.deleted_at).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
