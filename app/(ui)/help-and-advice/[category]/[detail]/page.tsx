import { fetchBlogMeta, fetchHelpAndAdviceBySlug } from "@/apis";
import ArticlesGroup from "@/components/custom/articles-group";
import BlogDetail from "@/components/custom/blog_detail";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ detail: string; category: string }>;
}): Promise<Metadata> {
  const { detail, category } = await params;
  let metaData;

  metaData = await fetchBlogMeta(decodeURIComponent(detail));
  const image = metaData?.data?.featured_image || FAVICON_URL;
  logger.info(metaData, "metaData");
  return {
    title: metaData?.data?.meta_title || WEBNAME,
    description: metaData?.data?.meta_description || "",
    keywords: metaData?.data?.meta_keywords || "",

    // Canonical URL
    alternates: {
      canonical: `${DOMAIN_URL}/help-and-advice/${decodeURIComponent(
        category,
      )}/${decodeURIComponent(detail)}`,
    },

    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
    openGraph: {
      title: metaData?.data?.meta_title || WEBNAME,
      description: metaData?.data?.meta_description || "",
      url: `${DOMAIN_URL}/help-and-advice/${decodeURIComponent(
        category,
      )}/${decodeURIComponent(detail)}`,
      siteName: WEBNAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: metaData?.data?.meta_title || WEBNAME,
        },
      ],
      locale: "en",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: metaData?.data?.meta_title || WEBNAME,
      description: metaData?.data?.meta_description || "",
      images: [image],
    },
    icons: { icon: FAVICON_URL },
  };
}
const BlogMain = async ({
  params,
  searchParams,
}: {
  params: Promise<{
    detail: string;
    category: string;
  }>;
  searchParams: Promise<{
    type: string;
    approved: string;
    page: string;
  }>;
}) => {
  const { detail } = await params;
  const details = await fetchHelpAndAdviceBySlug(detail);
  if (!detail) return notFound();
  // const blogUrl = `${BACKEND_URL}/blog/${details?.data?.category_slug}/${detail}`;

  return (
    <>
      <BlogDetail details={details?.data} />
      <div className="text-center bg-black/10 py-10 mb-10">
        <h2 className="mb-2 text-3xl font-semibold">
          Explore Related Articles
        </h2>
        <p className="mb-5">
          Discover more insights and tips to enhance your knowledge and skills.
        </p>
        <ArticlesGroup
          h={false}
          data={details?.data?.related_blogs || []}
          isBlog={false}
        />
      </div>
    </>
  );
};

export default BlogMain;
