// components/ui/data-table/data-table.tsx
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "../button/Button";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onUpdateUser?: (userId: number, updatedUser: TData) => void;
  onMemberCountClick?: (channelId: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onUpdateUser,
  onMemberCountClick,
}: DataTableProps<TData, TValue>) {
  const [tableData, setTableData] = useState<TData[]>(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(globalFilter), 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter: debouncedFilter, sorting },
    onGlobalFilterChange: setDebouncedFilter,
    onSortingChange: setSorting,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    meta: {
      updateUser: onUpdateUser ? (userId: number, updatedUser: TData) => {
        setTableData((prev) => prev.map((u) => ((u as any).user_id === userId ? updatedUser : u)));
        onUpdateUser(userId, updatedUser);
      } : undefined,
      onMemberCountClick,
    },
  });

  const pageIndex = table.getState().pagination.pageIndex ?? 0;
  const pageSize = table.getState().pagination.pageSize ?? 10;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, table.getRowCount());
  const total = table.getRowCount();

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50 dark:bg-gray-800">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center space-x-2"
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                    >
                      <span>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getCanSort() && (
                        <span className="text-gray-400">
                          {({
                            asc: <ArrowUp className="h-4 w-4" />,
                            desc: <ArrowDown className="h-4 w-4" />,
                            false: <ArrowUpDown className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="h-4 w-4" />)}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-gray-500 dark:text-gray-400">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{from}</span> to <span className="font-medium">{to}</span> of <span className="font-medium">{total}</span> results
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
