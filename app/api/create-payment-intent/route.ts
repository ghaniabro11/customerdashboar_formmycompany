import { NextResponse } from "next/server";
import Stripe from "stripe";
import logger from "@/lib/logger/logger";

// Don't initialize Stripe here - do it after validation
let stripe: Stripe | null = null;

export async function POST(req: Request) {
  try {
    logger.info("=== Payment Intent Creation Started ===");
    
    // Validate and initialize Stripe first
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    logger.info({
      hasStripeKey: !!stripeKey,
      keyPrefix: stripeKey ? stripeKey.substring(0, 7) + "..." : "missing",
      keyLength: stripeKey?.length || 0,
      isPublishableKey: stripeKey?.startsWith('pk_') || false,
      isSecretKey: stripeKey?.startsWith('sk_') || false,
    }, "Stripe key validation check");

    if (!stripeKey) {
      logger.error("STRIPE_SECRET_KEY environment variable is not set");
      return NextResponse.json(
        { 
          success: false,
          message: "Server configuration error: STRIPE_SECRET_KEY is not set",
          error: "missing_secret_key"
        },
        { status: 500 }
      );
    }

    if (stripeKey.startsWith('pk_')) {
      logger.error({
        keyType: "publishable",
        message: "STRIPE_SECRET_KEY is set to a publishable key (pk_) instead of a secret key (sk_)"
      }, "Invalid Stripe key type");
      return NextResponse.json(
        { 
          success: false,
          message: "Server configuration error: STRIPE_SECRET_KEY must be a secret key (starts with 'sk_'), not a publishable key",
          error: "invalid_key_type"
        },
        { status: 500 }
      );
    }

    if (!stripeKey.startsWith('sk_')) {
      logger.error({
        keyPrefix: stripeKey.substring(0, 7),
        message: "STRIPE_SECRET_KEY does not start with 'sk_'"
      }, "Invalid Stripe key format");
      return NextResponse.json(
        { 
          success: false,
          message: "Server configuration error: STRIPE_SECRET_KEY format is invalid (must start with 'sk_')",
          error: "invalid_key_format"
        },
        { status: 500 }
      );
    }

    // Initialize Stripe after validation
    if (!stripe) {
      stripe = new Stripe(stripeKey, {
        apiVersion: "2025-10-29.clover",
      });
      logger.info("Stripe instance initialized successfully");
    }

    const body = await req.json();
    logger.info({ body }, "Request body received");
    
    const { items = [], currency = "GBP", paymentMethodId, billing } = body;
    
    logger.info({
      itemsCount: items.length,
      currency,
      paymentMethodId,
      hasBilling: !!billing,
    }, "Payment intent parameters");

    // Recalculate totals server-side to prevent tampering
    const pricing = items.reduce(
      (acc: any, item: any) => {
        const unitPrice = parseFloat(item.price || 0);
        const duration = parseFloat(item.duration || 0);
        const qty = parseFloat(item.qty || 1);
        const discount = parseFloat(item.discount || 0);
        const vat = parseFloat(item.vat || 0);

        const workspaceSubtotal = unitPrice * duration * qty;
        const workspaceDiscount = discount * duration * qty;
        const workspaceTax = vat * duration * qty;

        return {
          subtotal: acc.subtotal + workspaceSubtotal,
          discountTotal: acc.discountTotal + workspaceDiscount,
          taxTotal: acc.taxTotal + workspaceTax,
        };
      },
      { subtotal: 0, discountTotal: 0, taxTotal: 0 }
    );

    const netTotal = pricing.subtotal - pricing.discountTotal;
    const total = netTotal + pricing.taxTotal;
    const amount = Math.max(0, Math.round(total * 100)); // amount in pence/cents

    logger.info({
      pricing,
      netTotal,
      total,
      amount,
      currency: (currency || "gbp").toLowerCase(),
    }, "Calculated pricing breakdown");

    // Create PaymentIntent server-side
    logger.info({
      amount,
      currency: (currency || "gbp").toLowerCase(),
      paymentMethodId: paymentMethodId || "not provided",
      willAttachPaymentMethod: false,
    }, "Creating Stripe PaymentIntent...");
    
    // Don't attach payment_method here - it will be attached during client-side confirmation
    // This avoids "No such PaymentMethod" errors when payment method is created client-side
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: (currency || "gbp").toLowerCase(),
      // Remove payment_method parameter - attach it during confirmation instead
      // payment_method: paymentMethodId || undefined,
      confirm: false,
      metadata: {
        items: JSON.stringify(items),
        billing: billing ? JSON.stringify(billing) : "",
      },
    }) as any;

    logger.info({
      paymentIntentId: intent.id,
      amount: intent.amount,
      currency: intent.currency,
      status: intent.status,
      clientSecret: intent.client_secret ? "***present***" : "missing",
      created: intent.created,
      metadata: intent.metadata,
      paymentMethodTypes: intent.payment_method_types,
      charges: intent.charges,
      customer: intent.customer,
      description: intent.description,
      completePaymentIntent: JSON.stringify(intent, null, 2), // Log complete PaymentIntent
    }, "PaymentIntent created successfully - complete details");

    // Return complete payment intent response
    // CRITICAL: Ensure we're returning client_secret, NOT the secret key
    const clientSecret = intent.client_secret;
    
    // Safety check - ensure we're not accidentally returning the secret key
    if (!clientSecret || clientSecret.startsWith('sk_')) {
      logger.error({
        hasClientSecret: !!clientSecret,
        clientSecretPrefix: clientSecret?.substring(0, 10),
        message: "CRITICAL: PaymentIntent client_secret is missing or appears to be a secret key!",
        intentId: intent.id,
      }, "Invalid client_secret in PaymentIntent");
      return NextResponse.json(
        {
          success: false,
          message: "Payment intent creation failed - invalid client secret",
          error: "invalid_client_secret"
        },
        { status: 500 }
      );
    }
    
    logger.info({
      clientSecretPrefix: clientSecret.substring(0, 30) + "...",
      clientSecretLength: clientSecret.length,
      clientSecretFormat: "pi_..._secret_...",
    }, "Validated client secret before returning to client");

    const response = {
      success: true,
      clientSecret: clientSecret, // Use the validated variable
      paymentIntent: intent, // Complete payment intent object
      amount: intent.amount,
      currency: intent.currency,
    };

    logger.info("=== Payment Intent Creation Completed Successfully ===");
    return NextResponse.json(response);
  } catch (err: any) {
    logger.error({
      error: err.message,
      type: err.type,
      code: err.code,
      statusCode: err.statusCode,
      stack: err.stack,
    }, "Payment intent creation error");
    
    return NextResponse.json(
      { 
        success: false,
        message: err.message || "Server error creating payment intent",
        error: err.type || "unknown_error"
      },
      { status: 500 }
    );
  }
}