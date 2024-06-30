"use client";

import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import Map from "@/components/Map";
import axios from "axios";
import { LatLngTuple } from "leaflet";


const MapPage = () => {
  const [trashbinData, setTrashbinData] = useState([]);
  const [centerCoordinates, setCenterCoordinates] = useState<LatLngTuple | null>(null);
  const [initialZoom, setInitialZoom] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const projectId = localStorage.getItem("projectId");

        const trashbinResponse = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin?project=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );

        const transformedTrashbinData = trashbinResponse.data.trashbins.map((item: any) => {
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
            imageUrl: item.image,
          };
        });

        setTrashbinData(transformedTrashbinData);

        const projectResponse = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );
        setInitialZoom(projectResponse.data.project.initialZoom);
        setCenterCoordinates(projectResponse.data.project.centerCoords);
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
        { centerCoordinates && initialZoom && (
          <Map trashbinData={trashbinData} centerCoordinates={centerCoordinates} initialZoom={initialZoom} />
        )}
      </div>
    </div>
  );
};

export default MapPage;
