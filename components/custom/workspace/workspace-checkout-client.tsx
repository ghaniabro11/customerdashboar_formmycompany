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
  Building2,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { workspaceCheckoutAction } from "@/actions/workspace-checkout";
import { workspaceCheckoutAction } from "@/actions/workspace-checkout";
import logger from "@/lib/logger/logger";
import {
  BillingDetails,
  PaymentItem,
  StripePaymentService,
} from "@/lib/stripe-payment.service";
import { gbp } from "@/lib/utils";
import { useWorkspaceCheckoutStore } from "@/store/workspace-checkout";
import Image from "next/image";
import React, { useState } from "react";

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

interface WorkspaceCheckoutClientProps {
  workspaceId?: string;
  workspaceData?: any;
  session: any;
}

const PaymentForm: React.FC<{
  onSuccess: () => void;
}> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const router = useRouter();
  const { workspaces, setPaymentStatus } = useWorkspaceCheckoutStore();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    logger.info("=== Checkout Form Submitted ===");
    logger.info(
      {
        workspacesCount: workspaces.length,
        hasStripe: !!stripe,
        hasElements: !!elements,
        sessionExists: !!session,
      },
      "Initial checkout state"
    );

    if (workspaces.length === 0) {
      logger.warn("No workspaces in cart");
      setErrorMessage("Please add at least one workspace to checkout");
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
      setErrorMessage("You must be logged in to checkout");
      router.push("/auth");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    setPaymentStatus("processing");

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

      // Prepare payment items
      const paymentItems: PaymentItem[] = workspaces.map((w: any) => ({
        id: w.itemId || w.id,
        price: parseFloat(w.meta?.price || "0"),
        duration: parseFloat(w.duration || "0"),
        qty: parseFloat(w.qty || w.quantity || "1"),
        discount: parseFloat(w.meta?.discount || "0"),
        vat: parseFloat(w.meta?.vat || "0"),
      }));

      // Process payment using the service
      const result = await StripePaymentService.processPayment(
        stripe,
        elements,
        cardholderName,
        billingDetails,
        paymentItems,
        "GBP"
      );
      logger.info(result, "result from workspace checkout client");
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
        setPaymentStatus("failed");
        return;
      }

      // Payment succeeded - call workspace checkout action
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
            "Calling external API after payment success..."
          );

          const items = workspaces.map((w: any) => ({
            id: w.itemId,
            duration: w.duration,
          }));
          const payment = {
            billing: {
              first_name: firstName,
              last_name: lastName,
              address: address,
              city: city,
              country:
                result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                  ?.country,
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
                  ?.brand,
              exp_month:
                result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                  ?.exp_month,
              exp_year:
                result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                  ?.exp_year,
              last4:
                result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                  ?.last4,
            },
            response: result?.paymentIntent,
          };
          logger.info(result, "result");
          const checkoutResult = await workspaceCheckoutAction({
            currency: "GBP",
            billing: {
              first_name: firstName,
              last_name: lastName,
              address: address,
              city: city,
              postcode: postcode,
            },
            items: items,
            paymentMethodId: result.paymentIntent.payment_method || "",
            payment,
          });
          logger.info(
            checkoutResult,
            "checkoutResult from workspace checkout client"
          );
          if (checkoutResult.ok) {
            setPaymentStatus("success");
            onSuccess();
          } else {
            setErrorMessage(
              checkoutResult.message || "Checkout failed. Please try again."
            );
            setIsProcessing(false);
            setPaymentStatus("failed");
          }
        } catch (externalApiError: any) {
          logger.error(
            {
              error: externalApiError.message,
              stack: externalApiError.stack,
            },
            "Error calling workspaceCheckoutAction after payment success"
          );
          setErrorMessage(
            "Payment succeeded but checkout failed. Please contact support."
          );
          setIsProcessing(false);
          setPaymentStatus("failed");
        }
      }
    } catch (err: any) {
      logger.error(
        {
          error: err.message,
          stack: err.stack,
          name: err.name,
        },
        "Checkout error"
      );
      setErrorMessage(err.message || "An unexpected error occurred");
      setIsProcessing(false);
      setPaymentStatus("failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <Building2 className="h-10 w-10 text-sky-500 mb-3" />
          <h2 className="text-2xl font-bold text-slate-900">
            Workspace Checkout
          </h2>
          <p className="mt-1 text-slate-600">
            Complete your workspace booking securely
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

        <div className="mt-6">
          <button
            type="submit"
            disabled={isProcessing || !stripe || workspaces.length === 0}
            className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-slate-400 flex items-center justify-center gap-2 transition-colors"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Complete Booking${
                workspaces.length > 1
                  ? ` (${workspaces.length} workspaces)`
                  : ""
              }`
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

const WorkspaceCheckoutClient: React.FC<WorkspaceCheckoutClientProps> = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { workspaces, removeWorkspace, clearWorkspaces } =
    useWorkspaceCheckoutStore();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }
  }, [status, router]);
  logger.info(workspaces);

  // Calculate pricing totals
  const pricing = workspaces.reduce(
    (acc, workspace: any) => {
      const unitPrice = parseFloat(workspace.meta?.price || "0");
      const duration = parseFloat(workspace.duration || "0");
      const qty = parseFloat(workspace.qty || workspace.quantity || "1");
      const discount = parseFloat(
        workspace.meta?.discount || workspace.discount || "0"
      );
      const vat = parseFloat(workspace.meta?.vat || "0");

      // Calculate according to the logic: price * duration * qty
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

  // Clear workspaces after successful checkout
  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      clearWorkspaces();
    }, 5000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Your workspace booking{workspaces.length > 1 ? "s have" : " has"}{" "}
              been successfully processed.
            </p>
            <button
              onClick={() => {
                clearWorkspaces();
                router.push("/workspace");
              }}
              className="rounded-lg bg-sky-500 px-8 py-3 font-semibold text-white hover:bg-sky-600"
            >
              Back to Workspaces
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No Workspaces Selected
            </h2>
            <p className="text-slate-600 mb-6">
              Add workspaces to your checkout to continue.
            </p>
            <button
              onClick={() => router.push("/workspace")}
              className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Browse Workspaces
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Workspace Checkout
          </h1>
          <p className="text-slate-600">
            Complete your booking for {workspaces.length} workspace
            {workspaces.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_380px]">
          <Elements stripe={stripePromise}>
            <PaymentForm onSuccess={handleSuccess} />
          </Elements>

          {/* Order Summary */}
          <aside className="sticky top-4 h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Booking Summary ({workspaces.length})
            </h3>

            <div className="space-y-3 mb-4 max-h-[500px] overflow-y-auto">
              {workspaces?.map((workspace) => {
                const unitPrice = parseFloat(workspace.meta?.price || "0");
                const duration = parseFloat(workspace.duration || "0");
                const qty = parseFloat(workspace.meta?.quantity || "1");
                const discount = parseFloat(workspace.meta?.discount);
                const workspaceSubtotal =
                  Number(unitPrice) * Number(duration) * Number(qty);
                const workspaceDiscount = Number(discount)
                  ? Number(discount) * Number(duration) * Number(qty)
                  : 0;
                const workspaceTotal =
                  Number(workspaceSubtotal) - Number(workspaceDiscount) || 0;
                logger.info(workspaceTotal, "workspaceTotal");
                logger.info(workspaceSubtotal, "workspaceSubtotal");
                logger.info(workspaceDiscount, "workspaceDiscount");
                return (
                  <div
                    key={workspace?.id}
                    className="rounded-lg border border-slate-200 p-3 group hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {workspace?.featured_image && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={workspace?.featured_image}
                            alt={workspace?.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm mb-1 truncate">
                          {workspace?.title}
                        </h4>
                        {workspace?.location && (
                          <p className="text-xs text-slate-600 mb-1">
                            {workspace?.location}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mb-1">
                          Duration: {workspace?.duration}{" "}
                          {workspace?.meta?.price_type === "per_month"
                            ? "months"
                            : "days"}
                          {qty > 1 && ` × ${qty}`}
                        </p>
                        <div className="flex items-center gap-2">
                          {workspaceDiscount > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              {gbp(workspaceSubtotal)}
                            </span>
                          )}
                          <p className="text-xs font-medium text-slate-700">
                            {gbp(Number(workspaceTotal))}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeWorkspace(workspace.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-full shrink-0"
                        aria-label={`Remove ${workspace?.title}`}
                      >
                        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium">{gbp(pricing.subtotal)}</span>
              </div>
              {pricing.discountTotal > 0 && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Discount</span>
                  <span className="font-medium text-green-600">
                    -{gbp(pricing.discountTotal)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-600">
                <span>VAT</span>
                <span className="font-medium">{gbp(pricing.taxTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-base font-semibold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-lg">{gbp(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCheckoutClient;
