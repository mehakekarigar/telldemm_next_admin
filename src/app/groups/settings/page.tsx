// src/app/groups/settings/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GlobalGroupSettingsClient from "./GlobalGroupSettingsClient";

// 🔐 Helper to validate token with your backend
async function validateToken(token: string) {
  try {
    const res = await fetch("https://apps.ekarigar.com/backend/admin/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fresh
    });

    // 401 => invalid / expired token
    if (res.status === 401) return false;

    return true;
  }  catch {
    return false;
  }
}

// 🔐 Server component wrapper
export default async function GlobalGroupSettingsPage() {
  const token = (await cookies()).get("auth_token")?.value;

  // No token → go to login
  if (!token) {
    redirect("/Login");
  }

  // Invalid / expired token → go to login
  const isValid = await validateToken(token);
  if (!isValid) {
    redirect("/Login");
  }

  // ✅ Token OK → render your client UI
  return <GlobalGroupSettingsClient />;
}
