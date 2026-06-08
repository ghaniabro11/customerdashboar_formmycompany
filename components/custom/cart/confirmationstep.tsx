"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useStore } from "@/store/cart";
import OrderSummary from "./ordersummary";
import { gbp } from "@/lib/utils";
import { useRouter } from "next/navigation";

const toNumber = (value: number | string | undefined | null): number => {
  if (value === undefined || value === null) return 0;

  const num =
    typeof value === "number" ? value : parseFloat(String(value || 0));

  return isNaN(num) ? 0 : num;
};

const ConfirmationStep: React.FC = () => {
  const { companyName, services, reset } = useStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const subtotal = services.reduce((sum, service) => {
    return sum + toNumber(service.price);
  }, 0);

  const discountTotal = services.reduce((sum, service) => {
    return sum + toNumber(service.discount);
  }, 0);

  const vatTotal = services.reduce((sum, service) => {
    return sum + toNumber(service.vat);
  }, 0);

  const companyHousingFeeTotal = services.reduce((sum, service) => {
    if (service.type !== "package") return sum;

    return sum + toNumber(service.companyHousingFee);
  }, 0);

  const netSubtotal = services.reduce((sum, service) => {
    const price = toNumber(service.price);
    const discount = toNumber(service.discount);

    return sum + Math.max(0, price - discount);
  }, 0);

  const grandTotal =
    netSubtotal +
    vatTotal +
    companyHousingFeeTotal;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      reset();
      router.push("/");
    }, 8000);

    return () => clearTimeout(timer);
  }, [reset, router]);

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
              Your company{" "}
              <span className="font-semibold">{companyName}</span> is being
              set up
            </p>

            <div className="rounded-lg bg-white border border-slate-200 p-6 text-left mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">
                Order Details
              </h3>

              <div className="space-y-4 mb-4">
                {services.map((service) => {
                  const price = toNumber(service.price);
                  const discount = toNumber(service.discount);
                  const vat = toNumber(service.vat);

                  const companyHousingFee =
                    service.type === "package"
                      ? toNumber(service.companyHousingFee)
                      : 0;

                  const netPrice = Math.max(0, price - discount);

                  const lineTotal =
                    netPrice +
                    vat +
                    companyHousingFee;

                  return (
                    <div
                      key={service.id}
                      className="border-b border-slate-100 pb-3 last:border-b-0"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-slate-800">
                          {service.title}
                        </span>

                        <span className="font-semibold text-slate-900">
                          {gbp(lineTotal)}
                        </span>
                      </div>

                      <div className="mt-1 space-y-1 text-xs text-slate-500">
                        <div className="flex justify-between">
                          <span>Type</span>
                          <span className="capitalize">
                            {service.type.replaceAll("_", " ")}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Price</span>
                          <span
                            className={
                              discount > 0
                                ? "line-through text-slate-400"
                                : ""
                            }
                          >
                            {gbp(price)}
                          </span>
                        </div>

                        {discount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount</span>
                            <span>-{gbp(discount)}</span>
                          </div>
                        )}

                        {vat > 0 && (
                          <div className="flex justify-between">
                            <span>VAT</span>
                            <span>{gbp(vat)}</span>
                          </div>
                        )}

                        {service.type === "package" &&
                          companyHousingFee > 0 && (
                            <div className="flex justify-between">
                              <span>Company Housing Fee</span>
                              <span>{gbp(companyHousingFee)}</span>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{gbp(subtotal)}</span>
                </div>

                {discountTotal > 0 && (
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Discount</span>
                    <span>-{gbp(discountTotal)}</span>
                  </div>
                )}

                {vatTotal > 0 && (
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>VAT</span>
                    <span>{gbp(vatTotal)}</span>
                  </div>
                )}

                {companyHousingFeeTotal > 0 && (
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Company Housing Fee</span>
                    <span>{gbp(companyHousingFeeTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-900">
                  <span>Total Paid</span>
                  <span>{gbp(grandTotal)}</span>
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