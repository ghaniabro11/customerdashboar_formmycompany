"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const PackageNavigation = ({
  package_types,
}: {
  package_types: {
    title: string;
    slug: string;
    type: "modules" | "variants";
  }[];
}) => {
  const pathname = usePathname();
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative main-x">
      {/* Mobile-only arrows */}
      <button
        ref={prevRef}
        type="button"
        aria-label="Previous"
        className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 md:hidden disabled:opacity-40"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        ref={nextRef}
        type="button"
        aria-label="Next"
        className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 md:hidden disabled:opacity-40"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <Swiper
        modules={[FreeMode, Navigation]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={16}
        className="package-navigation-swiper px-10 md:px-0"
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
        {package_types?.map((item, index) => {
          // If it's the first link, point to /compare-packages
          const linkHref =
            index === 0 ? "/compare-packages" : `/packages/${item?.slug}`;

          // Check active state
          const isActive =
            (index === 0 && pathname === "/compare-packages") ||
            decodeURIComponent(pathname) ===
              `/packages/${decodeURIComponent(item?.slug)}`;

          return (
            <SwiperSlide key={index} style={{ width: "auto" }}>
              <Link
                href={linkHref}
                className={`border bg-gray-200 text-nowrap p-2 md:px-5 rounded-lg md:text-base text-sm text-center transition-colors block ${
                  isActive
                    ? "bg-orange/50 border-orange/50"
                    : "border-gray-400 hover:border-orange/30"
                }`}
              >
                {item?.title}
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default PackageNavigation;
