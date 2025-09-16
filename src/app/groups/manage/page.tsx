//groups/manage/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { columns, Group } from "./columns";
// import { DataTable } from "@/components/groups/DataTable"; // Updated import path
import { fetchGroups } from "@/app/services/apiService";
import { DataTable } from "../data_table";

export default function GroupTablePage() {
  const [data, setData] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadGroups = async () => {
      setLoading(true);
      try {
        const apiGroups = await fetchGroups();
        const mappedGroups: Group[] = apiGroups.map((apiGroup) => ({
          group_id: apiGroup.group_id,
          group_name: apiGroup.group_name,
          creator_name: apiGroup.creator_name,
          member_count: apiGroup.member_count,
          created_at: apiGroup.created_at ?? null,
          group_dp: apiGroup.group_dp ?? null,
          creator_id: apiGroup.creator_id ?? null,
          creator_dp: apiGroup.creator_dp ?? null,
        }));

        if (!cancelled) setData(mappedGroups);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to fetch groups.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadGroups();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Group Table" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1440px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">Groups</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <DataTable columns={columns} data={data} onUpdateGroup={(id, updated) => {
              setData(prev => prev.map(g => g.group_id === id ? updated as Group : g));
            }} />
          )}
        </div>
      </div>
    </div>
  );
}