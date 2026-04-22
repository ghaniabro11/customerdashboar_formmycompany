import Navbar from "@/components/custom/navbar";
import type { Metadata } from "next";
import { Inter, Jost, Kaisei_Decol } from "next/font/google";
import "./globals.css";
import Footer from "@/components/custom/footer";
import { Providers } from "@/components/auth/providers";
import { Toaster } from "@/components/ui/sonner";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import ScrollToTop from "@/components/custom/ScrollToTop";
import { CartNotificationDialog } from "@/components/custom/cart-notification-dialog";


const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Only load weights you actually use
  display: "swap",
});


export const metadata: Metadata = {
  title: WEBNAME,
  description:
    "Foundrly helps entrepreneurs easily register their companies with full compliance and support. Enjoy exclusive business partner deals and more!",
  icons: {
    icon: FAVICON_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={` ${jost.variable} antialiased`}
      >
        {/* <WEB_VITALS/> */}
        <Toaster />
        <CartNotificationDialog />
        <Providers>
          <Navbar />
          <ScrollToTop />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
