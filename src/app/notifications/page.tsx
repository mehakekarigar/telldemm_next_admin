// src/app/notifications/page.tsx
"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState, useEffect } from "react";
import { fetchNotifications, sendNotification } from "../services/apiService";

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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState({
    from_user_id: "",
    to_user_id: "",
    title: "",
    message: "",
    type: "general",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications(44, 1, 10);
      setNotifications(data.notifications);
    // } catch (err) {
    //   // setError("Error fetching notifications");
    //   setError(err.message || "Error fetching notifications");
    // } 
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Error fetching notifications");
  }
}

    finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate inputs
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
      const notification = await sendNotification({
        ...newNotification,
        from_user_id: parseInt(newNotification.from_user_id),
        to_user_id: parseInt(newNotification.to_user_id),
      });
      setNotifications([notification, ...notifications]);
      setNewNotification({
        from_user_id: "",
        to_user_id: "",
        title: "",
        message: "",
        type: "general",
      });
    } 
    // catch (err) {
    //   setError("Error sending notification");
    // } 
//Type guard with instanceof Error
    catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Error fetching notifications");
  }
}

    finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewNotification((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    loadNotifications();
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
                  From User ID
                </label>
                <input
                  type="number"
                  name="from_user_id"
                  value={newNotification.from_user_id}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter sender ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  To User ID
                </label>
                <input
                  type="number"
                  name="to_user_id"
                  value={newNotification.to_user_id}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter recipient ID"
                  required
                />
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
                  required
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
                  required
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
                  required
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

          {/* Notifications List */}
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              Recent Notifications
            </h4>
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
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          notification.type === "general"
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
          </div>
        </div>
      </div>
    </div>
  );
}