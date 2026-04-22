"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const DashboardPage = () => {
  const dashboardItems = [
    {
      title: "My Companies",
      description: "Get access to (and change) your company information.",
      href: "/account/my-companies",
    },
    {
      title: "My Services",
      description: "View your services and renewals.",
      href: "/account/services",
    },
    {
      title: "Personal Details",
      description: "Update your personal details.",
      href: "/account/my-details",
    },
    {
      title: "Login Details",
      description: "Update your login details.",
      href: "/account/login-details",
    },
    {
      title: "My Order History",
      description:
        "View your order history and access invoices for all your payments.",
      href: "/account/order-history",
    },
    {
      title: "Proof of ID status",
      description: "View and manage your proof of ID.",
      href: "/account/id-check",
    },
    {
      title: "My Work History",
      description: "View your work history.",
      href: "/account/my-work-history",
    },
    // {
    //   title: "My Workspace History",
    //   description: "View your workspace history.",
    //   href: "/account/my-workspace-history",
    // },
  ];
  return (
    <>
      <main className="">
        <h1>Dashboard</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-10">
          {dashboardItems.map((item, idx) => (
            <div key={idx}>
              <Link href={item.href}>
                <Card className="hover:shadow-lg transition-shadow border border-orange rounded-2xl h-full">
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <h2 className="text-xl font-semibold text-orange mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default DashboardPage;


