import { CartLine } from "@/constants/types";
import logger from "@/lib/logger/logger";
import { calc, gbp } from "@/lib/utils";
import { useStore } from "@/store/cart";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Loader2, Mail, MapPin, Phone, Wallet } from "lucide-react";
import React, { useState, useEffect } from "react";
import OrderSummary from "./ordersummary";
import { CheckoutAction } from "@/actions/checkout";
import { coutries } from "@/constants/dummydata";
import {
  StripePaymentService,
  BillingDetails,
  PaymentItem,
} from "@/lib/stripe-payment.service";
import { checkoutViaWallet, fetchWalletBalance } from "@/apis/wallet";

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

// Initialize Stripe with your publishable key
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

const PaymentForm: React.FC<{ onNext: () => void; onBack: () => void }> = ({
  onNext,
  onBack,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { services, companyName, setPaymentStatus, removeService, reset } =
    useStore();

  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [isProcessingWallet, setIsProcessingWallet] = useState(false);

  const taxRate = 0;
  const cartLines: CartLine[] = services.map((s) => ({ ...s, qty: 1 }));
  const totals = calc(cartLines, taxRate);

  // Fetch wallet balance on component mount
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoadingBalance(true);
        const balanceData = await fetchWalletBalance();

        if (balanceData) {
          const balance = parseFloat(balanceData.balance || "0");
          setWalletBalance(balance);
          logger.info({ balance }, "Wallet balance fetched");
        } else {
          logger.warn("Failed to fetch wallet balance");
          setWalletBalance(0);
        }
      } catch (error: any) {
        logger.error(error, "Error fetching wallet balance");
        setWalletBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, []);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    if (!cardholderName || !email || !phone || !address || !city || !country) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    logger.info("=== Checkout Form Submitted ===");
    logger.info(
      {
        servicesCount: services.length,
        hasStripe: !!stripe,
        hasElements: !!elements,
      },
      "Initial checkout state"
    );

    try {
      // Prepare billing details
      const billingDetails: BillingDetails = {
        name: cardholderName,
        email,
        phone,
        address,
        city,
        country,
        postcode: "",
      };

      // Prepare payment items
      const paymentItems: PaymentItem[] = services.map((s) => ({
        id: s.checkoutId?.toString() || s.id,
        price: typeof s.price === "number" ? s.price : parseFloat(s.price) || 0,
        duration: 1, // Default duration for services
        qty: 1,
        discount:
          typeof s.discount === "number"
            ? s.discount
            : parseFloat(s.discount || "0") || 0,
        vat: typeof s.vat === "number" ? s.vat : parseFloat(s.vat || "0") || 0,
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

      // Payment succeeded - call CheckoutAction
      if (
        result?.paymentIntent?.paymentIntent &&
        result?.paymentIntent?.paymentIntent?.status === "succeeded"
      ) {
        logger.info("=== Payment Completed Successfully ===");

        try {
          const payment = {
            billing: {
              first_name: cardholderName,
              last_name: "",
              address: address,
              city: city,
              country:
                result?.paymentIntent?.paymentMethod?.paymentMethod?.card
                  ?.country,
              postal_code:
                result?.paymentIntent?.paymentMethod?.paymentMethod
                  ?.billing_details?.address?.postal_code || "",
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
          const itemsPayload = services.reduce<
            {
              type: string;
              id: string;
              quantity: string;
              meta: { features?: string[]; service_id?: string };
            }[]
          >((acc, service) => {
            const itemId =
              service.checkoutId ??
              (service.meta?.service_id !== undefined
                ? service.meta.service_id
                : undefined);

            if (!itemId) {
              logger.warn("Skipping checkout item with no id", service);
              return acc;
            }

            const meta: { features?: string[]; service_id?: string } = {};

            if (
              Array.isArray(service.meta?.features) &&
              service.meta.features.length
            ) {
              meta.features = service.meta.features.map((feature: any) =>
                String(feature)
              );
            }

            if (service.meta?.service_id !== undefined) {
              meta.service_id = String(service.meta.service_id);
            }

            acc.push({
              type: service.type,
              id: String(itemId),
              quantity: "1",
              meta,
            });
            return acc;
          }, []);

          logger.info(itemsPayload, "Items Payload");
          logger.info(payment, "payment");
          const res = await CheckoutAction({
            company_name: companyName,
            postcode:
              result.paymentIntent?.charges?.data?.[0]?.billing_details?.address
                ?.postal_code || "",
            country:
              result.paymentIntent?.charges?.data?.[0]?.billing_details?.address
                ?.country || country,
            city:
              result.paymentIntent?.charges?.data?.[0]?.billing_details?.address
                ?.city || city,
            contact_email:
              result.paymentIntent?.charges?.data?.[0]?.billing_details
                ?.email || email,
            contact_phone:
              result.paymentIntent?.charges?.data?.[0]?.billing_details
                ?.phone || phone,
            registered_address:
              result.paymentIntent?.charges?.data?.[0]?.billing_details?.address
                ?.line1 || address,
            company_type: "private limited company",
            business_activity: "business",
            items: itemsPayload,
            payment,
          });

          logger.info(res, "Checkout Response");

          if (res.ok) {
            setPaymentStatus("success");
            onNext();
          } else {
            setErrorMessage(res.message || "Checkout failed");
            setPaymentStatus("failed");
            setIsProcessing(false);
          }
        } catch (externalApiError: any) {
          logger.error(
            {
              error: externalApiError.message,
              stack: externalApiError.stack,
            },
            "Error calling CheckoutAction after payment success"
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

  const handleWalletPayment = async () => {
    if (!email || !phone || !address || !city || !country) {
      setErrorMessage("Please fill in all billing fields");
      return;
    }

    if (walletBalance <= 0) {
      setErrorMessage("Insufficient wallet balance");
      return;
    }

    setIsProcessingWallet(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    logger.info("=== Wallet Payment Submitted ===");

    try {
      // Prepare items payload
      const itemsPayload = services.reduce<
        {
          type: string;
          id: string;
          quantity: string;
          meta: { features?: string[]; service_id?: string };
        }[]
      >((acc, service) => {
        const itemId =
          service.checkoutId ??
          (service.meta?.service_id !== undefined
            ? service.meta.service_id
            : undefined);

        if (!itemId) {
          logger.warn("Skipping checkout item with no id", service);
          return acc;
        }

        const meta: { features?: string[]; service_id?: string } = {};

        if (
          Array.isArray(service.meta?.features) &&
          service.meta.features.length
        ) {
          meta.features = service.meta.features.map((feature: any) =>
            String(feature)
          );
        }

        if (service.meta?.service_id !== undefined) {
          meta.service_id = String(service.meta.service_id);
        }

        acc.push({
          type: service.type,
          id: String(itemId),
          quantity: "1",
          meta,
        });
        return acc;
      }, []);

      logger.info(itemsPayload, "Wallet checkout items payload");

      // Call checkout via wallet
      const res = await checkoutViaWallet({
        company: {
          company_name: companyName,
          company_type: "Private Limited Company",
          business_activity: "business",
          country: country,
          city: city,
          contact_phone: phone,
          contact_email: email,
          registered_address: address,
          postcode: "",
        },
        items: itemsPayload,
      });

      logger.info(res, "Wallet checkout response");

      if (res.ok) {
        setPaymentStatus("success");
        onNext();
      } else {
        setErrorMessage(res.message || "Wallet checkout failed");
        setPaymentStatus("failed");
        setIsProcessingWallet(false);
      }
    } catch (err: any) {
      logger.error(
        {
          error: err.message,
          stack: err.stack,
          name: err.name,
        },
        "Wallet checkout error"
      );
      setErrorMessage(err.message || "An unexpected error occurred");
      setIsProcessingWallet(false);
      setPaymentStatus("failed");
    }
  };

  const canPayViaWallet = walletBalance > 0 && !isLoadingBalance;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-6 md:grid-cols-[1fr_380px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <CreditCard className="h-10 w-10 text-sky-500 mb-3" />
            <h2 className="text-2xl font-bold text-slate-900">
              Payment Details
            </h2>
            <p className="mt-1 text-slate-600">
              Complete your order securely with Stripe
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="John Smith"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Card Details
              </label>
              <div className="rounded-lg border border-slate-300 px-4 py-3 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Secured by Stripe. Your payment information is encrypted.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <h3 className="font-semibold text-slate-900 mb-4">
                Billing Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="London"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country
                  </label>
                  <select
                    name=""
                    id=""
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {coutries.map((country) => (
                      <option value={country.id} key={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900000"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Billing Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main Street, London, SW1A 1AA"
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Wallet Balance Display */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Wallet Balance:
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {isLoadingBalance ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    gbp(walletBalance)
                  )}
                </span>
              </div>
              {!canPayViaWallet && walletBalance <= 0 && !isLoadingBalance && (
                <p className="text-xs text-slate-500 mt-2">
                  Insufficient balance. Please add funds to your wallet or use
                  card payment.
                </p>
              )}
            </div>

            {services.length > 0 && (
              <div className="flex md:flex-row flex-col gap-3 pt-4">
                <button
                  onClick={onBack}
                  disabled={isProcessing || isProcessingWallet}
                  className="rounded-lg border-2 border-slate-300 py-2 px-3  font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors flex-1"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing || isProcessingWallet || !stripe}
                  className="rounded-lg bg-orange-500  font-semibold py-2 px-3 text-white hover:bg-orange-600 disabled:bg-slate-400 flex items-center justify-center gap-2 transition-colors flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${gbp(totals.total)}`
                  )}
                </button>

                <button
                  onClick={handleWalletPayment}
                  disabled={
                    isProcessing ||
                    isProcessingWallet ||
                    !canPayViaWallet ||
                    isLoadingBalance
                  }
                  className="rounded-lg bg-sky-500 py-2 px-3  font-semibold text-white hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors flex-1"
                >
                  {isProcessingWallet ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5" />
                      Wallet : {gbp(totals.total)}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <OrderSummary
          companyName={companyName}
          services={services}
          onRemoveService={removeService}
        />
      </div>
    </div>
  );
};

const PaymentStep: React.FC<{ onNext: () => void; onBack: () => void }> = (
  props
) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default PaymentStep;
