"use client";
import DataTable from "@/components/custom/datatable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ServiceTable = ({ services }: { services: any }) => {
  const [data, setData] = useState({ data: [], type: "" });
  const [open, setOpen] = useState(false);
  return (
    <main className="">
      <h1 className="mb-5">My Services</h1>
      <DataTable
        data={services || []}
        columns={[
          {
            header: "Title",
            accessor: "title",
          },
          {
            header: "Summary",
            accessor: "summary",
          },
          {
            header: "Icon",
            accessor: "icon",
            cell: (row) => {
              return (
                <Image
                  src={row?.icon}
                  alt={row?.title}
                  width={20}
                  height={20}
                />
              );
            },
          },
          {
            header: "Action",
            accessor: "action",
            cell: (row: any) => {
              return (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => {
                      setData({
                        data: row?.service_addons || [],
                        type: "addons",
                      });
                      setOpen(true);
                    }}
                    size={"sm"}
                    variant={"orange"}
                    className="text-xs"
                    disabled={row?.service_addons?.length === 0}
                  >
                    <Eye />
                    Add Ons
                  </Button>
                  <Button
                    onClick={() => {
                      setData({
                        data: row?.service_packages || [],
                        type: "packages",
                      });
                      setOpen(true);
                    }}
                    size={"sm"}
                    variant={"orange"}
                    className="text-xs"
                    disabled={row?.service_packages?.length === 0}
                  >
                    <Eye />
                    Packages
                  </Button>
                </div>
              );
            },
          },
        ]}
        total={services?.length || 0}
        rowKey={(row) => row?.title}
        pagination={false}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {data?.type === "addons" ? "Add Ons" : "Packages"}
            </DialogTitle>
          </DialogHeader>

          <DataTable
            data={data?.data || []}
            columns={[
              {
                header: "ID",
                accessor: "id",
              },
              {
                header: "Name",
                accessor: "name",
              },
              {
                header: "Description",
                accessor: "description",
              },
              {
                header: "Price",
                accessor: "unit_price",
              },
              {
                header: "Vat",
                accessor: "vat",
              },
            ]}
            total={data?.data?.length || 0}
            pagination={false}
            rowKey={(row: any) => row?.id}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default ServiceTable;
