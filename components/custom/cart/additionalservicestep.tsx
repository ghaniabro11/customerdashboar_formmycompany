"use client";
import React from "react";
import { useStore } from "@/store/cart";
import OrderSummary from "./ordersummary";
import Link from "next/link";
import { Lock, ShoppingBasket, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";

const AdditionalServicesStep: React.FC<{
  onNext: () => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const { services, addService, removeService, companyName } = useStore();
  const { status } = useSession();
  const isServiceAdded = (title: string) =>
    services.some((s) => s.title === title);

  // const handleToggleService = (service: (typeof availableServices)[0]) => {
  //   const existing = services.find((s) => s.title === service.title);
  //   if (existing) {
  //     removeService(existing.id);
  //   } else {
  //     addService({
  //       title: service.title,
  //       type: "additional-service",
  //       price: service.price,
  //     });
  //   }
  // };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-6 md:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Additional Services
          </h2>
          <p className="mt-2 text-slate-600">
            Enhance your company setup for{" "}
            <span className="font-semibold">{companyName}</span>
          </p>

          {services.length === 0 && <BasketEmptyPage />}
          <div className="grid gap-4 md:grid-cols-2">
            {/* {services.map((service, idx) => {
              const added = isServiceAdded(service.title);
              return (
                <div
                  key={idx}
                  className={`rounded-lg border-2 bg-white p-5 transition-all ${
                    added ? "border-sky-500 bg-sky-50" : "border-slate-200"
                  }`}
                >
                  <h3 className="font-semibold text-slate-900">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Professional service to help you with{" "}
                    {service.title.toLowerCase()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">
                      {service.price}
                    </span>
                    <button
                      onClick={() => handleToggleService(service)}
                      className={`rounded-lg px-4 py-2 font-semibold transition-colors ${
                        added
                          ? "bg-slate-200 text-slate-700"
                          : "bg-sky-500 text-white"
                      }`}
                    >
                      {added ? "Remove" : "Add"}
                    </button>
                  </div>
                </div>
              );
            })} */}
          </div>
          {services.length > 0 && (
            <div className="mt-8 flex md:flex-row flex-col gap-3">
              <button
                onClick={onBack}
                className="rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Back
              </button>
              {status === "unauthenticated" ? (
                <Link
                  className="flex-1 rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white hover:bg-gray-600 flex gap-2 items-center justify-center"
                  href={`/auth`}
                >
                  <Lock size={20}/> Please Login Before Continue
                </Link>
              ) : (
                <button
                  onClick={onNext}
                  className="flex-1 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  Continue to Payment →
                </button>
              )}
            </div>
          )}
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

export default AdditionalServicesStep;
const BasketEmptyPage = () => {
  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center py-10">
      <div className="container text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        <p className="text-xl font-semibold text-gray-800">
          Your Basket is Empty
        </p>

        <div className="mt-6">
          <p className="text-lg text-gray-600 mb-2">
            Why not try our services today?
          </p>
          <p className="text-sm text-gray-500">
            A company limited by shares is the most popular company type.
          </p>
          <p className="mt-4 text-lg font-medium text-gray-800">
            Select the perfect package for you & start your new business
            adventure today.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="text-lg font-bold text-orange-600">
              Starts at £54.99 +VAT
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/compare-packages"
              className="inline-block px-6 py-3 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-orange-500 transition duration-300"
            >
              Check Company Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
