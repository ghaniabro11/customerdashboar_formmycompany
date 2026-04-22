import { fetchWalletBalance } from "@/apis/wallet";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import WalletClient from "@/components/custom/wallet/wallet-client";

export async function generateMetadata() {
  return {
    title: `My Credit - ${WEBNAME}`,
    description: "Manage your account wallet and credits.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/wallet`,
    },
    openGraph: {
      type: "website",
      title: `My Credit - ${WEBNAME}`,
      description: "Manage your account wallet and credits.",
      url: `${DOMAIN_URL}/account/wallet`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Wallet",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `My Credit - ${WEBNAME}`,
      description: "Manage your account wallet and credits.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const WalletPage = async () => {
  const balanceData = await fetchWalletBalance();
  const balance = balanceData?.balance || "0.00";

  return <WalletClient initialBalance={balance} />;
};

export default WalletPage;
