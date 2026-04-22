"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  cell?: (row: T) => React.ReactNode; // overrides accessor
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  total: number; // total records (from API)
  pageSize?: number; // default 10
  pageParam?: string; // default "page"
  emptyText?: string; // default "No data"
  rowKey: (row: T) => string | number;
  pagination?: boolean;
};

export default function DataTable<T>({
  data,
  columns,
  total,
  pageSize = 10,
  pageParam = "page",
  emptyText = "No data",
  rowKey,
  pagination = true,
}: DataTableProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get(pageParam) || "1", 10));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParam, String(next));
    router.replace(`${pathname}?${params.toString()}`);
  };

  const renderCell = (col: Column<T>, row: T) => {
    if (col.cell) return col.cell(row);
    if (typeof col.accessor === "function") return col.accessor(row);
    const v = row[col.accessor] as unknown as React.ReactNode;
    return v ?? "";
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-2xl shadow border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-left">
            <tr>
              {columns.map((c, i) => (
                <th key={i} className="py-3 px-4">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-orange/50 transition-colors"
                >
                  {columns.map((c, i) => (
                    <td key={i} className={`py-3 px-4 ${c.className ?? ""}`}>
                      {renderCell(c, row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 px-4 text-center text-gray-600"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-600">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span> —{" "}
            <span className="font-semibold">{total}</span> result
            {total !== 1 ? "s" : ""}
          </p>

          <div className="inline-flex gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-1.5 border rounded disabled:opacity-50"
            >
              « First
            </button>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 border rounded disabled:opacity-50"
            >
              ‹ Prev
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 border rounded disabled:opacity-50"
            >
              Next ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 border rounded disabled:opacity-50"
            >
              Last »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
