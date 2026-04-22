"use client";

import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addWalletCredit } from "@/apis/wallet";
import logger from "@/lib/logger/logger";
import {
  BillingDetails,
  PaymentItem,
  StripePaymentService,
} from "@/lib/stripe-payment.service";
import { gbp } from "@/lib/utils";

// CRITICAL: Validate that we're using a publishable key, not a secret key
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

if (STRIPE_PUBLISHABLE_KEY.startsWith("sk_")) {
  throw new Error(
    "CRITICAL ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set to a SECRET KEY (sk_) instead of a PUBLISHABLE KEY (pk_). " +
      "This is a security issue and will cause payment failures. Please check your .env file."
  );
}

if (!STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
  throw new Error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with 'pk_' (publishable key), not 'sk_' (secret key)"
  );
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#0f172a",
      fontFamily: "system-ui, sans-serif",
      "::placeholder": {
        color: "#94a3b8",
      },
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

interface WalletPaymentFormProps {
  amount: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<WalletPaymentFormProps> = ({
  amount,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const creditAmount = parseFloat(amount || "0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    logger.info("=== Wallet Credit Payment Form Submitted ===");
    logger.info(
      {
        amount: creditAmount,
        hasStripe: !!stripe,
        hasElements: !!elements,
        sessionExists: !!session,
      },
      "Initial payment state"
    );

    if (!creditAmount || creditAmount <= 0) {
      setErrorMessage("Invalid credit amount");
      return;
    }

    if (!stripe || !elements) {
      logger.error("Stripe not loaded");
      setErrorMessage("Stripe is not loaded. Please refresh the page.");
      return;
    }

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postcode ||
      !cardholderName
    ) {
      logger.warn("Missing required form fields");
      setErrorMessage("Please fill in all required fields");
      return;
    }

    if (!session) {
      logger.warn("User not authenticated");
      setErrorMessage("You must be logged in to add credit");
      router.push("/auth");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Prepare billing details
      const billingDetails: BillingDetails = {
        first_name: firstName,
        last_name: lastName,
        name: cardholderName,
        email,
        phone,
        address,
        city,
        postcode,
        country: "GB",
      };

      // Prepare payment items (amount in pence for Stripe)
      const paymentItems: PaymentItem[] = [
        {
          id: "wallet-credit",
          price: creditAmount,
          duration: 1,
          qty: 1,
          discount: 0,
          vat: 0,
        },
      ];

      // Process payment using the service
      const result = await StripePaymentService.processPayment(
        stripe,
        elements,
        cardholderName,
        billingDetails,
        paymentItems,
        "GBP"
      );

      logger.info(result, "Payment result from wallet credit");

      if (!result.success) {
        logger.error(
          {
            error: result.error,
            errorMessage: result.errorMessage,
          },
          "Payment processing failed"
        );
        setErrorMessage(
          result.errorMessage || "Payment failed. Please try again."
        );
        setIsProcessing(false);
        return;
      }

      // Payment succeeded - call wallet credit API
      if (
        result?.paymentIntent?.paymentIntent &&
        result?.paymentIntent?.paymentIntent?.status === "succeeded"
      ) {
        logger.info("=== Payment Completed Successfully ===");

        try {
          logger.info(
            {
              paymentIntentId: result?.paymentIntent?.paymentIntent?.id,
              amount: result?.paymentIntent?.paymentIntent?.amount,
              currency: result?.paymentIntent?.paymentIntent?.currency,
            },
            "Calling wallet credit API after payment success..."
          );

          const creditResult = await addWalletCredit({
            amount: String(creditAmount),
            remarks: "Credits",
            payment: {
              billing: {
                first_name: firstName,
                last_name: lastName,
                address: address,
                city: city,
                country:
                  result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                    ?.country || "GB",
                postal_code: postcode,
                email: email,
                phone: phone,
              },
              currency: "gbp",
              amount: result?.paymentIntent?.paymentIntent?.amount,
              id: result?.paymentIntent?.paymentIntent?.id,
              status: "succeeded",
              created:
                result?.paymentIntent?.paymentIntent?.created ||
                Math.floor(Date.now() / 1000),
              card: {
                brand:
                  result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                    ?.brand || "",
                exp_month:
                  String(
                    result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                      ?.exp_month || ""
                  ),
                exp_year:
                  String(
                    result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                      ?.exp_year || ""
                  ),
                last4:
                  result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                    ?.last4 || "",
              },
              response: result?.paymentIntent,
            },
          });

          logger.info(creditResult, "Wallet credit result");

          if (creditResult.ok) {
            onSuccess();
          } else {
            setErrorMessage(
              creditResult.message || "Failed to add credit. Please try again."
            );
            setIsProcessing(false);
          }
        } catch (externalApiError: any) {
          logger.error(
            {
              error: externalApiError.message,
              stack: externalApiError.stack,
            },
            "Error calling addWalletCredit after payment success"
          );
          setErrorMessage(
            "Payment succeeded but credit addition failed. Please contact support."
          );
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      logger.error(
        {
          error: err.message,
          stack: err.stack,
          name: err.name,
        },
        "Wallet credit payment error"
      );
      setErrorMessage(err.message || "An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={onCancel}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Wallet
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <CreditCard className="h-10 w-10 text-sky-500 mb-3" />
              <h2 className="text-2xl font-bold text-slate-900">
                Add Credit Payment
              </h2>
              <p className="mt-1 text-slate-600">
                Pay securely to add {gbp(creditAmount)} to your wallet
              </p>
            </div>

            {/* Billing Information */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-900 text-lg">
                Billing Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 900000"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Business St"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="London"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="E1 4NS"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="border-t border-slate-200 pt-6 space-y-4">
              <h3 className="font-semibold text-slate-900 text-lg">
                Payment Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Card Details *
                </label>
                <div className="rounded-lg border border-slate-300 px-4 py-3 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Secured by Stripe. Your payment information is encrypted.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !stripe}
                className="flex-1 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-slate-400 flex items-center justify-center gap-2 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {gbp(creditAmount)}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const WalletPaymentForm: React.FC<WalletPaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default WalletPaymentForm;
