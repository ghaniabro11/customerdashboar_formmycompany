"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MessageCircle, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";
import { getWhatsAppUrl } from "@/lib/utils";

const Footer = () => {
  const pathname = usePathname();
  return (
    <footer>
      {pathname === "/auth" ||
      pathname === "/register" ||
      pathname === "/cart" ||
      pathname.startsWith("/account") ? (
        <></>
      ) : (
        <div className="bg-orange max-w-4xl mx-auto md:p-20 p-10 text-center">
          <h2 className="md:text-6xl text-4xl font-bold  text-white">
            Companies House Authorised Agent
          </h2>
          <p className=" my-2  text-white">
            Accredited by Companies House and ACRA since our inception in 2002,
            we've facilitated the seamless formation of over a million
            companies, providing expert advice from beginning to end.
          </p>
          <div className=" space-x-5 mt-5 md:space-y-0 space-y-2">
            <Button className="bg-darkslate text-white  py-7 px-10 max-sm:w-full ">
              Find out More
            </Button>
            <Link href={`/compare-packages`}>
              <Button className="text-white border py-7 px-10 border-white bg-transparent hover:bg-transparent max-sm:w-full ">
                View Packages
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="bg-darkslate p-10">
        <div className="md:px-[10%]  grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
          <div>
            <div className="flex gap-2 items-center mb-2 w-fit p-4">
              <Image
                src={`/FMC-Logo-White-1.svg`}
                height={52}
                width={150}
                alt="Foundrly Footer Icon"
                className="object-contain h-13 "
              />
            </div>
            <p className="text-white">
              Your Trusted Partner for UK Company Formation
            </p>
          </div>
          
          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              Contact Us
            </h3>

            <div className="text-white mb-2 space-y-3">
              <a
                href={`mailto:info@formmycompany.uk`}
                className="text-sm font-normal flex gap-1"
              >
                <Mail size={20} /> info@formmycompany.uk
              </a>


            </div>
          </div>
          <div className="border-t my-10  border-t-white w-full col-span-full" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
