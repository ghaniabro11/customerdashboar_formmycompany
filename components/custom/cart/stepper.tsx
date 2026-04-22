"use client";

import React from "react";
import { Check, CheckCircle, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/cart";

type Step = "name-search" | "additional-services" | "payment" | "confirmation";

const Stepper: React.FC<{
  current: 1 | 2 | 3 | 4;
  onStepClick: (step: Step) => void;
  companyName: string;
}> = ({ current, onStepClick, companyName }) => {
  const steps: { id: 1 | 2 | 3 | 4; label: string; step: Step }[] = [
    { id: 1, label: "Name Search", step: "name-search" },
    { id: 2, label: "Additional Services", step: "additional-services" },
    { id: 3, label: "Payment", step: "payment" },
    { id: 4, label: "Confirmation", step: "confirmation" },
  ];
  const { services } = useStore();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const canNavigateToStep = (stepId: number, step: Step) => {
    if (step === "name-search") return true;
    if (step === "additional-services") return !!companyName;
    if (step === "payment")
      return !!companyName && services.length > 0 && isAuthenticated;
    if (step === "confirmation") return current === 4;
    return false;
  };

  return (
    <ol className="mb-8 flex flex-wrap items-center gap-4" aria-label="Checkout steps">
      {steps.map((s) => {
        const isActive = current === s.id;
        const isDone = current > s.id;
        const canNavigate = canNavigateToStep(s.id, s.step);
        
        return (
          <li
            key={s.id}
            className={`flex items-center gap-2 text-sm font-semibold ${isActive ? "text-sky-900" : isDone ? "text-sky-700" : "text-slate-500"} ${canNavigate ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-60"}`}
            onClick={() => canNavigate && onStepClick(s.step)}
          >
            <span className={`grid h-8 w-8 place-items-center rounded-full transition-all ${isActive ? "bg-sky-500 text-white" : isDone ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-600"}`}>
              {isDone ? <Check className="h-5 w-5" /> : s.id}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
