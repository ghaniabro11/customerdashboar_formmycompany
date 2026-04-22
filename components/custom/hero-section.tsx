import Image from "next/image";
import React from "react";

const HeroSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <div className="h-24" /> */}
      <div className="relative h-[250px] ">
        <Image
          src={`/herobg.png`}
          alt="Hero Section"
          fill
          className="w-full h-full z-1"
        />
        <div className="z-2 relative">{children}</div>
      </div>
    </>
  );
};

export default HeroSection;
