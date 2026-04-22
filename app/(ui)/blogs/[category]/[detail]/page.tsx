import { fetchBlogBySlug, fetchBlogMeta } from "@/apis";
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
  try {
    const { detail, category } = await params;
    const decodedDetail = decodeURIComponent(detail);
    const decodedCategory = decodeURIComponent(category);
    
    let metaData;
    try {
      metaData = await fetchBlogMeta(decodedDetail);
    } catch (error) {
      logger.error(error, "Error fetching blog metadata");
      metaData = null;
    }

    // Fallback values
    const title = metaData?.data?.meta_title || WEBNAME;
    const description = metaData?.data?.meta_description || "Read our latest blog article";
    const image = metaData?.data?.image || FAVICON_URL;
    const canonicalUrl = `${DOMAIN_URL}/blogs/${decodedCategory}/${decodedDetail}`;

    return {
      title,
      description,
      keywords: metaData?.data?.meta_keywords || "",
      
      alternates: {
        canonical: canonicalUrl,
      },
      
      robots: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-video-preview": -1,
        "max-image-preview": "large",
      },
      
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: WEBNAME,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "en",
        type: "article",
        publishedTime: metaData?.data?.published_date,
        authors: metaData?.data?.author ? [metaData?.data?.author] : undefined,
      },
      
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      
      icons: { icon: FAVICON_URL },
    };
  } catch (error) {
    logger.error(error, "Error in generateMetadata");
    return {
      title: WEBNAME,
      description: "Read our latest blog article",
      alternates: {
        canonical: DOMAIN_URL,
      },
    };
  }
}

const BlogMain = async ({
  params,
}: {
  params: Promise<{
    detail: string;
    category: string;
  }>;
}) => {
  try {
    const { detail, category } = await params;
    const decodedDetail = decodeURIComponent(detail);
    const decodedCategory = decodeURIComponent(category);
    
    let details;
    try {
      details = await fetchBlogBySlug(decodedDetail);
    } catch (error) {
      logger.error(error, "Error fetching blog details");
      return notFound();
    }

    if (!details?.data) {
      logger.warn(`Blog not found: ${decodedDetail}`);
      return notFound();
    }

    const blogData = details.data;
    const relatedBlogs = blogData?.related_blogs || [];

    // Generate structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blogData.title,
      description: blogData.meta_description || blogData.title,
      image: blogData.featured_image,
      datePublished: blogData.published_date,
      dateModified: blogData.published_date,
      author: {
        "@type": "Person",
        name: blogData.author || "Foundrly Team",
      },
      publisher: {
        "@type": "Organization",
        name: WEBNAME,
        logo: {
          "@type": "ImageObject",
          url: FAVICON_URL,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${DOMAIN_URL}/blogs/${decodedCategory}/${decodedDetail}`,
      },
      articleSection: blogData.categories?.[0]?.name || "General",
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <article className="min-h-screen">
          <BlogDetail  details={blogData} />
          {relatedBlogs.length > 0 && (
            <section 
              className="text-center bg-gradient-to-b from-black/5 to-transparent py-12 my-12"
              aria-labelledby="related-articles-heading"
            >
              <div className="main">
                <header className="mb-8">
                  <h2 
                    id="related-articles-heading"
                    className="text-3xl font-bold mb-3 text-gray-900 dark:text-white"
                  >
                    Explore Related Articles
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Discover more insights and tips to enhance your knowledge and skills.
                  </p>
                </header>
                <ArticlesGroup isDynamic={true} data={relatedBlogs} />
              </div>
            </section>
          )}
        </article>
      </>
    );
  } catch (error) {
    logger.error(error, "Unexpected error in BlogMain");
    return notFound();
  }
};

export default BlogMain;
