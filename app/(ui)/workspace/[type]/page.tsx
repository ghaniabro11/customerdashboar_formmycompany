import { fetchWorkspaceTypeBySlugDetail, fetchWorkspaceTypes } from "@/apis";
import WorkspaceBannerLayout from "@/components/custom/workspace-banner-layout";
import WorkSpaceTypesNavigation from "@/components/custom/workspace-types";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const workspaceTypeDetail = await fetchWorkspaceTypeBySlugDetail(
    decodeURIComponent(type)
  );

  logger.info(workspaceTypeDetail, "ssssssssssssssssssss");
  const title = workspaceTypeDetail?.data?.meta_title || "";
  const description = workspaceTypeDetail?.data?.meta_description || "";
  const image = workspaceTypeDetail?.data?.image || FAVICON_URL;

  return {
    title: `${title}`,
    description: description,
    alternates: {
      canonical: `${DOMAIN_URL}/workspace/${decodeURIComponent(type)}`,
    },
    openGraph: {
      type: "website",
      title: `${title}`,
      description: description,
      url: `${DOMAIN_URL}/workspace/${decodeURIComponent(type)}`,
      siteName: WEBNAME,
      images: [
        {
          url: image,
          alt: title,
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}`,
      description: description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: { icon: FAVICON_URL },
  };
}

const WorkSpacePage = async ({
  params,
}: {
  params: Promise<{ type: string }>;
}) => {
  const { type } = await params;
  const workspaceTypes = await fetchWorkspaceTypes();
  logger.debug(workspaceTypes, "workspaceTypes from type page");

  // Add debugging to see the actual structure
  logger.debug(workspaceTypes?.data, "workspaceTypes.data");
  logger.debug(workspaceTypes?.data?.data, "workspaceTypes.data.data");

  // Check if data exists
  if (!workspaceTypes) {
    return <div>No workspace types found</div>;
  }

  // Try different data access patterns
  const types =
    workspaceTypes?.data?.data || workspaceTypes?.data || workspaceTypes || [];

  const workspaceTypeDetail = await fetchWorkspaceTypeBySlugDetail(
    decodeURIComponent(type)
  );
  logger.debug(types, "types");

  return (
    <>
      <h1 className="sr-only">{workspaceTypeDetail?.data?.meta_title}</h1>
      <WorkSpaceTypesNavigation types={types} />
      <WorkspaceBannerLayout
        templates={workspaceTypeDetail?.data?.templates || []}
        type={decodeURIComponent(type)}
      />
    </>
  );
};

export default WorkSpacePage;
