import FileLinks from "@/components/custom/file-links";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
export const dynamic = "force-dynamic";


export async function generateMetadata() {
  return {
    title: `Statutory Forms - ${WEBNAME}`,
    description:
      "Access useful templates and forms for your statutory requirements. Download official company forms and documents.",
    alternates: {
      canonical: `${DOMAIN_URL}/statutory-forms`,
    },
    openGraph: {
      type: "website",
      title: `Statutory Forms - ${WEBNAME}`,
      description:
        "Access useful templates and forms for your statutory requirements. Download official company forms and documents.",
      url: `${DOMAIN_URL}/statutory-forms`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Foundrly Statutory Forms",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Statutory Forms - ${WEBNAME}`,
      description:
        "Access useful templates and forms for your statutory requirements. Download official company forms and documents.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: { icon: FAVICON_URL },
  };
}

const StatutoryForms = () => {
  return (
    <main>
      <FileLinks></FileLinks>
    </main>
  );
};

export default StatutoryForms;
