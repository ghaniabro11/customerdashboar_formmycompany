"use client";
import DataTable, { Column } from "@/components/custom/datatable";
import logger from "@/lib/logger/logger";
import Link from "next/link";

type Order = {
  uuid: string;
  status: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  grand_total: number;
  currency: string;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default function OrderHistoryPage({
  orders,
}: {
  orders: { orders: Order[]; total: number };
}) {
  // Your API should support pagination: { data, total }
  // Example: fetchCustomerOrderHistory({ page, pageSize })
  const data = orders?.orders ?? [];
  logger.info(orders);

  const columns: Column<Order>[] = [
    {
      header: "UUID",
      accessor: (o) => (
        <span title={o.uuid} className="truncate block max-w-[160px]">
          {o.uuid}
        </span>
      ),
    },
    { header: "Status", accessor: "status", className: "capitalize" },
    { header: "Subtotal", accessor: "subtotal" },
    { header: "Discount", accessor: "discount_total" },
    { header: "Tax", accessor: "tax_total" },
    { header: "Total", accessor: "grand_total" },
    { header: "Currency", accessor: "currency" },
    { header: "Created", accessor: "created_at" },
    {
      header: "Action",
      accessor: (o) => (
        <Link
          href={`/account/order-history/${o.uuid}`}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <section className="max-w-6xl mx-auto min-h-dvh p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
        Order History
      </h1>

      <DataTable<Order>
        data={data}
        columns={columns}
        total={data?.length}
        pagination={false}
        rowKey={(o) => o.uuid}
        pageParam="page" // syncs with ?page
        emptyText="No orders found"
      />
    </section>
  );
}
