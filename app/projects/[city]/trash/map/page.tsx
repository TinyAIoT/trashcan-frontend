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
  const [fillThresholds, setFillThresholds] = useState<[number, number] | null>(null);
  const [batteryThresholds, setBatteryThresholds] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const projectId = localStorage.getItem("projectId");

        const trashbinResponse = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin?project=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
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
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        setInitialZoom(projectResponse.data.project.initialZoom);
        setCenterCoordinates(projectResponse.data.project.centerCoords);
        setFillThresholds(projectResponse.data.project.preferences.fillThresholds);
        setBatteryThresholds(projectResponse.data.project.preferences.batteryThresholds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-[90vh]">
      <div className="pb-2">
        <PageTitle title="Map" />
      </div>
      {/* Make sure that all information was fetched from the backend before rendering the map */}
      { centerCoordinates && initialZoom && fillThresholds && batteryThresholds && (
        <Map
          trashbinData={trashbinData}
          centerCoordinates={centerCoordinates}
          initialZoom={initialZoom}
          fillThresholds={fillThresholds}
          batteryThresholds={batteryThresholds}
          isRoutePlanning={false}
        />
      )}
    </div>
  );
};

export default MapPage;
