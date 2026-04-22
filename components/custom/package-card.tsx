import { PackagesHome } from "@/constants/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { BuyNowButton } from "./buynow";
import { DEFAULT_CURRENCY_UNIT } from "@/constants/url";

const PackageCard = ({
  data,
  features, 
  packageType,
}: {
  data: PackagesHome;
  features: any;
  packageType: string;
  }) => {
  return (
    <article
      className="relative"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Most Popular Badge */}
      {false && (
        <div
          className="bg-orange px-10 text-white w-fit absolute -top-4 right-16 py-1 rounded-xl"
          aria-label="Most popular plan"
        >
          Most Popular
        </div>
      )}

      {/* Decorative Top Border */}
      <div
        className={`h-[3px] w-full ${false ? "bg-orange" : "bg-gray-300"}`}
        aria-hidden="true"
      ></div>

      {/* Header Section */}
      <header
        className={`pt-10 px-1 bg-linear-to-b ${
          false ? "from-orange-100" : "from-gray-100"
        } to-white from-5% text-center`}
      >
        <h2
          className="text-[#265985] font-jost font-bold text-3xl mb-1"
          itemProp="name"
        >
          {data?.title}
        </h2>
        <p className="text-gray-500 text-sm" itemProp="description">
          Annual fee including tax
        </p>
        <div className="flex justify-center items-baseline gap-2 font-jost mt-2">
          <strong
            className="text-[#558CBB] font-bold text-4xl"
            itemProp="price"
          >
            {DEFAULT_CURRENCY_UNIT}
            {data?.price}
          </strong>
          <span
            className="text-gray-400 text-sm"
            itemProp="priceCurrency"
            content="USD"
          >
            {data?.duration ? `/${data.duration}` : ""}
          </span>
        </div>
        <meta itemProp="priceCurrency" content="USD" />
      </header>

      {/* Features Section */}
      <section className="px-10 py-6">
        <h3 className="sr-only">Plan Features</h3>
        <ul className="space-y-2 mb-10" itemProp="featureList">
          {features?.map((item: any, index: number) => (
            <li key={index} className="flex items-center text-nowrap gap-2">
              {/* <Tick aria-hidden="true" /> */}
              <span className="inline-flex items-center justify-center">
                <Image
                  // src={item.isAdded ? "/tick.png" : "/cross.png"}
                  src={
                    data.package_features.some(
                      (feature: any) => feature === item.id
                    )
                      ? "/tick.png"
                      : "/cross.png"
                  } // alt={
                  //   item.isAdded
                  //     ? `${item.feature} included in ${data?.plan_name}`
                  //     : `${item.feature} not included in ${data?.plan_name}`
                  // }
                  alt={`${item.title} included in ${data?.title}`}
                  height={24}
                  width={24}
                  className="min-h-6 max-h-6 min-w-6 max-w-6  object-contain inline-block"
                  loading="lazy"
                />
              </span>
              <span className="truncate">{item?.title}</span>
            </li>
          ))}
        </ul>

        {/* CTA Section */}
        <div className="space-y-3 text-center">
          <BuyNowButton
            title={data?.title}
            type={"package"}
            price={Number(data?.price)}
            className="w-full"
            discount={Number(data?.discount)}
            vat={Number(data?.vat)}
          />

          <Link
            href={`/packages/${packageType}/${data?.slug}`}
            className="border-b border-b-black inline-block "
            title={`Read more about ${data?.title} plan`}
          >
            Read More
          </Link>
        </div>
      </section>
    </article>
  );
};

export default PackageCard;
