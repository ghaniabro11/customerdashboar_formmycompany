"use client";
import React, { useEffect, useState } from "react";
import { useStore } from "@/store/cart"; // Assume your store is managing the state
import NameSearchStep from "@/components/custom/cart/namesearchstep";
import AdditionalServicesStep from "@/components/custom/cart/additionalservicestep";
import PaymentStep from "@/components/custom/cart/paymentstep";
import ConfirmationStep from "@/components/custom/cart/confirmationstep";
import Stepper from "@/components/custom/cart/stepper";
import logger from "@/lib/logger/logger";

const CheckoutFlow: React.FC = () => {
  const { currentStep, nextStep, prevStep, goToStep, companyName, services } =
    useStore();
  const [hasAutoNavigated, setHasAutoNavigated] = useState(false);

  // Auto-navigate to step 2 if company name is already selected (only once on initial load)
  useEffect(() => {
    if (companyName && currentStep === "name-search" && !hasAutoNavigated) {
      goToStep("additional-services");
      setHasAutoNavigated(true);
    }
  }, [companyName, currentStep, goToStep, hasAutoNavigated]);

  // Reset auto-navigate flag when company name is cleared
  useEffect(() => {
    if (!companyName) {
      setHasAutoNavigated(false);
    }
  }, [companyName]);

  // Mapping steps to corresponding component
  const stepMap: Record<string, React.ReactNode> = {
    "name-search": <NameSearchStep onNext={nextStep} />,
    "additional-services": (
      <AdditionalServicesStep onNext={nextStep} onBack={prevStep} />
    ),
    payment: <PaymentStep onNext={nextStep} onBack={prevStep} />,
    confirmation: <ConfirmationStep />,
  };

  // Mapping step names to step numbers for Stepper component
  const stepNumberMap: Record<string, 1 | 2 | 3 | 4> = {
    "name-search": 1,
    "additional-services": 2,
    payment: 3,
    confirmation: 4,
  };
  const handleStepClick = (step: string) => {
    if (step === "name-search") {
      goToStep(step);
      return;
    }

    if (step === "additional-services" && companyName) {
      goToStep(step);
      return;
    }

    if (step === "payment" && companyName) {
      goToStep(step);
      return;
    }

    if (step === "confirmation" && currentStep === "confirmation") {
      goToStep(step);
      return;
    }
  };
  logger.info(services, "services");
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Render the Stepper component */}
        <Stepper
          current={stepNumberMap[currentStep] || 1}
          onStepClick={handleStepClick}
          companyName={companyName}
        />
        {/* Render the step based on currentStep */}
        {stepMap[currentStep]}
      </div>
    </div>
  );
};

export default CheckoutFlow;
