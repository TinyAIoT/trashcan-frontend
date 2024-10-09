"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from '@/lib/axios-api'
import PageTitle from "@/components/PageTitle";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trashbin } from '@/app/types';
import { io, Socket } from 'socket.io-client';

// Bins currently always assigned to a single collector
// Treated like a boolean for now: assigned or not assigned
const COLLECTOR_ID = "66fab28bd6afdad80f1d8dca";

const headerSortButton = (column: any, displayname: string) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {displayname}
    </Button>
  );
};

const columns: ColumnDef<Trashbin>[] = [
  {
    accessorKey: "identifier",
    header: ({ column }) => {
      return headerSortButton(column, "Identifier");
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return headerSortButton(column, "Name");
    },
  },
  {
    accessorKey: "fillLevel",
    header: ({ column }) => {
      return headerSortButton(column, "Fill Level");
    },
  },
  {
    accessorKey: "fillLevelChange",
    header: ({ column }) => {
      return headerSortButton(column, "Fill Level Change");
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return headerSortButton(column, "Location");
    },
  },
  {
    accessorKey: "lastEmptied",
    header: ({ column }) => {
      return headerSortButton(column, "Last Emptied");
    },
  },
  {
    accessorKey: "batteryLevel",
    header: ({ column }) => {
      return headerSortButton(column, "Battery Level");
    },
  },
  {
    accessorKey: "signalStrength",
    header: ({ column }) => {
      return headerSortButton(column, "Signal Strength");
    },
  },
  { accessorKey: "assigned", 
    header: ({ column }) => {
      return headerSortButton(column, "Assigned");
    },
  },
];

export default function TrashbinsOverview() {
  const [trashbinData, setTrashbinData] = useState<Trashbin[]>([]);
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);

  const handleClick = useCallback((trashbin: Trashbin) => {
    const city = localStorage.getItem("cityName");
    const type = localStorage.getItem("projectType");
    router.push(`/projects/${city}/${type}/trashbins/${trashbin.identifier}`);
  }, [router]);

  useEffect(() => {
    if (!socket) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);

      newSocket.on('newData', (data) => {
        if(data.message.fill_level) {
          let adjustedFillLevel = (data.message.fill_level<1) ? data.message.fill_level*100 : data.message.fill_level;
          setTrashbinData(trashbinData => {
            if(trashbinData) {
              return {
                ...trashbinData,  // Copy the previous state
                fillLevel: adjustedFillLevel,  // Update only the 'status' field
              };
            }
            return trashbinData;
          });
        }
        if(data.message.battery_level) {
          let adjustedBatteryLevel = (data.message.battery_level<1) ? data.message.battery_level*100 : data.message.battery_level;
          setTrashbinData(trashbinData => {
            if(trashbinData) {
              return {
                ...trashbinData,  // Copy the previous state
                batteryLevel: adjustedBatteryLevel,  // Update only the 'status' field
              };
            }
            return trashbinData;
          });
        }
        
        console.log('Received new data:', data);
        // Update your frontend UI with the new data
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
        var transformedTrashbinData: Trashbin[] = allTrashbinsResponse.data.trashbins;

        // Get the currently assigned bins
        const assignedTrashbinsResponse = await api.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trash-collector/${COLLECTOR_ID}/trashbins`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        const assignedTrashbins = assignedTrashbinsResponse.data.assignedTrashbins.map((item: Trashbin) => item._id);

        // Set the assigned property for each trashbin to true, if its id is in the assignedTrashbins array
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

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Trashbins" />
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
