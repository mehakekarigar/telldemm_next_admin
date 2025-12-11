// src/app/groups/settings/GlobalGroupSettingsClient.tsx
"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";

export default function GlobalGroupSettingsClient() {
  const [privacy, setPrivacy] = useState("public");
  const [allowInvites, setAllowInvites] = useState(true);
  const [maxMembers, setMaxMembers] = useState(1000);
  const [onlyAdminsPost, setOnlyAdminsPost] = useState(false);
  const [allowImages, setAllowImages] = useState(true);
  const [allowVideos, setAllowVideos] = useState(true);
  const [allowDocuments, setAllowDocuments] = useState(true);
  const [autoDeleteMedia, setAutoDeleteMedia] = useState(false);
  const [muteGroup, setMuteGroup] = useState(false);
  const [mentionsOnly, setMentionsOnly] = useState(false);
  const [allowReports, setAllowReports] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("✅ Settings updated successfully!");
    setIsLoading(false);
  };

  const handleReset = () => {
    setPrivacy("public");
    setAllowInvites(true);
    setMaxMembers(1000);
    setOnlyAdminsPost(false);
    setAllowImages(true);
    setAllowVideos(true);
    setAllowDocuments(true);
    setAutoDeleteMedia(false);
    setMuteGroup(false);
    setMentionsOnly(false);
    setAllowReports(true);
    alert("🔄 Settings reset to defaults.");
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Group Settings" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-4xl space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white/90">
              ⚙️ Global Group Settings
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage privacy, invites, media, notifications, and more for all
              groups in one place.
            </p>
          </div>

          {/* Group Privacy */}
          <section className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              🔒 Group Privacy
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={privacy === "public"}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Public (Anyone can find and join)
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={privacy === "private"}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Private (Invite or approval required)
                </span>
              </label>
            </div>
          </section>

          {/* Group Invite Settings */}
          <section className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              ✉️ Group Invite Settings
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  Allow members to invite others
                </span>
                <input
                  type="checkbox"
                  checked={allowInvites}
                  onChange={(e) => setAllowInvites(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </label>
              <div className="text-xs text-gray-500 dark:text-gray-400 pl-3">
                Controls whether non-admins can send invites via email or link.
              </div>
            </div>
          </section>

          {/* Member Management */}
          <section className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              👥 Member Management
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Members per Group
                </label>
                <input
                  type="number"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(Number(e.target.value))}
                  min={1}
                  max={10000}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                  placeholder="Enter max members (e.g., 1000)"
                />
              </div>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  Only admins can post
                </span>
                <input
                  type="checkbox"
                  checked={onlyAdminsPost}
                  onChange={(e) => setOnlyAdminsPost(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </label>
            </div>
          </section>

          {/* Group Media Settings */}
          <section className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              📷 Group Media Settings
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={allowImages}
                  onChange={(e) => setAllowImages(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Allow Images
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={allowVideos}
                  onChange={(e) => setAllowVideos(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Allow Videos
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={allowDocuments}
                  onChange={(e) => setAllowDocuments(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Allow Documents
                </span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50">
                <input
                  type="checkbox"
                  checked={autoDeleteMedia}
                  onChange={(e) => setAutoDeleteMedia(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Auto-delete media after 30 days
                </span>
              </label>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              🔔 Notifications
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  Mute Group Notifications
                </span>
                <input
                  type="checkbox"
                  checked={muteGroup}
                  onChange={(e) => setMuteGroup(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  Notify on Mentions Only
                </span>
                <input
                  type="checkbox"
                  checked={mentionsOnly}
                  onChange={(e) => setMentionsOnly(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </label>
            </div>
          </section>

          {/* Security & Reporting */}
          <section className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              🛡️ Security & Reporting
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  Allow members to report inappropriate content
                </span>
                <input
                  type="checkbox"
                  checked={allowReports}
                  onChange={(e) => setAllowReports(e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </label>
              <div className="text-xs text-gray-500 dark:text-gray-400 pl-3">
                Enables reporting for spam, harassment, or violations.
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
            <button
              onClick={handleReset}
              className="rounded-xl bg-gray-500 px-6 py-3 text-white font-semibold shadow-md transition hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              🔄 Reset to Defaults
            </button>
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-md transition disabled:opacity-50 hover:bg-blue-700 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>💾 Update Settings</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
