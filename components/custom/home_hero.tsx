"use client";
import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Search } from "lucide-react";
import CompanySearchForm from "./company-search-form";

const HomeHero = () => {
  const carouselItems = [
    {
      type: "stat",
      value: "15,000+",
      label: "Companies Registered",
    },
    {
      type: "image",
      src: "/google.png",
      alt: "Google Icon",
    },
    {
      type: "stat",
      value: "24/7",
      label: "Expert Support",
    },
  ];

  return (
    <>
      <section
        role="region"
        aria-label="Hero banner"
        aria-labelledby="hero-heading"
        className="relative min-h-[80dvh] bg-cover bg-center w-full"
        style={{ backgroundImage: "url('/hero.png')" }}
      >
        <div className="bg-darkslate/70 z-20 absolute inset-0 h-full w-full" />

        <div className="relative z-20 gap-3 sm:gap-4 flex flex-col justify-center items-center md:min-h-[70dvh] min-h-[75dvh] w-full px-4 sm:px-5 text-center">
          <h1 id="hero-heading" className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2">
            Register Your Company with Foundrly Today
          </h1>
          <p className="text-white md:text-xl text-lg font-medium">
            Start your business. Fast, simple, and fully online.
          </p>
          <p className="max-w-[60ch] text-center text-white md:text-lg text-sm">
            Foundrly makes company registration effortless — from forming your
            business to getting official documents, all in minutes.
          </p>
          <div className="md:min-w-xl md:w-fit w-full">
            <CompanySearchForm />
          </div>
        </div>
        {/* Curved Background Section */}
        <div className="absolute bottom-0 w-full overflow-hidden z-20 md:h-[30dvh]">
          <svg
            className="absolute bottom-0 left-0 w-full h-full z-0"
            viewBox="0 0 1153 180"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 20C0 20 250 50 576 50C902 50 1153 20 1153 20V180H0V20Z"
              fill="#393939"
            />
          </svg>

          {/* Content - Static on mobile, Swiper Carousel on md+ */}
          <div className="relative z-10 max-w-[80%] md:mt-20 mt-10 md:mb-0 mb-5 mx-auto">
            {/* Mobile: Horizontal Scroll */}
            <div className="md:flex hidden justify-between items-center text-white gap-6 overflow-x-auto scrollbar-hide px-4">
              {/* 1️⃣ Stat */}
              <figure className="text-center min-w-[150px] shrink-0">
                <p className="text-xl font-bold">15,000+</p>
                <figcaption className="text-sm">
                  Companies Registered
                </figcaption>
              </figure>

              {/* Divider */}
              <svg
                width="11"
                height="30"
                viewBox="0 0 11 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <rect
                  x="0.390625"
                  width="10.1487"
                  height="29.7931"
                  rx="5.07433"
                  fill="#D9D9D9"
                />
              </svg>

              {/* Google */}
              <div className="shrink-0">
                <Image
                  src="/google.png"
                  alt="Google Icon"
                  height={80}
                  width={160}
                  loading="lazy"
                  style={{ width: "auto", height: "auto" }}
                  className="object-contain"
                />
              </div>

              {/* Divider */}
              <svg
                width="11"
                height="30"
                viewBox="0 0 11 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <rect
                  x="0.390625"
                  width="10.1487"
                  height="29.7931"
                  rx="5.07433"
                  fill="#D9D9D9"
                />
              </svg>

              <figure className="text-center min-w-[150px] shrink-0">
                <p className="text-xl font-bold">24/7</p>
                <figcaption className="text-sm">Expert Support</figcaption>
              </figure>
            </div>

            <div className="md:hidden ">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet !bg-white/50",
                  bulletActiveClass:
                    "swiper-pagination-bullet-active !bg-white !w-6",
                }}
                initialSlide={1}
                loop={true}
                className="hero-swiper"
              >
                {carouselItems.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="flex items-center justify-center h-24 text-white">
                      {item.type === "stat" ? (
                        <div className="text-center">
                          <p className="text-2xl font-bold">{item.value}</p>
                          <p className="text-base">{item.label}</p>
                        </div>
                      ) : (
                        <div>
                          <Image
                            src={item?.src || "/placeholder.svg"}
                            alt={item?.alt || "/placeholder.svg"}
                            height={80}
                            width={160}
                            style={{ width: "auto", height: "auto" }}
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          width: 24px !important;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default HomeHero;
