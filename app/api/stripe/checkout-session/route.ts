import logger from "@/lib/logger/logger";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { lineItems, billingDetails, workspaceIds } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/company-inbox`,
      customer_email: billingDetails.email,
      metadata: {
        workspaceIds: workspaceIds.join(","),
      },
    });
    logger.debug("Created Stripe checkout session:", session);
    return NextResponse.json({ url: session.url, session });
  } catch (error) {
    logger.error("Checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
