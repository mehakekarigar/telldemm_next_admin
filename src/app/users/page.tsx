// users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { columns, User } from "./columns";
import { DataTable } from "@/components/ui/data-table/data-table";
import { fetchUsers } from "../services/apiService";

export default function UserTablePage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadUsers = async () => {
      setLoading(true);
      try {
        const apiUsers = await fetchUsers();

        const mappedUsers: User[] = apiUsers.map((apiUser) => ({
          user_id: apiUser.user_id,
          name: apiUser.name,
          phone_number: apiUser.phone_number,
          status: apiUser.status,
          last_seen: apiUser.last_seen ?? null,
          is_online: apiUser.is_online,
          force_logout: apiUser.force_logout ?? 0,
          logged_in_status: apiUser.logged_in_status ?? 0,
          last_logged_in: apiUser.last_logged_in ?? null,
        }));

        if (!cancelled) setData(mappedUsers);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to fetch users.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="User Table" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1440px]">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">Users</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <DataTable columns={columns} data={data} onUpdateUser={(id, updated) => {
              // Optionally update local page-level state if you want persistence across interactions.
              setData(prev => prev.map(u => u.user_id === id ? updated as User : u));
            }} />
          )}
        </div>
      </div>
    </div>
  );
}
