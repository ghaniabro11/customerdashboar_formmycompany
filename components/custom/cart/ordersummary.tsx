import React from "react";
import { gbp } from "@/lib/utils";
import { X } from "lucide-react";
import { CartService } from "@/constants/types";

type OrderSummaryProps = {
  companyName: string;
  services: CartService[];
  showProceedButton?: boolean;
  onProceed?: () => void;
  proceedButtonText?: string;
  onRemoveService?: (id: string) => void;
};

const toNumber = (value: number | string | undefined | null): number => {
  if (value === undefined || value === null) return 0;

  const num =
    typeof value === "number" ? value : parseFloat(String(value || 0));

  return isNaN(num) ? 0 : num;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  companyName,
  services,
  showProceedButton = false,
  onProceed,
  proceedButtonText = "Proceed to Payment",
  onRemoveService,
}) => {
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
    netSubtotal + vatTotal + companyHousingFeeTotal;

  return (
    <aside className="sticky top-4 h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        Order Summary
      </h3>

      <div className="mb-4 rounded-lg bg-sky-50 p-3">
        <div className="text-sm text-slate-600">Company Name</div>
        <div className="font-semibold text-slate-900 max-w-[200px] truncate">
          {companyName || "Not selected"}
        </div>
      </div>

      {services.length > 0 ? (
        <>
          <div className="space-y-3 mb-4">
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
                netPrice + vat + companyHousingFee;

              return (
                <div
                  key={service.id}
                  className="flex items-start justify-between gap-2 group"
                >
                  <div className="flex flex-col flex-1">
                    <span className="text-slate-700 text-sm font-medium">
                      {service.title}
                    </span>

                    <span className="text-xs text-slate-500 capitalize">
                      {service.type.replaceAll("_", " ")}
                    </span>

                    {discount > 0 ? (
                      <span className="text-xs text-slate-400 line-through">
                        Price: {gbp(price)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">
                        Price: {gbp(price)}
                      </span>
                    )}

                    {discount > 0 && (
                      <span className="text-xs text-slate-500">
                        Discount: -{gbp(discount)}
                      </span>
                    )}

                    {vat > 0 && (
                      <span className="text-xs text-slate-500">
                        VAT: {gbp(vat)}
                      </span>
                    )}

                    {service.type === "package" &&
                      companyHousingFee > 0 && (
                        <span className="text-xs text-slate-500">
                          Company Housing Fee: {gbp(companyHousingFee)}
                        </span>
                      )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {gbp(lineTotal)}
                    </span>

                    {onRemoveService && (
                      <button
                        onClick={() => onRemoveService(service.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-full"
                        aria-label={`Remove ${service.title}`}
                      >
                        <X className="h-4 w-4 text-red-500 hover:text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{gbp(subtotal)}</span>
            </div>

            {discountTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span>-{gbp(discountTotal)}</span>
              </div>
            )}

            {vatTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>VAT</span>
                <span>{gbp(vatTotal)}</span>
              </div>
            )}

            {companyHousingFeeTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Company Housing Fee</span>
                <span>{gbp(companyHousingFeeTotal)}</span>
              </div>
            )}
          </div>

          <div className="border-t-2 border-slate-900 mt-3 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{gbp(grandTotal)}</span>
            </div>
          </div>

          {showProceedButton && onProceed && (
            <button
              onClick={onProceed}
              className="mt-4 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
            >
              {proceedButtonText} →
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">
          No services added yet
        </p>
      )}
    </aside>
  );
};

export default OrderSummary;