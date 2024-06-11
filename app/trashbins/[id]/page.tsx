// app/trashbins/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FillLevelChart from "@/components/FillLevelChart";
import { CardContent } from "@/components/Card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Trashbin = {
  id: string;
  identifier: string;
  coordinates: [number, number];
  location: string;
  project: string;
  sensors: any[];
  createdAt: Date;
  updatedAt: Date;
};

const columns: ColumnDef<Trashbin>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "identifier",
    header: "Identifier",
  },
  {
    accessorKey: "coordinates",
    header: "Coordinates",
    cell: ({ row }) => row.original.coordinates.join(", "),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "project",
    header: "Project",
  },
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

const TrashbinDetailPage = ({ params }: { params: { id: string } }) => {
  const [data, setData] = useState<Trashbin | null>(null);
  const editUrl = `/trashbins/${params.id}/edit`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${params.id}`
        );
        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );

        console.log(response.data);
        const trashbin = {
          id: response.data._id,
          identifier: response.data.identifier,
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
  }, [params.id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between px-4 py-4">
        <PageTitle title={`Trashbin ${data.identifier}`} />
        <Button asChild className="bg-green-600 text-white">
          <Link href={editUrl}>Edit Trashcan</Link>
        </Button>
      </div>
      <Tabs defaultValue="table" className="">
        <TabsList className="w-full">
          <TabsTrigger value="table" className="w-full">
            Table View
          </TabsTrigger>
          <TabsTrigger value="visual" className="w-full">
            Graphical View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <DataTable columns={columns} data={[data]} />
        </TabsContent>
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
      </Tabs>
    </div>
  );
};

export default TrashbinDetailPage;
