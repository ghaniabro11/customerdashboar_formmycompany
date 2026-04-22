"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import DataTable, { Column } from "@/components/custom/datatable";
import logger from "@/lib/logger/logger";

interface Company {
  id: string;
  company_name: string;
  company_type: string;
  order_number: string;
  order_date: string;
  status: string;
  accountsDue: string;
  statementDue: string;
  services: string;
}

const MyCompaniesPage = ({
  companies,
  pagination,
}: {
  companies: Company[];
  pagination: any;
}) => {
  const [search, setSearch] = useState("");
  logger.info(companies, "companies");
  const filteredCompanies = companies.filter(
    (company) =>
      company.company_name.toLowerCase().includes(search.toLowerCase()) ||
      company.order_number.includes(search)
  );

  // Define columns for the DataTable
  const columns: Column<Company>[] = [
    {
      header: "Company Name",
      accessor: "company_name",
      cell: (row) => (
        <Link
          href={`/account/my-companies/${row.id}`}
          className="text-orange font-medium hover:underline"
        >
          {row.company_name}
        </Link>
      ),
    },
    { header: "Company Type", accessor: "company_type" },
    {
      header: "Order Number",
      accessor: "order_number",
      cell: (row) => (
        <Link
          href={`/account/my-companies/${row.id}`}
          className="text-blue-700 hover:underline"
        >
          {row.order_number}
        </Link>
      ),
    },
    { header: "Order Date", accessor: "order_date" },
    { header: "Status", accessor: "status" },
  ];

  return (
    <section className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <h1 className="text-4xl font-semibold mb-6">My Companies</h1>

      {/* Not Incorporated Section */}
      <Card className="mb-8 border border-gray-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Not Incorporated</h2>
          <p className="text-gray-600">No not incorporated companies found</p>
        </CardContent>
      </Card>

      {/* Incorporated Section */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Incorporated</h2>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <Input
            type="text"
            placeholder="Search by company name or number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-96"
          />
          <Button className="bg-gray-800 hover:bg-gray-900">Search</Button>
          <button className="text-sm text-gray-600 hover:underline">
            advanced
          </button>
        </div>

        {/* DataTable */}
        <DataTable<Company>
          data={filteredCompanies}
          columns={columns}
          total={pagination?.data?.total ?? 0}
          pageSize={pagination?.data?.per_page ?? 10}
          rowKey={(company) => company.order_number}
          pagination={false}
        />
      </div>
    </section>
  );
};

export default MyCompaniesPage;
