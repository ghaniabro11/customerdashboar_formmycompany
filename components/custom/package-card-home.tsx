import { PackagesHome } from "@/constants/types";
import { DEFAULT_CURRENCY_UNIT } from "@/constants/url";
import logger from "@/lib/logger/logger";
import Image from "next/image";
import { BuyNowButton } from "./buynow";
import Link from "next/link";

const PackageCardHome = ({ data }: { data: PackagesHome }) => {
  logger.debug(data, "data for package card home");
  const secondaryColor = data?.secondary_color || "#f37a1f";
  return (
    <article
      className="relative"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div
        className={` w-full `}
        aria-hidden="true"
        style={{ backgroundColor: data?.primary_color || "#d1d5dc" }}
      >
        {data?.package_label && (
          <div
            className={` px-10  text-white absolute py-1 w-full`}
            aria-label="Most popular plan"
            style={{ backgroundColor: data?.primary_color || "#d1d5dc" }}
          >
            {data?.package_label}
          </div>
        )}
      </div>
      <div
        className="py-10 px-1 bg-linear-to-b  to-white text-center"
        style={{
          backgroundImage: secondaryColor
            ? `linear-gradient(to bottom, ${secondaryColor} 0%, white 100%)`
            : "linear-gradient(to bottom, rgb(209, 213, 220) 0%, white 100%)",
        }}
      >
        <header>
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
              {data.duration ? `/${data.duration}` : ""}
            </span>
          </div>
          <meta itemProp="priceCurrency" content="USD" />
        </header>

        {/* Features Section */}
        <section className="px-10 py-6 hf">
          <h3 className="sr-only">Plan Features</h3>
          <ul className="space-y-2 mb-10" itemProp="featureList">
            {data?.package_features?.map((item, index) => (
              <li key={index} className="flex items-center text-nowrap gap-2">
                {/* <Tick aria-hidden="true" /> */}
                <span className="inline-flex items-center justify-center">
                  <Image
                    // src={item.isAdded ? "/tick.png" : "/cross.png"}
                    src={"/tick.png"}
                    // alt={
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
                <span
                  className="truncate"
                  aria-label={item?.title}
                  title={item?.title}
                >
                  {item?.title}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA Section */}
          <div className="space-y-3">
            {/* <Button
            variant="orange"
            className="w-full"
            aria-label={`Buy ${data?.title} plan`}
          >
            Buy Now
          </Button> */}
            <BuyNowButton
              aria-label={`Buy ${data?.title} plan`}
              title={data?.title}
              type={"package"}
              className="w-full"
              price={Number(data?.price)}
              discount={Number(data?.discount)}
              vat={Number(data?.vat)}
              checkoutId={data?.id || 0}
            />

            <Link
              href={`/packages/${data?.package_type_slug}/${data?.slug}`}
              className="border-b border-b-black inline-block"
              title={`Read more about ${data?.title} plan`}
            >
              Read More
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
};

export default PackageCardHome;
