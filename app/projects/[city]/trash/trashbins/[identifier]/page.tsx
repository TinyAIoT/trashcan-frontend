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
import LoadingComponent from "@/components/LoadingComponent";
import { time } from "console";

interface HistoryDataItem {
  timestamp: Date;
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
  const [fillThresholds, setFillThresholds] = useState<[number, number]>([20, 80]);
  const [batteryThresholds, setBatteryThresholds] = useState<[number, number]>([80, 20]);
  
  const [data, setData] = useState<Trashbin | null>(null);
  const [fillLevelData, setFillLevelData] = useState<DataItem[]>([]);
  const [batteryLevelData, setBatteryLevelData] = useState<DataItem[]>([]);

  const [history, setHistory] = useState<HistoryDataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Fetch trashbin data
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trashbin/${params.identifier}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        setData(response.data);

        // Fetch project settings
        const projectId = localStorage.getItem("projectId");
        const projectResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        setFillThresholds(projectResponse.data.project.preferences.fillThresholds);
        setBatteryThresholds(projectResponse.data.project.preferences.batteryThresholds);

        // Sensor IDs of the trashbin
        const sensorIds = response.data.sensors;
        // Fetch history data of the two sensors
        const historyResponse0 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history/sensor/${sensorIds[0]}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        if (historyResponse0.data) {
          const measurements = historyResponse0.data.map((item: any) => ({
            timestamp: new Date(item.createdAt),
            measurement: item.measurement,
          }));
          const measureType = historyResponse0.data[0].measureType;

          if (measureType === "fill_level") {
            setFillLevelData(measurements);
          }
          if (measureType === "battery_level") {
            setBatteryLevelData(measurements);
          }
        }

        const historyResponse1 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history/sensor/${sensorIds[1]}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        if (historyResponse1.data) {
          const measurements = historyResponse1.data.map((item: any) => ({
            timestamp: new Date(item.createdAt),
            measurement: item.measurement,
          }));
          const measureType = historyResponse1.data[0].measureType;

          if (measureType === "fill_level") {
            setFillLevelData(measurements);
          }
          if (measureType === "battery_level") {
            setBatteryLevelData(measurements);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.identifier]);

  // Hook to combine the two sensor data to one HistoryDataItem array
  useEffect(() => {
    const roundToNearestSecond = (date: Date) => {
      return new Date(Math.round(date.getTime() / 1000) * 1000);
    };

    const roundedFillLevelData = fillLevelData.map(item => ({
      timestamp: roundToNearestSecond(item.timestamp),
      measurement: item.measurement,
    }));

    const roundedBatteryLevelData = batteryLevelData.map(item => ({
      timestamp: roundToNearestSecond(item.timestamp),
      measurement: item.measurement,
    }));

    const timestamps = new Set([...roundedFillLevelData.map(item => item.timestamp.getTime()), ...roundedBatteryLevelData.map(item => item.timestamp.getTime())]);
    const fillLevels = new Map(roundedFillLevelData.map(item => [item.timestamp.getTime(), item.measurement]));
    const batteryLevels = new Map(roundedBatteryLevelData.map(item => [item.timestamp.getTime(), item.measurement]));

    const historyData: HistoryDataItem[] = [];

    timestamps.forEach(timestamp => {
      historyData.push({
        timestamp: new Date(timestamp),
        fillLevel: fillLevels.get(timestamp) ?? 0,
        batteryLevel: batteryLevels.get(timestamp) ?? 0,
      });
    });

    historyData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    setHistory(historyData);
  }, [fillLevelData, batteryLevelData]);


  if (!data) {
    return <LoadingComponent />;
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
          <Link href={getEditUrl()}>Edit Trashbin</Link>
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
              { fillLevelData.length > 0 &&
                <LineChart
                  historyData={fillLevelData}
                  green={[0, fillThresholds[0]]}
                  yellow={[fillThresholds[0], fillThresholds[1]]}
                  red={[fillThresholds[1], 100]}
                />
              }
            </CardContent>
            <CardContent>
              <p className="p-4 font-semibold">Battery Level</p>
              { batteryLevelData.length > 0 &&
                <LineChart
                  historyData={batteryLevelData}
                  green={[batteryThresholds[0], 100]}
                  yellow={[batteryThresholds[1], batteryThresholds[0]]}
                  red={[0, batteryThresholds[1]]}
                />
              }
            </CardContent>
          </section>
        </TabsContent>
        <TabsContent value="table">
          <div className="h-[510px] overflow-y-auto">
            <DataTable
              columns={columns}
              data={history}
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
            <p>Last Emptied: {data.lastEmptied ? data.lastEmptied.toString() : "Not available"}</p>
            <p>Signal Strength: {data.signalStrength}</p>
          </section>
      
    </div>
  );
}
