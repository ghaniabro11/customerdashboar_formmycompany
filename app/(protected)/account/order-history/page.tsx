import { fetchCustomerOrderHistory } from "@/apis";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import React from "react";
import OrderHistoryPage from "./orderpage";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: `Order History - ${WEBNAME}`,
    description: "View your order history and access invoices for all your payments.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/order-history`,
    },
    openGraph: {
      type: "website",
      title: `Order History - ${WEBNAME}`,
      description: "View your order history and access invoices for all your payments.",
      url: `${DOMAIN_URL}/account/order-history`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Order History",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Order History - ${WEBNAME}`,
      description: "View your order history and access invoices for all your payments.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const OrderPage = async () => {
  const orders = await fetchCustomerOrderHistory();

  return <OrderHistoryPage orders={orders} />;
};

export default OrderPage;
