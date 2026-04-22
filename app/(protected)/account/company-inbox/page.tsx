import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import CompanyInboxContent from "./company-inbox-content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: `Company Inbox - ${WEBNAME}`,
    description: "View post items received by your companies.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/company-inbox`,
    },
    openGraph: {
      type: "website",
      title: `Company Inbox - ${WEBNAME}`,
      description: "View post items received by your companies.",
      url: `${DOMAIN_URL}/account/company-inbox`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Company Inbox",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Company Inbox - ${WEBNAME}`,
      description: "View post items received by your companies.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const CompanyInboxPage = () => {
  return <CompanyInboxContent />;
};

export default CompanyInboxPage;
