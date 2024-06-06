"use client";

import React from 'react';
import PageTitle from "@/components/PageTitle";
import { CardContent } from '@/components/Card';
import Map from "@/components/Map";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

// import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// type Props = {};
type Trashbin = {
    id: string;
    name: string;
    fill_level: number;
    fill_level_change: number;
};

const columns: ColumnDef<Trashbin>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "fill_level",
        header: "Fill Level",
    },
    {
        accessorKey: "fill_level_change",
        header: "Change",
    },
];

const data: Trashbin[] = [
    {
        id: "laer-bin-0001",
        name: "Laer Eisdiele",
        fill_level_change: +35,
        fill_level: 75,
    },
    {
        id: "laer-bin-0002",
        name: "Laer Rathaus",
        fill_level_change: -70,
        fill_level: 10,
    },
    {
        id: "laer-bin-0003",
        name: "Mock 1",
        fill_level_change: +10,
        fill_level: 40,
    },
    {
        id: "laer-bin-0004",
        name: "Mock 2",
        fill_level_change: -20,
        fill_level: 20,
    },
    {
        id: "laer-bin-0005",
        name: "Mock 3",
        fill_level_change: +30,
        fill_level: 60,
    },
    {
        id: "laer-bin-0006",
        name: "Mock 4",
        fill_level_change: -40,
        fill_level: 20,
    },
    {
        id: "laer-bin-0007",
        name: "Mock 5",
        fill_level_change: +50,
        fill_level: 70,
    },
    {
        id: "laer-bin-0008",
        name: "Mock 6",
        fill_level_change: -60,
        fill_level: 40,
    },
    {
        id: "laer-bin-0009",
        name: "Mock 7",
        fill_level_change: +70,
        fill_level: 70,
    },
    {
        id: "laer-bin-0010",
        name: "Mock 8",
        fill_level_change: -80,
        fill_level: 20,
    },
    {
        id: "laer-bin-0011",
        name: "Mock 9",
        fill_level_change: +90,
        fill_level: 90,
    },
    {
        id: "laer-bin-0012",
        name: "Mock 10",
        fill_level_change: -100,
        fill_level: 10,
    }
];


const RoutePlanning = () => {
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Route Planning" />
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <div className="w-full h-[400px]">
            <Map />
          </div>
        </CardContent>
        <CardContent>
           <div className="w-full h-[400px] overflow-auto">
            <DataTable columns={columns} data={data} />
        </div>
        </CardContent>
      </section>

      <div className="flex-col">
        <h1 className="text-2xl font-bold">Options</h1>
        <div className="flex items-center mb-3">
            <p>Driver: </p>
            <Select>
            <SelectTrigger className="w-[180px] ml-2">
                <SelectValue placeholder="Select Driver" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="driver_a">Alice</SelectItem>
                <SelectItem value="driver_b">Bob</SelectItem>
                <SelectItem value="driver_c">Carol</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className="flex items-center mb-3">
            <p>Time Constraint: </p>
            <Input
                type="number"
                placeholder="Minutes"
                className="w-[180px] mx-2"
                step="30"
            />
            <p>Minutes</p>
        </div>
        <div className="flex items-center">
            <p>Optimization Criterion: </p>
            <Select>
            <SelectTrigger className="w-[180px] ml-2">
                <SelectValue placeholder="Select Criterion" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="time">Time</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>

      <section className="grid grid-cols-2  gap-4 transition-all lg:grid-cols-4">
        <Button className="bg-green-600 text-white">Show Route</Button>
        <Button className="bg-green-600 text-white">Export to Maps</Button>
        <Button className="bg-green-600 text-white">Assign Route</Button>
        <Button className="bg-red-600 text-white">Unassign All Bins</Button>
      </section>
    </div>
  );
};

export default RoutePlanning;
