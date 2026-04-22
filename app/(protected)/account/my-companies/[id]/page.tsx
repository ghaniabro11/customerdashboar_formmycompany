import React from "react";
import CompanyDetailComponent from "./company-detail-page";
import logger from "@/lib/logger/logger";
import {
  fetchCustomerCompanyDetailBySlug,
  getCompanyInboxEmails,
  getDocumentsByAdmin,
} from "@/apis";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await fetchCustomerCompanyDetailBySlug(id);
  const title = company?.data?.company_name || `Company Details - ${WEBNAME}`;

  return {
    title: `${title} - ${WEBNAME}`,
    description: "View and manage your company details, documents, and information.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/my-companies/${decodeURIComponent(id)}`,
    },
    openGraph: {
      type: "website",
      title: `${title} - ${WEBNAME}`,
      description: "View and manage your company details, documents, and information.",
      url: `${DOMAIN_URL}/account/my-companies/${decodeURIComponent(id)}`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - ${WEBNAME}`,
      description: "View and manage your company details, documents, and information.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const CompanyDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const company = await fetchCustomerCompanyDetailBySlug(id);
  logger.info(company, "company");
  const companyInboxEmails = await getCompanyInboxEmails(id);
  logger.info(companyInboxEmails, "companyInboxEmails");
  const documentsByAdmin = await getDocumentsByAdmin(id);
  logger.info(documentsByAdmin, "documentsByAdmin");

  
  return (
    <CompanyDetailComponent
      company={company?.data}
      token={cookieStore.get("ldjsldjs82ydkz")?.value || ""}
      companyInboxEmails={companyInboxEmails?.data || []}
      documentsByAdmin={documentsByAdmin?.data || []}
    />
  );
};

export default CompanyDetailPage;
