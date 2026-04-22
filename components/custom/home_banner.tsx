import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const HomeBanner = () => {
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 bg-[#393939] min-h-[40dvh] md:py-0 py-10">
      <div className="md:px-[10%] px-[5%] flex flex-col justify-center md:items-start md:text-start items-center text-center gap-8">
        <h2 className="md:text-6xl text-4xl text-white font-bold">
          Companies House Authorised Agent
        </h2>
        <div className="text-white space-y-4 ">
          <p>
            Whether you’re unsure how to start a limited company or need help
            choosing the right package, Foundrly’s experts are here to guide
            you.
          </p>
          <p>
            Get in touch today to speak with our company formation specialists —
            and get clear answers to all your questions.
          </p>
        </div>
        <Button className="w-fit px-10 py-7" variant={"orange"}>
          Get Started Now
        </Button>
      </div>
      <Image
        src={`/banner.png`}
        alt=""
        height={800}
        width={800}
        className="w-full max-h-[60dvh] h-fit hidden md:block curve object-cover "
      />
    </div>
  );
};

export default HomeBanner;
