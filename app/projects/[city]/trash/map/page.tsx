"use client";

import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import Map from "@/components/Map";
import axios from "axios";

interface Trashbin {
  lat: number;
  lng: number;
  fill: number;
  fillLevelChange: number;
  battery: number;
  id: string;
  display: string;
}

const MapPage = () => {
  const [trashbinData, setTrashbinData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const projectId = localStorage.getItem("projectId");

        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin?project=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );

        const transformedData = response.data.trashbins.map((item: any) => {
          return {
            // id: item._id,
            identifier: item.identifier,
            name: item.name,
            // coordinates: item.coordinates,
            lat: item.coordinates[0],
            lng: item.coordinates[1],
            fillLevel: item.fillLevel,
            fillLevelChange: item.fillLevelChange,
            batteryLevel: item.batteryLevel,
            signalStrength: item.signalStrength,
          };
        });

        setTrashbinData(transformedData);
        console.log(trashbinData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        padding: "2px",
      }}
    >
      <div className="flex flex-col h-screen p-1">
        <div className="flex justify-between items-center">
          <PageTitle title="Map" />
        </div>
        <Map trashbinData={trashbinData} />
      </div>
    </div>
  );
};

export default MapPage;
