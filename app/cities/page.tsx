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
  trashcans: string | number | boolean;
}

const columns: ColumnDef<Setting>[] = [
  {
    accessorKey: "city",
    header: "Cities",
  },
  {
    accessorKey: "trashcans",
    header: "Trash Cans",
  },
];
const data: Setting[] = [
  {
    city: "Münster",
    trashcans: "50",
  },
  {
    city: "Emsdetten",
    trashcans: "55",
  },
  {
    city: "Berlin",
    trashcans: "1050",
  },
  {
    city: "Munich",
    trashcans: "1000",
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
