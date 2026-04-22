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
          className="flex items-center gap-2 py-2 text-black font-medium hover:text-orange transition-colors rounded-lg hover:bg-gray-50"
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
        className="w-64 p-0 z-100 "
      >
        <div className="p-2">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-semibold text-gray-900">My Account</p>
            <p className="text-xs text-gray-500">Manage your account settings</p>
          </div>
          <Separator className="my-2" />
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-orange/10 hover:text-orange rounded-lg transition-colors group"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
