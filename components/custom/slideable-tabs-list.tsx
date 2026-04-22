"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { ReactNode, Children } from "react";

const SlideableTabsList = ({ children }: { children: ReactNode }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative w-full">
      {/* Mobile-only arrows */}
      <button
        ref={prevRef}
        type="button"
        aria-label="Previous"
        className="absolute -left-5 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 md:hidden disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        ref={nextRef}
        type="button"
        aria-label="Next"
        className="absolute -right-5 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-200 text-gray-700 md:hidden disabled:opacity-40"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <Swiper
        modules={[FreeMode, Navigation]}
        freeMode={true}
        slidesPerView="auto"
        spaceBetween={8}
        className="slideable-tabs-swiper px-10 md:px-0"
        style={{ width: "100%" }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          const nav = swiper.params.navigation as { prevEl?: HTMLElement | null; nextEl?: HTMLElement | null };
          if (nav) {
            nav.prevEl = prevRef.current;
            nav.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
      >
        {Children.map(children, (child, index) => (
          <SwiperSlide key={index} style={{ width: "auto" }}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SlideableTabsList;

