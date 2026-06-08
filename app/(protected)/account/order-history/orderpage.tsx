"use client";

import DataTable, { Column } from "@/components/custom/datatable";
import logger from "@/lib/logger/logger";
import Link from "next/link";

type MoneyValue = number | string | null | undefined;

type Order = {
  uuid: string;
  status: string;
  subtotal: MoneyValue;
  discount_total: MoneyValue;
  tax_total: MoneyValue;
  company_housing_fee?: MoneyValue;
  grand_total: MoneyValue;
  currency: string;
  created_at: string;
};

export const dynamic = "force-dynamic";

const toNumber = (value: MoneyValue): number => {
  if (value === undefined || value === null || value === "") return 0;

  const num =
    typeof value === "number" ? value : parseFloat(String(value || 0));

  return isNaN(num) ? 0 : num;
};

const formatMoney = (value: MoneyValue, currency = "GBP") => {
  const amount = toNumber(value);

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
  }).format(amount);
};

const formatDate = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);

  if (isNaN(date.getTime())) return value;

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderHistoryPage({
  orders,
}: {
  orders: { orders: Order[]; total: number };
}) {
  const data = orders?.orders ?? [];

  logger.info(orders, "Order History Data");

  const columns: Column<Order>[] = [
    {
      header: "UUID",
      accessor: (o) => (
        <span title={o.uuid} className="truncate block max-w-[160px]">
          {o.uuid}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (o) => (
        <span className="capitalize">
          {o.status}
        </span>
      ),
    },
    {
      header: "Subtotal",
      accessor: (o) => formatMoney(o.subtotal, o.currency),
    },
    {
      header: "Discount",
      accessor: (o) => (
        <span>
          {toNumber(o.discount_total) > 0
            ? `-${formatMoney(o.discount_total, o.currency)}`
            : formatMoney(0, o.currency)}
        </span>
      ),
    },
    {
      header: "Tax",
      accessor: (o) => formatMoney(o.tax_total, o.currency),
    },
    {
      header: "Company Housing Fee",
      accessor: (o) => {
        const fee = toNumber(o.company_housing_fee);

        return fee > 0 ? formatMoney(fee, o.currency) : "-";
      },
    },
    {
      header: "Total",
      accessor: (o) => (
        <strong className="font-semibold">
          {formatMoney(o.grand_total, o.currency)}
        </strong>
      ),
    },
    {
      header: "Currency",
      accessor: (o) => o.currency || "GBP",
    },
    {
      header: "Created",
      accessor: (o) => formatDate(o.created_at),
    },
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
        total={orders?.total ?? data.length}
        pagination={false}
        rowKey={(o) => o.uuid}
        pageParam="page"
        emptyText="No orders found"
      />
    </section>
  );
}