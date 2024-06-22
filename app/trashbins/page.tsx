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

import React, { useCallback, useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  { accessorKey: "identifier", header: "Identifier" },
  { accessorKey: "display", header: "Name" },
  { accessorKey: "fill", header: "Fill Level" },
  { accessorKey: "fillLevelChange", header: "Fill Level Change" },
  { accessorKey: "coordinates", header: "Coordinates" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "createdAt", header: "Created At" },
  { accessorKey: "updatedAt", header: "Updated At" },
];


export default function TrashbinsOverview({}: Props) {
  const [trashbinData, setTrashbinData] = useState([]);
  const router = useRouter();

  const handleClick = useCallback((trashbin: Trashbin) => {
    console.log("Clicked on trashbin: ", trashbin);
    router.push(`/trashbins/${trashbin.identifier}`);
  }, []);

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

        setTrashbinData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Trashbins" />
      <DataTable
            columns={columns}
            data={trashbinData}
            onRowClick={handleClick}
          />
    </div>
  );
}
