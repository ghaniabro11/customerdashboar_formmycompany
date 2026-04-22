import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import DashboardPage from "./dashboard-content";

export async function generateMetadata() {
  return {
    title: `Dashboard - ${WEBNAME}`,
    description: "Access your account dashboard to manage your companies, services, and account details.",
    alternates: {
      canonical: `${DOMAIN_URL}/dashboard`,
    },
    openGraph: {
      type: "website",
      title: `Dashboard - ${WEBNAME}`,
      description: "Access your account dashboard to manage your companies, services, and account details.",
      url: `${DOMAIN_URL}/dashboard`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Foundrly Dashboard",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Dashboard - ${WEBNAME}`,
      description: "Access your account dashboard to manage your companies, services, and account details.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;
