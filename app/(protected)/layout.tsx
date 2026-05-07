import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

// Default metadata for protected routes
export const metadata: Metadata = {
  title: WEBNAME,
  description: "Access your account dashboard and manage your companies, services, and account details.",
  robots: {
    index: false,
    follow: false,
  },
  icons: { icon: FAVICON_URL },
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
// return <AuthWrapper>{children}</AuthWrapper>;
