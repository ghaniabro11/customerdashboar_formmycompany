// app/my-details/page.tsx
import { updateCustomerProfile } from "@/actions/customer";
import { fetchCustomerProfile } from "@/apis";
import { MyDetailsForm } from "@/components/custom/my-detail-form";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { Suspense } from "react";

export async function generateMetadata() {
  return {
    title: `My Details - ${WEBNAME}`,
    description: "Update your personal details and account information.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/my-details`,
    },
    openGraph: {
      type: "website",
      title: `My Details - ${WEBNAME}`,
      description: "Update your personal details and account information.",
      url: `${DOMAIN_URL}/account/my-details`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "My Details",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `My Details - ${WEBNAME}`,
      description: "Update your personal details and account information.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

const normalize = (d: any) => ({
  title: d?.title ?? "",
  first_name: d?.first_name ?? "",
  last_name: d?.last_name ?? "",
  email: d?.email ?? "",
  phone: d?.phone ?? "",
  address: d?.address ?? "",
  country: d?.country ?? "",
  dob: d?.dob ? d.dob.slice(0, 10) : "", // yyyy-mm-dd for <input type="date">
  proof_verified: Boolean(d?.proof_verified),
  status: d?.status ?? "active",

});

const MyDetailsPage = async () => {
  const data = await fetchCustomerProfile();
  logger.info(data, "Profile Data");

  return (
    <Suspense>
      <div className="main">
        <h1 className="text-xl font-semibold mb-4">My Details</h1>
        <MyDetailsForm
          initialData={normalize(data)}
          updateAction={updateCustomerProfile}
        />
      </div>
    </Suspense>
  );
};

export default MyDetailsPage;
