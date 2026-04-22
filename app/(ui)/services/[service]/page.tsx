import { fetchServiceBySlug } from "@/apis";
import { PackageItem } from "@/components/custom/module-package-layout";
import { ServiceAddons } from "@/components/custom/service-addons";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyNowButton } from "@/components/custom/buynow";
import {
  DEFAULT_CURRENCY_UNIT,
  DOMAIN_URL,
  FAVICON_URL,
  WEBNAME,
} from "@/constants/url";
import logger from "@/lib/logger/logger";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const serviceData = await fetchServiceBySlug(service);
  const title = serviceData?.data?.title || `Service - ${WEBNAME}`;
  const description =
    serviceData?.data?.meta_description ||
    serviceData?.data?.summary ||
    "Discover our professional company services";
  const image = serviceData?.data?.image || FAVICON_URL;

  return {
    title: `${title} - ${WEBNAME}`,
    description: description,
    alternates: {
      canonical: `${DOMAIN_URL}/services/${decodeURIComponent(service)}`,
    },
    openGraph: {
      type: "website",
      title: `${title} - ${WEBNAME}`,
      description: description,
      url: `${DOMAIN_URL}/services/${decodeURIComponent(service)}`,
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
      title: `${title} - ${WEBNAME}`,
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

const IndiviualService = async ({
  params,
}: {
  params: Promise<{ service: string }>;
}) => {
  const { service } = await params;
  const serviceData = await fetchServiceBySlug(service);
  logger.info(serviceData, "serviceData");
  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6 md:grid md:grid-cols-2 grid-cols-1 gap-12">
        {/* Service Description */}
        <div
          dangerouslySetInnerHTML={{
            __html: serviceData?.data?.description || "<p></p>",
          }}
          className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                     [&_a]:text-orange [&_a]:font-semibold [&_a]:underline 
                     [&_a:hover]:text-orange-600 [&_img]:rounded-lg [&_img]:shadow-lg
                     [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
                     [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                     [&_p]:mb-4 [&_p]:leading-relaxed
                     [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                     [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
                     [&_blockquote]:border-l-4 [&_blockquote]:border-orange 
                     [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4"
        />

        {/* Service Packages */}
        <div className="space-y-6">
          {serviceData?.data?.service_packages?.map(
            (item: PackageItem, index: number) => {
              const price = parseFloat(item?.price || "0");
              const discount = parseFloat(item?.discount || "0");
              const vat = parseFloat(item?.vat || "0");
              const finalPrice = price - discount;
              return (
                <div
                  key={index}
                  className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                >
                  <h2 className="text-3xl font-semibold text-darkslate-800 mb-3">
                    {item?.title}
                  </h2>
                  <div
                    className="mb-6 prose prose-lg prose-slate dark:prose-invert max-w-none 
                     [&_a]:text-orange [&_a]:font-semibold [&_a]:underline 
                     [&_a:hover]:text-orange-600 [&_img]:rounded-lg [&_img]:shadow-lg
                     [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
                     [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
                     [&_p]:mb-4 [&_p]:leading-relaxed
                     [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                     [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
                     [&_blockquote]:border-l-4 [&_blockquote]:border-orange 
                     [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4"
                    dangerouslySetInnerHTML={{
                      __html: item?.description || "<p></p>",
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-darkslate-900 relative">
                      <div className="flex justify-center items-baseline gap-2 font-jost">
                        <strong className="text-[#558CBB] font-bold text-4xl">
                          £{finalPrice.toFixed(2)}
                        </strong>
                        <span className="text-gray-400 text-sm">
                          /{item?.duration}
                        </span>
                        {discount > 0 && (
                          <span className="text-gray-400 line-through text-lg">
                            £{price.toFixed(2)}
                          </span>
                        )}
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
                    <BuyNowButton
                      title={item?.title}
                      type={"service_package"}
                      checkoutId={item?.id || 0}
                      price={Number(item?.price)}
                      meta={{ service_id: serviceData?.data?.id }}
                      discount={Number(item?.discount)}
                      vat={Number(item?.vat)}
                    />
                  </div>
                </div>
              );
            },
          )}
        </div>

        {/* Features / Addons: table on desktop, cards on mobile */}
        {serviceData?.data?.addons && serviceData?.data?.addons?.length > 0 && (
          <ServiceAddons
            addons={serviceData.data.addons}
            features={serviceData?.features ?? []}
            serviceId={serviceData?.data?.id}
          />
        )}

        {/* Service Tabs */}
        <Tabs
          defaultValue={serviceData?.data?.tabs?.[0]?.name}
          className="w-full col-span-full"
        >
          <TabsList className="flex flex-wrap gap-4 mb-6">
            {serviceData?.data?.tabs?.map((tab: { name: string }) => (
              <TabsTrigger
                key={tab?.name}
                value={tab?.name}
                className="py-2 px-4 text-xl font-semibold text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {tab?.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs content */}
          {serviceData?.data?.tabs?.map(
            (tab: {
              name: string;
              questions: {
                question: string;
                description: string;
              }[];
            }) => (
              <TabsContent key={tab?.name} value={tab?.name}>
                <div className="space-y-8">
                  {tab?.questions.length > 0 ? (
                    tab?.questions?.map((q) => (
                      <div
                        key={q?.question}
                        className="border p-6 rounded-md bg-muted/30 shadow-md"
                      >
                        <h3 className="font-semibold text-2xl mb-3 text-darkslate-800">
                          {q?.question}
                        </h3>
                        <div
                          className="neditor-html"
                          dangerouslySetInnerHTML={{ __html: q?.description }}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">
                      No questions available for this tab.
                    </p>
                  )}
                </div>
              </TabsContent>
            ),
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default IndiviualService;
