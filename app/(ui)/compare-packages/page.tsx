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

export const dynamic = "force-dynamic";


export async function generateMetadata() {
  const package_types = await fetchPackagesTypes({});
  const packageSlug = package_types?.data?.data[0]?.slug || "";
  const package_type_meta = await fetchPackageTypeMetaBySlug(packageSlug);
  logger.debug(package_type_meta, "package_type_meta");
  const title = package_type_meta?.data?.meta_title || "";
  const description = package_type_meta?.data?.meta_description || "";
  const keywords = package_type_meta?.data?.meta_keywords || "";
  const image = package_type_meta?.data?.image || FAVICON_URL;
  return {
    title: title || `Compare Packages - ${WEBNAME}`,
    description:
      description ||
      "Compare different company registration packages and find the best one for your business",
    keywords: keywords,
    alternates: {
      canonical: `${DOMAIN_URL}/compare-packages`,
    },
    openGraph: {
      type: "website",
      title: title || `Compare Packages - ${WEBNAME}`,
      description:
        description ||
        "Compare different company registration packages and find the best one for your business",
      url: `${DOMAIN_URL}/compare-packages`,
      siteName: WEBNAME,
      images: [
        {
          url: image,
          alt: title || "Compare Packages",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: title || `Compare Packages - ${WEBNAME}`,
      description:
        description ||
        "Compare different company registration packages and find the best one for your business",
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: { icon: FAVICON_URL },
  };
}

const DynamicPackagePage = async () => {
  const package_types = await fetchPackagesTypes({});
  logger.debug(package_types?.data?.data, "package_types?.data?.data");
  const packageSlug = package_types?.data?.data[0]?.slug || "";
  const packages = await fetchPackages({
    package_type: decodeURIComponent(packageSlug),
  });
  if (packages?.message === "No packages found for the specified package type.")
    return notFound();
  logger.debug(packages);
  const artciles = await fetchLatestBlogs({});
  logger.debug(artciles);
  logger.info(
    package_types?.data?.data[0]?.slug,
    "package_types?.data[0]?.slug"
  );

  return packages?.package_type === "modules" ? (
    <ModuleLayoutComparePackages
      package_types={package_types?.data?.data || []}
      packageItems={packages || { data: [], features: [] }}
      artciles={artciles?.data}
      packageType={package_types?.data?.data[0]?.slug || ""}
    />
  ) : (
    <ComparePackages
      package_types={package_types?.data?.data || []}
      packageItems={packages || { data: [], features: [] }}
      artciles={artciles?.data}
      packageType={package_types?.data?.data[0]?.slug || ""}
    />
  );
};

export default DynamicPackagePage;
