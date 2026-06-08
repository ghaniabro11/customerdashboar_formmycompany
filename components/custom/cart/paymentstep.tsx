"use client";

import logger from "@/lib/logger/logger";
import { gbp } from "@/lib/utils";
import { useStore } from "@/store/cart";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Loader2, Wallet } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import OrderSummary from "./ordersummary";
import { CheckoutAction } from "@/actions/checkout";
import { coutries } from "@/constants/dummydata";
import {
  StripePaymentService,
  BillingDetails,
  PaymentItem,
} from "@/lib/stripe-payment.service";
import { checkoutViaWallet, fetchWalletBalance } from "@/apis/wallet";

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

if (STRIPE_PUBLISHABLE_KEY.startsWith("sk_")) {
  throw new Error(
    "CRITICAL ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set to a SECRET KEY (sk_) instead of a PUBLISHABLE KEY (pk_)."
  );
}

if (!STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with 'pk_'");
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
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

const toNumber = (value: number | string | undefined | null): number => {
  if (value === undefined || value === null || value === "") return 0;

  const num =
    typeof value === "number" ? value : parseFloat(String(value || 0));

  return isNaN(num) ? 0 : num;
};

const normalizeType = (type: any): string => {
  return String(type || "").trim().toLowerCase();
};

const getCompanyHousingFee = (service: any): number => {
  const type = normalizeType(service.type);

  if (type !== "package") return 0;

  return toNumber(
    service.companyHousingFee ?? service.company_housing_fee ?? 0
  );
};

type CheckoutItemPayload = {
  type: string;
  id: string;
  quantity: string;
  meta: {
    features?: string[];
    service_id?: string;
  };
};

const PaymentForm: React.FC<{ onNext: () => void; onBack: () => void }> = ({
  onNext,
  onBack,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const { services, companyName, setPaymentStatus, removeService } =
    useStore();

  const [countrySearch, setCountrySearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingWallet, setIsProcessingWallet] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const totals = useMemo(() => {
    const subtotal = services.reduce((sum, service) => {
      return sum + toNumber(service.price);
    }, 0);

    const discount = services.reduce((sum, service) => {
      return sum + toNumber(service.discount);
    }, 0);

    const vat = services.reduce((sum, service) => {
      return sum + toNumber(service.vat);
    }, 0);

    const companyHousingFee = services.reduce((sum, service) => {
      return sum + getCompanyHousingFee(service);
    }, 0);

    const netSubtotal = services.reduce((sum, service) => {
      const price = toNumber(service.price);
      const itemDiscount = toNumber(service.discount);

      return sum + Math.max(0, price - itemDiscount);
    }, 0);

    const total = netSubtotal + vat + companyHousingFee;

    return {
      subtotal,
      discount,
      vat,
      companyHousingFee,
      total,
    };
  }, [services]);

  const sortedCountries = [...coutries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const filteredCountries = sortedCountries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const canPayViaWallet =
    !isLoadingBalance && walletBalance >= totals.total && services.length > 0;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoadingBalance(true);

        const balanceData = await fetchWalletBalance();

        if (balanceData) {
          const balance = parseFloat(balanceData.balance || "0");
          setWalletBalance(isNaN(balance) ? 0 : balance);
        } else {
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

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!e.target.closest(".country-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const buildItemsPayload = (): CheckoutItemPayload[] => {
    return services.reduce<CheckoutItemPayload[]>((acc, service) => {
      const itemId =
        service.checkoutId ??
        (service.meta?.service_id !== undefined
          ? service.meta.service_id
          : undefined);

      if (!itemId) {
        logger.warn("Skipping checkout item with no id", service);
        return acc;
      }

      const meta: {
        features?: string[];
        service_id?: string;
      } = {};

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
        type: normalizeType(service.type),
        id: String(itemId),
        quantity: "1",
        meta,
      });

      return acc;
    }, []);
  };

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    if (!services.length) {
      setErrorMessage("Your cart is empty");
      return;
    }

    if (!cardholderName || !email || !phone || !address || !city || !country) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      const billingDetails: BillingDetails = {
        name: cardholderName,
        email,
        phone,
        address,
        city,
        country,
        postcode: "",
      };

      const paymentItems: PaymentItem[] = services.map((service) => {
        const type = normalizeType(service.type);
        const companyHousingFee =
          type === "package" ? getCompanyHousingFee(service) : 0;

        return {
          id: service.checkoutId?.toString() || service.id,

          // IMPORTANT: this fixes Stripe housing fee issue
          type,

          price: toNumber(service.price),
          duration: 1,
          qty: 1,
          discount: toNumber(service.discount),
          vat: toNumber(service.vat),
          companyHousingFee,
        };
      });

      const expectedStripeTotal = paymentItems.reduce((sum, item) => {
        const price = toNumber(item.price);
        const discount = toNumber(item.discount);
        const vat = toNumber(item.vat);
        const fee =
          item.type === "package" ? toNumber(item.companyHousingFee) : 0;

        return sum + Math.max(0, price - discount) + vat + fee;
      }, 0);

      logger.info(
        {
          paymentItems,
          totals,
          expectedStripeTotal,
          expectedStripeAmountInPence: Math.round(expectedStripeTotal * 100),
        },
        "FINAL Stripe payment items before processPayment"
      );

      const result = await StripePaymentService.processPayment(
        stripe,
        elements,
        cardholderName,
        billingDetails,
        paymentItems,
        "GBP"
      );

      if (!result.success) {
        setErrorMessage(
          result.errorMessage || "Payment failed. Please try again."
        );
        setIsProcessing(false);
        setPaymentStatus("failed");
        return;
      }

      if (
        !result?.paymentIntent?.paymentIntent ||
        result?.paymentIntent?.paymentIntent?.status !== "succeeded"
      ) {
        setErrorMessage("Payment was not completed. Please try again.");
        setIsProcessing(false);
        setPaymentStatus("failed");
        return;
      }

      const payment = {
        billing: {
          first_name: cardholderName,
          last_name: "",
          address,
          city,
          country:
            result?.paymentIntent?.paymentMethod?.paymentMethod?.card
              ?.country || country,
          postal_code:
            result?.paymentIntent?.paymentMethod?.paymentMethod
              ?.billing_details?.address?.postal_code || "",
          email,
          phone,
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
            result?.paymentIntent?.paymentMethod?.paymentMethod?.card?.brand,
          exp_month:
            result?.paymentIntent?.paymentMethod?.paymentMethod?.card
              ?.exp_month,
          exp_year:
            result?.paymentIntent?.paymentMethod?.paymentMethod?.card
              ?.exp_year,
          last4:
            result?.paymentIntent?.paymentMethod?.paymentMethod?.card?.last4,
        },
        response: result?.paymentIntent,
      };

      const itemsPayload = buildItemsPayload();

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
          result.paymentIntent?.charges?.data?.[0]?.billing_details?.email ||
          email,
        contact_phone:
          result.paymentIntent?.charges?.data?.[0]?.billing_details?.phone ||
          phone,
        registered_address:
          result.paymentIntent?.charges?.data?.[0]?.billing_details?.address
            ?.line1 || address,
        company_type: "private limited company",
        business_activity: "business",
        items: itemsPayload,
        payment,
      });

      if (res.ok) {
        setPaymentStatus("success");
        onNext();
      } else {
        setErrorMessage(res.message || "Checkout failed");
        setPaymentStatus("failed");
        setIsProcessing(false);
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
    if (!services.length) {
      setErrorMessage("Your cart is empty");
      return;
    }

    if (!email || !phone || !address || !city || !country) {
      setErrorMessage("Please fill in all billing fields");
      return;
    }

    if (walletBalance < totals.total) {
      setErrorMessage(
        `Insufficient wallet balance. Required ${gbp(
          totals.total
        )}, available ${gbp(walletBalance)}.`
      );
      return;
    }

    setIsProcessingWallet(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      const itemsPayload = buildItemsPayload();

      const res = await checkoutViaWallet({
        company: {
          company_name: companyName,
          company_type: "Private Limited Company",
          business_activity: "business",
          country,
          city,
          contact_phone: phone,
          contact_email: email,
          registered_address: address,
          postcode: "",
        },
        items: itemsPayload,
      });

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

                <div className="relative country-dropdown">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country
                  </label>

                  <input
                    type="text"
                    value={
                      countrySearch ||
                      sortedCountries.find((c) => c.id === country)?.name ||
                      ""
                    }
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search country..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />

                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => {
                              setCountry(c.id);
                              setCountrySearch(c.name);
                              setIsDropdownOpen(false);
                            }}
                            className="cursor-pointer px-4 py-2 hover:bg-sky-100 text-sm"
                          >
                            {c.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-slate-500">
                          No country found
                        </div>
                      )}
                    </div>
                  )}
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

              {!canPayViaWallet && !isLoadingBalance && services.length > 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  Insufficient balance. Required {gbp(totals.total)}, available{" "}
                  {gbp(walletBalance)}.
                </p>
              )}
            </div>

            {services.length > 0 && (
              <div className="flex md:flex-row flex-col gap-3 pt-4">
                <button
                  onClick={onBack}
                  disabled={isProcessing || isProcessingWallet}
                  className="rounded-lg border-2 border-slate-300 py-2 px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors flex-1"
                >
                  ← Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isProcessing || isProcessingWallet || !stripe}
                  className="rounded-lg bg-orange-500 font-semibold py-2 px-3 text-white hover:bg-orange-600 disabled:bg-slate-400 flex items-center justify-center gap-2 transition-colors flex-1"
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
                  className="rounded-lg bg-sky-500 py-2 px-3 font-semibold text-white hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors flex-1"
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