import React from "react";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";

export async function generateMetadata() {
  return {
    title: `Import Company - ${WEBNAME}`,
    description: "Import your existing company into our management portal.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/company-import`,
    },
    openGraph: {
      type: "website",
      title: `Import Company - ${WEBNAME}`,
      description: "Import your existing company into our management portal.",
      url: `${DOMAIN_URL}/account/company-import`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Import Company",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Import Company - ${WEBNAME}`,
      description: "Import your existing company into our management portal.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const page = () => {
  return <div>page</div>;
};

export default page;
