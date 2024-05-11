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
import React from "react";
import PageTitle from "@/components/PageTitle";
import { cn } from "@/lib/utils";

type Props = {};

interface Setting {
  city: string;
  trashbins: string | number | boolean;
}

const columns: ColumnDef<Setting>[] = [
  {
    accessorKey: "city",
    header: "Cities",
  },
  {
    accessorKey: "trashbins",
    header: "Trashbins",
  },
];
const data: Setting[] = [
  {
    city: "Münster",
    trashbins: "50",
  },
  {
    city: "Emsdetten",
    trashbins: "55",
  },
  {
    city: "Berlin",
    trashbins: "1050",
  },
  {
    city: "Munich",
    trashbins: "1000",
  },
];

export default function SettingsPage({}: Props) {
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Settings" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
