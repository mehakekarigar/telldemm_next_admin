// users/columns.tsx
"use client";

import Badge from "@/components/ui/badge/Badge";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { forceLogoutUser } from "../services/apiService";
import Button from "@/components/ui/button/Button";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateUser?: (userId: number, updatedUser: TData) => void;
  }
}

// Define a type for your API response
type ApiResponse = {
  status: boolean;
  message?: string;
};

export type User = {
  user_id: number;
  name: string;
  phone_number: string;
  status: string;
  last_seen: string | null;
  is_online: number | boolean;
  force_logout: number;
  logged_in_status: number;
  last_logged_in: string | null;
};

// const mapStatusBadge = (
//   status: string
// ): { label: string; color: "success" | "warning" | "error" } => {
//   switch ((status || "").toLowerCase()) {
//     case "verified":
//       return { label: "Active", color: "success" };
//     case "pending_otp":
//     case "unverified":
//       return { label: "Inactive", color: "warning" };
//     case "blocked":
//       return { label: "Blocked", color: "error" };
//     default:
//       return { label: "Inactive", color: "warning" };
//   }
// };

// Formatter for IST absolute strings
// const istFormatter = new Intl.DateTimeFormat("en-GB", {
//   timeZone: "Asia/Kolkata",
//   year: "numeric",
//   month: "short",
//   day: "2-digit",
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
//   hour12: true,
// });

const istFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

function safeParseDate(ts: string | null): Date | null {
  if (!ts) return null;
  return new Date(ts); // always return Date object
}

export const columns: ColumnDef<User>[] = [
  {
    id: "sequential_id",
    header: "S.No",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
  },
  {
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
 {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
    const status = (row.original.status || "").toLowerCase();

    switch (status) {
      case "verified":
        return <Badge variant="light" color="success">Verified</Badge>;
      case "blocked":
        return <Badge variant="light" color="error">Blocked</Badge>;
      case "pending_otp":
      case "unverified":
      default:
        return <Badge variant="light" color="warning">Unverified</Badge>;
    }
  },
},
  {
    accessorKey: "last_seen",
    header: "Last Seen",
    cell: ({ row }) => {
      const ts = row.original.last_seen;
      const d = safeParseDate(ts);
      if (!d) return "Never";
      try {
        const relative = formatDistanceToNow(d, { addSuffix: true });
        const absoluteIST = istFormatter.format(d) + " IST";
        return (
          <div className="flex flex-col">
            <span>{relative}</span>
            <small className="text-sm text-gray-500">{absoluteIST}</small>
          </div>
        );
      } catch {
        return "Invalid date";
      }
    },
  },
  {
    accessorKey: "is_online",
    header: "Online",
    cell: ({ row }) => {
      const online = row.original.is_online === 1 || row.original.is_online === true;
      return (
        <span className={online ? "text-green-600" : "text-red-600"}>
          {online ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    accessorKey: "logged_in_status",
    header: "Logged In Status",
    cell: ({ row }) => (
      <span className={row.original.logged_in_status === 1 ? "text-green-600" : "text-red-600"}>
        {row.original.logged_in_status === 1 ? "Logged In" : "Logged Out"}
      </span>
    ),
  },
  {
    accessorKey: "last_logged_in",
    header: "Last Logged In",
    cell: ({ row }) => {
      const ts = row.original.last_logged_in;
      const d = safeParseDate(ts);
      if (!d) return "Never";
      try {
        const relative = formatDistanceToNow(d, { addSuffix: true });
        const absoluteIST = istFormatter.format(d) + " IST";
        return (
          <div className="flex flex-col">
            <span>{relative}</span>
            <small className="text-sm text-gray-500">{absoluteIST}</small>
          </div>
        );
      } catch {
        return "Invalid date";
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const user = row.original;
      if (user.force_logout === 1) {
        return <span className="text-gray-500 font-medium">Already Logged Out</span>;
      }

      return (
        <Button
          size="sm"
          variant="classic"
          // onClick={async () => {
          //   try {
          //     const res = await forceLogoutUser(user.user_id);
          //     if (res && (res as any).status) {
          //       table.options.meta?.updateUser?.(user.user_id, {
          //         ...user,
          //         force_logout: 1,
          //         is_online: 0,
          //       } as User);
          //     } else {
          //       alert("Failed: " + ((res as any).message || "Unknown"));
          //     }
          //   } catch (err: any) {
          //     alert(err?.message || "Something went wrong while forcing logout");
          //   }
          // }}
          // inside the action cell
          onClick={async () => {
            try {
              const res: ApiResponse = await forceLogoutUser(user.user_id);

              if (res.status) {
                table.options.meta?.updateUser?.(user.user_id, {
                  ...user,
                  force_logout: 1,
                  is_online: 0,
                } as User);
              } else {
                alert("Failed: " + (res.message || "Unknown"));
              }
            } catch (err: unknown) {
              if (err instanceof Error) {
                alert(err.message);
              } else {
                alert("Something went wrong while forcing logout");
              }
            }
          }}
        >
          Force Logout
        </Button>
      );
    },
  },
];
