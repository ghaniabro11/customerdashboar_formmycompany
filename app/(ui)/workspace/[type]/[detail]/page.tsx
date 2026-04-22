import { fetchWorkSpaceDetail } from "@/apis";
import WorkspaceInquiryForm from "@/components/custom/workspace-inquiry-form";
import AddToCheckoutButton from "@/components/custom/workspace/add-to-checkout-button";
import EnquireButton from "@/components/custom/workspace/enquire-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logger from "@/lib/logger/logger";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import Image from "next/image";

const WorkspaceDetail = async ({
  params,
}: {
  params: Promise<{ type: string; detail: string }>;
}) => {
  const { type, detail } = await params;
  const workspaceDetail = await fetchWorkSpaceDetail(detail);
  logger.debug(workspaceDetail, "workspaceDetail");
  const data = workspaceDetail?.data || {};
  logger.debug(data?.amenities, "datas");
  logger.info(data, "data");

  // Check authentication on server side
  // const session = await getServerSession(authOptions);

  // Get workspace ID - adjust based on your data structure
  const workspaceId = data?.id || data?.workspace_id || detail;

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[85dvh] w-full">
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/80 z-10" />
        <Image
          src={data?.featured_image || "/placeholder.svg"}
          alt={data?.title || "Workspace"}
          width={1920}
          height={1080}
          className="w-full h-full object-cover absolute inset-0"
          priority
          // onError={handleImageError}
        />

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 px-5 md:px-0 flex items-center main">
          <div className="w-full">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              {/* Left Content */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                    {data?.title}
                  </h1>
                  {data?.location && (
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{data?.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </Button>
                  {data?.booking_type === "direct" ? (
                    <AddToCheckoutButton
                      workspaceId={workspaceId}
                      workspaceData={data}
                      type={type}
                      detail={detail}
                    />
                  ) : (
                    <EnquireButton
                      variant="orange"
                      size="lg"
                      className="text-base px-8 py-6"
                    />
                  )}
                </div>
              </div>

              {/* Right Card - Amenities */}
              <Card className="w-full max-w-[400px] bg-white/95 backdrop-blur-md shadow-2xl border-0 gap-0">
                <CardHeader className="">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2 pb-0 mb-0">
                    <CheckCircle2 className="w-6 h-6 text-orange" />
                    Amenities
                  </CardTitle>
                </CardHeader>
                <CardContent className=" overflow-y-auto pr-2">
                  {data?.amenities &&
                  Array.isArray(data?.amenities) &&
                  data?.amenities?.length > 0 ? (
                    data?.amenities.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="shrink-0 w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                          {item?.icon ? (
                            <Image
                              src={item?.icon}
                              alt={item?.name || "Amenity"}
                              width={20}
                              height={20}
                              className="object-contain"
                              // onError={handleImageError}
                            />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-orange" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {item?.name}
                            {item?.value && item?.value !== "Yes" && (
                              <span className="text-gray-600 ml-1">
                                ({item?.value})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-4">
                      No amenities listed
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="p-5 md:max-w-[70vw] mx-auto">
        {/* Description Section */}
        {data?.description && (
          <section className="mb-12 lg:mb-16">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  About This Workspace
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-full overflow-auto">
                <div
                  className=""
                  dangerouslySetInnerHTML={{ __html: data?.description }}
                />
              </CardContent>
            </Card>
          </section>
        )}

        {/* Gallery Section */}
        {data?.other_images &&
          Array.isArray(data?.other_images) &&
          data?.other_images.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.other_images?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 aspect-square"
                  >
                    <Image
                      src={item || "/placeholder.svg"}
                      alt={`${data?.title || "Workspace"} - Image ${index + 1}`}
                      width={800}
                      height={800}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      // onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Call to Action Section */}
        <section className="mt-12 lg:mt-16">
          <Card className="bg-linear-to-r from-orange to-orange/90 text-white shadow-xl border-0">
            <CardContent className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                    Ready to Get Started?
                  </h3>
                  <p className="text-white/90 text-lg">
                    Contact us today to schedule a tour or get more information
                    about this workspace.
                  </p>
                </div>
                <div className="flex  gap-4">
                  <Button
                    variant="outline"
                    size="default"
                    className="bg-white text-orange hover:bg-white/90 border-0 px-8"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </Button>
                  <EnquireButton
                    variant="secondary"
                    size="default"
                    className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 px-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        {/* Inquiry Form Section */}
        {data?.booking_type !== "direct" && (
          <section id="workspace-inquiry-form" className="mt-12 lg:mt-16 scroll-mt-24">
            <WorkspaceInquiryForm
              workspaceId={workspaceId}
              workspaceTitle={data?.title}
            />
          </section>
        )}
      </div>
    </>
  );
};

export default WorkspaceDetail;
