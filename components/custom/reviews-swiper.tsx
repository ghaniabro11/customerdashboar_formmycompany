"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  A11y,
  Autoplay,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";
import Image from "next/image";

const ReviewsSwiper = () => {
  return (
    <Swiper
      modules={[A11y, Pagination, Navigation, Keyboard, Autoplay]}
      pagination={{ clickable: true }}
      keyboard={{ enabled: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      a11y={{
        prevSlideMessage: "Previous review",
        nextSlideMessage: "Next review",
        firstSlideMessage: "This is the first review",
        lastSlideMessage: "This is the last review",
      }}
      aria-roledescription="carousel"
      aria-label="Customer reviews"
    >
      <SwiperSlide aria-label="Review from John Smith">
        <article className="bg-darkslate/10 rounded-4xl h-[50dvh] max-w-4xl md:mx-auto p-10 flex flex-col justify-between">
          {/* Decorative quote mark */}
          <svg
            width="44"
            height="33"
            viewBox="0 0 44 33"
            aria-hidden="true"
            // className="mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.2344 2.53217L17.3317 0.187949C6.52435 6.36266 1.49118 13.3365 0.196614 21.126C-0.76956 27.5599 1.81559 32.6124 8.26145 32.5606C12.8414 32.5239 17.2273 29.4447 18.2043 24.3636C19.005 18.4383 15.5839 14.9145 11.3364 14.103C12.9865 8.34008 20.0647 2.53353 20.2344 2.53217ZM34.912 13.5755C36.7331 7.98032 43.4734 2.34558 43.643 2.34422L40.7403 0C29.933 6.1747 24.8998 13.1486 23.6053 20.938C22.6391 27.3719 25.2243 32.4244 31.6701 32.3727C36.2501 32.3359 40.636 29.2567 41.4434 24.177C42.4136 18.2504 39.1595 14.387 34.912 13.5755Z"
              fill="url(#paint0_radial)"
            />
            <defs>
              <radialGradient
                id="paint0_radial"
                cx="0"
                cy="0"
                r="1"
                gradientTransform="matrix(15.236 26.6404 -36.2121 11.365 12.3745 5.76487)"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFA800" />
                <stop offset="1" stopColor="#FF4D00" />
              </radialGradient>
            </defs>
          </svg>

          <blockquote className="text-center mt-3">
            <p className="leading-relaxed">
              Foundrly made the entire company registration process so easy and
              stress-free. As a first-time founder, I had so many questions, but
              their team was always there to guide me. Everything was done
              quickly, and I had my official documents within hours. I can’t
              recommend them enough for anyone starting a business.
            </p>
            <footer className="mt-6">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="p-1 bg-linear-to-b from-orange-300 to-orange rounded-full w-fit">
                  <Image
                    src="/john.png"
                    alt="Portrait of John Smith"
                    width={60}
                    height={60}
                    className="rounded-full h-20 w-20 object-cover"
                    priority
                  />
                </div>
                <cite className="not-italic font-semibold">John Smith</cite>
                <p className="text-sm text-gray-600">
                  Founder, Awesomeux Technology
                </p>
              </div>
            </footer>
          </blockquote>
        </article>
      </SwiperSlide>
    </Swiper>
  );
};

export default ReviewsSwiper;
