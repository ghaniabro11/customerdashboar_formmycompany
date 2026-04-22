"use client";
import DataTable, { Column } from "@/components/custom/datatable";
import Link from "next/link";

type Booking = {
  id: number;
  booking_number: string;
  status: string;
  currency: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  grand_total: number;
  created_at: string;
};

const formatMoney = (value: number, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(value);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr.replace(" ", "T") + "Z");
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusClass = (status: string) => {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium";
  switch (status.toLowerCase()) {
    case "pending":
      return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
    case "confirmed":
    case "completed":
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    case "cancelled":
      return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
    default:
      return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
  }
};

export default function WorkHistoryTable({
  bookings,
  total,
}: {
  bookings: Booking[];
  total: number;
}) {
  const columns: Column<Booking>[] = [
    {
      header: "Booking Number",
      accessor: (b) => (
        <span className="font-semibold text-slate-900">
          #{b.booking_number}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (b) => (
        <span className={statusClass(b.status)}>{b.status}</span>
      ),
    },
    {
      header: "Subtotal",
      accessor: (b) => formatMoney(b.subtotal, b.currency),
    },
    {
      header: "Discount",
      accessor: (b) => formatMoney(b.discount_total, b.currency),
    },
    {
      header: "Tax",
      accessor: (b) => formatMoney(b.tax_total, b.currency),
    },
    {
      header: "Grand Total",
      accessor: (b) => (
        <span className="font-semibold text-slate-900">
          {formatMoney(b.grand_total, b.currency)}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: (b) => (
        <span className="text-sm text-slate-600">{formatDate(b.created_at)}</span>
      ),
    },
    {
      header: "Action",
      accessor: (b) => (
        <Link
          href={`/account/my-work-history/${b.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium underline"
        >
          View Details
        </Link>
      ),
    },
  ];

  return (
    <section className="max-w-6xl mx-auto min-h-dvh p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        My Work History
      </h1>

      <DataTable<Booking>
        data={bookings}
        columns={columns}
        total={total}
        pagination={true}
        rowKey={(b) => b.id.toString()}
        pageParam="page"
        emptyText="No bookings found"
      />
    </section>
  );
}
