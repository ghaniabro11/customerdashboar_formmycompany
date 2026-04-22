import React from "react";
import MyCompaniesPage from "./mycompanycomponent";
import { fetchCustomerCompanies } from "@/apis";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: `My Companies - ${WEBNAME}`,
    description: "View and manage your registered companies. Access company information and make updates.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/my-companies`,
    },
    openGraph: {
      type: "website",
      title: `My Companies - ${WEBNAME}`,
      description: "View and manage your registered companies. Access company information and make updates.",
      url: `${DOMAIN_URL}/account/my-companies`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "My Companies",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `My Companies - ${WEBNAME}`,
      description: "View and manage your registered companies. Access company information and make updates.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const MyCompanies = async () => {
  const companies = await fetchCustomerCompanies();
  logger.debug(companies, "companies");
  return <MyCompaniesPage companies={companies?.data?.data || []} pagination={companies} />;
};

export default MyCompanies;
