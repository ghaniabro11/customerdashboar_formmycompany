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
  price: number;
  duration: number;
  qty: number;
  discount?: number;
  vat?: number;
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
  /**
   * Creates a payment method using Stripe Elements
   */
  static async createPaymentMethod(
    stripe: Stripe | null,
    elements: StripeElements | null,
    cardholderName: string,
    billingDetails: BillingDetails
  ): Promise<{ paymentMethod: any; error: any }> {
    logger.info("=== Creating Payment Method ===");
    logger.info(
      {
        hasStripe: !!stripe,
        hasElements: !!elements,
        cardholderName,
        billingEmail: billingDetails.email,
      },
      "Payment method creation started"
    );

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
      logger.info(paymentMethod, "Payment method");

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
      logger.info(paymentMethod, "Payment method");
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

  /**
   * Creates a payment intent by calling the API
   */
  static async createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<PaymentIntentResponse> {
    logger.info("=== Creating Payment Intent ===");
    logger.info(
      {
        itemsCount: request.items.length,
        currency: request.currency,
        paymentMethodId: request.paymentMethodId,
        hasBilling: !!request.billing,
      },
      "Payment intent request started"
    );

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: request.currency || "GBP",
          billing: request.billing,
          items: request.items,
          paymentMethodId: request.paymentMethodId,
        }),
      });

      logger.info(
        {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        },
        "Payment intent API response status"
      );

      const data = await response.json();

      logger.info(
        {
          success: data.success,
          hasClientSecret: !!data.clientSecret,
          hasPaymentIntent: !!data.paymentIntent,
          amount: data.amount,
          currency: data.currency,
          data: data,
        },
        "Payment intent API response data"
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

  /**
   * Validates the client secret format
   */
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

    // CRITICAL: Must not be a secret key
    if (cleanClientSecret.startsWith("sk_")) {
      logger.error(
        {
          receivedValue: cleanClientSecret.substring(0, 50) + "...",
          message:
            "CRITICAL ERROR: Received Stripe secret key instead of PaymentIntent client secret!",
        },
        "Invalid client secret - appears to be secret key"
      );
      return {
        valid: false,
        error: "Payment initialization failed (server configuration error)",
      };
    }

    // Must be PaymentIntent format: pi_..._secret_...
    if (
      !cleanClientSecret.startsWith("pi_") ||
      !cleanClientSecret.includes("_secret_")
    ) {
      logger.error(
        {
          receivedValue: cleanClientSecret.substring(0, 50) + "...",
          expectedFormat: "pi_..._secret_...",
          actualFormat: cleanClientSecret.substring(0, 10) + "...",
        },
        "Invalid client secret format"
      );
      return {
        valid: false,
        error: "Payment initialization failed (invalid client secret format)",
      };
    }

    logger.info(
      {
        clientSecretPrefix: cleanClientSecret.substring(0, 50) + "...",
        clientSecretLength: cleanClientSecret.length,
        isValidFormat: true,
      },
      "Client secret validated successfully"
    );

    return { valid: true };
  }

  /**
   * Confirms the payment using Stripe
   */
  static async confirmPayment(
    stripe: Stripe | null,
    clientSecret: string,
    paymentMethodId: string,
    paymentMethod: any
  ): Promise<ProcessPaymentResult> {
    logger.info("=== Confirming Payment ===");
    logger.info(
      {
        hasStripe: !!stripe,
        clientSecretPrefix: clientSecret.substring(0, 50) + "...",
        paymentMethodId,
      },
      "Payment confirmation started"
    );

    if (!stripe) {
      const error = "Stripe is not loaded";
      logger.error(error, "Stripe not initialized");
      return {
        success: false,
        error: "stripe_not_loaded",
        errorMessage: error,
      };
    }

    // Final validation before confirmation
    const validation = this.validateClientSecret(clientSecret);
    if (!validation.valid) {
      return {
        success: false,
        error: "invalid_client_secret",
        errorMessage: validation.error,
      };
    }

    try {
      logger.info(
        {
          callingConfirmCardPayment: true,
          clientSecretBeingPassed: clientSecret.substring(0, 50) + "...",
        },
        "Calling stripe.confirmCardPayment"
      );

      const confirmResult = (await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      })) as any;

      logger.info(
        {
          confirmCardPaymentCompleted: true,
          hasError: !!confirmResult.error,
          paymentIntentId: confirmResult.paymentIntent?.id,
          paymentIntentStatus: confirmResult.paymentIntent?.status,
        },
        "Payment confirmation completed"
      );

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
      logger.info(paymentIntent, "Payment intent");

      if (paymentIntent && paymentIntent.status === "succeeded") {
        logger.info("=== Payment Completed Successfully ===");
        return {
          success: true,
          paymentIntent: { paymentIntent, paymentMethod: { paymentMethod } },
        };
      } else {
        logger.warn(
          {
            status: paymentIntent?.status,
            paymentIntentId: paymentIntent?.id,
          },
          "Payment not completed with succeeded status"
        );
        return {
          success: false,
          error: "payment_not_succeeded",
          errorMessage: `Payment status: ${paymentIntent?.status}. Please try again.`,
        };
      }
    } catch (err: any) {
      logger.error(
        {
          errorMessage: err.message,
          errorStack: err.stack,
          errorName: err.name,
          clientSecretPrefix: clientSecret.substring(0, 50) + "...",
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

  /**
   * Complete payment flow: Create payment method -> Create intent -> Confirm payment
   */
  static async processPayment(
    stripe: Stripe | null,
    elements: StripeElements | null,
    cardholderName: string,
    billingDetails: BillingDetails,
    items: PaymentItem[],
    currency: string = "GBP"
  ): Promise<ProcessPaymentResult> {
    logger.info("=== Starting Complete Payment Flow ===");
    logger.info(
      {
        itemsCount: items.length,
        currency,
        cardholderName,
        billingEmail: billingDetails.email,
      },
      "Payment flow initiated"
    );

    // Step 1: Create payment method
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

    // Step 2: Create payment intent
    const paymentIntentResponse = await this.createPaymentIntent({
      currency,
      billing: billingDetails,
      items,
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

    // Step 3: Validate client secret
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

    // Step 4: Confirm payment
    const confirmResult = await this.confirmPayment(
      stripe,
      paymentIntentResponse.clientSecret,
      paymentMethod.id,
      paymentMethod
    );

    return confirmResult;
  }
}
