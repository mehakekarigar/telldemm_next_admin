// app/dashboard/page.tsx  (or wherever this Dashboard component lives)

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import MessageActivity from "./components/MessageActivity";
import MetricsCards from "./components/MetricsCards";
import Notifications from "./components/Notifications";
import QuickActions from "./components/QuickActions";
import UserManagement from "./components/UserManagement";

// 🔐 Helper to validate token using your backend
async function validateToken(token: string) {
  try {
    const res = await fetch("https://apps.ekarigar.com/backend/admin/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // don’t cache auth check
    });

    // 401 → token invalid / expired
    if (res.status === 401) return false;

    return true;
  } catch {
    return false;
  }
}

// 🔐 Secure server component
export default async function Dashboard() {
  // 1️⃣ Get token from cookies (server-side)
  const token = (await cookies()).get("auth_token")?.value;

  // 2️⃣ No token → redirect to login
  if (!token) {
    redirect("/Login");
  }

  // 3️⃣ Validate token with backend
  const isValid = await validateToken(token);
  if (!isValid) {
    redirect("/Login");
  }

  // 4️⃣ Token valid → render dashboard
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Monitor your chat application metrics and user activity
      </p>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Message Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MessageActivity />
        <Notifications />
      </div>

      {/* Quick Actions and User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <QuickActions />
        <UserManagement />
      </div>
    </div>
  );
}
