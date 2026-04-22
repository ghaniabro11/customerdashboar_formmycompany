import { getCustomerVerifications } from "@/apis";
import IDCheckComponent from "@/components/custom/id-check-page-component";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { cookies } from "next/headers";
import { Suspense } from "react";

export async function generateMetadata() {
  return {
    title: `ID Check - ${WEBNAME}`,
    description: "View and manage your proof of ID verification status.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/id-check`,
    },
    openGraph: {
      type: "website",
      title: `ID Check - ${WEBNAME}`,
      description: "View and manage your proof of ID verification status.",
      url: `${DOMAIN_URL}/account/id-check`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "ID Check",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `ID Check - ${WEBNAME}`,
      description: "View and manage your proof of ID verification status.",
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
  const verifications = await getCustomerVerifications();
  logger.info(verifications, "Verifications");
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  logger.info(token, "Token");

  return (
    <Suspense>
      <IDCheckComponent verifications={verifications} token={token?.value || ""} />
    </Suspense>
  );
};

export default page;
