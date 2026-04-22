import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import CheckoutFlow from "./cart-page";

export async function generateMetadata() {
  return {
    title: `Cart - ${WEBNAME}`,
    description:
      "Foundrly helps entrepreneurs easily register their companies with full compliance and support. Enjoy exclusive business partner deals and more!",
    alternates: {
      canonical: `${DOMAIN_URL}/cart`,
    },
    openGraph: {
      type: "website",
      title: `Cart - ${WEBNAME}`,
      description:
        "Foundrly helps entrepreneurs easily register their companies with full compliance and support. Enjoy exclusive business partner deals and more!",
      url: `${DOMAIN_URL}/cart`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Foundrly Cart",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Cart - ${WEBNAME}`,
      description:
        "Foundrly helps entrepreneurs easily register their companies with full compliance and support. Enjoy exclusive business partner deals and more!",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: "index, follow",
    icons: { icon: FAVICON_URL },
  };
}


const CartPage = () => {
  return <CheckoutFlow />;
};

export default CartPage;
