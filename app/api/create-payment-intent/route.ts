import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

type PaymentItem = {
  id: string;
  type?: string;
  price: number | string;
  qty?: number | string;
  quantity?: number | string;
  discount?: number | string;
  vat?: number | string;
  companyHousingFee?: number | string;
  company_housing_fee?: number | string;
};

const toNumber = (value: number | string | undefined | null): number => {
  if (value === undefined || value === null) return 0;

  const num =
    typeof value === "number" ? value : parseFloat(String(value || 0));

  return isNaN(num) ? 0 : num;
};

const normalizeItems = (items: PaymentItem[]) => {
  return items.map((item) => {
    const type = item.type || "";

    const price = toNumber(item.price);
    const discount = toNumber(item.discount);
    const vat = toNumber(item.vat);

    const qty = Math.max(
      1,
      Math.floor(toNumber(item.qty ?? item.quantity ?? 1))
    );

    const companyHousingFee =
      type === "package"
        ? toNumber(item.companyHousingFee ?? item.company_housing_fee ?? 0)
        : 0;

    const net = Math.max(0, price - discount);

    const lineTotal =
      (net + vat + companyHousingFee) * qty;

    return {
      id: item.id,
      type,
      price,
      discount,
      vat,
      qty,
      companyHousingFee,
      net,
      lineTotal,
    };
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const currency = String(body.currency || "GBP").toLowerCase();
    const billing = body.billing || {};
    const paymentMethodId = body.paymentMethodId;
    const items = Array.isArray(body.items) ? body.items : [];

    if (!paymentMethodId) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment method is required",
          error: "missing_payment_method",
        },
        { status: 422 }
      );
    }

    if (!items.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart is empty",
          error: "empty_cart",
        },
        { status: 422 }
      );
    }

    const normalizedItems = normalizeItems(items);

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const discountTotal = normalizedItems.reduce(
      (sum, item) => sum + item.discount * item.qty,
      0
    );

    const taxTotal = normalizedItems.reduce(
      (sum, item) => sum + item.vat * item.qty,
      0
    );

    const companyHousingFeeTotal = normalizedItems.reduce(
      (sum, item) => sum + item.companyHousingFee * item.qty,
      0
    );

    const grandTotal = normalizedItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    const amountInPence = Math.round(grandTotal * 100);

    if (amountInPence <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount",
          error: "invalid_amount",
        },
        { status: 422 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency,
      payment_method_types: ["card"],
      receipt_email: billing.email || undefined,
      metadata: {
        subtotal: subtotal.toFixed(2),
        discount_total: discountTotal.toFixed(2),
        tax_total: taxTotal.toFixed(2),
        company_housing_fee: companyHousingFeeTotal.toFixed(2),
        grand_total: grandTotal.toFixed(2),
        items_count: String(normalizedItems.length),
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntent,
      amount: amountInPence,
      currency,
      totals: {
        subtotal,
        discount_total: discountTotal,
        tax_total: taxTotal,
        company_housing_fee: companyHousingFeeTotal,
        grand_total: grandTotal,
      },
      items: normalizedItems,
    });
  } catch (error: any) {
    console.error("Create payment intent error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create payment intent",
        error: "server_error",
      },
      { status: 500 }
    );
  }
}