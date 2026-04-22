import { DEFAULT_CURRENCY_UNIT } from "@/constants/url";
import Image from "next/image";
import { BuyNowButton } from "./buynow";

export type AddonItem = {
  id: number;
  title: string;
  summary: string;
  price: string;
  discount: string;
  vat: string;
  features: { id: number }[];
};

export type FeatureItem = {
  id: number;
  title: string;
};

const primaryColor = "#265985";
const secondaryColor = "#558CBB";

/** Desktop: comparison table. Mobile: card stack (package-card-home style). */
export function ServiceAddons({
  addons,
  features,
  serviceId,
}: {
  addons: AddonItem[];
  features: FeatureItem[];
  serviceId: number;
}) {
  if (!addons?.length) return null;

  return (
    <>
      {/* Desktop: table (hidden on mobile) */}
      <div className="overflow-x-auto px-6 py-4 col-span-full hidden md:block">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left font-medium text-gray-600">
                Feature / Addon
              </th>
              {addons.map((addon) => (
                <th
                  key={addon.id}
                  className="py-3 px-6 text-center font-medium text-gray-600"
                >
                  <div className="text-lg font-semibold text-gray-700">
                    {addon.title}
                  </div>
                  <div className="text-sm text-gray-500">{addon.summary}</div>
                  <div className="text-sm text-gray-500">
                    {addon.price ? DEFAULT_CURRENCY_UNIT : ""}
                    {addon.price}
                  </div>
                  <BuyNowButton
                    title={addon.title}
                    type="addon"
                    price={Number(addon.price)}
                    meta={{ service_id: serviceId }}
                    discount={addon.discount ? Number(addon.discount) : 0}
                    vat={addon.vat ? Number(addon.vat) : 0}
                    checkoutId={addon.id || 0}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.id} className="hover:bg-gray-50">
                <td className="py-3 px-6 border-b text-gray-700">
                  {feature.title}
                </td>
                {addons.map((addon) => (
                  <td
                    key={addon.title}
                    className="py-3 px-6 border-b text-center"
                  >
                    {addon.features?.some((item) => item?.id === feature?.id) ? (
                      <span className="text-green-500">
                        <Image
                          src="/tick.png"
                          alt="tick"
                          width={24}
                          height={24}
                          className="min-h-6 max-h-6 min-w-6 max-w-6 object-contain inline-block"
                        />
                      </span>
                    ) : (
                      <span className="text-red-500">
                        <Image
                          src="/cross.png"
                          alt="cross"
                          width={24}
                          height={24}
                          className="min-h-6 max-h-6 min-w-6 max-w-6 object-contain inline-block"
                        />
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: addon cards (visible only on mobile, package-card-home style) */}
      <div className="col-span-full md:hidden px-4 py-4 space-y-6">
        {addons.map((addon) => (
          <AddonCard
            key={addon.id}
            addon={addon}
            features={features}
            serviceId={serviceId}
          />
        ))}
      </div>
    </>
  );
}

function AddonCard({
  addon,
  features,
  serviceId,
}: {
  addon: AddonItem;
  features: FeatureItem[];
  serviceId: number;
}) {
  return (
    <article
      className="relative rounded-lg overflow-hidden shadow-md bg-white"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div
        className="w-full h-1"
        aria-hidden="true"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="py-6 px-5 text-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${secondaryColor}08 0%, white 100%)`,
        }}
      >
        <header>
          <h2
            className="text-[#265985] font-jost font-bold text-2xl mb-1"
            itemProp="name"
          >
            {addon.title}
          </h2>
          {addon.summary && (
            <p className="text-gray-500 text-sm" itemProp="description">
              {addon.summary}
            </p>
          )}
          <div className="flex justify-center items-baseline gap-2 font-jost mt-2">
            <strong
              className="text-[#558CBB] font-bold text-3xl"
              itemProp="price"
            >
              {addon.price ? DEFAULT_CURRENCY_UNIT : ""}
              {addon.price}
            </strong>
          </div>
          <meta itemProp="priceCurrency" content="GBP" />
        </header>

        {/* Features list (tick/cross like package-card-home) */}
        <section className="px-4 py-4 text-left">
          <h3 className="sr-only">Addon features</h3>
          <ul className="space-y-2 mb-6" itemProp="featureList">
            {features.map((feature) => {
              const isIncluded = addon.features?.some(
                (f) => f?.id === feature?.id
              );
              return (
                <li
                  key={feature.id}
                  className="flex items-center text-nowrap gap-2"
                >
                  <span className="inline-flex items-center justify-center shrink-0">
                    <Image
                      src={isIncluded ? "/tick.png" : "/cross.png"}
                      alt={
                        isIncluded
                          ? `${feature.title} included`
                          : `${feature.title} not included`
                      }
                      height={24}
                      width={24}
                      className="min-h-6 max-h-6 min-w-6 max-w-6 object-contain inline-block"
                      loading="lazy"
                    />
                  </span>
                  <span
                    className="truncate text-gray-700"
                    aria-label={feature.title}
                    title={feature.title}
                  >
                    {feature.title}
                  </span>
                </li>
              );
            })}
          </ul>

          <BuyNowButton
            aria-label={`Buy ${addon.title} addon`}
            title={addon.title}
            type="addon"
            className="w-full"
            price={Number(addon.price)}
            meta={{ service_id: serviceId }}
            discount={addon.discount ? Number(addon.discount) : 0}
            vat={addon.vat ? Number(addon.vat) : 0}
            checkoutId={addon.id || 0}
          />
        </section>
      </div>
    </article>
  );
}
