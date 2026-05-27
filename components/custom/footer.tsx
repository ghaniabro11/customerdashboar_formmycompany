"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter, 
} from "lucide-react";
import { FaPinterestP } from "react-icons/fa";
const Footer = () => {
  return (
<footer className="bg-[var(--footer-bg)] text-white font-[Inter]">
  

  {/* MAIN */}
  <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid md:grid-cols-5 gap-10">
    
    {/* LOGO */}
    <div>
      <Image src="/FMC-Logo-White-1.svg" width={150} height={50} alt="logo" />

      <p className="mt-4 text-base text-[var(--footer-muted)] leading-relaxed">
        Form My Company helps you set up and grow your UK business with fast,
        reliable, and fully compliant company formation services.
      </p>

      <div className="flex gap-3 mt-5">
      <a
        href="https://www.facebook.com/formmycompany/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="p-2 bg-[#343637] rounded-full hover:bg-[#4b4d4e] transition">
          <Facebook size={16} />
        </div>
      </a>
      <a
        href="https://x.com/FormMyCompanyUK"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="p-2 bg-[#343637] rounded-full"><Twitter size={16} /></div>
      </a>
      <a
        href="https://www.instagram.com/formmycompany"
        target="_blank"
        rel="noopener noreferrer"
      >  
        <div className="p-2 bg-[#343637] rounded-full"><Instagram size={16} /></div>
      </a> 
      <a
        href="https://www.linkedin.com/company/form-my-company"
        target="_blank"
        rel="noopener noreferrer"
      >   
        <div className="p-2 bg-[#343637] rounded-full"><Linkedin size={16} /></div>
      </a>  

      <a
        href="https://uk.pinterest.com/formmycompany/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="p-2 bg-[#343637] rounded-full">
          <FaPinterestP size={16} />
        </div>
      </a>
      </div>
    </div>

    {/* COMPANY FORMATION */}
    <div>
      <h3 className="text-base font-semibold tracking-wide pb-3 mb-4 border-b border-[#1e293b]">
      COMPANY FORMATION
      </h3>
      <ul className="space-y-3 text-base text-[var(--footer-muted)]">
      <li>
          <Link href="https://formmycompany.uk/packages/private-limited-ltd-company/">
            Private Limited Company
          </Link>
        </li>

        <li>
          <Link href="https://formmycompany.uk/packages/non-uk-residents/">
            Non-UK Resident Company
          </Link>
        </li>

        <li>
          <Link href="https://formmycompany.uk/packages/limited-by-guarantee/">
            Limited by Guarantee
          </Link>
        </li>

        <li>
          <Link href="https://formmycompany.uk/packages/public-limited-company/">
            Public Limited Company
          </Link>
        </li>
      </ul>
    </div>

    {/* BUSINESS SERVICES */}
    <div>
      <h3 className="text-base font-semibold tracking-wide pb-3 mb-4 border-b border-[#1e293b]">
       BUSINESS SERVICES
      </h3>
      
      <ul className="space-y-3 text-base text-[var(--footer-muted)]">
        <li>
        <Link href="https://formmycompany.uk/services/business-address/">
          Registered Office Address
        </Link>
      </li>

      <li>
        <Link href="https://formmycompany.uk/services/virtual-offices/">
          Virtual Office Services
        </Link>
      </li>

      <li>
        <Link href="https://formmycompany.uk/services/meeting-rooms/">
          Meeting Room Hire
        </Link>
      </li>

      <li>
        <Link href="https://formmycompany.uk/company-services/vat-registration-assistance/">
          VAT Registration Service
        </Link>
      </li>
      </ul>
    </div>

    {/* RESOURCES & TRUST */}
    <div>
      <h3 className="text-base font-semibold tracking-wide pb-3 mb-4 border-b border-[#1e293b]">
        RESOURCES & TRUST
      </h3>
      
      <ul className="space-y-3 text-base text-[var(--footer-muted)]">
      <li>
        <Link href="https://formmycompany.uk/about/">
          About Form My Company
        </Link>
      </li>

      <li>
        <Link href="https://formmycompany.uk/contact/">
          Contact Us
        </Link>
      </li>

      <li>
        <Link href="https://formmycompany.uk/faq/">
          FAQs
        </Link>
      </li>

      <li>
        <Link href="https://formmycompany.uk/blogs/">
          Latest Business Insights
        </Link>
      </li>

      <li>
        <Link href="https://formmycompany.uk/research-insights/">
          Research
        </Link>
      </li>

      <li>
        <Link href="https://formmycompany.uk/news/">
          News
        </Link>
      </li>
      </ul>
    </div>

    {/* NEWSLETTER */}
    <div>
      <h3 className="text-base font-semibold tracking-wide pb-3 mb-4 border-b border-[#1e293b]">
        KEEP IN TOUCH
      </h3>

      <p className="text-base text-[var(--footer-muted)] mb-4">
        Subscribe us & receive our offers and updates
      </p>

      <div className="flex">
        <input
          type="email"
          placeholder="Email Address*"
          className="w-full px-4 py-2 bg-[var(--footer-input)] text-base rounded-l-md outline-none"
        />
        <button className="bg-[var(--footer-accent)] px-4 text-base rounded-r-md font-medium">
          Sign Up
        </button>
      </div>

      <div className="mt-6 text-base text-[var(--footer-muted)]">
        <p className="font-semibold text-white mb-1">NEED HELP?</p>
        <p>info@formmycompany.uk</p>
      </div>
    </div>
  </div>

  {/* BOTTOM */}
  <div className="bg-[var(--footer-bg-dark)] border-t border-[#1e293b] py-5 px-6 flex flex-col md:flex-row justify-between items-center text-base text-[var(--footer-muted)]">
    <p>© 2026 Form My Company.</p>

    <div className="flex gap-6 mt-3 md:mt-0">
      <span>
        <a
          href="https://formmycompany.uk/sitemap/"
          target="_blank"
          rel="noopener noreferrer"
          >
            Sitemap
        </a>
      </span>
      <span>
        <a
          href="https://formmycompany.uk/privacy-policy/"
          target="_blank"
          rel="noopener noreferrer"
          >
         Privacy Policy
         </a>
      </span>
      <span>
        <a
          href="https://formmycompany.uk/cookies-policy/"
          target="_blank"
          rel="noopener noreferrer"
          >
        Cookies Policy
        </a>
      </span>
      <span>
        <a
          href="https://formmycompany.uk/terms-conditions/"
          target="_blank"
          rel="noopener noreferrer"
          >
        Terms and Conditions
       </a>
      </span>
    </div>
  </div>
</footer>
  );
};

export default Footer;