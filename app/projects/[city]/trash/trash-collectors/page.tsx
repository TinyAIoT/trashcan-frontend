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

type Props = {};
type Payment = {
  name: string;
  id: string;
  assignedtrashbins: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Employee ID",
  },

  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <img
            className="h-10 w-10"
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${row.getValue(
              "name"
            )}`}
            alt="user-image"
          />
          <p>{row.getValue("name")} </p>
        </div>
      );
    },
  },

  {
    accessorKey: "assignedtrashbins",
    header: "Assigned Trashbins",
  },
];

const data: Payment[] = [
  {
    name: "John Doe",
    id: "EMP12345",
    assignedtrashbins: "17",
  },
  {
    name: "Alice Smith",
    id: "EMP23456",
    assignedtrashbins: "42",
  },
  {
    name: "Bob Johnson",
    id: "EMP34567",
    assignedtrashbins: "31",
  },
  {
    name: "Emma Brown",
    id: "EMP45678",
    assignedtrashbins: "29",
  },
  {
    name: "Michael Davis",
    id: "EMP56789",
    assignedtrashbins: "13",
  },
  {
    name: "Sophia Wilson",
    id: "EMP67890",
    assignedtrashbins: "58",
  },
  {
    name: "Liam Garcia",
    id: "EMP78901",
    assignedtrashbins: "25",
  },
  {
    name: "Olivia Martinez",
    id: "EMP89012",
    assignedtrashbins: "36",
  },
  {
    name: "Noah Rodriguez",
    id: "EMP90123",
    assignedtrashbins: "71",
  },
  {
    name: "Ava Lopez",
    id: "EMP01234",
    assignedtrashbins: "19",
  },
  {
    name: "Elijah Hernandez",
    id: "EMP98765",
    assignedtrashbins: "63",
  },
  {
    name: "Mia Gonzalez",
    id: "EMP87654",
    assignedtrashbins: "77",
  },
  {
    name: "James Perez",
    id: "EMP76543",
    assignedtrashbins: "85",
  },
  {
    name: "Charlotte Carter",
    id: "EMP65432",
    assignedtrashbins: "94",
  },
  {
    name: "Benjamin Taylor",
    id: "EMP54321",
    assignedtrashbins: "10",
  },
];

export default function UsersPage({}: Props) {
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Trash Collectors" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
