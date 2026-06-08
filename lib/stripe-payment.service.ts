import logger from "@/lib/logger/logger";
import { Stripe, StripeElements } from "@stripe/stripe-js";

export interface BillingDetails {
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode?: string;
  country?: string;
}

export interface PaymentItem {
  id: string;
  type: string;
  price: number | string;
  duration: number;
  qty: number | string;
  discount?: number | string;
  vat?: number | string;
  companyHousingFee?: number | string;
}

export interface CreatePaymentIntentRequest {
  currency?: string;
  billing: BillingDetails;
  items: PaymentItem[];
  paymentMethodId: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntent?: any;
  amount?: number;
  currency?: string;
  message?: string;
  error?: string;
}

export interface ProcessPaymentResult {
  success: boolean;
  paymentIntent?: any;
  error?: string;
  errorMessage?: string;
}

export class StripePaymentService {
  private static toNumber(value: number | string | undefined | null): number {
    if (value === undefined || value === null) return 0;

    const num =
      typeof value === "number" ? value : parseFloat(String(value || 0));

    return isNaN(num) ? 0 : num;
  }

  private static normalizePaymentItems(items: PaymentItem[]): PaymentItem[] {
    return items.map((item) => {
      const type = item.type || "";
      const price = this.toNumber(item.price);
      const discount = this.toNumber(item.discount);
      const vat = this.toNumber(item.vat);
      const qty = Math.max(1, this.toNumber(item.qty || 1));

      const companyHousingFee =
        type === "package" ? this.toNumber(item.companyHousingFee) : 0;

      return {
        ...item,
        type,
        price,
        discount,
        vat,
        qty,
        companyHousingFee,
      };
    });
  }

  private static calculateItemsTotal(items: PaymentItem[]): number {
    return items.reduce((sum, item) => {
      const price = this.toNumber(item.price);
      const discount = this.toNumber(item.discount);
      const vat = this.toNumber(item.vat);
      const qty = Math.max(1, this.toNumber(item.qty || 1));

      const companyHousingFee =
        item.type === "package" ? this.toNumber(item.companyHousingFee) : 0;

      const net = Math.max(0, price - discount);

      return sum + (net + vat + companyHousingFee) * qty;
    }, 0);
  }

  static async createPaymentMethod(
    stripe: Stripe | null,
    elements: StripeElements | null,
    cardholderName: string,
    billingDetails: BillingDetails
  ): Promise<{ paymentMethod: any; error: any }> {
    logger.info("=== Creating Payment Method ===");

    if (!stripe || !elements) {
      const error = {
        message: "Stripe is not loaded. Please refresh the page.",
        type: "stripe_not_loaded",
      };

      logger.error(error, "Stripe not initialized");
      return { paymentMethod: null, error };
    }

    const cardElement = elements.getElement("card");

    if (!cardElement) {
      const error = {
        message: "Card element not found",
        type: "card_element_not_found",
      };

      logger.error(error, "Card element missing");
      return { paymentMethod: null, error };
    }

    try {
      const { error: pmError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: cardholderName,
            email: billingDetails.email,
            phone: billingDetails.phone,
            address: {
              line1: billingDetails.address,
              city: billingDetails.city,
              postal_code: billingDetails.postcode,
              country: billingDetails.country || "GB",
            },
          },
        });

      if (pmError) {
        logger.error(
          {
            error: pmError.message,
            code: pmError.code,
            type: pmError.type,
            declineCode: pmError.decline_code,
          },
          "Payment method creation failed"
        );

        return { paymentMethod: null, error: pmError };
      }

      logger.info(
        {
          paymentMethodId: paymentMethod?.id,
          paymentMethodType: paymentMethod?.type,
          cardBrand: paymentMethod?.card?.brand,
          cardLast4: paymentMethod?.card?.last4,
        },
        "Payment method created successfully"
      );

      return { paymentMethod, error: null };
    } catch (err: any) {
      logger.error(
        {
          error: err.message,
          stack: err.stack,
          name: err.name,
        },
        "Unexpected error creating payment method"
      );

      return {
        paymentMethod: null,
        error: {
          message: err.message || "Failed to create payment method",
          type: "unexpected_error",
        },
      };
    }
  }

  static async createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<PaymentIntentResponse> {
    logger.info("=== Creating Payment Intent ===");

    try {
      const normalizedItems = this.normalizePaymentItems(request.items);
      const expectedTotal = this.calculateItemsTotal(normalizedItems);
      const expectedAmountInPence = Math.round(expectedTotal * 100);

      logger.info(
        {
          itemsCount: normalizedItems.length,
          currency: request.currency || "GBP",
          paymentMethodId: request.paymentMethodId,
          expectedTotal,
          expectedAmountInPence,
          items: normalizedItems,
        },
        "Payment intent request prepared"
      );

      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: request.currency || "GBP",
          billing: request.billing,
          items: normalizedItems,
          paymentMethodId: request.paymentMethodId,
        }),
      });

      const data = await response.json();

      logger.info(
        {
          status: response.status,
          ok: response.ok,
          success: data.success,
          amount: data.amount,
          currency: data.currency,
        },
        "Payment intent API response"
      );

      if (!response.ok || !data.success) {
        logger.error(
          {
            status: response.status,
            error: data.message,
            errorType: data.error,
          },
          "Payment intent creation failed"
        );

        return {
          success: false,
          message: data?.message || "Failed to create payment intent",
          error: data.error,
        };
      }

      if (
        typeof data.amount === "number" &&
        data.amount !== expectedAmountInPence
      ) {
        logger.warn(
          {
            frontendExpectedAmount: expectedAmountInPence,
            backendAmount: data.amount,
          },
          "Stripe amount mismatch between frontend expected and API response"
        );
      }

      return {
        success: true,
        clientSecret: data.paymentIntent?.client_secret || data.clientSecret,
        paymentIntent: data.paymentIntent,
        amount: data.amount,
        currency: data.currency,
      };
    } catch (err: any) {
      logger.error(
        {
          error: err.message,
          stack: err.stack,
          name: err.name,
        },
        "Error calling payment intent API"
      );

      return {
        success: false,
        message: err.message || "Failed to create payment intent",
        error: "api_error",
      };
    }
  }

  static validateClientSecret(clientSecret: string | undefined): {
    valid: boolean;
    error?: string;
  } {
    logger.info("=== Validating Client Secret ===");

    if (!clientSecret) {
      logger.error("Client secret is missing");

      return {
        valid: false,
        error: "Payment initialization failed (no client secret returned)",
      };
    }

    const cleanClientSecret = String(clientSecret).trim();

    if (cleanClientSecret.startsWith("sk_")) {
      logger.error(
        {
          receivedValue: cleanClientSecret.substring(0, 50) + "...",
        },
        "Invalid client secret - secret key received"
      );

      return {
        valid: false,
        error: "Payment initialization failed (server configuration error)",
      };
    }

    if (
      !cleanClientSecret.startsWith("pi_") ||
      !cleanClientSecret.includes("_secret_")
    ) {
      logger.error(
        {
          receivedValue: cleanClientSecret.substring(0, 50) + "...",
          expectedFormat: "pi_..._secret_...",
        },
        "Invalid client secret format"
      );

      return {
        valid: false,
        error: "Payment initialization failed (invalid client secret format)",
      };
    }

    return { valid: true };
  }

  static async confirmPayment(
    stripe: Stripe | null,
    clientSecret: string,
    paymentMethodId: string,
    paymentMethod: any
  ): Promise<ProcessPaymentResult> {
    logger.info("=== Confirming Payment ===");

    if (!stripe) {
      const error = "Stripe is not loaded";

      logger.error(error, "Stripe not initialized");

      return {
        success: false,
        error: "stripe_not_loaded",
        errorMessage: error,
      };
    }

    const validation = this.validateClientSecret(clientSecret);

    if (!validation.valid) {
      return {
        success: false,
        error: "invalid_client_secret",
        errorMessage: validation.error,
      };
    }

    try {
      const confirmResult = (await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      })) as any;

      if (confirmResult.error) {
        logger.error(
          {
            error: confirmResult.error.message,
            code: confirmResult.error.code,
            type: confirmResult.error.type,
            declineCode: confirmResult.error.decline_code,
          },
          "Payment confirmation failed"
        );

        return {
          success: false,
          error: confirmResult.error.code || "payment_failed",
          errorMessage:
            confirmResult.error.message || "Payment confirmation failed",
        };
      }

      const paymentIntent = confirmResult.paymentIntent;

      logger.info(
        {
          paymentIntentId: paymentIntent?.id,
          status: paymentIntent?.status,
          amount: paymentIntent?.amount,
          currency: paymentIntent?.currency,
        },
        "Payment intent final status"
      );

      if (paymentIntent && paymentIntent.status === "succeeded") {
        return {
          success: true,
          paymentIntent: { paymentIntent, paymentMethod: { paymentMethod } },
        };
      }

      return {
        success: false,
        error: "payment_not_succeeded",
        errorMessage: `Payment status: ${paymentIntent?.status}. Please try again.`,
      };
    } catch (err: any) {
      logger.error(
        {
          errorMessage: err.message,
          errorStack: err.stack,
          errorName: err.name,
        },
        "Error in confirmCardPayment call"
      );

      return {
        success: false,
        error: "confirmation_error",
        errorMessage: err.message || "Payment confirmation failed",
      };
    }
  }

  static async processPayment(
    stripe: Stripe | null,
    elements: StripeElements | null,
    cardholderName: string,
    billingDetails: BillingDetails,
    items: PaymentItem[],
    currency: string = "GBP"
  ): Promise<ProcessPaymentResult> {
    logger.info("=== Starting Complete Payment Flow ===");

    const normalizedItems = this.normalizePaymentItems(items);

    const { paymentMethod, error: pmError } = await this.createPaymentMethod(
      stripe,
      elements,
      cardholderName,
      billingDetails
    );

    if (pmError || !paymentMethod) {
      return {
        success: false,
        error: pmError?.code || "payment_method_error",
        errorMessage: pmError?.message || "Failed to create payment method",
      };
    }

    const paymentIntentResponse = await this.createPaymentIntent({
      currency,
      billing: billingDetails,
      items: normalizedItems,
      paymentMethodId: paymentMethod.id,
    });

    if (!paymentIntentResponse.success || !paymentIntentResponse.clientSecret) {
      return {
        success: false,
        error: paymentIntentResponse.error || "payment_intent_error",
        errorMessage:
          paymentIntentResponse.message || "Failed to create payment intent",
      };
    }

    const validation = this.validateClientSecret(
      paymentIntentResponse.clientSecret
    );

    if (!validation.valid) {
      return {
        success: false,
        error: "invalid_client_secret",
        errorMessage: validation.error,
      };
    }

    return await this.confirmPayment(
      stripe,
      paymentIntentResponse.clientSecret,
      paymentMethod.id,
      paymentMethod
    );
  }
}