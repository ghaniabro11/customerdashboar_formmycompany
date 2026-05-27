"use client";

import React from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    label: "My Companies",
    href: "/account/my-companies",
    icon: "🏢",
  },
  {
    label: "My Services",
    href: "/account/services",
    icon: "⚙️",
  },
  {
    label: "Personal Details",
    href: "/account/my-details",
    icon: "👤",
  },
  {
    label: "Login Details",
    href: "/account/login-details",
    icon: "🔐",
  },
  {
    label: "My Order History",
    href: "/account/order-history",
    icon: "📦",
  },
  {
    label: "Proof of ID status",
    href: "/account/id-check",
    icon: "🆔",
  },
  {
    label: "My Work History",
    href: "/account/my-work-history",
    icon: "💼",
  },
  {
    label: "My Wallet",
    href: "/account/wallet",
    icon: "💰",
  },
];

export default function AccountDropdown({
  setIsMobileOpen,
}: {
  setIsMobileOpen?: (open: boolean) => void;
}) {
  const handleLinkClick = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth" });
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 text-[14px] font-medium text-gray-800 rounded-xl transition-all duration-200 hover:bg-gray-100 hover:text-[#3F9C96]"
          aria-label="Account menu"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline">My Account</span>
          <ChevronDown className="w-4 h-4 hidden sm:inline" />
        </button>
      </PopoverTrigger>
      <PopoverContent
          align="end"
          side="bottom"
          sideOffset={8}
          className="w-[280px] p-0 z-[100] rounded-2xl border border-gray-200 shadow-2xl"
        >
        <div className="p-2 max-h-[70vh] overflow-y-auto">
          <div className="px-3 py-2 mb-1">
            <p className="text-[14px] font-semibold text-gray-900">
                My Account
            </p>
            <p className="text-[12px] text-gray-500">
              Manage your account settings
            </p>
          </div>
          <Separator className="my-2" />
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-gray-700 hover:bg-[#3F9C96]/10 hover:text-[#3F9C96] rounded-xl transition-all duration-200 group"
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 rounded-xl text-[13px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
