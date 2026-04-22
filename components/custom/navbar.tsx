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

const navLinks: any[] = [
  // { label: "Register A Company", link: "/compare-packages" },
  { label: "Register A Company", link: "/" },
  // {
  //   label: "Service",
  //   link: "/",
  //   children: [
  //     {
  //       label: "A",
  //       link: "/",
  //     },
  //     { label: "B", link: "/" },
  //   ],
  // },
  { label: "Services", link: "/services" },
  { label: "Blogs", link: "/blogs" },
  { label: "Help & Advices", link: "/help-and-advice" },
  { label: "Workspace", link: "/workspace" },
];

const Navbar = () => {
  const [IsMobileOpen, setIsMobileOpen] = React.useState(false);
  const { data: session, status } = useSession();

  return (
    <nav
      className={`bg-white shadow-md z-50 transition-all duration-300 w-full sticky top-0`}
    >
      <div className="bg-white/95 backdrop-blur-sm px-[5%] flex flex-wrap justify-between items-center  border-b border-gray-100">
        {IsMobileOpen ? (
          <div></div>
        ) : (
          <Link href={`/`} aria-label="Home Url">
            <Image
              height={70}
              width={140}
              src={`/logo.svg`}
              alt="My Company Registration Logo"
              className="object-contain "
            />
          </Link>
        )}

        {/* Nav Links */}
        <ul className="pl-0 my-0 md:flex items-center gap-3 flex-wrap hidden">
          <NavLink navLink={navLinks} />
          <Link href={`/compare-packages`} aria-label="View Packages">
            <Button variant={"orange"} className="font-medium">
              View Packages
            </Button>
          </Link>
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
                  alt="My Company Registration Logo"
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
              className="block px-4 py-2 w-full hover:bg-gray-50 transition-colors rounded"
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
            <div className="absolute top-0 left-full ml-1 min-w-[220px] bg-white/95 backdrop-blur-md text-gray-800 border border-gray-200 rounded-lg shadow-lg z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
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
            <div className="px-3 py-2 flex items-center gap-1  cursor-pointer text-gray-900">
              <span>{category.label}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  hoveredDropdown === category.label ? "rotate-180 " : ""
                }`}
              />
            </div>

            {/* Dropdown */}
            {hoveredDropdown === category.label && (
              <div className="absolute top-full left-0 mt-1 min-w-60 bg-white/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2 w-full text-gray-900">
                  <Link aria-label={category.label} href={category.link}>
                    <span className="block px-4 py-2   hover:bg-gray-50  transition-colors rounded">
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
                hover:text-gray-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] 
                after:w-0 after:bg-gray-600 after:transition-all after:duration-300 
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
