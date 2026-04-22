import { getWorkspaceBookingDetail } from "@/apis";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Booking Details - ${WEBNAME}`,
    description: "View detailed information about your workspace booking.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/my-work-history/${decodeURIComponent(id)}`,
    },
    openGraph: {
      type: "website",
      title: `Booking Details - ${WEBNAME}`,
      description: "View detailed information about your workspace booking.",
      url: `${DOMAIN_URL}/account/my-work-history/${decodeURIComponent(id)}`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Booking Details",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Booking Details - ${WEBNAME}`,
      description: "View detailed information about your workspace booking.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

type BookingDetail = {
  status: boolean;
  booking: {
    id: number;
    booking_number: string;
    status: string;
    subtotal: string;
    discount_total: string;
    tax_total: string;
    grand_total: string;
    currency: string;
    billing: {
      first_name: string;
      last_name: string;
      address: string;
      city: string;
      postcode: string;
    };
    created_at: string;
    items: Array<{
      id: number;
      type: string;
      title: string;
      description: string;
      unit_price: string;
      discount: string;
      vat: string;
      quantity: number;
      duration: number;
      total: string;
    }>;
  };
  payment?: {
    id: number;
    booking_id: number;
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
      last_name: string;
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

const formatMoney = (value: string | number, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(
    typeof value === "string" ? parseFloat(value) : value
  );

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr.replace(" ", "T").replace("Z", ""));
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

const paymentStatusClass = (status: string) => {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium";
  switch (status.toLowerCase()) {
    case "succeeded":
    case "completed":
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

const getCardBrandIcon = (brand: string) => {
  const normalized = brand.toLowerCase();
  switch (normalized) {
    case "visa":
      return "💳";
    case "mastercard":
      return "💳";
    case "amex":
    case "american express":
      return "💳";
    default:
      return "💳";
  }
};

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

function BookingItemCard({
  item,
  currency,
}: {
  item: BookingDetail["booking"]["items"][number];
  currency: string;
}) {
  return (
    <li className="flex gap-4 border-b border-slate-100 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold text-slate-900">
            {item.title}
          </div>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-700">
            {item.type}
          </span>
        </div>

        <div
          className="mt-1 line-clamp-3 text-sm text-slate-600"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />

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
              <span className="font-medium">{item.duration} months</span>
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

const BookingDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const bookingData = (await getWorkspaceBookingDetail(id)) as BookingDetail | null;

  if (!bookingData || !bookingData.status || !bookingData.booking) {
    notFound();
  }

  logger.info(bookingData, "bookingData");

  const { booking, payment } = bookingData;
  const currency = booking.currency || "GBP";

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Booking #{booking.booking_number}
          </h1>
          <p className="text-sm text-slate-600">
            Created on {formatDate(booking.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={statusClass(booking.status)}>{booking.status}</span>
        </div>
      </div>

      {/* Totals + Billing */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader title="Booking summary" />
          <div className="p-4">
            <div className="space-y-1.5">
              <Row
                label="Subtotal"
                value={formatMoney(booking.subtotal, currency)}
              />
              <Row
                label="Discounts"
                value={formatMoney(booking.discount_total, currency)}
              />
              <Row label="Tax" value={formatMoney(booking.tax_total, currency)} />
              <div className="my-2 border-t border-slate-200" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-slate-900">
                  Grand total
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {formatMoney(booking.grand_total, currency)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Billing Information" />
          <div className="p-4 text-sm">
            <div className="font-semibold text-slate-900">
              {booking.billing.first_name} {booking.billing.last_name}
            </div>
            <div className="mt-2 text-slate-700">
              {booking.billing.address}
            </div>
            <div className="text-slate-700">
              {booking.billing.city}, {booking.billing.postcode}
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Section */}
      {payment && (
        <Card className="mt-4">
          <CardHeader 
            title="Payment Information"
            aside={
              <span className={paymentStatusClass(payment.status)}>
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
                        <span>{getCardBrandIcon(payment.card.brand)}</span>
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
                      {payment.billing.first_name} {payment.billing.last_name}
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
        <CardHeader title="Booking Items" />
        <ul className="divide-y divide-transparent p-4">
          {booking.items.map((item) => (
            <BookingItemCard key={item.id} item={item} currency={currency} />
          ))}
        </ul>
      </Card>

      {/* Footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div>Booking ID: {booking.id}</div>
        <div>Created: {formatDate(booking.created_at)}</div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
