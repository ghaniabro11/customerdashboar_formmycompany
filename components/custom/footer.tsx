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
                src={`/logo.png`}
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
          {[
            {
              title: "Start",
              links: [
                { name: "About My Company Registration", href: "/about-my-company-registration" },
                { name: "Contact Us", href: "/contact-us" },
                { name: "How It Works", href: "/how-it-works-company-registration-uk" },
                { name: "FAQs", href: "/company-registration-faqs" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms & Conditions", href: "/terms-conditions" },
                { name: "Registered & Compliance", href: "/compliance-company-registration" },  
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-white text-xl font-semibold mb-5">
                {section.title}
              </h3>
              {section.links.map((link) => (
                <div key={link.name} className="text-white mb-2">
                  <Link href={link.href} className="text-sm font-normal">
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          ))}
          {[
            {
              title: "Services",
              links: [
                { name: "Registered Office Address", href: "/services/registered-office-address" },
                { name: "UK Mail Forwarding", href: "/services/uk-mail-forwarding" },
                { name: "Identity Verification Service: Director or PSC", href: "/services/identity-verification-service-director-or-psc" },
                { name: "Director Appointment & Resignation Bundle", href: "/services/director-appointment-resignation-bundle" },
                { name: "Company Secretarial Services", href: "/services/company-secretarial-services" },
                { name: "Business Fraud Protection", href: "/services/business-fraud-protection" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-white text-xl font-semibold mb-5">
                {section.title}
              </h3>
              {section.links.map((link) => (
                <div key={link.name} className="text-white mb-2">
                  <Link href={link.href} className="text-sm font-normal">
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          ))}
          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              Contact Us
            </h3>

            <div className="text-white mb-2 space-y-3">
              <a
                href={`mailto:info@mycompanyregistration.uk`}
                className="text-sm font-normal flex gap-1"
              >
                <Mail size={20} /> info@mycompanyregistration.uk
              </a>

              {/* Social Icons */}
              <div className="flex gap-4 mt-4">
                <a
                  href="https://www.facebook.com/mycompanyregistration/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-500 transition-all duration-200 hover:scale-110"
                >
                  <Facebook size={22} />
                </a>

                <a
                  href="https://www.instagram.com/mycompanyregistration"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-pink-500 transition-all duration-200 hover:scale-110"
                >
                  <Instagram size={22} />
                </a>

                <a
                  href="https://www.linkedin.com/company/my-company-registration/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400 transition-all duration-200 hover:scale-110"
                >
                  <Linkedin size={22} />
                </a>

                <a
                  href="https://x.com/MyCompanyReg1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-all duration-200 hover:scale-110"
                >
                  <Twitter size={22} />
                </a>

                <a
                  href="https://uk.pinterest.com/mycompanyregister/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-red-500 transition-all duration-200 hover:scale-110"
                >
                  {/* Pinterest SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.22 2.62 7.82 6.32 9.27-.09-.79-.17-2 .03-2.87.18-.79 1.16-5.04 1.16-5.04s-.3-.6-.3-1.49c0-1.39.81-2.43 1.82-2.43.86 0 1.27.65 1.27 1.42 0 .87-.55 2.17-.83 3.38-.24 1.01.51 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.65 0-2.43-1.75-4.13-4.25-4.13-2.9 0-4.6 2.17-4.6 4.41 0 .87.34 1.8.76 2.31.08.1.09.19.07.29-.08.32-.26 1.01-.29 1.15-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.44 2.5-6.6 7.2-6.6 3.78 0 6.72 2.7 6.72 6.31 0 3.76-2.37 6.79-5.66 6.79-1.11 0-2.15-.58-2.5-1.27l-.68 2.59c-.25.96-.92 2.17-1.37 2.91 1.03.32 2.12.49 3.26.49 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t my-10  border-t-white w-full col-span-full" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
