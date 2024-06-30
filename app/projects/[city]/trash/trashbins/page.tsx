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
import { ColumnDef, useReactTable } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import axios from "axios";
import {
  ColumnFiltersState,
  getFilteredRowModel,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {};

type Trashbin = {
  id: string;
  identifier: string;
  location: string;
  project: string;
  createdAt: Date;
  updatedAt: Date;
  lastEmptied: Date;
  batteryLevel: number;
  signalStrength: number;
  assigned: boolean;
};

const columns: ColumnDef<Trashbin>[] = [
  {
    accessorKey: "identifier",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Identifier
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  { accessorKey: "display", header: "Name" },
  {
    accessorKey: "fill",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Fill Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  { accessorKey: "fillLevelChange", header: "Fill Level Change" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "createdAt", header: "Created At" },
  { accessorKey: "updatedAt", header: "Updated At" },
  { accessorKey: "lastEmptied", header: "Last Emptied" },
  {
    accessorKey: "batteryLevel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Battery Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  { accessorKey: "signalStrength", header: "Signal Strength" },
  { accessorKey: "assigned", header: "Assigned" },
];

export default function TrashbinsOverview({}: Props) {
  const [trashbinData, setTrashbinData] = useState([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const router = useRouter();

  const handleClick = useCallback((trashbin: Trashbin) => {
    const path = window.location.pathname;
    const parts = path.split("/");
    const city = parts[2];
    const type = parts[3];
    router.push(`/projects/${city}/${type}/trashbins/${trashbin.identifier}`);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const projectId = localStorage.getItem("projectId");

        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin?project=${projectId}`,
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
