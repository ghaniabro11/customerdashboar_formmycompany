"use client";
import HeroSection from "@/components/custom/hero-section";
import PackageNavigation from "@/components/custom/package-navigation";
import Image from "next/image";
import { Fragment } from "react";

import ArticlesGroup from "@/components/custom/articles-group";
import { Article } from "@/constants/types";
import logger from "@/lib/logger/logger";
import "swiper/css";

import { BuyNowButton } from "./buynow";
import ReviewsSwiper from "./reviews-swiper";
import { DEFAULT_CURRENCY_UNIT } from "@/constants/url";
import Link from "next/link";

export interface PackageItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  price: string;
  discount: string;
  vat: string;
  status: string;
  duration: any;
}

const ModuleLayoutComparePackages = ({
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
  logger.info(packageItems, "package");
  // const data = transformData(packageItems);
  // logger.info(data, "datya");

  // Build a unique, ordered feature list across all packages (not just the first one)

  return (
    <Fragment>
      {/* JSON-LD */}
      {/* <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      /> */}
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

      <section className="main grid md:grid-cols-2 grid-cols-1 gap-10">
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: packageItems?.package_type_description || "<p></p>",
          }}
        />
        <div className="space-y-5">
          {packageItems?.data?.data?.map((item: PackageItem, index: number) => (
            <div
              key={index}
              className="border rounded-md p-5 border-b-4 border-b-darkslate"
            >
              <h2 className="text-2xl font-semibold">{item?.title}</h2>

              <p className="mb-6">{item?.summary}</p>
              <div className="flex items-center justify-between">
                <div className="text-lg">
                  {DEFAULT_CURRENCY_UNIT}
                  {item?.price}
                  <Link
                    href={`/packages/${packageType}/${item?.slug}`}
                    className="text-sm text-gray-500 block mt-3"
                  >
                    More Info
                  </Link>
                </div>
                <BuyNowButton
                  title={item?.title}
                  type={"package"}
                  price={Number(item?.price)}
                  discount={Number(item?.discount)}
                  vat={Number(item?.vat)}
                  checkoutId={item?.id || 0}
                />
              </div>
            </div>
          ))}
        </div>
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

export default ModuleLayoutComparePackages;
