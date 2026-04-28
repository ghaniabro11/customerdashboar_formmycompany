import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import AuthPageComponent from "./auth-page";
import { Suspense } from "react";

export async function generateMetadata() {
  return {
    title: `Auth - ${WEBNAME}`,
    description:
      "Foundrly helps entrepreneurs easily register their companies with full compliance and support. Enjoy exclusive business partner deals and more!",
    alternates: {
      canonical: `${DOMAIN_URL}/auth`,
    },
    openGraph: {
      type: "website",
      title: `Auth - ${WEBNAME}`,
      description:
        "Foundrly helps entrepreneurs easily register their companies with full compliance and support. Enjoy exclusive business partner deals and more!",
      url: `${DOMAIN_URL}/auth`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Foundrly Authentication",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Auth - ${WEBNAME}`,
      description:
        "Foundrly helps entrepreneurs easily register their companies with full compliance and support. Enjoy exclusive business partner deals and more!",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: "index, follow",
    icons: { icon: FAVICON_URL },
  };
}
const AuthPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("ldjsldjs82ydkz")?.value;
  const params = await searchParams;

  if (token) {
    redirect(params?.callbackUrl || "/dashboard");
  }

  return (
    <Suspense>
      <AuthPageComponent />
    </Suspense>
  );
};

export default AuthPage;
