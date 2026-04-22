import { fetchHelpAdviceCategories } from "@/apis";
import CompanySearchForm from "@/components/custom/company-search-form";
import HeroSection from "@/components/custom/hero-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/constants/faqs";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: `Help & Advice - ${WEBNAME}`,
    description:
      "Get help and advice on company registration, compliance, and business formation. Find answers to frequently asked questions and expert guidance.",
    alternates: {
      canonical: `${DOMAIN_URL}/help-and-advice`,
    },
    openGraph: {
      type: "website",
      title: `Help & Advice - ${WEBNAME}`,
      description:
        "Get help and advice on company registration, compliance, and business formation. Find answers to frequently asked questions and expert guidance.",
      url: `${DOMAIN_URL}/help-and-advice`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Foundrly Help & Advice",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Help & Advice - ${WEBNAME}`,
      description:
        "Get help and advice on company registration, compliance, and business formation. Find answers to frequently asked questions and expert guidance.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: { icon: FAVICON_URL },
  };
}

const HelpAndAdvicePage = async () => {
  let categories_help_and_advice = null;
  let error = null;

  try {
    categories_help_and_advice = await fetchHelpAdviceCategories();
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load help & advice categories";
    console.error("Error fetching help & advice categories:", err);
  }

  // Check if categories data is available
  const categoriesData = categories_help_and_advice?.data;
  const hasCategories = Array.isArray(categoriesData) && categoriesData.length > 0;
  const hasFaqs = Array.isArray(faqs) && faqs.length > 0;

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <HeroSection>
        <header className="space-y-4 my-auto pt-10 text-center">
          <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
            Hi, how can we help?
          </h1>

          <div className="md:max-w-xl mx-auto px-5">
            <CompanySearchForm />
          </div>
        </header>
      </HeroSection>

      {/* ===== Error State for Categories ===== */}
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
                    Error Loading Categories
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

      {/* ===== No Categories Available State ===== */}
      {!error && !hasCategories && (
        <section className="main py-12 -mt-24 relative z-50">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    No Help Categories Available
                  </h2>
                  <p className="text-gray-600">
                    We're currently organizing our help resources. Check back soon or contact our support team for assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Categories Grid ===== */}
      {!error && hasCategories && (
        <section className="main grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 -mt-24 relative z-50">
          {categoriesData.map((item: any, index: number) => {
            const categorySlug = item?.slug || "";
            const categoryName = item?.name || "Unnamed Category";
            const categoryIcon = item?.icon || "/dummy/article.png";
            const categoryDescription = item?.meta_description || "";

            return (
              <Link
                href={categorySlug ? `/help-and-advice/${categorySlug}` : "#"}
                className=""
                key={item?.id || index}
              >
                <div className="bg-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] text-center hover:shadow-[0px_6px_8px_2px_rgba(0,0,0,0.15)] transition-shadow duration-200">
                  <div className="p-10 flex flex-col justify-center items-center gap-2">
                    <Image
                      src={categoryIcon}
                      alt={categoryName}
                      height={40}
                      width={40}
                      className="object-contain"
                      // onError={(e) => {
                      //   // Fallback to a default icon if image fails to load
                      //   e.currentTarget.src = "/dummy/article.png";
                      // }}
                    />
                    <h3 className="text-lg font-semibold">{categoryName}</h3>
                    {categoryDescription && (
                      <p className="text-gray-500 text-sm">{categoryDescription}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}

      {/* ===== Support Section ===== */}
      <section className="bg-darkslate flex flex-col py-10 px-5 my-10 text-white gap-3 justify-center items-center text-center">
        <h2 className="text-3xl font-bold leading-tight">
          Didn't find an answer?
        </h2>
        <p className="max-w-2xl">
          Don't hesitate to get in touch with our support team. Send us an email
          or call, and we will respond as soon as possible.
        </p>
        <Button variant="orange" className="px-10 py-5 mt-2">
          Call Us
        </Button>
      </section>

      {/* ===== FAQs Section ===== */}
      <div className="main">
        <h2 className="md:text-nowrap text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        {!hasFaqs ? (
          <div className="max-w-2xl mx-auto text-center px-5 py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600">
                FAQs are currently being updated. Please check back soon or contact our support team for assistance.
              </p>
            </div>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            className="w-full col-span-1 grid md:grid-cols-2 grid-cols-1 gap-10"
          >
            {faqs.map((faq, index) => {
              const question = faq?.question || "Question not available";
              const answer = faq?.answer || "Answer not available";

              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default HelpAndAdvicePage;
