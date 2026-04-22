import {
  fetchArticlesByCategorySlug,
  fetchBlogCategoryMetaBySlug,
} from "@/apis";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react"; // Assuming you're using Lucide icons
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryData = await fetchBlogCategoryMetaBySlug(category);
  const title = categoryData?.data?.meta_title || "";
  const description = categoryData?.data?.meta_description || "";
  const image = categoryData?.data?.featured_image || FAVICON_URL;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `${DOMAIN_URL}/help-and-advice/${decodeURIComponent(category)}`,
    },
    openGraph: {
      type: "website",
      title: title,
      description: description,
      url: `${DOMAIN_URL}/help-and-advice/${decodeURIComponent(category)}`,
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

const HelpAndAdviceCategoryPage = async ({
  params,
}: {
  params: Promise<{
    category: string;
  }>;
}) => {
  const { category } = await params;
  logger.info(category, "category");

  const categoryData = await fetchArticlesByCategorySlug(category);
  logger.info(categoryData, "categoryData");

  if (!categoryData) return notFound(); // Handles case when no category data is found

  return (
    <section className="p-10">
      <header className="mb-10 bg-gray-100 p-5">
        <h1>{categoryData?.name}</h1>
        <p>{categoryData?.meta_description}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categoryData?.data?.map((item: any) => (
          <article key={item.id} className="border-b pb-4">
            <Link href={`/help-and-advice/${category}/${item.slug}`} passHref>
              <div className="flex items-center gap-3">
                <Info className="text-gray-500" />
                <h2 className="text-lg font-semibold">{item.title}</h2>
              </div>
            </Link>
            <p className="text-sm text-gray-600">{item.meta_description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HelpAndAdviceCategoryPage;
