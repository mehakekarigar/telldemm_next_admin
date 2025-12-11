
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// ✅ Page metadata
export const metadata: Metadata = {
  title: "Next.js Blank Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Blank Page TailAdmin Dashboard Template",
};

async function validateToken(token: string) {
  try {
    const res = await fetch("https://apps.ekarigar.com/backend/admin/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // always fresh, don't cache auth check
    });

    // 401 => invalid / expired token
    if (res.status === 401) return false;

    return true;
  }  catch {
    return false;
  }
}

// ✅ Secure server component
export default async function BlankPage() {
  // 1️⃣ Read token from cookies (server-side)
  const token = (await cookies()).get("auth_token")?.value;

  // 2️⃣ No token → redirect to /Login
  if (!token) {
    redirect("/Login");
  }

  // 3️⃣ Validate token with backend
  const isValid = await validateToken(token);
  if (!isValid) {
    redirect("/Login");
  }

  // 4️⃣ Token is valid → render page
  return (
    <div>
      <PageBreadcrumb pageTitle="Blank Page" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Card Title Here
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Start putting content on grids or panels, you can also use different
            combinations of grids. Please check out the dashboard and other pages
          </p>
        </div>
      </div>
    </div>
  );
}
