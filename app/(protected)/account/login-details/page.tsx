import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import LoginDetailsForm from "./login-details-form";
import { cookies } from "next/headers";

export async function generateMetadata() {
  return {
    title: `Login Details - ${WEBNAME}`,
    description: "Update your login details including email and password.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/login-details`,
    },
    openGraph: {
      type: "website",
      title: `Login Details - ${WEBNAME}`,
      description: "Update your login details including email and password.",
      url: `${DOMAIN_URL}/account/login-details`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Login Details",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Login Details - ${WEBNAME}`,
      description: "Update your login details including email and password.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const LoginDetailsPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz");
  return <LoginDetailsForm token={token?.value || ""} />;
};

export default LoginDetailsPage;
