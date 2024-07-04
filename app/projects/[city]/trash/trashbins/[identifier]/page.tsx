// app/trashbins/[identifier]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LineChart from "@/components/LineChart";
import { CardContent } from "@/components/Card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trashbin } from '@/app/types';

function generateMockData(numPoints: number) {
  const data = [];
  const startDate = new Date().getTime(); // current timestamp

  for (let i = 0; i < numPoints; i++) {
    const timestamp = new Date(startDate - i * 1000 * 60 * 120); // every 120 minutes
    const fillLevel = Math.floor(Math.random() * 100); // fill between 0 and 100
    const batteryLevel = Math.floor(Math.random() * 100); // fill between 0 and 100
    data.push({
      timestamp: timestamp.toISOString(),
      fillLevel: fillLevel,
      batteryLevel: batteryLevel,
    });
  }

  return data;
}

interface HistoryDataItem {
  timestamp: string;
  fillLevel: number;
  batteryLevel: number;
}

interface DataItem {
  timestamp: Date;
  measurement: number;
}

const columns: ColumnDef<HistoryDataItem>[] = [
  { accessorKey: "timestamp", header: "Time" },
  { accessorKey: "fillLevel", header: "Fill Level" },
  { accessorKey: "batteryLevel", header: "Battery Level" },
];

export default function TrashbinDetail({
  params,
}: {
  params: { identifier: string };
}) {
  const [data, setData] = useState<Trashbin | null>(null);
  const historyData = generateMockData(100);

  // Convert historyData for the fillLevel chart
  const fillLevelData: DataItem[] = historyData.map(item => ({
    timestamp: new Date(item.timestamp),
    measurement: item.fillLevel,
  }));
  
  // Convert historyData for the batteryLevel chart
  const batteryLevelData: DataItem[] = historyData.map(item => ({
    timestamp: new Date(item.timestamp),
    measurement: item.batteryLevel,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${params.identifier}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );

        const trashbin = {
          _id: response.data._id,
          identifier: response.data.identifier,
          name: response.data.name,
          coordinates: response.data.coordinates,
          location: response.data.location,  // Could use Google Reverse Geocoding API to get location
          project: response.data.project,
          fillLevel: response.data.fillLevel,
          fillLevelChange: response.data.fillLevelChange,
          batteryLevel: response.data.batteryLevel,
          signalStrength: response.data.signalStrength,
          lastEmptied: new Date(response.data.lastEmptied),
          assigned: response.data.assigned,
          imageUrl: response.data.image
        };

        // TODO: Edit Trashbin type to completely match the API response
        // setData(response.data);
        setData(trashbin);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.identifier]);

  if (!data) {
    return <div>Loading...</div>;
  }

  function getEditUrl(): string {
    const city = localStorage.getItem("cityName");
    const type = localStorage.getItem("projectType");
    return `/projects/${city}/${type}/trashbins/${params.identifier}/edit`;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between">
        <PageTitle title={`Trashbin ${data.name} (${data.identifier})`} />
        <Button asChild className="bg-green-600 text-white">
          <Link href={getEditUrl()}>Edit Trashcan</Link>
        </Button>
      </div>
      <Tabs defaultValue="visual" className="">
        <TabsList className="w-full">
          <TabsTrigger value="visual" className="w-full">
            Graphical View
          </TabsTrigger>
          <TabsTrigger value="table" className="w-full">
            Table View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="visual">
          <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
            <CardContent>
              <p className="p-4 font-semibold">Fill Level</p>
              <LineChart
                historyData={fillLevelData}
                green={[0, 30]}
                yellow={[30, 70]}
                red={[70, 100]}
              />
            </CardContent>
            <CardContent>
              <p className="p-4 font-semibold">Battery Level</p>
              <LineChart
                historyData={batteryLevelData}
                green={[80, 100]}
                yellow={[20, 80]}
                red={[0, 20]}
              />
            </CardContent>
          </section>
        </TabsContent>
        <TabsContent value="table">
          <div className="h-[510px] overflow-y-auto">
            <DataTable
              columns={columns}
              data={historyData}
              showSearchBar={false}
              showExportButton={false}
            />
          </div>
        </TabsContent>
      </Tabs>
      <section className="mt-5 mr-4 gap-3">
            <div className="flex gap-3 items-center">
              <p className="inline">Location: {data.location} ({data.coordinates[0]}, {data.coordinates[1]})</p>
              <Button className="bg-green-600 text-white">
                <Link
                  href={`https://www.google.com/maps/@${data.coordinates[0]},${data.coordinates[1]},z=18?q=${data.coordinates[0]},${data.coordinates[1]}`}
                  target="_blank"
                >
                  See on Google Maps
                </Link>
              </Button>
            </div>
            <p>Last Emptied: {data.lastEmptied.toString()}</p>
            <p>Signal Strength: {data.signalStrength}</p>
          </section>
      
    </div>
  );
}
