"use client";

import React from "react";
import { useStore } from "@/store/cart";
import { Button } from "../ui/button";
import logger from "@/lib/logger/logger";

interface BuyNowButtonProps {
  title: string;
  type: "service_package" | "package" | "addon";
  price: number;
  discount?: number;
  vat?: number;
  companyHousingFee?: number; // ADD
  label?: string;
  className?: string;
  meta?: any;
  checkoutId?: number;
}

export const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  title,
  type,
  price,
  meta,
  label = "Buy Now",
  className = "",
  discount,
  vat,
  checkoutId,
}) => {
  const addService = useStore((state) => state.addService);

  const handleClick = () => {
    logger.info(title, type, price, discount, vat, meta, "title, type, price, discount, vat, meta");
    addService({checkoutId, title, type, price, discount, vat, meta });
  };
  return (
    <Button
      onClick={handleClick}
      className={className}
      //   className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition ${className}`}
      variant={"orange"}
    >
      {label}
    </Button>
  );
};
