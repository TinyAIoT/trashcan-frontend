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
import axios from 'axios';
import {useState, useEffect} from 'react';

type Props = {};
type Payment = {
  id: string;
  name: string;
  fillLevel: number;
  batteryLevel: number;
  lastEmptied: Date;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "fillLevel",
    header: "Fill Level",
  },
  {
    accessorKey: "batteryLevel",
    header: "BatteryLevel",
  },
  {
    accessorKey: "lastEmptied",
    header: "Last Emptied",
  },
];


export default function OrdersPage({}: Props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/trashbins/all');

        const transformedData = response.data.map((item : any) => {
          return {
            ...item,
          }
        })

        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Trashbins" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
