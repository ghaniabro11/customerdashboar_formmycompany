import { Template } from "@/constants/types";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Card } from "../ui/card";

const WorkspaceBannerLayout = ({
  templates,
  type,
}: {
  templates: Template[];
  type: string;
}) => {
  const data = Array.isArray(templates) ? templates : [];

  return (
    <>
      {data?.length > 0 ? (
        data?.map((template: Template, index: number) => (
          <div key={index} className="">
            {/* Image and Summary Layout */}
            {(template?.layout_type === "image_left_summary_right_rounded" ||
              template.layout_type === "image_left_summary_right_squared" ||
              template?.layout_type === "summary_left_image_right_rounded" ||
              template.layout_type === "summary_left_image_right_squared") && (
              <section className="main grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-12">
                {/* Image Left / Summary Right */}
                <div
                  className={`flex flex-col justify-center space-y-6 ${
                    template?.layout_type ===
                      "summary_left_image_right_rounded" ||
                    template.layout_type === "summary_left_image_right_squared"
                      ? "md:order-2"
                      : ""
                  }`}
                >
                  {(template?.layout_type ===
                    "image_left_summary_right_rounded" ||
                    template.layout_type ===
                      "image_left_summary_right_squared") && (
                    <div className="relative group overflow-hidden rounded-2xl  transition-shadow duration-300">
                      {/* <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" /> */}
                      <Image
                        // src={"/placeholder.svg"}
                        src={template?.image || "/placeholder.svg"}
                        alt={template?.placeholder || "Placeholder image"}
                        width={600}
                        height={600}
                        className={`w-full h-auto object-cover  ${
                          template?.layout_type ===
                          "image_left_summary_right_rounded"
                            ? "rounded-full aspect-square"
                            : "rounded-xl"
                        }`}
                      />
                    </div>
                  )}

                  {(template?.layout_type ===
                    "summary_left_image_right_rounded" ||
                    template.layout_type ===
                      "summary_left_image_right_squared") && (
                    <div className="relative group overflow-hidden rounded-2xl  transition-shadow duration-300">
                      {/* <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" /> */}
                      <Image
                        src={template?.image || "/placeholder.svg"}
                        // src={"/placeholder.svg"}
                        alt={template?.placeholder || "Placeholder image"}
                        width={600}
                        height={600}
                        className={`w-full h-auto object-cover  ${
                          template?.layout_type ===
                          "summary_left_image_right_rounded"
                            ? "rounded-full aspect-square"
                            : "rounded-xl"
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Summary Left / Image Right */}
                <div
                  className={`flex flex-col justify-center space-y-6 ${
                    template?.layout_type ===
                      "summary_left_image_right_rounded" ||
                    template.layout_type === "summary_left_image_right_squared"
                      ? "md:order-1"
                      : ""
                  }`}
                >
                  {(template?.layout_type ===
                    "image_left_summary_right_rounded" ||
                    template.layout_type ===
                      "image_left_summary_right_squared") && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                          {template?.placeholder}
                        </h3>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: template?.summary || "",
                          }}
                          className="content"
                        />
                      </div>
                    </div>
                  )}

                  {(template?.layout_type ===
                    "summary_left_image_right_rounded" ||
                    template.layout_type ===
                      "summary_left_image_right_squared") && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                          {template?.placeholder}
                        </h3>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: template?.summary || "",
                          }}
                          className="content"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Workspaces Grid Layout */}
            {template.layout_type === "items_only" && (
              <section className="main py-8 lg:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {template.workspaces?.map((item, index) => (
                    <Card
                      key={index}
                      className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full hover:-translate-y-2"
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden h-56 lg:h-64">
                        <Image
                          src={item.featured_image || "/placeholder.svg"}
                          alt={item.title || "Workspace"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Booking Type Badge */}
                        {item.booking_type === "direct" && item.price && (
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                            <span className="text-sm font-bold text-orange">
                              {item.price}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Container */}
                      <div className="p-5 lg:p-6 flex flex-col flex-1 space-y-4">
                        {/* Title */}
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange transition-colors duration-200">
                          {item?.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm lg:text-base text-gray-600 line-clamp-3 flex-1">
                          {item?.meta_description}
                        </p>

                        {/* Price & VAT (if direct booking) */}
                        {item.booking_type === "direct" &&
                          (item?.price || item?.vat) && (
                            <div className="flex flex-col gap-1 pt-2 border-t border-gray-200">
                              {item?.price && (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-orange">
                                    {item.price}
                                  </span>
                                  {item?.vat && (
                                    <span className="text-sm text-gray-500">
                                      + VAT
                                    </span>
                                  )}
                                </div>
                              )}
                              {item?.vat && item?.vat !== "Yes" && (
                                <p className="text-xs text-gray-500">
                                  VAT: {item.vat}
                                </p>
                              )}
                            </div>
                          )}

                        {/* Action Button */}
                        <Link
                          href={`/workspace/${type}/${item.slug}`}
                          className="mt-auto"
                        >
                          <Button
                            variant={
                              item.booking_type === "direct"
                                ? "default"
                                : "orange"
                            }
                            className="w-full group/btn"
                            size="lg"
                          >
                            {item.booking_type === "direct" ? (
                              <>
                                Book Now
                                <Calendar className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                              </>
                            ) : (
                              <>
                                Inquiry Now
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 min-h-[50dvh] flex items-center justify-center">No data found</div>
      )}
    </>
  );
};

export default WorkspaceBannerLayout;
