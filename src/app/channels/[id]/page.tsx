// channels/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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

  const fmt = (s?: string | null) => (s ? new Date(s).toLocaleString() : "N/A");

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Channel Detail" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mx-auto w-full max-w-[1100px]">
            <div className="animate-pulse space-y-4">
              <div className="h-36 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-50 dark:from-gray-800 dark:to-gray-700" />
              <div className="h-4 w-2/5 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="h-20 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-20 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-20 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Channel Detail" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mx-auto w-full max-w-[1100px]">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Channel Detail" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mx-auto w-full max-w-[1100px]">
            <p>Channel not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Channel Detail" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1100px]">
          <header className="mb-6 rounded-xl bg-gradient-to-r from-white to-slate-50 p-6 shadow-sm dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-md dark:border-gray-800">
                  {channel.channel_dp ? (
                    <Image
                      src={channel.channel_dp}
                      alt={channel.channel_name ?? `Channel ${channel.channel_id}`}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xl font-semibold text-gray-600 dark:bg-gray-800">
                      {(channel.channel_name || "").slice(0, 2).toUpperCase() || "CH"}
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-white">
                  {channel.channel_name}
                </h2>
                  <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Description</div>
                  <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">{channel.description ?? "—"}</div>
                </div>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left: details grid */}
          <div className="rounded-lg border border-gray-100 bg-gradient-to-br from-white/80 to-slate-50 p-5 shadow-sm dark:from-gray-900/40 dark:to-gray-800/30 dark:border-gray-800 dark:bg-transparent">
  <div className="flex">
    {/* Accent stripe */}
    <div className="mr-4 flex-shrink-0">
      <div className="h-full w-1 rounded-full bg-gradient-to-b from-indigo-500 via-emerald-400 to-rose-400" />
    </div>

    <div className="w-full">
      <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Channel Information</h2>

      <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 dark:text-gray-500">Channel Name</span>
          <span className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{channel.channel_name}</span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-gray-400 dark:text-gray-500">Channel ID</span>
          <span className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{channel.channel_id}</span>
        </div>

        <div className="flex flex-col border-t border-transparent pt-3 sm:border-t-0 sm:pt-0">
          <span className="text-xs text-gray-400 dark:text-gray-500">Creator Name</span>
          <span className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-100">{channel.creator_name ?? "-"}</span>
        </div>

        <div className="flex flex-col border-t border-transparent pt-3 sm:border-t-0 sm:pt-0">
          <span className="text-xs text-gray-400 dark:text-gray-500">Created By</span>
          <span className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-100">{channel.created_by ?? "-"}</span>
        </div>

        <div className="flex flex-col col-span-1">
          <span className="text-xs text-gray-400 dark:text-gray-500">Created At</span>
          <span className="mt-1 text-sm text-gray-800 dark:text-gray-100 font-medium">{fmt(channel.created_at)}</span>
        </div>

        <div className="flex flex-col col-span-1">
          <span className="text-xs text-gray-400 dark:text-gray-500">Firebase Channel ID</span>
          <span className="mt-1 break-all text-sm text-gray-800 dark:text-gray-100 font-medium">{channel.firebase_channel_id ?? "—"}</span>
        </div>
      </div>
    </div>
  </div>
</div>


{/* Enhanced Status Card with diagonal split / inverted dark-mode colors */}
<div className="relative overflow-hidden rounded-lg border border-gray-100 p-5 shadow-sm dark:border-gray-800">
  {/* triangular backgrounds (absolute layers) */}
  {/* top-left triangle: light -> white, dark -> black */}
  <div
    className="pointer-events-none absolute inset-0 -z-10 [clip-path:polygon(0%_0%,100%_0%,0%_100%)]"
    aria-hidden="true"
  >
    <div className="h-full w-full bg-white dark:bg-black/95" />
  </div>

  {/* bottom-right triangle: light -> slate, dark -> white */}
  <div
    className="pointer-events-none absolute inset-0 -z-20 [clip-path:polygon(100%_100%,0%_100%,100%_0%)]"
    aria-hidden="true"
  >
    <div className="h-full w-full bg-slate-50 dark:bg-white/5" />
  </div>

  {/* subtle overlay to smooth the split (optional, keeps same fields) */}
  <div className="pointer-events-none absolute inset-0 -z-5 bg-gradient-to-tr from-transparent via-transparent to-transparent" />

  {/* Card content (kept exactly the same fields) */}
  <div className="relative z-10">
    <div className="flex items-center justify-between">
      <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</h2>
    </div>

    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {/* Is Public */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">Is Public</span>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              channel.is_public
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
            }`}
          >
            {channel.is_public ? "Yes (Public)" : "No (Private)"}
          </span>
        </div>
      </div>

      {/* Max Members */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">Max Members</span>
        <div className="mt-1">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/60 px-3 py-1 text-sm font-semibold text-slate-800 shadow-sm dark:bg-black/50 dark:text-white">
            <svg className="h-4 w-4 text-slate-500 dark:text-gray-300" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{channel.max_members ?? "—"}</span>
          </div>
        </div>
      </div>

      {/* Delete Status */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">Delete Status</span>
        <div className="mt-1">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              channel.delete_status
                ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
            }`}
          >
            {channel.delete_status ? "Deleted" : "Active"}
          </span>
        </div>
      </div>

      {/* Deleted At */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">Deleted At</span>
        <div className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
          {fmt(channel.deleted_at)}
        </div>
      </div>
    </div>
  </div>
</div>


          </section>
        </div>
      </div>
    </div>
  );
}
