/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */
"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageTitle from "@/components/PageTitle";
import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

type Props = {};
type Trashbin = {
  id: string;
  identifier: string;
  coordinates: [number, number];
  location: string;
  project: string;
  createdAt: Date;
  updatedAt: Date;
};

const columns: ColumnDef<Trashbin>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <a
        href={`/trashbins/${row.original.id}`}
        className="text-blue-500 underline"
      >
        {row.original.id}
      </a>
    ),
  },
  {
    accessorKey: "identifier",
    header: "Identifier",
  },
  {
    accessorKey: "coordinates",
    header: "Coordinates",
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
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
];

export default function OrdersPage({}: Props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );

        const transformedData = response.data.map((item: any) => {
          return {
            id: item._id,
            identifier: item.identifier,
            coordinates: item.coordinates,
            location: item.location,
            project: item.project,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
          };
        });

        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Trashbins" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
