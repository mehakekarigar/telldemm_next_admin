"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { fetchChannelMembers, ChannelMember } from "../../../services/apiService";

export default function ChannelMembersPage() {
  const params = useParams();
  const channelId = parseInt(params.id as string, 10);

  const [members, setMembers] = useState<ChannelMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(15);
  const [pagination, setPagination] = useState<{ page: number; limit: number; totalPages: number; totalCount: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchChannelMembers(channelId, page, limit);
        if (!cancelled) {
          setMembers(res.members || []);
          setPagination(res.pagination || null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to fetch channel members.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (channelId) loadMembers();

    return () => {
      cancelled = true;
    };
  }, [channelId, page, limit]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Channel Members" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1440px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Channel Members
          </h3>

          {loading ? (
            <p>Loading members...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : members.length === 0 ? (
            <p>No members found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((m) => (
                  <div key={m.user_id} className="rounded-lg border p-4 bg-white shadow-sm dark:bg-gray-900">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{ m.name || "—"}</p>
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{m.email ?? "—"}</p>
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Channel Id</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{m.channel_id}</p>
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">User Id</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{m.user_id}</p>
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Id</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{m.role_id}</p>
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Removed At</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{m.removed_at}</p>
                    </div>

                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined At</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{m.joined_at ? new Date(m.joined_at).toLocaleString() : "—"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{m.is_active ? "Yes" : "No"}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing page {pagination?.page ?? page} of {pagination?.totalPages ?? "?"} — total {pagination?.totalCount ?? members.length}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={pagination ? page >= pagination.totalPages : members.length < limit}
                    className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}





