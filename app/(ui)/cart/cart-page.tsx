"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/store/cart";

import NameSearchStep from "@/components/custom/cart/namesearchstep";
import AdditionalServicesStep from "@/components/custom/cart/additionalservicestep";
import PaymentStep from "@/components/custom/cart/paymentstep";
import ConfirmationStep from "@/components/custom/cart/confirmationstep";
import Stepper from "@/components/custom/cart/stepper";

const CheckoutFlow: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    companyName,
    setCompanyName,
    syncCartFromUrl,
    services,
  } = useStore();

  const [hasProcessedUrl, setHasProcessedUrl] = useState(false);

  useEffect(() => {
    const company_name = searchParams.get("company_name");
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");

    const handleUrlCart = async () => {
      if (hasProcessedUrl) return;

      if (company_name) {
        setCompanyName(company_name);
      }

      if (slug && type) {
        await syncCartFromUrl(slug, type);
      }

      setHasProcessedUrl(true);

      //router.replace("/cart");
    };

    handleUrlCart();
  }, [
    searchParams,
    router,
    setCompanyName,
    syncCartFromUrl,
    hasProcessedUrl,
  ]);

  const stepMap: Record<string, React.ReactNode> = {
    "name-search": <NameSearchStep onNext={nextStep} />,
    "additional-services": (
      <AdditionalServicesStep onNext={nextStep} onBack={prevStep} />
    ),
    payment: <PaymentStep onNext={nextStep} onBack={prevStep} />,
    confirmation: <ConfirmationStep />,
  };

  const stepNumberMap: Record<string, 1 | 2 | 3 | 4> = {
    "name-search": 1,
    "additional-services": 2,
    payment: 3,
    confirmation: 4,
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <Stepper
          current={stepNumberMap[currentStep] || 1}
          onStepClick={goToStep}
          companyName={companyName}
        />

        {stepMap[currentStep]}
      </div>
    </div>
  );
};

export default CheckoutFlow;