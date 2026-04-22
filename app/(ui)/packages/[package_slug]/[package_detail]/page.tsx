import { fetchPackageBySlug, getPackagesMetaBySlug } from "@/apis";
import { BuyNowButton } from "@/components/custom/buynow";
import HeroSection from "@/components/custom/hero-section";
import SlideableTabsList from "@/components/custom/slideable-tabs-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
import { Check } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ package_slug: string; package_detail: string }>;
}) {
  const { package_slug, package_detail } = await params;
  const package_meta = await getPackagesMetaBySlug(package_detail);
  logger.debug(package_meta, "package_meta");

  const title = package_meta?.data?.meta_title || "";
  const description = package_meta?.data?.meta_description || "";
  const keywords = package_meta?.data?.meta_keywords || "";
  const image = FAVICON_URL;

  return {
    title: title || `Package Details - ${WEBNAME}`,
    description:
      description ||
      "View detailed information about this package and its features",
    keywords: keywords,
    alternates: {
      canonical: `${DOMAIN_URL}/packages/${decodeURIComponent(
        package_slug,
      )}/${decodeURIComponent(package_detail)}`,
    },
    openGraph: {
      type: "website",
      title: title || `Package Details - ${WEBNAME}`,
      description:
        description ||
        "View detailed information about this package and its features",
      url: `${DOMAIN_URL}/packages/${decodeURIComponent(
        package_slug,
      )}/${decodeURIComponent(package_detail)}`,
      siteName: WEBNAME,
      images: [
        {
          url: image,
          alt: title || "Package Details",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: title || `Package Details - ${WEBNAME}`,
      description:
        description ||
        "View detailed information about this package and its features",
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: { icon: FAVICON_URL },
  };
}

const PackageDetail = async ({
  params,
}: {
  params: Promise<{ package_slug: string; package_detail: string }>;
}) => {
  const { package_slug, package_detail } = await params;
  const detail = await fetchPackageBySlug(package_detail);

  const packageData = detail?.data;

  if (
    decodeURIComponent(packageData?.package_type_slug) !==
      decodeURIComponent(package_slug) ||
    !detail
  ) {
    return notFound();
  }
  const price = parseFloat(packageData?.price || "0");
  const discount = parseFloat(packageData?.discount || "0");
  const vat = parseFloat(packageData?.vat || "0");
  const finalPrice = price + vat - discount;

  return (
    <>
      {/* Hero Section */}
      <HeroSection>
        <div className="text-white text-center max-w-5xl p-5 max-md:text-2xl mx-auto py-14 space-y-4">
          {/* <Link
            href={`/packages/${package_slug}`}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Packages</span>
          </Link> */}
          <h1 className="text-4xl  font-bold">{packageData?.title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            {packageData?.package_type_meta_description}
          </p>
        </div>
      </HeroSection>

      {/* Main Content */}
      <section className="main py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Package Description */}
            <article className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#265985] mb-4">
                About {packageData?.title}
              </h2>
              <div
                className="prose prose-sm max-w-none [&_p]:text-gray-700 [&_p]:mb-4 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{
                  __html:
                    packageData?.description ||
                    "<p>No description available.</p>",
                }}
              />
            </article>
            {/* Mobile Column - Pricing Card */}
            <div className="md:col-span-1 md:hidden ">
              <aside className="sticky top-20 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
                {/* Package Label Badge */}
                {packageData?.package_label && (
                  <div
                    className="px-4 py-2 text-center text-white font-semibold text-sm"
                    style={{
                      backgroundColor: packageData?.primary_color || "#f97316",
                    }}
                  >
                    {packageData?.package_label}
                  </div>
                )}

                <div className="p-6 md:p-8">
                  {/* Title */}
                  <h2 className="text-[#265985] font-jost font-bold text-2xl md:text-3xl mb-2 text-center">
                    {packageData?.title}
                  </h2>

                  {/* Price Section */}
                  <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm mb-2">
                      Annual fee including tax
                    </p>
                    <div className="flex justify-center items-baseline gap-2 font-jost">
                      {discount > 0 && (
                        <span className="text-gray-400 line-through text-lg">
                          £{price.toFixed(2)}
                        </span>
                      )}
                      <strong className="text-[#558CBB] font-bold text-4xl">
                        £{finalPrice.toFixed(2)}
                      </strong>
                      <span className="text-gray-400 text-sm">/year</span>
                    </div>
                    {discount > 0 && (
                      <p className="text-green-600 text-sm font-semibold mt-2">
                        Save £{discount.toFixed(2)}
                      </p>
                    )}
                    {vat > 0 && (
                      <p className="text-gray-500 text-xs mt-1">
                        VAT: £{vat.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <BuyNowButton
                    title={packageData?.title}
                    type="package"
                    price={finalPrice}
                    discount={discount}
                    vat={vat}
                    checkoutId={packageData?.id}
                    className="w-full"
                  />

                  {/* Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                      {packageData?.summary}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="mt-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        packageData?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {packageData?.status === "active"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
            {/* Tabs Section */}
            {packageData?.tabs && packageData?.tabs?.length > 0 && (
              <article className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                <Tabs
                  defaultValue={packageData?.tabs[0]?.id?.toString() || "0"}
                  className="w-full"
                >
                  <TabsList className="bg-gray-200 rounded-xl p-2 flex flex-wrap gap-2 mb-6 md:max-w-fit max-w-xs overflow-hidden">
                    <SlideableTabsList>
                      {packageData?.tabs?.map((service: any, index: number) => (
                        <TabsTrigger
                          key={index}
                          value={service?.id?.toString()}
                          className="border border-gray-400 p-2 md:px-4 rounded-lg text-center text-nowrap data-[state=active]:bg-orange/50 data-[state=active]:border-orange/50 shrink-0"
                        >
                          {service?.name}
                        </TabsTrigger>
                      ))}
                    </SlideableTabsList>
                  </TabsList>

                  {packageData?.tabs?.map((tab: any) => (
                    <TabsContent
                      key={tab?.id}
                      value={tab?.id.toString()}
                      className="space-y-6"
                    >
                      {tab?.questions && tab?.questions?.length > 0 ? (
                        tab?.questions?.map((question: any) => (
                          <div
                            key={question?.id}
                            className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                          >
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                              {question?.question}
                            </h3>
                            <div
                              className="neditor-html"
                              dangerouslySetInnerHTML={{
                                __html:
                                  question?.description ||
                                  "<p>No description available.</p>",
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No questions available for this tab?.
                        </p>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </article>
            )}

            {/* Package Features */}
            {packageData?.package_features &&
              packageData?.package_features?.length > 0 && (
                <article className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#265985] mb-6">
                    Package Features
                  </h2>
                  <div className="space-y-4">
                    {packageData?.package_features?.map((feature: any) => (
                      <div
                        key={feature?.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <Check className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {feature?.title}
                          </h3>
                          <div
                            className="prose prose-sm max-w-none text-gray-700 [&_p]:mb-2 [&_p:last-child]:mb-0"
                            dangerouslySetInnerHTML={{
                              __html: feature?.description || "",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              )}
          </div>

          {/* Right Column - Pricing Card */}
          <div className="md:col-span-1 hidden md:block">
            <aside className="sticky top-20 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
              {/* Package Label Badge */}
              {packageData?.package_label && (
                <div
                  className="px-4 py-2 text-center text-white font-semibold text-sm"
                  style={{
                    backgroundColor: packageData?.primary_color || "#f97316",
                  }}
                >
                  {packageData?.package_label}
                </div>
              )}

              <div className="p-6 md:p-8">
                {/* Title */}
                <h2 className="text-[#265985] font-jost font-bold text-2xl md:text-3xl mb-2 text-center">
                  {packageData?.title}
                </h2>

                {/* Price Section */}
                <div className="text-center mb-6">
                  <p className="text-gray-500 text-sm mb-2">
                    Annual fee including tax
                  </p>
                  <div className="flex justify-center items-baseline gap-2 font-jost">
                    {discount > 0 && (
                      <span className="text-gray-400 line-through text-lg">
                        £{price.toFixed(2)}
                      </span>
                    )}
                    <strong className="text-[#558CBB] font-bold text-4xl">
                      £{finalPrice.toFixed(2)}
                    </strong>
                    <span className="text-gray-400 text-sm">/year</span>
                  </div>
                  {discount > 0 && (
                    <p className="text-green-600 text-sm font-semibold mt-2">
                      Save £{discount.toFixed(2)}
                    </p>
                  )}
                  {vat > 0 && (
                    <p className="text-gray-500 text-xs mt-1">
                      VAT: £{vat.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <BuyNowButton
                  title={packageData?.title}
                  type="package"
                  price={finalPrice}
                  discount={discount}
                  vat={vat}
                  checkoutId={packageData?.id}
                  className="w-full"
                />

                {/* Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    {packageData?.summary}
                  </p>
                </div>

                {/* Status */}
                <div className="mt-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      packageData?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {packageData?.status === "active"
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default PackageDetail;
