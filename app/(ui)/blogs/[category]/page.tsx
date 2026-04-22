import { fetchBlogCategoryMetaBySlug, fetchBlogsByCategorySlug } from "@/apis";
import ArticleVerticalCard from "@/components/custom/articleverticalcard";
import { BlogProp } from "@/constants/types";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const blog_category_meta = await fetchBlogCategoryMetaBySlug(category);
  logger.debug(blog_category_meta, "blog_category_meta");
  const title = blog_category_meta?.data?.meta_title || "";
  const description = blog_category_meta?.data?.meta_description || "";
  const keywords = blog_category_meta?.data?.meta_keywords || "";
  const image = blog_category_meta?.data?.icon || FAVICON_URL;
  return {
    title: title || `Blog Category - ${WEBNAME}`,
    description: description || "Browse our blog articles by category",
    keywords: keywords,
    alternates: {
      canonical: `${DOMAIN_URL}/blogs/${decodeURIComponent(category)}`,
    },
    openGraph: {
      type: "website",
      title: title || `Blog Category - ${WEBNAME}`,
      description: description || "Browse our blog articles by category",
      url: `${DOMAIN_URL}/blogs/${decodeURIComponent(category)}`,
      siteName: WEBNAME,
      images: [
        {
          url: image,
          alt: title || "Blog Category",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: title || `Blog Category - ${WEBNAME}`,
      description: description || "Browse our blog articles by category",
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: { icon: FAVICON_URL },
  };
}

interface CategoryParams {
  params: Promise<{ category: string }>;
}

const CategoryPage = async ({ params }: CategoryParams) => {
  const { category } = await params;

  const categoryData = await fetchBlogsByCategorySlug(category);
  logger.debug(categoryData, "categoryData");
  if (!categoryData) {
    return notFound();
  }

  const { name, meta_description, data: blogs } = categoryData;

  return (
    <main className="container mx-auto px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 capitalize">{name}</h1>
        {meta_description && (
          <p className="text-gray-600 max-w-2xl mx-auto">{meta_description}</p>
        )}
      </header>

      {blogs?.length > 0 ? (
        <section
          className="main grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6"
          aria-label={`Blogs under ${name} category`}
        >
          {blogs?.map((item: BlogProp, index: number) => (
            <ArticleVerticalCard
              key={item.slug ?? index}
              title={item.title}
              category={item.category}
              categorySlug={decodeURIComponent(category)}
              imageUrl={item.featured_image}
              excerpt={item.meta_description}
              slug={`/blogs/${decodeURIComponent(category)}/${item.slug}`}
            />
          ))}
        </section>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No blogs available in this category yet.
        </p>
      )}
    </main>
  );
};

export default CategoryPage;
