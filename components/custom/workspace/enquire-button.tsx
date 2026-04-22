"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useRef, useEffect } from "react";

interface EnquireButtonProps {
  formId?: string;
  variant?: "orange" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

const EnquireButton = ({
  formId = "workspace-inquiry-form",
  variant = "orange",
  size = "lg",
  className = "",
  children = "Enquire Now",
}: EnquireButtonProps) => {
  const scrollToForm = () => {
    const formElement = document.getElementById(formId);
    if (formElement) {
      // Calculate offset for navbar (if sticky)
      const navbarHeight = 80; // Approximate navbar height
      const elementPosition = formElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Optional: Add a subtle highlight effect
      formElement.classList.add("animate-pulse");
      setTimeout(() => {
        formElement.classList.remove("animate-pulse");
      }, 2000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} group relative overflow-hidden`}
      onClick={scrollToForm}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {/* <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" /> */}
      </span>
      <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
    </Button>
  );
};

export default EnquireButton;

