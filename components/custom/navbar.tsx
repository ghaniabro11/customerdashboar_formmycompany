"use client";

import { ChevronDown, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import AccountDropdown from "./accountdropdown";
import CartDropdown from "./cart-dropdown";
import Notifications from "./notifications";
import Image from "next/image";

interface NavLinks {
  label: string;
  link: string;
  children?: Array<{
    label: string;
    link: string;
  }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "";

const navLinks: NavLinks[] = [
  { label: "Home", link: `${BASE_URL}/` },
  { label: "About", link: `${BASE_URL}/about/` },

  {
    label: "Company Packages",
    link: `${BASE_URL}/packages/`,
    children: [
      {
        label: "Limited by Guarantee Packages",
        link: `${BASE_URL}/packages/limited-by-guarantee/`,
      },
      {
        label: "Limited By Guarantee Bespoke",
        link: `${BASE_URL}/packages/limited-by-guarantee-bespoke/`,
      },
      {
        label: "Digital & Print Package",
        link: `${BASE_URL}/packages/print/`,
      },
      {
        label: "Digital Plan Package",
        link: `${BASE_URL}/packages/digital/`,
      },
      {
        label: "Entrepreneurs Choice Package",
        link: `${BASE_URL}/packages/entrepreneurs-choice/`,
      },
      {
        label: "Fully Inclusive Package",
        link: `${BASE_URL}/packages/fully-inclusive/`,
      },
      {
        label: "Privacy Package",
        link: `${BASE_URL}/packages/privacy/`,
      },
      {
        label: "Public Limited Company",
        link: `${BASE_URL}/packages/public-limited-company/`,
      },
      {
        label: "Limited Liability Partnership",
        link: `${BASE_URL}/packages/limited-liability-partnership-llp/`,
      },
      {
        label: "Rights To Manage Company",
        link: `${BASE_URL}/packages/rights-to-manage-company/`,
      },
      {
        label: "UK Charity Company",
        link: `${BASE_URL}/packages/uk-charity-company/`,
      },
      {
        label: "Private Limited (Ltd) Company",
        link: `${BASE_URL}/packages/private-limited-ltd-company/`,
      },
    ],
  },
  {
    label: "Non-Residents UK Company",
    link: `${BASE_URL}/packages/non-uk-residents/`,
    children: [
      {
        label: "For Bangladesh", 
        link: `${BASE_URL}/packages/non-uk-residents/bangladesh`,
      },
      {
        label: "For China",
        link: `${BASE_URL}/non-uk-residents/china/`,
      }
    ],
  },
  {
    label: "Services",
    link: `${BASE_URL}/services/`,
    children: [
      {
        label: "Interview Rooms",
        link: `${BASE_URL}/services/interview-rooms/`,
      },
      {
        label: "Conference Rooms",
        link: `${BASE_URL}/services/conference-rooms/`,
      },
      {
        label: "Call Answering",
        link: `${BASE_URL}/services/call-answering/`,
      },
      {
        label: "Business Address",
        link: `${BASE_URL}/services/business-address/`,
      },
      {
        label: "Boardrooms",
        link: `${BASE_URL}/services/boardrooms/`,
      },
      {
        label: "Virtual Offices",
        link: `${BASE_URL}/services/virtual-offices/`,
      },
      {
        label: "Training Rooms",
        link: `${BASE_URL}/services/training-rooms/`,
      },
      {
        label: "Serviced Offices",
        link: `${BASE_URL}/services/serviced-offices/`,
      },
      {
        label: "Meeting Room",
        link: `${BASE_URL}/services/meeting-rooms/`,
      },
    ],
  },

  {
    label: "Company Services",
    link: `${BASE_URL}/company-services/`,
    children: [
      {
        label: "Director Appointment",
        link: `${BASE_URL}/company-services/director-appointment/`,
      },
      {
        label: "Director Resignation",
        link: `${BASE_URL}/company-services/director-resignation/`,
      },
      {
        label: "Director Appointment & Resignation Bundle",
        link: `${BASE_URL}/company-services/director-appointment-resignation/`,
      },
      {
        label: "File a Confirmation Statement",
        link: `${BASE_URL}/company-services/file-a-confirmation-statement/`,
      },
      {
        label: "File Accounts for Dormant Companies",
        link: `${BASE_URL}/company-services/file-accounts-for-dormant-companies/`,
      },
      {
        label: "Identity Verification Service: Director or PSC",
        link: `${BASE_URL}/company-services/identity-verification-service-director-or-psc/`,
      },
      {
        label: "PAYE Registration Assistance",
        link: `${BASE_URL}/company-services/paye-registration-assistance/`,
      },
      {
        label: "VAT Registration Assistance",
        link: `${BASE_URL}/company-services/vat-registration-assistance/`,
      },
      {
        label: "Company Secretarial",
        link: `${BASE_URL}/company-services/company-secretarial-service/`,
      },
      {
        label: "Apostilled Documents",
        link: `${BASE_URL}/company-services/apostilled-documents/`,
      },
      {
        label: "Certificate of Good Standing",
        link: `${BASE_URL}/company-services/certificate-of-good-standing/`,
      },
      {
        label: "Supplementary Company Documents",
        link: `${BASE_URL}/company-services/supplementary-company-documents/`,
      },
      {
        label: "Company Pack",
        link: `${BASE_URL}/company-services/company-pack/`,
      },
      {
        label: "PSC Register",
        link: `${BASE_URL}/company-services/psc-register/`,
      },
      {
        label: "Fraud Protection",
        link: `${BASE_URL}/company-services/fraud-protection/`,
      },
    ],
  },

  { label: "FAQ", link: `${BASE_URL}/faq/` },
  { label: "Contact", link: `${BASE_URL}/contact/` },
];

const Navbar = () => {
  const [IsMobileOpen, setIsMobileOpen] = React.useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full shadow-sm">
      {/* Top bar */}
      <div className="bg-[#3F9C96] text-white text-sm px-[5%] py-2 flex justify-end">
        <a
          href="mailto:info@formmycompany.uk"
          className="bg-[#20323a] px-4 py-1 rounded-sm font-semibold"
        >
          info@formmycompany.uk
        </a>
      </div>
      <div className="bg-white px-[5%] flex items-center justify-between h-[110px]">
        {IsMobileOpen ? (
          <div></div>
        ) : (
          <Link
            href={`https://formmycompany.uk/`}
            aria-label="Home Url"
            className="flex-shrink-0"
          >
            <Image
              height={70}
              width={140}
              src={`/logo.webp`}
              alt="My Company Registration Logo"
              className="object-contain "
            />
          </Link>
        )}

        {/* Nav Links */}
        <ul className="pl-0 my-0 md:flex md:flex-wrap items-center gap-x-1 gap-y-2 hidden">
          <NavLink navLink={navLinks} />
          {/* Conditionally show Login or Logout */}
          {!session ? (
            <Link href="/auth">
              <Button variant={"outline"} className="font-medium">
                Login
              </Button>
            </Link>
          ) : (
            <>
              <AccountDropdown />
              <Notifications />
            </>
          )}
          <CartDropdown />
        </ul>

        <Sheet open={IsMobileOpen} onOpenChange={setIsMobileOpen}>
          <div className="flex items-center gap-2 md:hidden">
            {!session ? (
              <Link onClick={() => setIsMobileOpen(false)} href="/auth">
                <Button className="w-full" variant={"outline"}>
                  Login
                </Button>
              </Link>
            ) : (
              <>
                <Notifications />
                <AccountDropdown setIsMobileOpen={setIsMobileOpen} />
              </>
            )}
            <CartDropdown />
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu />
              </button>
            </SheetTrigger>
          </div>
          <SheetContent className="px-3">
            <SheetHeader>
              <div className="hidden">
                <SheetTitle />
              </div>
              <Link
                href={`/`}
                aria-label="Home Url"
                className="flex items-center gap-2 font-serif text-gray-800 hover:opacity-90 transition-opacity"
                onClick={() => setIsMobileOpen(false)}
              >
                <img
                  src={`/logo.svg`}
                  alt="Form My Company Logo"
                  className="object-contain  h-13 w-auto "
                  loading="eager"
                />
              </Link>
            </SheetHeader>

            <div className="">
              <NavLink navLink={navLinks} setIsMobileOpen={setIsMobileOpen} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;

/* =============== Helper Functions =============== */

const renderSubMenu = (
  children: any[],
  level = 1,
  setIsMobileOpen?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  return (
    <ul className="pl-0 m-0 ">
      {children.map((subCategory, idx) => (
        <li
          key={`submenu-${subCategory.label}-${idx}`}
          className="group relative list-none"
        >
          <div className="flex items-center justify-between  w-full text-black">
            <Link
              aria-label={subCategory.label}
              href={subCategory.link}
              className="block px-3 py-2 w-full text-[13px] leading-5 font-medium rounded-md transition-all duration-200 hover:bg-[#3F9C96]/10 hover:text-[#3F9C96]"
              onClick={() => {
                if (setIsMobileOpen) {
                  setIsMobileOpen(false);
                }
              }}
            >
              {subCategory.label}
            </Link>
            {subCategory.children && (
              <ChevronDown
                size={12}
                className="ml-1 text-gray-400 group-hover:text-red-600 group-hover:rotate-180 transition-all duration-200"
              />
            )}
          </div>

          {/* Submenu for nested children */}
          {subCategory.children && (
            <div className="absolute top-0 left-full max-lg:right-0 max-lg:left-auto ml-1 w-[260px] max-w-[90vw] bg-white text-gray-800 border border-gray-200 rounded-lg shadow-lg z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
              <div className="py-2">
                {renderSubMenu(subCategory.children, level + 1)}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

const NavLink = ({
  navLink,
  setIsMobileOpen,
}: {
  navLink: NavLinks[];
  setIsMobileOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [hoveredDropdown, setHoveredDropdown] = React.useState<string | null>(
    null,
  );
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredDropdown(null), 300);
  };

  return (
    <>
      {navLink.map((category: any, idx: number) =>
        category.children ? (
          <li
            key={`desktop-${category.label}-${idx}`}
            className="relative list-none"
            onMouseEnter={() => handleMouseEnter(category.label)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="px-3 py-2 flex items-center gap-1 cursor-pointer text-gray-900 rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-[#3F9C96]">
            <span className="text-[13px] font-medium whitespace-nowrap">{category.label}</span>
              <ChevronDown
                size={14}
                className={`transition-all duration-300 ${
                  hoveredDropdown === category.label
                    ? "rotate-180 text-[#3F9C96]"
                    : "text-gray-500"
                }`}
              />
            </div>

            {/* Dropdown */}
            {hoveredDropdown === category.label && (
              <div className="absolute top-full left-0 mt-2 w-[280px] max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 w-full text-gray-900 max-h-[70vh] overflow-y-auto">
                  <Link aria-label={category.label} href={category.link}>
                    <span className="block px-3 py-2 text-[13px] leading-5 font-semibold rounded-md transition-all duration-200 hover:bg-[#3F9C96]/10 hover:text-[#3F9C96]">
                      {category.label}
                    </span>
                  </Link>
                  <div className="h-px bg-gray-200 my-2 mx-3" />
                  {renderSubMenu(category.children, 1, setIsMobileOpen)}
                </div>
              </div>
            )}
          </li>
        ) : (
          <li
            onClick={() => {
              if (setIsMobileOpen) {
                setIsMobileOpen(false);
              }
            }}
            key={`desktop-${category.label}-${idx}`}
            className="list-none"
          >
            <Link aria-label={category.label} href={category.link}>
            <span className="relative px-3 py-2 block text-gray-800 font-medium transition-all duration-300 
              hover:text-[#3F9C96] after:absolute after:left-0 after:-bottom-1 after:h-[2px] 
              after:w-0 after:bg-[#3F9C96] after:transition-all after:duration-300 
              hover:after:w-full">
                {category.label}
              </span>
            </Link>
          </li>
        ),
      )}
    </>
  );
};
