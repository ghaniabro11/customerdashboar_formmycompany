"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ArrowIcon = ({ direction }: { direction: "prev" | "next" }) => (
  <svg
    className="h-5 w-5 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {direction === "prev" ? (
      <path d="M15 19l-7-7 7-7" />
    ) : (
      <path d="M9 5l7 7-7 7" />
    )}
  </svg>
);

const WorkSpaceTypesNavigation = ({
  types,
}: {
  types: {
    icon: string;
    name: string;
    slug: string;
  }[];
}) => {
  const pathname = usePathname();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  console.log(scrollTop, "scrollTop");
  return (
    <nav
      className={cn(
        "sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/80",
        scrollTop > 80 ? "pt-[10dvh]" : "pt-0",
      )}
    >
      <div className=" mx-auto px-5">
        <div className="py-4 px-2 sm:px-4">
          {Array.isArray(types) && types.length > 0 ? (
            <div className="relative flex items-center gap-2">
              {/* Prev arrow */}
              <button
                ref={prevRef}
                type="button"
                aria-label="Previous workspace types"
                className={cn(
                  "workspace-types-prev z-10 flex absolute h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  "bg-white border-2 border-gray-200 text-gray-600 shadow-md",
                  "hover:border-orange/60 hover:bg-orange/10 hover:text-orange hover:shadow-lg hover:shadow-orange/10",
                  "transition-all duration-200 active:scale-95",
                )}
              >
                <ArrowIcon direction="prev" />
              </button>

              <Swiper
                modules={[FreeMode, Navigation]}
                freeMode={true}
                slidesPerView="auto"
                spaceBetween={12}
                className="workspace-types-swiper flex-1 min-w-0"
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onInit={(swiper) => {
                  const nav = swiper.params.navigation as {
                    prevEl?: HTMLElement | null;
                    nextEl?: HTMLElement | null;
                  };
                  if (nav) {
                    nav.prevEl = prevRef.current;
                    nav.nextEl = nextRef.current;
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }
                }}
              >
                {types?.map(
                  (
                    type: { icon: string; name: string; slug: string },
                    index: number,
                  ) => {
                    const linkHref =
                      index === 0
                        ? "/workspace"
                        : `/workspace/${decodeURIComponent(type?.slug)}`;

                    const isActive =
                      (index === 0 &&
                        decodeURIComponent(pathname) === "/workspace") ||
                      decodeURIComponent(pathname) ===
                        `/workspace/${decodeURIComponent(type?.slug)}` ||
                      (decodeURIComponent(pathname).startsWith(
                        `/workspace/${decodeURIComponent(type?.slug)}/`,
                      ) &&
                        decodeURIComponent(pathname) !== "/workspace");

                    return (
                      <SwiperSlide key={index} style={{ width: "auto" }}>
                        <Link
                          href={linkHref}
                          className={cn(
                            "group relative flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl text-center transition-all duration-300 min-w-fit",
                            "border-2 backdrop-blur-sm",
                            isActive
                              ? "bg-linear-to-br from-orange/20 to-orange/10 border-orange shadow-lg shadow-orange/20 scale-[1.02]"
                              : "bg-white border-gray-200 hover:border-orange/50 hover:bg-orange/5 hover:shadow-md hover:scale-[1.01]",
                          )}
                        >
                          {isActive && (
                            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-orange rounded-full" />
                          )}

                          <span
                            className={cn(
                              "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 overflow-hidden",
                              isActive
                                ? "bg-orange/20 ring-2 ring-orange/40 shadow-md"
                                : "bg-gray-100 group-hover:bg-orange/10",
                            )}
                          >
                            <Image
                              src={type?.icon || "/placeholder.svg"}
                              alt={type?.name || "Workspace type"}
                              width={24}
                              height={24}
                              className={cn(
                                "object-contain w-6 h-6 transition-transform duration-300",
                                isActive && "scale-110",
                              )}
                            />
                          </span>

                          <span
                            className={cn(
                              "text-xs font-medium whitespace-nowrap transition-colors duration-300",
                              isActive
                                ? "text-orange font-semibold"
                                : "text-gray-700 group-hover:text-orange",
                            )}
                          >
                            {type?.name}
                          </span>
                        </Link>
                      </SwiperSlide>
                    );
                  },
                )}
              </Swiper>

              {/* Next arrow */}
              <button
                ref={nextRef}
                type="button"
                aria-label="Next workspace types"
                className={cn(
                  "workspace-types-next absolute right-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  "bg-white border-2 border-gray-200 text-gray-600 shadow-md",
                  "hover:border-orange/60 hover:bg-orange/10 hover:text-orange hover:shadow-lg hover:shadow-orange/10",
                  "transition-all duration-200 active:scale-95",
                )}
              >
                <ArrowIcon direction="next" />
              </button>
            </div>
          ) : (
            <div className="text-gray-500 py-4 text-center text-sm">
              No workspace types available
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default WorkSpaceTypesNavigation;
