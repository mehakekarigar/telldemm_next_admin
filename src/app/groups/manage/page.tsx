"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { columns, Group, Member } from "./columns";
import { DataTable } from "../data_table";
import { fetchGroups, fetchGroupMembers } from "@/app/services/apiService";

export default function GroupTablePage() {
  const [data, setData] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

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
        console.error("Error fetching groups:", err);
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

  const handleMemberCountClick = async (groupId: number) => {
    console.log("handleMemberCountClick triggered for groupId:", groupId); // Debug log
    setSelectedGroupId(groupId);
    setMembersLoading(true);
    setMembersError(null);
    try {
      const groupMembers = await fetchGroupMembers(groupId);
      console.log("Fetched members:", groupMembers); // Debug log
      setMembers(groupMembers);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching group members:", err);
      setMembersError("Failed to fetch group members.");
    } finally {
      setMembersLoading(false);
    }
  };

  const closeModal = () => {
    console.log("Closing modal"); // Debug log
    setIsModalOpen(false);
    setMembers([]);
    setSelectedGroupId(null);
    setMembersError(null);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Group Table" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white p-2 text-gray-900 dark:text-white dark:bg-white/[0.03]">
        <div className="mx-auto w-full max-w-[1440px] relative">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">Groups</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              onUpdateGroup={(id, updated) => {
                setData((prev) => prev.map((g) => (g.group_id === id ? updated as Group : g)));
              }}
              onMemberCountClick={handleMemberCountClick}
            />
          )}
          {isModalOpen && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-md">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Members of Group {data.find((g) => g.group_id === selectedGroupId)?.group_name || "Unknown"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                  {membersLoading ? (
                    <p>Loading members...</p>
                  ) : membersError ? (
                    <p className="text-red-500">{membersError}</p>
                  ) : members.length === 0 ? (
                    <p>No members found.</p>
                  ) : (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="text-left p-2">S.No</th>
                          <th className="text-left p-2">Name</th>
                          <th className="text-left p-2">Phone</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Role</th>
                          <th className="text-left p-2">Added On</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member, index) => (
                          <tr key={member.user_id} className="border-b dark:border-gray-700">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{member.member_name}</td>
                            <td className="p-2">{member.phone_number}</td>
                            <td className="p-2">{member.email || "N/A"}</td>
                            <td className="p-2">{member.role_name}</td>
                            <td className="p-2">{new Date(member.added_on).toLocaleDateString("en-GB")}</td>
                            <td className="p-2">{member.is_active ? "Active" : "Inactive"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}