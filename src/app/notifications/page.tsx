// src/app/notifications/page.tsx
"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect } from "react";
import { UserListItem } from "../services/apiService";
import {
  fetchNotifications,
  sendNotification,
  fetchUsers,
} from "../services/apiService";

interface Notification {
  id: number;
  from_user_id: number;
  from_username: string;
  to_user_id: number;
  to_username: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

interface UserOption {
  user_id: number;
  name: string;
}


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [newNotification, setNewNotification] = useState({
    from_user_id: "",
    to_user_id: "",
    title: "",
    message: "",
    type: "general",
  });
  const [loading, setLoading] = useState(false);
  // const [loadingUsers, setLoadingUsers] = useState(false);
  // const [ setLoadingUsers] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalNotifications, setTotalNotifications] = useState<number>(0);

  // Fetch users for dropdown
 // Update loadUsers:
  // const loadUsers = async () => {
  //   // Remove: setLoadingUsers(true);
  //   try {
  //     const res = await fetchUsers();
  //     // Fix any types: assume res is UserListItem[]
  //     const mapped: UserOption[] = Array.isArray(res)
  //       ? res.map((u: UserListItem) => ({ user_id: u.user_id, name: u.name }))
  //       : [];
  //     setUsers(mapped);
  //   } catch (err) {
  //     console.error("Failed to load users", err);
  //     setError(err instanceof Error ? err.message : "Failed to load users");
  //   } finally {
  //     // Remove: setLoadingUsers(false);
  //   }
  // };
  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      const mapped: UserOption[] = Array.isArray(res)
        ? res.map((u: UserListItem) => ({ user_id: u.user_id, name: u.name }))
        : [];
      setUsers(mapped);
    } catch (err) {
      console.error("Failed to load users", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
    }
  };
  // Load notifications for given page & limit
  // ✅ inside NotificationsPage
 // 1) Update loadNotifications signature and use optional filterUserId
// Updated loadNotifications to use pagination info if available, fallback to client-side estimation
// Full updated loadNotifications function with apiUserIdParam defined
const loadNotifications = async (p = page, l = limit, filterUserId?: string | number) => {
  setLoading(true);
  setError(null);
  try {
    // Prefer explicit filterUserId passed in; otherwise fallback to state
    let toUserIdStr: string | number | undefined;
    if (typeof filterUserId !== "undefined") {
      toUserIdStr = filterUserId;
    } else {
      toUserIdStr = newNotification.to_user_id;
    }

    // Normalize: '' -> undefined (no filter)
    const toUserId =
      toUserIdStr === "" || toUserIdStr === 0 || typeof toUserIdStr === "undefined"
        ? undefined
        : parseInt(String(toUserIdStr), 10);

    // Prefer: if toUserId === undefined -> pass 0 (backend treats 0 as "all")
    const apiUserIdParam = typeof toUserId === "undefined" ? 0 : toUserId;

    const result = await fetchNotifications(apiUserIdParam, p, l);
    setNotifications(result.notifications);

    if (result.pagination) {
      // Use backend-provided pagination
      setTotalPages(result.pagination.totalPages);
      setTotalNotifications(result.pagination.totalNotifications);
    } else {
      // Fallback to client-side estimation
      if (result.notifications.length < l && p === 1) {
        setTotalPages(1);
      } else if (result.notifications.length < l) {
        setTotalPages(p);
      } else {
        setTotalPages((prev) => Math.max(prev, p));
      }
      setTotalNotifications((prev) => (p === 1 ? result.notifications.length : prev + result.notifications.length));
    }
    setPage(p);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    setError(err instanceof Error ? err.message : "Error fetching notifications");
  } finally {
    setLoading(false);
  }
};



  // handle form submit
 // Updated handleSubmit in NotificationsPage
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  if (
    !newNotification.from_user_id ||
    !newNotification.to_user_id ||
    !newNotification.title ||
    !newNotification.message ||
    !newNotification.type
  ) {
    setError("All fields are required");
    setLoading(false);
    return;
  }

  try {
    // Note: from_user_id is not in payload as per Postman; assuming admin sends as system
    const payload = {
      to_user_id: parseInt(newNotification.to_user_id),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
    };
    const response = await sendNotification(payload);
    if (response.message.includes("successfully")) {
      // Refresh the notifications list instead of prepending (since full object not returned)
      const currentFilter = newNotification.to_user_id || undefined;
      loadNotifications(page, limit, currentFilter);
      // Reset form (keep current filter user selected)
      setNewNotification((prev) => ({
        from_user_id: "",
        to_user_id: prev.to_user_id,
        title: "",
        message: "",
        type: "general",
      }));
      setError("Notification sent successfully!");
    } else {
      throw new Error(response.message || "Unexpected response");
    }
  } catch (err) {
    console.error("Error sending notification:", err);
    setError(err instanceof Error ? err.message : "Error sending notification");
  } finally {
    setLoading(false);
  }
};

  // handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewNotification((prev) => ({ ...prev, [name]: value }));
  };

  // pagination handlers
  const goToPage = (p: number) => {
    const next = Math.max(1, Math.min(p, totalPages || p));
    setPage(next);
    loadNotifications(next, limit);
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);

  const onLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const l = parseInt(e.target.value, 10);
    setLimit(l);
    // reset to page 1 for new limit
    setPage(1);
    loadNotifications(1, l);
  };

  // load users & initial notifications
  useEffect(() => {
    loadUsers();
    loadNotifications(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Notification Management" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[1140px]">
          <h3 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Notification Management
          </h3>

          {/* Send Notification Form */}
          <div className="mb-8 rounded-lg bg-gray-50 p-6 dark:bg-gray-800/50">
            <h4 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              Send New Notification
            </h4>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  From User
                </label>
                <select
                  name="from_user_id"
                  value={newNotification.from_user_id}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">-- Select sender --</option>
                  {users.map((u) => (
                    <option key={u.user_id} value={String(u.user_id)}>
                      {u.name} ({u.user_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  To User
                </label>
                <select
                  name="to_user_id"
                  value={newNotification.to_user_id}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">-- Select recipient --</option>
                  {users.map((u) => (
                    <option key={u.user_id} value={String(u.user_id)}>
                      {u.name} ({u.user_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newNotification.title}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <input
                  type="text"
                  name="message"
                  value={newNotification.message}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter notification message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type
                </label>
                <select
                  name="type"
                  value={newNotification.type}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="general">General</option>
                  <option value="alert">Alert</option>
                  <option value="warning">Warning</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </form>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </div>

          {/* Filter & Pagination Controls */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">Filter by recipient:</label>

              <select
                value={newNotification.to_user_id}
                onChange={(e) => {
                  const val = e.target.value;
                  // update state for the form & filter UI
                  setNewNotification((prev) => ({ ...prev, to_user_id: val }));
                  // reset to page 1 and reload using the NEW value (pass value directly to avoid stale state)
                  setPage(1);
                  loadNotifications(1, limit, val); // <-- pass the selected value
                }}
                className="rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All users</option>
                {users.map((u) => (
                  <option key={u.user_id} value={String(u.user_id)}>
                    {u.name} ({u.user_id})
                  </option>
                ))}
              </select>

            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-300">Page size:</label>
              <select
                value={String(limit)}
                onChange={onLimitChange}
                className="rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              Recent Notifications
            </h4>

            {/* Debug / loading */}
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No notifications found.</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-800 dark:text-white/90">
                          {notification.title}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                          From: {notification.from_username} | To: {notification.to_username} |{" "}
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${notification.type === "general"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : notification.type === "alert"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                      >
                        {notification.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination UI */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing page <strong>{page}</strong> {totalNotifications ? `of ${totalPages}` : ""}{" "}
                {totalNotifications ? `- ${totalNotifications} total` : ""}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={page <= 1 || loading}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                >
                  Prev
                </button>

                {/* simple numeric buttons (1..totalPages up to 7 pages displayed) */}
                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(totalPages || 1, 7) },
                    (_, i) => i + 1
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`rounded px-3 py-1 ${p === page ? "bg-blue-600 text-white" : "border"}`}
                      disabled={loading}
                    >
                      {p}
                    </button>
                  ))}
                  {totalPages > 7 && (
                    <span className="px-2 text-sm text-gray-500">...</span>
                  )}
                </div>

                <button
                  onClick={nextPage}
                  disabled={page >= (totalPages || page) || loading}
                  className="rounded border px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* debug raw state - remove for production */}
            {/* <pre className="mt-4 text-xs bg-gray-100 p-2 rounded">{JSON.stringify({ notifications, page, limit, totalPages, totalNotifications }, null, 2)}</pre> */}
          </div>
        </div>
      </div>
    </div>
  );
}
