import { fetchBlogs } from "@/apis";
import ArticleVerticalCard from "@/components/custom/articleverticalcard";
import CompanySearchForm from "@/components/custom/company-search-form";
import HeroSection from "@/components/custom/hero-section";
import { BlogProp } from "@/constants/types";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "UK Company Registration Guides & Insights | My Company Registration",
    description:
      "Read expert guides from My Company Registration on UK company formation, compliance, and business setup for startups and entrepreneurs.",

    alternates: {
      canonical: `${DOMAIN_URL}/blogs`,
    },

    openGraph: {
      type: "website",
      title:
        "UK Company Registration Guides & Insights | My Company Registration",
      description:
        "Read expert guides from My Company Registration on UK company formation, compliance, and business setup for startups and entrepreneurs.",
      url: `${DOMAIN_URL}/blogs`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "My Company Registration Blogs",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },

    twitter: {
      card: "summary_large_image",
      title:
        "UK Company Registration Guides & Insights | My Company Registration",
      description:
        "Read expert guides from My Company Registration on UK company formation, compliance, and business setup for startups and entrepreneurs.",
      images: [`${DOMAIN_URL}/hero.png`],
    },

    robots: "index, follow",
    icons: { icon: FAVICON_URL },
  };
}

const BlogsPage = async () => {
  let blog = null;
  let error = null;

  try {
    blog = await fetchBlogs({});
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load blogs";
    console.error("Error fetching blogs:", err);
  }

  // Check if blog data is available
  const blogsData = blog?.data;
  const hasBlogs = Array.isArray(blogsData) && blogsData.length > 0;

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <HeroSection>
        <header className="space-y-4 my-auto pt-10 text-center">
          <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
            Company formation content to get you started.
          </h1>

          <div className="md:max-w-xl mx-auto px-5">
            <CompanySearchForm />
          </div>
        </header>
      </HeroSection>

      {/* ===== Error State ===== */}
      {error && (
        <section className="main py-12">
          <div className="max-w-2xl mx-auto text-center px-5">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h2 className="text-xl font-semibold text-red-800 mb-2">
                    Error Loading Blogs
                  </h2>
                  <p className="text-red-600">{error}</p>
                  <p className="text-sm text-red-500 mt-2">
                    Please try refreshing the page or contact support if the problem persists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== No Data State ===== */}
      {!error && !hasBlogs && (
        <section className="main py-12">
          <div className="max-w-2xl mx-auto text-center px-5">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Blogs Available
                  </h2>
                  <p className="text-gray-600">
                    We're currently working on creating great content for you. Check back soon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Blogs Grid ===== */}
      {!error && hasBlogs && (
        <section className="main grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
          {blogsData.map((blogItem: BlogProp, index: number) => {
            // Safely access category data
            const category = blogItem?.categories?.[0];
            const categoryName = category?.name || "Uncategorized";
            const categorySlug = category?.slug || "";
            const blogSlug = blogItem?.slug || "";
            
            // Build the full slug path safely
            const fullSlug = categorySlug && blogSlug 
              ? `/blogs/${categorySlug}/${blogSlug}`
              : "#";

            return (
              <ArticleVerticalCard
                excerpt={blogItem?.meta_description || ""}
                title={blogItem?.title || "Untitled Article"}
                category={categoryName}
                categorySlug={categorySlug}
                imageUrl={blogItem?.featured_image || "/dummy/article.png"}
                slug={fullSlug}
                key={blogItem?.id || index}
              />
            );
          })}
        </section>
      )}
    </div>
  );
};

export default BlogsPage;