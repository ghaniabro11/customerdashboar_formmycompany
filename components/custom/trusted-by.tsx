"use client";

import React, { useState } from "react";
import Stripe from "../icons/stripe";
import Amex from "../icons/amex";
import MasterCard from "../icons/mastercard";
import ApplePay from "../icons/apple-pay";
import AliPay from "../icons/alipay";
import Qiwi from "../icons/qiwi";
import Visa from "../icons/visa";
import Paypal from "../icons/paypal";
import Discover from "../icons/discover";
import Gpay from "../icons/gpay";
import WeChat from "../icons/wechat";
import DinersClub from "../icons/dinersclub";
import Bitcoin from "../icons/bitcoin";
import Amazon from "../icons/amazon";
import BitPay from "../icons/bitpay";
import Yandex from "../icons/yandex";
import Etherium from "../icons/etherium";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

const TrustedBy = () => {
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);
  const isMobile = useIsMobile();
  // text mapping for each logo
  const logoTexts: Record<string, string> = {
    Stripe: "This is text for Stripe.",
    Amex: "This is text for American Express.",
    MasterCard: "This is text for MasterCard.",
    ApplePay: "This is text for Apple Pay.",
    AliPay: "This is text for AliPay.",
    Qiwi: "This is text for Qiwi.",
    Visa: "This is text for Visa.",
    Paypal: "This is text for PayPal.",
    Discover: "This is text for Discover.",
    Gpay: "This is text for Google Pay.",
    WeChat: "This is text for WeChat Pay.",
    DinersClub: "This is text for Diners Club.",
    Bitcoin: "This is text for Bitcoin.",
    Amazon: "This is text for Amazon Pay.",
    BitPay: "This is text for BitPay.",
    Yandex: "This is text for Yandex.",
    Etherium: "This is text for Ethereum.",
  };

  const iconComponents = [
    { name: "Stripe", component: <Stripe /> },
    { name: "Amex", component: <Amex /> },
    { name: "MasterCard", component: <MasterCard /> },
    { name: "ApplePay", component: <ApplePay /> },
    { name: "AliPay", component: <AliPay /> },
    { name: "Qiwi", component: <Qiwi /> },
    { name: "Visa", component: <Visa /> },
    { name: "Paypal", component: <Paypal /> },
    { name: "Discover", component: <Discover /> },
    { name: "Gpay", component: <Gpay /> },
    { name: "WeChat", component: <WeChat /> },
    { name: "DinersClub", component: <DinersClub /> },
    { name: "Bitcoin", component: <Bitcoin /> },
    { name: "Amazon", component: <Amazon /> },
    { name: "BitPay", component: <BitPay /> },
    { name: "Yandex", component: <Yandex /> },
    { name: "Etherium", component: <Etherium /> },
  ];
  const renderLogoWithTooltip = (
    item: { name: string; component: React.ReactNode },
    index: number
  ) => {
    const isOpen = openTooltip === index;

    return (
      <Tooltip
        key={index}
        open={isOpen ? true : undefined}
        onOpenChange={(open) => {
          // Close tooltip if it was manually opened and user wants to close it
          if (!open && isOpen) {
            setOpenTooltip(null);
          }
        }}
      >
        <TooltipTrigger asChild>
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 rounded touch-manipulation"
            onClick={() => {
              setOpenTooltip(isOpen ? null : index);
            }}
          >
            {item.component}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs z-50"
          onPointerDownOutside={() => {
            setOpenTooltip(null);
          }}
        >
          <p>{logoTexts[item.name]}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <section className="main grid md:grid-cols-2 grid-cols-1 gap-10 place-items-center relative  ">
      <div>
        <h2 className="font-bold text-3xl mb-10">
          Pick a <span className="text-orange">free business bank account</span>{" "}
          with your package
        </h2>
        <p>
          Benefit from a free business bank account when you use our services.
          There are six great options to choose from, and you'll also get your
          application fast-tracked. No more long wait times for appointments, so
          you can get back to the important stuff - running your new business.
          Simply select the bank account that best suits your needs and get
          started in minutes.
        </p>
      </div>
      {!isMobile && (
        <div className="md:flex hidden gap-5">
          <div className="space-y-5">
            {iconComponents
              .slice(0, 5)
              .map((item, index) => renderLogoWithTooltip(item, index))}
          </div>
          <div className="mt-5 space-y-5">
            {iconComponents
              .slice(5, 9)
              .map((item, index) => renderLogoWithTooltip(item, index + 5))}
          </div>
          <div className="space-y-5">
            {iconComponents
              .slice(9, 14)
              .map((item, index) => renderLogoWithTooltip(item, index + 9))}
          </div>
          <div className="space-y-5 my-auto">
            {iconComponents
              .slice(14, 17)
              .map((item, index) => renderLogoWithTooltip(item, index + 14))}
          </div>
        </div>
      )}

      <div className=" md:hidden gap-5">
        <div className="space-y-5 flex flex-wrap justify-center gap-5">
          {iconComponents.map((item, index) =>
            renderLogoWithTooltip(item, index)
          )}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
