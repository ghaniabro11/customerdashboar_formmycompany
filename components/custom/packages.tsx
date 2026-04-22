"use client";
import HeroSection from "@/components/custom/hero-section";
import PackageNavigation from "@/components/custom/package-navigation";
import Image from "next/image";
import React, { Fragment, useMemo } from "react";
// Import Swiper React components

// Import Swiper styles
import ArticlesGroup from "@/components/custom/articles-group";
import { Article } from "@/constants/types";
import { DEFAULT_CURRENCY_UNIT } from "@/constants/url";
import { useIsMobile } from "@/hooks/useIsMobile";
import logger from "@/lib/logger/logger";
import { Check, X } from "lucide-react";
import Link from "next/link";
import "swiper/css";
import { BuyNowButton } from "./buynow";
import PackageCard from "./package-card";
import ReviewsSwiper from "./reviews-swiper";

type Feature = {
  id: number;
  title: string;
  slug: string;
  description: string;
};

type ApiPackage = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  price: string;
  discount: string;
  vat: string;
  status: string;
  duration: string | null;
  package_label: string | null;
  primary_color: string;
  secondary_color: string;
  package_features: number[];
};

type TransformedFeature = {
  isAdded: boolean;
  feature: string;
};

type TransformedPackage = {
  id: number;
  title: string;
  price: number;
  discount: number;
  vat: number;
  period: string;
  slug: string;
  mostPopular: boolean;
  features: TransformedFeature[];
};

const transformData = (apiResponse: any): TransformedPackage[] => {
  const { data, features } = apiResponse;
  logger.debug(data, features, "data, features");
  return data?.data?.map((apiPackage: ApiPackage) => {
    const packageName = apiPackage?.title;
    const id = apiPackage?.id || 0;
    const price = parseFloat(apiPackage?.price);
    const discount = parseFloat(apiPackage?.discount);
    const vat = parseFloat(apiPackage?.vat);
    const mostPopular = apiPackage?.package_label === "Best Value";
    const period = apiPackage?.duration || ""; // Assuming all packages are per year for now
    const slug = apiPackage?.slug;
    const primaryColor = apiPackage?.primary_color || "#d1d5dc";
    const secondaryColor = apiPackage?.secondary_color || "#f37a1f";
    const packageLabel = apiPackage?.package_label || "";
    logger.debug(primaryColor, secondaryColor, "primaryColor, secondaryColor");
    // Map features for the package
    const transformedFeatures: TransformedFeature[] =
      apiPackage?.package_features?.map((featureId: number) => {
        const feature = features?.find((f: Feature) => f.id === featureId);
        if (feature) {
          return {
            isAdded: true,
            feature: feature.title,
          };
        }
        return {
          isAdded: false,
          feature: "",
        };
      });

    return {
      title: packageName,
      price: price,
      discount: discount,
      vat: vat,
      id: id,
      period: period,
      mostPopular: mostPopular,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor,
      packageLabel: packageLabel,
      features: transformedFeatures,
      slug: slug,
    };
  });
};
const ComparePackages = ({
  package_types,
  packageItems,
  artciles,
  packageType,
}: {
  package_types: any;
  packageItems: any;
  artciles: Article[];
  packageType: string;
}) => {
  logger.info(packageItems, "packageItems");
  const data = transformData(packageItems);
  const isMobile = useIsMobile();

  const allFeatures = useMemo(() => {
    const set = new Set<string>();
    data?.forEach((p) => p.features.forEach((f) => set.add(f.feature)));
    return Array.from(set);
  }, [data]);
  const numPackages = data?.length;
  logger.info(data, "Packages Data");
  return (
    <Fragment>
      <HeroSection>
        <h1 className="text-white text-center max-w-5xl p-5 max-md:text-2xl mx-auto py-14">
          Select the perfect package for you & register your new company online
          today.
        </h1>
      </HeroSection>

      <nav
        aria-label="Package sections"
        className="sticky bg-white top-0 pt-[12dvh] pb-3 z-40 "
      >
        <PackageNavigation package_types={package_types} />
      </nav>

      {/* Comparison Table */}
      <section aria-labelledby="compare-heading" className="main">
        <h2 id="compare-heading" className="sr-only">
          Compare packages
        </h2>
        {data?.length > 0 ? (
          <div
            className=" md:grid hidden gap-px bg-orange/20 rounded-xl overflow-hidden border border-orange/20"
            style={{
              gridTemplateColumns: `minmax(200px, 1fr) repeat(${numPackages}, minmax(180px, 1fr))`,
            }}
          >
            {/* Header Row - Feature Label */}
            <div className="bg-gray-50 p-5 font-semibold text-gray-700 flex items-end">
              Features
            </div>

            {/* Header Row - Package Cards */}
            {data?.map((plan: any) => {
              const finalPrice = plan?.price - plan?.discount;

              return (
                <div
                  key={plan?.title}
                  className="bg-linear-to-b to-white text-center"
                  style={{
                    backgroundImage: plan?.secondaryColor
                      ? `linear-gradient(to bottom, ${plan?.secondaryColor} 0%, white 100%)`
                      : "linear-gradient(to bottom, rgb(249, 250, 251) 0%, white 100%)",
                  }}
                >
                  <div
                    className={` ${plan?.packageLabel ? "" : "h-6"} w-full bg-gray-300 text-white`}
                    aria-hidden="true"
                    style={{ backgroundColor: plan?.primaryColor || "#d1d5dc" }}
                  >
                    {plan?.packageLabel}
                  </div>
                  <div
                    className={`h-[3px] w-full `}
                    aria-hidden="true"
                    style={{ backgroundColor: plan?.primaryColor || "#d1d5dc" }}
                  />
                  <header
                    className="py-10 bg-linear-to-b to-white text-center"
                    style={{
                      backgroundImage: plan?.secondaryColor
                        ? `linear-gradient(to bottom, ${plan?.secondaryColor} 5%, white 100%)`
                        : "linear-gradient(to bottom, rgb(243, 244, 246) 5%, white 100%)",
                    }}
                  >
                    <h3
                      className="text-[#265985] font-jost font-bold text-3xl mb-1 "
                      itemProp="name"
                    >
                      {plan?.title}
                    </h3>
                    <p className="text-gray-500 text-sm" itemProp="description">
                      Annual fee including tax
                    </p>
                    <div
                      className="flex justify-center  items-baseline gap-2 font-jost mt-2"
                      aria-label="Price"
                    >
                      <strong
                        className="text-[#558CBB] font-bold text-4xl"
                        itemProp="price"
                      >
                        {DEFAULT_CURRENCY_UNIT}
                        {finalPrice}{" "}
                        {plan?.discount > 0 && (
                          <span className="text-gray-400 line-through text-lg">
                            £{plan?.price.toFixed(2)}
                          </span>
                        )}
                      </strong>
                      <span
                        className="text-gray-400 text-sm"
                        itemProp="priceCurrency"
                        content="USD"
                      >
                        {plan?.period ? `/${plan?.period}` : ""}
                      </span>
                    </div>

                    {plan?.discount > 0 && (
                      <p className="text-green-600 text-sm font-semibold mt-2">
                        Save £{plan?.discount?.toFixed(2)}
                      </p>
                    )}
                    {plan?.vat > 0 && (
                      <p className="text-gray-500 text-xs mt-1">
                        VAT: £{plan?.vat?.toFixed(2)}
                      </p>
                    )}
                    <meta itemProp="priceCurrency" content="USD" />
                    <BuyNowButton
                      title={plan?.title}
                      type={"package"}
                      price={plan?.price}
                      className="mt-3"
                      aria-label={`Buy ${plan?.title} plan`}
                      discount={plan?.discount}
                      vat={plan?.vat}
                      checkoutId={plan?.id || 0}
                    />
                    <Link
                      href={`/packages/${packageType}/${plan?.slug}`}
                      className="text-sm text-gray-500 block mt-3"
                    >
                      More Info
                    </Link>
                  </header>
                </div>
              );
            })}

            {/* Feature Rows */}
            {allFeatures.map((feature, index) => (
              <React.Fragment key={feature}>
                {/* Feature Name */}
                <div
                  className={`p-4 text-sm text-gray-700 flex items-center ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {feature}
                </div>

                {/* Feature Availability */}
                {data.map((plan) => {
                  const currentFeature = plan?.features.find(
                    (f) => f.feature === feature,
                  );
                  const isAdded = currentFeature?.isAdded;

                  return (
                    <div
                      key={`${plan?.title}-${feature}`}
                      className={`flex items-center justify-center p-4 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {isAdded ? (
                        <Check
                          className="w-6 h-6 text-green-500"
                          strokeWidth={3}
                        />
                      ) : (
                        <X className="w-6 h-6 text-gray-300" strokeWidth={2} />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="text-center hidden md:block text-gray-500">
            No packages found
          </div>
        )}
        {isMobile && (
          <div className="md:hidden ">
            {packageItems?.data?.data?.length > 0 ? (
              packageItems?.data?.data?.map((plan: any, index: number) => (
                <PackageCard
                  key={index}
                  data={plan}
                  features={packageItems.features}
                  packageType={packageType}
                />
              ))
            ) : (
              <div className="text-center text-gray-500">No packages found</div>
            )}
          </div>
        )}
      </section>

      <section
        aria-labelledby="why-heading"
        className="grid items-center grid-cols-1 md:grid-cols-2 gap-10 main"
      >
        <h2 id="why-heading" className="sr-only">
          Why choose Foundrly
        </h2>

        <div className="order-2 md:order-1">
          <Image
            src="/packagesbanner.png"
            alt="Illustration representing package options and company registration"
            height={500}
            width={500}
            className="h-auto w-full max-w-xl"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="order-1 md:order-2">
          <h3 className="text-3xl font-bold mb-5 leading-tight">
            Why choose <span className="text-orange">Foundrly</span> to register
            your company?
          </h3>

          <div className="space-y-6">
            <section aria-labelledby="auth-heading">
              <h4 id="auth-heading" className="text-xl font-semibold mb-1">
                We’re Companies House-Authorised
              </h4>
              <p>
                Foundrly is authorised by Companies House, ensuring your company
                registration is handled with full accuracy and compliance.
              </p>
            </section>

            <section aria-labelledby="steps-heading">
              <h4 id="steps-heading" className="text-xl font-semibold mb-1">
                Step-by-Step UK Company Formation
              </h4>
              <p>
                From choosing the right structure to completing your
                registration, our specialists guide you at every step—simple,
                secure, and compliant.
              </p>
            </section>

            <section aria-labelledby="deals-heading">
              <h4 id="deals-heading" className="text-xl font-semibold mb-1">
                Exclusive Deals and Partner Offers
              </h4>
              <p>
                Get partner perks on banking, websites, accounting, legal, and
                marketing—everything you need to grow.
              </p>
            </section>
          </div>
        </div>
      </section>
      <ReviewsSwiper />
      <ArticlesGroup data={artciles} />
    </Fragment>
  );
};

export default ComparePackages;

// <div className="overflow-x-auto rounded-xl border border-orange/20 bg-white  md:block hidden">
// <table className="w-full border-collapse border text-sm" role="table">
//   <caption className="sr-only">
//     Feature comparison of packages
//   </caption>
//   <thead>
//     <tr className="bg-[#F9FAFB] text-gray-800 border-b border-orange/20">
//       {/* Feature header */}
//       <th
//         scope="col"
//         className={`text-left py-5 px-6 font-semibold text-gray-700 border-x border-orange/20 h-full ${featureColWidth}`}
//       >
//         Features
//       </th>

//       {/* Package headers */}
//       {data?.map((plan) => (
//         <th
//           scope="col"
//           key={plan?.title}
//           className={`text-center font-semibold uppercase text-[#233B78] border-x border-orange/20 relative h-full align-bottom ${planColWidth}`}
//         >
//           <div
//             className={`h-[3px] w-full bg-gray-300`}
//             aria-hidden="true"
//           />
//           {/* <div
//             className={`h-[3px] w-full ${
//               plan?.mostPopular ? "bg-orange" : "bg-gray-300"
//             }`}
//             aria-hidden="true"
//           /> */}
//           <header
//             className={`p-10 bg-linear-to-b from-gray-100
//             to-white from-5% text-center`}
//             // className={`p-10 bg-linear-to-b ${
//             //   plan?.mostPopular ? "from-orange-100" : "from-gray-100"
//             // } to-white from-5% text-center`}
//           >
//             <p className="sr-only">
//               {plan?.mostPopular ? "Most popular" : "Package"}
//             </p>
//             {/* <span
//               className="inline-block text-xs tracking-wide mb-2"
//               aria-hidden={!plan?.mostPopular}
//             >
//               {plan?.mostPopular ? "Most popular" : "\u00A0"}
//             </span> */}
//             <h3
//               className="text-[#265985] font-jost font-bold text-3xl mb-1 min-h-20"
//               itemProp="name"
//             >
//               {plan?.title}
//             </h3>
//             <p
//               className="text-gray-500 text-sm"
//               itemProp="description"
//             >
//               Annual fee including tax
//             </p>
//             <div
//               className="flex justify-center items-baseline gap-2 font-jost mt-2"
//               aria-label="Price"
//             >
//               <strong
//                 className="text-[#558CBB] font-bold text-4xl"
//                 itemProp="price"
//               >
//                 {plan?.price}
//               </strong>
//               <span
//                 className="text-gray-400 text-sm"
//                 itemProp="priceCurrency"
//                 content="USD"
//               >
//                 /year
//               </span>
//             </div>
//             <meta itemProp="priceCurrency" content="USD" />
//             <BuyNowButton
//               title={plan?.title}
//               type={plan?.title.toLowerCase()}
//               price={plan?.price}
//               className="mt-3"
//               aria-label={`Buy ${plan?.title} plan`}
//             />
//           </header>
//         </th>
//       ))}
//     </tr>
//   </thead>

//   <tbody>
//     {allFeatures.map((feature, index) => (
//       <tr
//         key={feature}
//         className={`border-b border-orange/20 hover:bg-gray-50 transition ${
//           index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
//         }`}
//       >
//         {/* Feature Name as row header */}

//         <th
//           scope="row"
//           className={`py-3 px-6 text-gray-700 text-sm border-x border-orange/20 text-left ${featureColWidth}`}
//           key={index}
//         >
//           {feature}
//         </th>

//         {/* Availability cells */}
//         {data.map((plan) => {
//           const currentFeature = plan?.features.find(
//             (f) => f.feature === feature
//           );
//           const isAdded = currentFeature?.isAdded;
//           return (
//             <td
//               key={`${plan?.title}-${feature}`}
//               className={`text-center py-3 px-6 border-x h-14 border-orange/20 align-middle ${planColWidth}`}
//             >
//               <span className="inline-flex items-center justify-center">
//                 <Image
//                   src={isAdded ? "/tick.png" : "/cross.png"}
//                   alt={
//                     isAdded
//                       ? `${feature} included in ${plan?.title}`
//                       : `${feature} not included in ${plan?.title}`
//                   }
//                   height={24}
//                   width={24}
//                   className="min-h-6 max-h-6 min-w-6 max-w-6 object-contain inline-block"
//                   loading="lazy"
//                 />
//               </span>
//             </td>
//           );
//         })}
//       </tr>
//     ))}
//   </tbody>
// </table>
// </div>
