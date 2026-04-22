// app/account/orders/[id]/page.tsx
import { fetchCustomerOrderHistoryDetail } from "@/apis";
import logger from "@/lib/logger/logger";
import React from "react";
export const dynamic = "force-dynamic";
type OrderHistory = {
  success: boolean;
  order: {
    id: number;
    order_number: string;
    uuid: string;
    customer_id: number;
    status: "pending" | "paid" | "failed" | "cancelled" | string;
    subtotal: string;
    discount_total: string;
    tax_total: string;
    grand_total: string;
    currency: string; // e.g. "GBP"
    billing: any;
    meta: any;
    created_at: string; // "YYYY-MM-DD HH:mm:ss"
    updated_at: string;
  };
  items: Array<{
    id: number;
    order_id: number;
    purchasable_type: string;
    purchasable_id: number;
    type: "package" | "addon" | "service_package" | string;
    title: string;
    description: string;
    unit_price: string;
    discount: string;
    vat: string;
    duration: string | null;
    quantity: number;
    total: string;
    meta: string | Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
    validity_status: "valid" | "expired" | "expiring_soon" | string;
    details?: {
      id: number;
      title: string;
      slug: string;
      summary?: string;
      description?: string;
      price?: string;
      discount?: string;
      vat?: string;
      duration?: string | null;
      status?: string;
      package_label?: string | null;
      primary_color?: string | null;
      secondary_color?: string | null;
    };
  }>;
  company?: {
    id: number;
    order_id: number;
    company_name: string;
    company_type: string;
    business_activity: string;
    registered_address: string;
    city: string;
    postcode: string;
    country: string;
    contact_email: string;
    contact_phone: string;
    status: string; // e.g. "draft"
    created_at: string;
    updated_at: string;
  } | null;
  payment?: {
    id: number;
    order_id: number;
    uuid: string;
    provider: string;
    provider_payment_id: string;
    amount: string;
    currency: string;
    status: string;
    card: {
      brand: string;
      exp_month: string;
      exp_year: string;
      last4: string;
    };
    billing: {
      first_name: string;
      last_name: string | null;
      address: string;
      city: string;
      country: string;
      postal_code: string;
      email: string;
      phone: string;
    };
    created_at: string;
    updated_at: string;
    payment_at: string;
  };
};

// ——— utils ———
const formatMoney = (value: string | number, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    typeof value === "string" ? parseFloat(value) : value
  );

const formatDate = (dateStr: string) => {
  // input "YYYY-MM-DD HH:mm:ss" -> local readable
  const d = new Date(dateStr.replace(" ", "T") + "Z"); // treat backend as UTC
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
  switch (status) {
    case "paid":
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    case "pending":
      return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
    case "failed":
    case "cancelled":
      return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
    default:
      return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
  }
};

const validityClass = (v: string) => {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium";
  switch (v) {
    case "valid":
      return `${base} bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200`;
    case "expired":
      return `${base} bg-rose-50 text-rose-700 ring-1 ring-rose-200`;
    case "expiring_soon":
      return `${base} bg-amber-50 text-amber-700 ring-1 ring-amber-200`;
    default:
      return `${base} bg-slate-50 text-slate-700 ring-1 ring-slate-200`;
  }
};

const parseMeta = (meta: unknown): Record<string, unknown> => {
  if (!meta) return {};
  if (typeof meta === "object") return meta as Record<string, unknown>;
  if (typeof meta === "string") {
    try {
      return JSON.parse(meta);
    } catch {
      return {};
    }
  }
  return {};
};

// ——— small UI bits ———
const Card = ({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) => (
  <div
    className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  title,
  aside,
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    {aside}
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-baseline justify-between py-1.5">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);

// ——— item card ———
function OrderItemCard({
  item,
  currency,
}: {
  item: OrderHistory["items"][number];
  currency: string;
}) {
  const meta = parseMeta(item.meta);
  const features = Array.isArray((meta as any).features)
    ? (meta as any).features
    : [];

  return (
    <li className="flex gap-4 border-b border-slate-100 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold text-slate-900">
            {item.title}
          </div>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-700">
            {item.type.replace("_", " ")}
          </span>
          <span className={validityClass(item.validity_status)}>
            {item.validity_status}
          </span>
          {item.details?.package_label ? (
            <span
              className="rounded px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ background: item.details?.primary_color || "#111827" }}
              title="Package label"
            >
              {item.details.package_label}
            </span>
          ) : null}
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {item.description}
        </p>

        {features.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1">
            {features.map((f: string, idx: number) => (
              <li
                key={idx}
                className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 ring-1 ring-slate-200"
              >
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <div>
            <span className="text-slate-500">Qty:</span>{" "}
            <span className="font-medium">{item.quantity}</span>
          </div>
          <div>
            <span className="text-slate-500">Unit:</span>{" "}
            <span className="font-medium">
              {formatMoney(item.unit_price, currency)}
            </span>
          </div>
          <div>
            <span className="text-slate-500">VAT:</span>{" "}
            <span className="font-medium">
              {formatMoney(item.vat || "0", currency)}
            </span>
          </div>
          {item.duration && (
            <div>
              <span className="text-slate-500">Duration:</span>{" "}
              <span className="font-medium">{item.duration}</span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="text-sm text-slate-500">Line total</div>
        <div className="text-base font-semibold text-slate-900">
          {formatMoney(item.total, currency)}
        </div>
      </div>
    </li>
  );
}

import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Order Details - ${WEBNAME}`,
    description: "View detailed information about your order, including items, pricing, and company details.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/order-history/${decodeURIComponent(id)}`,
    },
    openGraph: {
      type: "website",
      title: `Order Details - ${WEBNAME}`,
      description: "View detailed information about your order, including items, pricing, and company details.",
      url: `${DOMAIN_URL}/account/order-history/${decodeURIComponent(id)}`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Order Details",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Order Details - ${WEBNAME}`,
      description: "View detailed information about your order, including items, pricing, and company details.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

// ——— main page ———
const OrderHistoryDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const orderHistoryDetail = (await fetchCustomerOrderHistoryDetail(
    id
  )) as OrderHistory;

  logger.info(orderHistoryDetail, "orderHistoryDetail");

  const { order, items, company, payment } = orderHistoryDetail;
  const currency = order.currency || "GBP";

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Order #{order.order_number}
          </h1>
          <p className="text-sm text-slate-600">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
         <div className="flex items-center gap-2">
          <span className={statusClass(order.status)}>{order.status}</span>
          </div>
         {/* <button
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            // onClick={...} // connect to invoice download if available
          >
            Download invoice
          </button>
          {order.status === "pending" && (
            <a
              href={`/checkout/${order.uuid}`}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Pay now
            </a>
          )}
        */}
      </div>

      {/* Totals + Company */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader title="Order summary" />
          <div className="p-4">
            <div className="space-y-1.5">
              <Row
                label="Subtotal"
                value={formatMoney(order.subtotal, currency)}
              />
              <Row
                label="Discounts"
                value={formatMoney(order.discount_total, currency)}
              />
              <Row label="Tax" value={formatMoney(order.tax_total, currency)} />
              <div className="my-2 border-t border-slate-200" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Grand total
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {formatMoney(order.grand_total, currency)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Company"
            aside={
              company?.status ? (
                <span className={statusClass(company.status)}>
                  {company.status}
                </span>
              ) : null
            }
          />
          <div className="p-4 text-sm">
            {company ? (
              <>
                <div className="font-semibold text-slate-900">
                  {company.company_name}
                </div>
                <div className="text-slate-600">{company.company_type}</div>
                <div className="mt-2 text-slate-700">
                  {company.registered_address}, {company.city}{" "}
                  {company.postcode}, {company.country}
                </div>
                <div className="mt-2 text-slate-600">
                  {company.business_activity}
                </div>
                <div className="mt-3 space-y-1">
                  <div>
                    <span className="text-slate-500">Email:</span>{" "}
                    <a
                      className="text-indigo-600 hover:underline"
                      href={`mailto:${company.contact_email}`}
                    >
                      {company.contact_email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>{" "}
                    <a
                      className="text-indigo-600 hover:underline"
                      href={`tel:${company.contact_phone}`}
                    >
                      {company.contact_phone}
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-slate-500">No company details.</div>
            )}
          </div>
        </Card>
      </div>

      {/* Payment Section */}
      {payment && (
        <Card className="mt-4">
          <CardHeader 
            title="Payment Information"
            aside={
              <span className={statusClass(payment.status)}>
                {payment.status}
              </span>
            }
          />
          <div className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Payment Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Payment Details</h4>
                <div className="space-y-1.5">
                  <Row
                    label="Payment ID"
                    value={<span className="font-mono text-xs">{payment.provider_payment_id}</span>}
                  />
                  <Row
                    label="Provider"
                    value={
                      <span className="capitalize">{payment.provider}</span>
                    }
                  />
                  <Row
                    label="Amount"
                    value={
                      <span className="font-semibold text-slate-900">
                        {formatMoney(payment.amount, payment.currency)}
                      </span>
                    }
                  />
                  <Row
                    label="Payment Date"
                    value={formatDate(payment.payment_at)}
                  />
                </div>
              </div>

              {/* Card Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Card Information</h4>
                <div className="space-y-1.5">
                  <Row
                    label="Card"
                    value={
                      <div className="flex items-center gap-2">
                        <span>💳</span>
                        <span className="capitalize">{payment.card.brand}</span>
                        <span className="text-slate-500">•••• {payment.card.last4}</span>
                      </div>
                    }
                  />
                  <Row
                    label="Expiry"
                    value={
                      <span>
                        {payment.card.exp_month.padStart(2, "0")}/{payment.card.exp_year}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Payment Billing Address */}
            {payment.billing && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-900">
                  Payment Billing Address
                </h4>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <span className="text-slate-500">Name:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {payment.billing.first_name} {payment.billing.last_name || ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Email:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {payment.billing.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {payment.billing.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Country:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {payment.billing.country}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Address:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {payment.billing.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">City:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {payment.billing.city}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Postal Code:</span>{" "}
                    <span className="font-medium text-slate-900">
                      {payment.billing.postal_code}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Metadata */}
            <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <div>Payment UUID: <span className="font-mono">{payment.uuid}</span></div>
              <div>Created: {formatDate(payment.created_at)}</div>
              {payment.updated_at !== payment.created_at && (
                <div>Updated: {formatDate(payment.updated_at)}</div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Items */}
      <Card className="mt-4">
        <CardHeader title="Items" />
        <ul className="divide-y divide-transparent p-4">
          {items.map((item) => (
            <OrderItemCard key={item.id} item={item} currency={currency} />
          ))}
        </ul>
      </Card>

      {/* Footer meta */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Order ID: {order.id} • UUID: {order.uuid}
        </div>
        <div>Last updated: {formatDate(order.updated_at)}</div>
      </div>
    </div>
  );
};

export default OrderHistoryDetail;
