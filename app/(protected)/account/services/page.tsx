import { getCompanyServices } from "@/apis";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import ServiceTable from "./service-table";

export async function generateMetadata() {
  return {
    title: `My Services - ${WEBNAME}`,
    description: "View your services, renewals, and manage your company service subscriptions.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/services`,
    },
    openGraph: {
      type: "website",
      title: `My Services - ${WEBNAME}`,
      description: "View your services, renewals, and manage your company service subscriptions.",
      url: `${DOMAIN_URL}/account/services`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "My Services",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `My Services - ${WEBNAME}`,
      description: "View your services, renewals, and manage your company service subscriptions.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const page = async () => {
  const services = await getCompanyServices();
  logger.info(services, "Services");
  return <ServiceTable services={services?.services || []} />;
};

export default page;
