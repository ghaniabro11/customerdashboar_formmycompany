import { fetchCategoriesWithServices } from "@/apis";
import CompanySearchForm from "@/components/custom/company-search-form";
import HeroSection from "@/components/custom/hero-section";
import ServiceCard from "@/components/custom/service-card";
import SlideableTabsList from "@/components/custom/slideable-tabs-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryAndServices, Service } from "@/constants/types";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import logger from "@/lib/logger/logger";
export const dynamic = "force-dynamic";


export async function generateMetadata() {
  return {
    title:
      "UK Company Formation & Business Services | My Company Registration",
    description:
      "Explore UK company formation, compliance, VAT, and business services with My Company Registration. Fast, reliable, and fully compliant solutions.",

    alternates: {
      canonical: `${DOMAIN_URL}/services`,
    },

    openGraph: {
      type: "website",
      title:
        "UK Company Formation & Business Services | My Company Registration",
      description:
        "Explore UK company formation, compliance, VAT, and business services with My Company Registration. Fast, reliable, and fully compliant solutions.",
      url: `${DOMAIN_URL}/services`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "My Company Registration Services",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },

    twitter: {
      card: "summary_large_image",
      title:
        "UK Company Formation & Business Services | My Company Registration",
      description:
        "Explore UK company formation, compliance, VAT, and business services with My Company Registration. Fast, reliable, and fully compliant solutions.",
      images: [`${DOMAIN_URL}/hero.png`],
    },

    robots: {
      index: true,
      follow: true,
    },

    icons: { icon: FAVICON_URL },
  };
}

const ServicesPage = async () => {
  const categories_with_services = await fetchCategoriesWithServices({});

  const categoryList: CategoryAndServices[] =
    categories_with_services?.data?.data || [];

  // Build tabs
  const services = [
    { label: "All Services", key: "all" },
    ...categoryList.map((c) => ({
      label: c?.name,
      key: c?.slug,
    })),
  ];

  logger.info(categories_with_services, "categories_with_services : /services");
  logger.debug(services, "services : /services");

  return (
    <div>
      {/* ===== Hero Section ===== */}
      <HeroSection>
        <header className="space-y-4 my-auto pt-10 text-center">
          <h1 className="text-white max-w-5xl px-5 mx-auto max-md:text-2xl font-semibold">
            Discover How Our Company Services Can Assist You
          </h1>

          <div className="md:max-w-xl mx-auto px-5">
            <CompanySearchForm />
          </div>
        </header>
      </HeroSection>

      {/* ===== Services Tabs Section ===== */}
      <section className="w-full  py-10">
        <nav aria-label="Service Categories">
          <Tabs defaultValue="all">
            <div className="sticky  z-40 bg-white py-4 -mt-10 mb-4 top-[7dvh] md:top-[10dvh]">
              <div className="bg-gray-200 rounded-xl p-2 overflow-hidden main-x">
                <TabsList className="block! w-full! min-h-0! p-0 bg-transparent">
                  <SlideableTabsList>
                    {services?.map((service, index) => (
                      <TabsTrigger
                        key={index}
                        value={service?.key}
                        className="border border-gray-400 p-2 md:px-4 rounded-lg text-center text-nowrap data-[state=active]:bg-orange/50 data-[state=active]:border-orange/50 shrink-0"
                      >
                        {service?.label}
                      </TabsTrigger>
                    ))}
                  </SlideableTabsList>
                </TabsList>
              </div>
            </div>

            {/* ===== All Services Tab ===== */}
            <TabsContent value="all" className="mt-10 pb-5 main-x">
              {categoryList?.length > 0 &&
                categoryList?.map((category, index) => (
                  <div key={index} className="mb-12">
                    <header className="flex items-center gap-2 mb-6">
                      <h2 className="text-3xl text-nowrap font-bold text-gray-900">
                        {category?.name}
                      </h2>
                      <div className="h-0.5 w-full bg-orange" />
                    </header>

                    <div className="grid md:grid-cols-3 sm:grid-cols-2  gap-5">
                      {category?.services?.length > 0 ? (
                        category?.services?.map(
                          (item: Service, idx: number) => (
                            <ServiceCard
                              key={
                                (item as any)?.id ??
                                `${(item as any)?.slug}-${idx}`
                              }
                              data={item as Service}
                              index={idx}
                            />
                          )
                        )
                      ) : (
                        <div className="text-center text-gray-500">
                          No services found
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </TabsContent>

            {/* ===== Individual Category Tabs ===== */}
            {categoryList.length > 0 ? (
              categoryList.map(
                (service: CategoryAndServices, index: number) => (
                  <TabsContent
                    key={index}
                    value={service?.slug}
                    className="mt-10 pb-5 main "
                  >
                    <header className="flex items-center gap-2 mb-10">
                      <h2 className="text-3xl text-nowrap font-bold text-gray-900">
                        {service?.name}
                      </h2>
                      <div className="h-0.5 w-full bg-orange" />
                    </header>

                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                      {service?.services?.length > 0 ? (
                        service?.services?.map((item: Service, idx: number) => (
                          <ServiceCard
                            key={
                              (item as any)?.id ??
                              `${(item as any)?.slug}-${idx}`
                            }
                            data={item}
                            index={idx}
                          />
                        ))
                      ) : (
                        <div className="text-center text-gray-500">
                          No services found
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )
              )
            ) : (
              <div className="text-center text-gray-500">No services found</div>
            )}
          </Tabs>
        </nav>
      </section>

      {/* ===== Support Section ===== */}
      <section className="bg-darkslate flex flex-col py-10 px-5 my-10 text-white gap-3 justify-center items-center text-center">
        <h2 className="text-3xl font-bold leading-tight">
          Didn’t find an answer?
        </h2>
        <p className="max-w-2xl">
          Don’t hesitate to get in touch with our support team. Send us an email
          or call, and we will respond as soon as possible.
        </p>
        <Button variant="orange" className="px-10 py-5 mt-2">
          Call Us
        </Button>
      </section>
    </div>
  );
};

export default ServicesPage;
