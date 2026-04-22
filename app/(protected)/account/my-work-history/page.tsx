import { getWorkspaceBookings } from "@/apis";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import WorkHistoryTable from "./work-history-table";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: `My Work History - ${WEBNAME}`,
    description: "View your workspace booking history and manage your bookings.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/my-work-history`,
    },
    openGraph: {
      type: "website",
      title: `My Work History - ${WEBNAME}`,
      description: "View your workspace booking history and manage your bookings.",
      url: `${DOMAIN_URL}/account/my-work-history`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "My Work History",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `My Work History - ${WEBNAME}`,
      description: "View your workspace booking history and manage your bookings.",
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
  const bookings = await getWorkspaceBookings();
  logger.info(bookings, "Bookings");
  return <WorkHistoryTable bookings={bookings?.bookings || []} total={bookings?.count || 0} />;
};

export default page;
