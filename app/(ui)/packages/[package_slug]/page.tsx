import {
  fetchLatestBlogs,
  fetchPackages,
  fetchPackagesTypes,
  fetchPackageTypeMetaBySlug,
} from "@/apis";
import ModuleLayoutComparePackages from "@/components/custom/module-package-layout";
import ComparePackages from "@/components/custom/packages";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ package_slug: string }>;
}) {
  const { package_slug } = await params;
  const package_type_meta = await fetchPackageTypeMetaBySlug(package_slug);
  logger.debug(package_type_meta, "package_type_meta");
  const title = package_type_meta?.data?.meta_title || "";
  const description = package_type_meta?.data?.meta_description || "";
  const keywords = package_type_meta?.data?.meta_keywords || "";
  const image = package_type_meta?.data?.image || FAVICON_URL;
  return {
    title: title || `Packages - ${WEBNAME}`,
    description:
      description ||
      "Compare and choose the best company registration package for your needs",
    keywords: keywords,
    alternates: {
      canonical: `${DOMAIN_URL}/packages/${decodeURIComponent(package_slug)}`,
    },
    openGraph: {
      type: "website",
      title: title || `Packages - ${WEBNAME}`,
      description:
        description ||
        "Compare and choose the best company registration package for your needs",
      url: `${DOMAIN_URL}/packages/${decodeURIComponent(package_slug)}`,
      siteName: WEBNAME,
      images: [
        {
          url: image,
          alt: title || "Package",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: title || `Packages - ${WEBNAME}`,
      description:
        description ||
        "Compare and choose the best company registration package for your needs",
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: { icon: FAVICON_URL },
  };
}

const DynamicPackagePage = async ({
  params,
}: {
  params: Promise<{
    package_slug: string;
  }>;
}) => {
  const { package_slug } = await params;
  const package_types = await fetchPackagesTypes({});
  logger.debug(package_types?.data?.data, "package_types?.data?.data");
  const packages = await fetchPackages({
    package_type: decodeURIComponent(package_slug),
  });
  if (packages?.message === "No packages found for the specified package type.")
    return notFound();
  logger.debug(packages, "packages");
  const artciles = await fetchLatestBlogs({});
  logger.debug(artciles);

  return packages?.package_type === "modules" ? (
    <ModuleLayoutComparePackages
      package_types={package_types?.data?.data || []}
      packageItems={packages || { data: [], features: [] }}
      artciles={artciles?.data}
      packageType={decodeURIComponent(package_slug)}
    />
  ) : (
    <ComparePackages
      package_types={package_types?.data?.data || []}
      packageItems={packages || { data: [], features: [] }}
      artciles={artciles?.data}
      packageType={decodeURIComponent(package_slug)}
    />
  );
};

export default DynamicPackagePage;
