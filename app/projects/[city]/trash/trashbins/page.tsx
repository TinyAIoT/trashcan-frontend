"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios-api";
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trashbin } from "@/app/types";
import { io, Socket } from "socket.io-client";
import { useTranslation } from "@/lib/TranslationContext"; // Import translation hook

const COLLECTOR_ID = "673b10d6f0e74b4771527ec9";

const headerSortButton = (column: any, displayName: string) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {displayName}
    </Button>
  );
};

export default function TrashbinsOverview() {
  const { t } = useTranslation(); // Translation hook
  const [trashbinData, setTrashbinData] = useState<Trashbin[]>([]);
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleClick = useCallback(
    (trashbin: Trashbin) => {
      const city = localStorage.getItem("cityName");
      const type = localStorage.getItem("projectType");
      router.push(`/projects/${city}/${type}/trashbins/${trashbin.identifier}`);
    },
    [router]
  );

  useEffect(() => {
    if (!socket) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

      newSocket.on("newData", (data) => {
        if (data.message.fill_level) {
          let adjustedFillLevel =
            data.message.fill_level <= 1
              ? data.message.fill_level * 100
              : data.message.fill_level;
          setTrashbinData((trashbinData) => {
            if (trashbinData) {
              let trashbinDataCopy = [...trashbinData];
              trashbinDataCopy = trashbinDataCopy.map((tData) => {
                if (
                  tData.sensors &&
                  tData.sensors.includes(data.message.sensor_id)
                ) {
                  return { ...tData, fillLevel: adjustedFillLevel };
                }
                return tData;
              });
              return trashbinDataCopy;
            }
            return trashbinData;
          });
        }
        if (data.message.battery_level) {
          let adjustedBatteryLevel =
            data.message.battery_level <= 1
              ? data.message.battery_level * 100
              : data.message.battery_level;
          setTrashbinData((trashbinData) => {
            if (trashbinData) {
              let trashbinDataCopy = [...trashbinData];
              trashbinDataCopy = trashbinDataCopy.map((tData) => {
                if (
                  tData.sensors &&
                  tData.sensors.includes(data.message.sensor_id)
                ) {
                  return { ...tData, batteryLevel: adjustedBatteryLevel };
                }
                return tData;
              });
              return trashbinDataCopy;
            }
            return trashbinData;
          });
        }
        console.log("Received new data:", data);
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const projectId = localStorage.getItem("projectId");

        const allTrashbinsResponse = await api.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trashbin?project=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        var transformedTrashbinData: Trashbin[] =
          allTrashbinsResponse.data.trashbins;

        const assignedTrashbinsResponse = await api.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trash-collector/${COLLECTOR_ID}/trashbins`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        const assignedTrashbins = assignedTrashbinsResponse.data.assignedTrashbins.map(
          (item: Trashbin) => item._id
        );

        transformedTrashbinData = transformedTrashbinData.map((item: Trashbin) => {
          return {
            ...item,
            assigned: assignedTrashbins.includes(item._id),
          };
        });

        setTrashbinData(transformedTrashbinData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const columns: ColumnDef<Trashbin>[] = [
    {
      accessorKey: "identifier",
      header: ({ column }) => headerSortButton(column, t("menu.identifier")),
    },
    {
      accessorKey: "name",
      header: ({ column }) => headerSortButton(column, t("menu.name")),
    },
    {
      accessorKey: "fillLevel",
      header: ({ column }) => headerSortButton(column, t("menu.fill_level")),
    },
    {
      accessorKey: "fillLevelChange",
      header: ({ column }) =>
        headerSortButton(column, t("menu.fill_level_change")),
    },
    {
      accessorKey: "location",
      header: ({ column }) => headerSortButton(column, t("menu.location")),
    },
    {
      accessorKey: "lastEmptied",
      header: ({ column }) => headerSortButton(column, t("menu.last_emptied")),
    },
    {
      accessorKey: "batteryLevel",
      header: ({ column }) =>
        headerSortButton(column, t("menu.battery_level")),
    },
    {
      accessorKey: "signalStrength",
      header: ({ column }) =>
        headerSortButton(column, t("menu.signal_strength")),
    },
    {
      accessorKey: "assigned",
      header: ({ column }) => headerSortButton(column, t("menu.assigned")),
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title={t("menu.trashbins")} />
      <div className="w-[80vw]">
        <DataTable
          columns={columns}
          data={trashbinData}
          onRowClick={handleClick}
          showSearchBar={true}
          showExportButton={true}
        />
      </div>
    </div>
  );
}
