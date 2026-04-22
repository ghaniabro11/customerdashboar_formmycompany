import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Service = () => {
  return (
    <section
      className="grid md:grid-cols-2 grid-cols-1 p-10"
      aria-labelledby="registered-office-title"
    >
      <article
        className="bg-[#F6F6F6] shadow-[2px_6px_8px_-1px_rgba(0,0,0,0.1)] rounded-[3.5rem] min-h-[108px] w-full relative"
        itemScope
        itemType="https://schema.org/Service"
      >
        {/* Service Header */}
        <header className="absolute right-0 md:-top-6 -top-3 w-[calc(100%-20%)]">
          <svg
            className="w-full"
            viewBox="0 0 324 76"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="presentation"
            aria-hidden="true"
          >
            <path
              d="M0 14H294C310.569 14 324 27.4315 324 44V76H30C13.4315 76 0 62.5685 0 46V14Z"
              fill="white"
            />
            <path
              d="M12.0855 7.88131L21.7502 0.610397L21.701 15.2204L12.0855 7.88131Z"
              fill="#A64D0A"
            />
            <path
              d="M7.58122 10.7723L18.0382 3.61188L17.9897 18.0065L7.58122 10.7723Z"
              fill="#A64D0A"
            />
            <path
              d="M4 11H294C310.569 11 324 24.4315 324 41V72H34C17.4315 72 4 58.5685 4 42V11Z"
              fill="#F6F6F6"
            />
            <path
              d="M22 1H78V40C78 51.0457 69.0457 60 58 60H42C30.9543 60 22 51.0457 22 40V1Z"
              fill="#F37A1F"
            />
          </svg>

          <div
            className="text-white absolute top-1/4 md:text-3xl text-lg font-semibold left-[14%]"
            aria-hidden="true"
          >
            1
          </div>
          <h3
            id="registered-office-title"
            className="px-5 absolute md:top-1/5 top-0 md:left-[30%] left-[20%] text-[#265985] py-5 md:text-2xl text-lg font-semibold"
            itemProp="name"
          >
            Registered Office
          </h3>
        </header>

        {/* Spacer to maintain layout */}
        <div className="md:h-[108px] h-[50px]" aria-hidden="true"></div>

        {/* Service Content */}
        <div className="p-5 md:py-10" itemProp="description">
          <p className="md:text-lg text-sm text-gray-700 leading-relaxed">
            Protect your privacy by using our official registered office address
            service — keeping your personal address off public records while
            maintaining full Companies House compliance. Our UK registered
            office solution helps business owners maintain professionalism,
            safeguard identity, and meet all legal obligations seamlessly.
          </p>

          <div className="py-3 flex justify-end">
            <Link
              href="/registered-office"
              className="flex items-center gap-2 text-[#265985] hover:underline"
              aria-label="Learn more about Registered Office Address Service"
            >
              <span>Learn More</span>
              <ArrowRight size={18} className="mt-0.5" />
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
};

export default Service;
