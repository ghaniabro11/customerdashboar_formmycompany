"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart, X, Briefcase, ArrowRight } from "lucide-react";
import { useStore } from "@/store/cart";
import { useWorkspaceCheckoutStore } from "@/store/workspace-checkout";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { gbp } from "@/lib/utils";
import { Money } from "@/constants/types";

interface CartDropdownProps {
  className?: string;
}

const toNumber = (
  value: Money | number | string | undefined | null
): number => {
  if (value === undefined || value === null) return 0;

  const num =
    typeof value === "number" ? value : parseFloat(String(value || 0));

  return isNaN(num) ? 0 : num;
};

const formatPrice = (
  price: Money | number | string | undefined | null
): string => {
  return gbp(toNumber(price));
};

const CartDropdown: React.FC<CartDropdownProps> = ({ className }) => {
  const services = useStore((state) => state.services);
  const removeService = useStore((state) => state.removeService);

  const workspaces = useWorkspaceCheckoutStore((state) => state.workspaces);
  const removeWorkspace = useWorkspaceCheckoutStore(
    (state) => state.removeWorkspace
  );

  const totalCartItems = services.length;
  const totalWorkspaceItems = workspaces.length;
  const totalItems = totalCartItems + totalWorkspaceItems;

  const getPrice = (service: any) => toNumber(service.price);
  const getDiscount = (service: any) => toNumber(service.discount);
  const getVat = (service: any) => toNumber(service.vat);

  const getCompanyHousingFee = (service: any) => {
    if (service.type !== "package") return 0;

    return toNumber(
      service.companyHousingFee ?? service.company_housing_fee ?? 0
    );
  };

  const calculateCartNetTotal = () =>
    services.reduce((sum, service) => {
      const price = getPrice(service);
      const discount = getDiscount(service);

      return sum + Math.max(0, price - discount);
    }, 0);

  const calculateCartVatTotal = () =>
    services.reduce((sum, service) => {
      return sum + getVat(service);
    }, 0);

  const calculateCartCompanyHousingFeeTotal = () =>
    services.reduce((sum, service) => {
      return sum + getCompanyHousingFee(service);
    }, 0);

  const calculateCartTotal = () =>
    calculateCartNetTotal() +
    calculateCartVatTotal() +
    calculateCartCompanyHousingFeeTotal();

  const calculateWorkspaceTotal = () =>
    workspaces.reduce((sum, workspace) => {
      return sum + toNumber(workspace.price);
    }, 0);

  if (totalItems === 0) {
    return (
      <Popover>
        <PopoverTrigger>
          <div className={`relative ${className}`} aria-label="Shopping cart">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange transition-colors" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0 z-[100]">
          <div className="p-6 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Your cart is empty</p>
            <p className="text-sm text-gray-500 mt-1">
              Add items to get started
            </p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`relative ${className}`} aria-label="Shopping cart">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange transition-colors" />

          <span className="absolute -top-2 -right-2 bg-orange text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
            {totalItems}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="md:w-96 max-w-[95dvw] max-h-[80vh] overflow-y-auto p-0 z-[100]">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cart</h3>

            <span className="text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          {totalCartItems > 0 && (
            <>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Services ({totalCartItems})
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {services.map((service) => {
                    const price = getPrice(service);
                    const discount = getDiscount(service);
                    const vat = getVat(service);
                    const companyHousingFee = getCompanyHousingFee(service);

                    const netPrice = Math.max(0, price - discount);
                    const lineTotal = netPrice + vat + companyHousingFee;
                    const discountedPrice = Math.max(0, price - discount);
                    return (
                      <div
                        key={service.id}
                        className="flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {service.title}
                          </p>

                          <p className="text-xs text-gray-500 capitalize">
                            {service.type.replaceAll("_", " ")}
                          </p>

                          <div className="mt-1 space-y-0.5">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPrice(lineTotal)}
                            </p>

                            

                            {discount > 0 ? (
                              <>
                                <p className="text-xs text-gray-400 line-through">
                                  Price: {formatPrice(price)}
                                </p>
                                <p className="text-xs text-green-600">
                                  Price: {formatPrice(discountedPrice)}
                                </p>
                              </>
                            ) : (
                              <p className="text-xs text-gray-500">
                                Price: {formatPrice(price)}
                              </p>
                            )}

                            {discount > 0 && (
                              <p className="text-xs text-gray-500">
                                Discount: - {formatPrice(discount)}
                              </p>
                            )}

                            {vat > 0 && (
                              <p className="text-xs text-gray-500">
                                VAT: {formatPrice(vat)}
                              </p>
                            )}

                            {service.type === "package" &&
                              companyHousingFee > 0 && (
                                <p className="text-xs text-gray-500">
                                  Company Housing Fee:{" "}
                                  {formatPrice(companyHousingFee)}
                                </p>
                              )}
                          </div>
                        </div>

                        <button
                          onClick={() => removeService(service.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-full text-black"
                          aria-label={`Remove ${service.title}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(calculateCartNetTotal())}
                    </span>
                  </div>

                  {calculateCartVatTotal() > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">VAT:</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(calculateCartVatTotal())}
                      </span>
                    </div>
                  )}

                  {calculateCartCompanyHousingFeeTotal() > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Company Housing Fee:
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(calculateCartCompanyHousingFeeTotal())}
                      </span>
                    </div>
                  )}

                  {/* <div className="flex items-center justify-between pt-1">
                    <span className="text-gray-700 font-semibold">
                      Cart Subtotal:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(calculateCartTotal())}
                    </span>
                  </div> */}
                </div>
              </div>

              {totalWorkspaceItems > 0 && <Separator className="my-3" />}
            </>
          )}

          {totalWorkspaceItems > 0 && (
            <>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Workspaces ({totalWorkspaceItems})
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {workspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className="flex items-start justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {workspace.title}
                        </p>

                        {workspace.location && (
                          <p className="text-xs text-gray-500">
                            {workspace.location}
                          </p>
                        )}

                        {workspace.duration && (
                          <p className="text-xs text-gray-500">
                            Duration: {workspace.duration} months
                          </p>
                        )}

                        {workspace.price !== undefined && (
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {formatPrice(workspace.price)}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeWorkspace(workspace.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-full"
                        aria-label={`Remove ${workspace.title}`}
                      >
                        <X className="h-4 w-4 text-red-500 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Workspace Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(calculateWorkspaceTotal())}
                  </span>
                </div>
              </div>
            </>
          )}

          <Separator className="my-3" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-gray-900">
              Total:
            </span>

            <span className="text-lg font-bold text-orange">
              {formatPrice(calculateCartTotal() + calculateWorkspaceTotal())}
            </span>
          </div>

          <div className="space-y-2">
            {totalCartItems > 0 && (
              <Link href="/cart" className="block">
                <Button
                  variant="orange"
                  className="w-full flex items-center justify-center gap-2"
                >
                  View Cart
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}

            {totalWorkspaceItems > 0 && (
              <Link href="/workspace/checkout" className="block">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-orange text-orange hover:bg-orange hover:text-white"
                >
                  <Briefcase className="w-4 h-4" />
                  Workspace Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CartDropdown;