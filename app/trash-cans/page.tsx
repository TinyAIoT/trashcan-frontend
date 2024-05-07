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
import axios from 'axios';
import {useState, useEffect} from 'react';

type Props = {};
type Payment = {
  trashCanID: string;
  status: string;
  lastPickup: string;
  assignedTo: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "trashCanID",
    header: "Trash Can ID",
  },
  {
    accessorKey: "filledStatus",
    header: "Filled Status"
  },
  {
    accessorKey: "lastPickup",
    header: "Last Picked",
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
];


export default function OrdersPage({}: Props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/trashcan/all');


        const transformedData = response.data.map((item : any) => {
          return {
            ...item,
            assignedTo: item?.assignedTrashCollector?.name,
          }
        })

        console.log('tt', transformedData);

        // console.log('Transformed Data' , transformedData);

        // console.log('Trasnformated Data' , transformedData);

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Trash Cans" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
