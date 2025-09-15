"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import Button from "@/components/ui/button/Button";
// import { Button } from "@/components/ui/button";

// Define the shape of your data
interface ApiMessage {
  user_id: number;
  name: string;
  phone_number: string;
  last_logged_in: string;
  status: boolean;
}

// ✅ Static dataset
const staticMessages: ApiMessage[] = [
  {
    user_id: 1,
    name: "Alice",
    phone_number: "+91 9876543210",
    last_logged_in: "2025-09-13T17:23:48.000Z",
    status: true,
  },
  {
    user_id: 2,
    name: "Bob",
    phone_number: "+91 9123456780",
    last_logged_in: "2025-09-14T09:12:30.000Z",
    status: false,
  },
  {
    user_id: 3,
    name: "Charlie",
    phone_number: "+91 9988776655",
    last_logged_in: "2025-09-15T11:45:00.000Z",
    status: true,
  },
];

// ✅ Table columns
const columns: ColumnDef<ApiMessage>[] = [
  {
    accessorKey: "user_id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
  },
  {
    accessorKey: "last_logged_in",
    header: "Last Login",
    cell: ({ row }) => {
      const dt = new Date(row.original.last_logged_in);
      return dt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded text-xs ${
          row.original.status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
        }`}
      >
        {row.original.status ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => alert(`Force logout user ${row.original.user_id}`)}
      >
        Force Logout
      </Button>
    ),
  },
];

// ✅ Static page component
export default function MessagesPage() {
  const [data] = useState<ApiMessage[]>(staticMessages);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Messages (Static View)</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
