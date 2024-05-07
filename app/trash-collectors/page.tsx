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
  assignedtrashcans: string;
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
    accessorKey: "assignedtrashcans",
    header: "Assigned Trash Cans",
  },
];

const data: Payment[] = [
  {
    name: "John Doe",
    id: "EMP12345",
    assignedtrashcans: "17",
  },
  {
    name: "Alice Smith",
    id: "EMP23456",
    assignedtrashcans: "42",
  },
  {
    name: "Bob Johnson",
    id: "EMP34567",
    assignedtrashcans: "31",
  },
  {
    name: "Emma Brown",
    id: "EMP45678",
    assignedtrashcans: "29",
  },
  {
    name: "Michael Davis",
    id: "EMP56789",
    assignedtrashcans: "13",
  },
  {
    name: "Sophia Wilson",
    id: "EMP67890",
    assignedtrashcans: "58",
  },
  {
    name: "Liam Garcia",
    id: "EMP78901",
    assignedtrashcans: "25",
  },
  {
    name: "Olivia Martinez",
    id: "EMP89012",
    assignedtrashcans: "36",
  },
  {
    name: "Noah Rodriguez",
    id: "EMP90123",
    assignedtrashcans: "71",
  },
  {
    name: "Ava Lopez",
    id: "EMP01234",
    assignedtrashcans: "19",
  },
  {
    name: "Elijah Hernandez",
    id: "EMP98765",
    assignedtrashcans: "63",
  },
  {
    name: "Mia Gonzalez",
    id: "EMP87654",
    assignedtrashcans: "77",
  },
  {
    name: "James Perez",
    id: "EMP76543",
    assignedtrashcans: "85",
  },
  {
    name: "Charlotte Carter",
    id: "EMP65432",
    assignedtrashcans: "94",
  },
  {
    name: "Benjamin Taylor",
    id: "EMP54321",
    assignedtrashcans: "10",
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
