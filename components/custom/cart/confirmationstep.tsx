"use client";
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useStore } from "@/store/cart";
import OrderSummary from "./ordersummary";
import { CartLine } from "@/constants/types";
import { calc, gbp } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ConfirmationStep: React.FC = () => {
  const { companyName, services, reset } = useStore();
  const router = useRouter();
  const taxRate = 0.2;
  const cartLines: CartLine[] = services.map((s) => ({ ...s, qty: 1 }));
  const totals = calc(cartLines, taxRate);

  const [loading, setLoading] = useState(true);

  // Set a timeout to stop the loader after a certain time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Call reset function or any other actions after timeout
      reset();
      router.push("/");
    }, 8000); // 3 seconds for example

    return () => clearTimeout(timer); // Clean up timeout if component unmounts
  }, []);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 md:grid-cols-[1fr_380px]">
        <div className="text-center">
          <div className="rounded-xl border border-green-200 bg-green-50 p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              {loading ? (
                <div className="loader h-8 w-8 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
              ) : (
                <Check className="h-8 w-8 text-white" />
              )}
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Order Confirmed!
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Your company <span className="font-semibold">{companyName}</span>{" "}
              is being set up
            </p>

            <div className="rounded-lg bg-white border border-slate-200 p-6 text-left mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">
                Order Details
              </h3>

              <div className="space-y-2 mb-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-700">{service.title}</span>
                    <span className="font-medium">{gbp(service.price)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{gbp(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>VAT</span>
                  <span>{gbp(totals.vat)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-900">
                  <span>Total Paid</span>
                  <span>{gbp(totals.total)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 mb-6">
              <p>✓ Confirmation email sent</p>
              <p>✓ Documents will be ready within 24 hours</p>
              <p>✓ You'll receive updates via email</p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-sky-500 px-8 py-3 font-semibold text-white hover:bg-sky-600"
            >
              Start New Order
            </button>
          </div>
        </div>

        <OrderSummary companyName={companyName} services={services} />
      </div>
    </div>
  );
};

export default ConfirmationStep;
