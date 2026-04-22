import Image from "next/image";
import React from "react";

const steps = [
  {
    title: "Choose a Company Name",
    description: "Pick a unique name for your company.",
    imageSrc: "/dummy/steps.png",
  },
  {
    title: "Pick Your Package",
    description: "Complete the necessary paperwork to register your company.",
    imageSrc: "/dummy/steps.png",
  },
  {
    title: "Continue To Checkout",
    description: "Use our registered office address to protect your privacy.",
    imageSrc: "/dummy/steps.png",
  },
  {
    title: "Complete your Company Details",
    description: "Make the final payment to complete the registration.",
    imageSrc: "/dummy/steps.png",
  },
];

const HomeSteps = () => {
  return (
    <section className="main text-center">
      <h2 className="font-bold text-3xl mb-2">
        Register your new company in four simple steps
      </h2>
      <p className="max-w-[65ch] mx-auto mb-10">
        Protect your privacy by using our official registered office address,
        keeping your personal address off the public record.
      </p>
      <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-0 gap-5 min-h-[280px] mt-10  items-center justify-center">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center w-full  h-full ">
            <div className="h-24 -mb-10 mx-auto w-24 rounded-full bg-orange/50 flex justify-center shrink-0">
              <div className="h-20 w-20 rounded-full bg-orange mt-2.5 flex justify-center items-center text-white text-2xl font-semibold">
                {index + 1}
              </div>
            </div>

            <div className="bg-white/50 mx-auto shadow-[0px_3px_8px_1px_rgba(0,0,0,0.1)] z-10 relative rounded-2xl md:p-14 p-10 w-full md:w-fit md:px-16 shrink-0">
              <div className="relative">
                <svg
                  className="absolute -bottom-3 -left-4"
                  width="69"
                  height="66"
                  viewBox="0 0 69 66"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="14"
                    width="55"
                    height="55"
                    fill="url(#pattern0_0_1)"
                  />
                  <path
                    d="M5.14111 27L8.3572 54.4313L38.2125 65.6328L-2.77507e-05 60.8209L5.14111 27Z"
                    fill="#F37A1F"
                    fillOpacity="0.55"
                  />
                  <defs>
                    <pattern
                      id="pattern0_0_1"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use
                        xlinkHref="#image0_0_1"
                        transform="scale(0.00390625)"
                      />
                    </pattern>
                  </defs>
                </svg>
                <Image
                  src={step.imageSrc}
                  width={65}
                  height={65}
                  alt=""
                  priority
                  className="min-h-14 min-w-14"
                />
              </div>
            </div>

            <h3 className="text-xl text-center font-semibold mt-2 w-full">
              {step.title}
            </h3>
            <p className="text-sm mt-1 text-center w-full">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeSteps;
