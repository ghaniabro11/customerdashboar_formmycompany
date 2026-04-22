import { fetchWorkspaceTypeBySlugDetail, fetchWorkspaceTypes } from "@/apis";
import WorkspaceBannerLayout from "@/components/custom/workspace-banner-layout";
import WorkSpaceTypesNavigation from "@/components/custom/workspace-types";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const workspaceTypes = await fetchWorkspaceTypes();
  logger.info(workspaceTypes, "workspaceTypes");
  const slug = workspaceTypes?.data[0]?.slug || "";
  const workspaceTypeDetail = await fetchWorkspaceTypeBySlugDetail(slug);
  const title = workspaceTypeDetail?.data?.meta_title || "";
  const description = workspaceTypeDetail?.data?.meta_description || "";
  const image = workspaceTypeDetail?.data?.image || FAVICON_URL;
  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${DOMAIN_URL}/workspace`,
    },
    openGraph: {
      type: "website",
      title: title,
      description: description,
      url: `${DOMAIN_URL}/workspace`,
      siteName: WEBNAME,
      images: [
        {
          url: image,
          alt: "Foundrly Workspace",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
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
  logger.debug(workspaceTypes, "workspaceTypes from workspace page");
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
    types[0]?.slug
  );

  logger.debug(types, "types");
  logger.debug(workspaceTypeDetail, "workspaceTypeDetail");

  return (
    <>
      <h1 className="sr-only">{workspaceTypeDetail?.data?.meta_title}</h1>

      <WorkSpaceTypesNavigation types={types} />
      <WorkspaceBannerLayout
        templates={workspaceTypeDetail?.data?.templates || []}
        type={types[0]?.slug}
      />
    </>
  );
};

export default WorkSpacePage;
