import React from "react";
import { calc, gbp } from "@/lib/utils";
import { X } from "lucide-react";
import { CartLine, CartService } from "@/constants/types";

type OrderSummaryProps = {
  companyName: string;
  services: CartService[];
  showProceedButton?: boolean;
  onProceed?: () => void;
  proceedButtonText?: string;
  onRemoveService?: (id: string) => void;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  companyName,
  services,
  showProceedButton = false,
  onProceed,
  proceedButtonText = "Proceed to Payment",
  onRemoveService,
}) => {
  const fallbackVatRate = 0.2;

  const cartLines: CartLine[] = services.map((service) => ({
    ...service,
    qty: 1,
  }));
  const totals = calc(cartLines, fallbackVatRate);

  return (
    <aside className="sticky top-4 h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>

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
              const hasDiscount = typeof service.discount === "number" && service.discount > 0;
              const netPrice = service.price - (service.discount ?? 0);

              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-2 group"
                >
                  <div className="flex flex-col flex-1">
                    <span className="text-slate-700 text-sm">{service.title}</span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-500">
                        {gbp(service.price)} − {gbp(service.discount!)} discount
                      </span>
                    )}
                    {typeof service.vat === "number" && (
                      <span className="text-xs text-slate-500">
                        VAT included: {gbp(service.vat)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {gbp(netPrice)}
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
              <span>{gbp(totals.subtotal)}</span>
            </div>

            {totals.discount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span>-{gbp(totals.discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>VAT</span>
              <span>{gbp(totals.vat)}</span>
            </div>
          </div>

          <div className="border-t-2 border-slate-900 mt-3 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{gbp(totals.total)}</span>
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