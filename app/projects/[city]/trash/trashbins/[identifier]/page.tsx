// app/trashbins/[identifier]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FillLevelChart from "@/components/FillLevelChart";
import { CardContent } from "@/components/Card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

type Trashbin = {
  id: string;
  identifier: string;
  name: string;
  coordinates: [number, number];
  location: string;
  project: string;
  sensors: any[];
  createdAt: Date;
  updatedAt: Date;
};

const columns: ColumnDef<Trashbin>[] = [
  { accessorKey: "identifier", header: "Identifier" },
  {
    accessorKey: "coordinates",
    header: "Coordinates",
    cell: ({ row }) => row.original.coordinates.join(", "),
  },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "project", header: "Project" },
  {
    accessorKey: "sensors",
    header: "Sensors",
    cell: ({ row }) => JSON.stringify(row.original.sensors),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleString(),
  },
];

export default function TrashbinDetail({
  params,
}: {
  params: { identifier: string };
}) {
  const [data, setData] = useState<Trashbin | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${params.identifier}`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );

        const trashbin = {
          id: response.data._id,
          identifier: response.data.identifier,
          name: response.data.name,
          coordinates: response.data.coordinates,
          location: response.data.location,
          project: response.data.project,
          sensors: response.data.sensors,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };

        setData(trashbin);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.identifier]);

  if (!data) {
    return <div>Loading...</div>;
  }

  function getEditUrl(): string {
    const path = window.location.pathname;
    const parts = path.split("/");
    const city = parts[2];
    const type = parts[3];
    return `/projects/${city}/${type}/trashbins/${params.identifier}/edit`;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between px-4 py-4">
        <PageTitle title={`Trashbin ${data.identifier}`} />
        <Button asChild className="bg-green-600 text-white">
          <Link href={getEditUrl()}>Edit Trashcan</Link>
        </Button>
      </div>
      <Tabs defaultValue="visual" className="">
        <TabsList className="w-full">
          <TabsTrigger value="visual" className="w-full">
            Graphical View
          </TabsTrigger>
          <TabsTrigger value="table" className="w-full">
            Table View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="visual">
          <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
            <CardContent>
              <p className="p-4 font-semibold">Fill Level</p>
              <FillLevelChart />
            </CardContent>
            <CardContent>
              <p className="p-4 font-semibold">Battery Level (TODO!)</p>
              <FillLevelChart />
            </CardContent>
          </section>
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={[data]} />
          <div className="flex gap-3 items-center">
            <p className="inline">Location: {data.location}</p>
            <Button className="bg-green-600 text-white">
              <Link href="https://www.google.com/maps" target="_blank">
                See on Google Maps
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
