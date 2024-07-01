"use client";
import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import axios from "axios";

export default function ProjectSettings() {
  const [trashbinData, setTrashbinData] = useState([]);
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [zoomLevel, setZoomLevel] = useState(0);
  const [fillLevelInterval, setFillLevelInterval] = useState(0);
  const [fillThresholds, setFillThresholds] = useState([0, 0]);
  const [batteryThresholds, setBatteryThresholds] = useState([0, 0]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const projectId = localStorage.getItem("projectId");

        const projectResponse = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );

        const { centerCoords, initialZoom, preferences } =
          projectResponse.data.project;
        setCoordinates({
          latitude: centerCoords[0],
          longitude: centerCoords[1],
        });
        setZoomLevel(initialZoom);
        setFillThresholds(preferences.fillThresholds);
        setBatteryThresholds(preferences.batteryThresholds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCoordinateChange = (key, value) => {
    setCoordinates((prevCoordinates) => ({
      ...prevCoordinates,
      [key]: value,
    }));
    setUpdated(false); // Reset update status when coordinates are changed
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const projectId = localStorage.getItem("projectId");

      await axios.patch(
        `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/project/${projectId}`,
        {
          centerCoords: [coordinates.latitude, coordinates.longitude],
          initialZoom: zoomLevel,
          preferences: {
            fillThresholds,
            batteryThresholds,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, "")}`,
          },
        }
      );

      console.log("Settings updated successfully!");
      setUpdated(true); // Set updated status to true
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleCancel = () => {
    window.location.href = window.location.href.replace("/settings", "");
    setUpdated(false); // Reset update status when canceled
  };

  useEffect(() => {
    if (updated) {
      // Redirect to the root URL if settings were successfully updated
      window.location.href = window.location.href.replace("/settings", "");
    }
  }, [updated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <PageTitle title="Project Settings" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Latitude</label>
          <input
            type="number"
            value={coordinates.latitude}
            onChange={(e) =>
              handleCoordinateChange("latitude", Number(e.target.value))
            }
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Longitude</label>
          <input
            type="number"
            value={coordinates.longitude}
            onChange={(e) =>
              handleCoordinateChange("longitude", Number(e.target.value))
            }
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Zoom Level</label>
          <input
            type="number"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Fill Level Thresholds</label>
          <div className="flex">
            <input
              type="number"
              value={fillThresholds[0]}
              onChange={(e) =>
                setFillThresholds([Number(e.target.value), fillThresholds[1]])
              }
              className="border border-gray-300 rounded-l px-3 py-2 w-1/2"
            />
            <input
              type="number"
              value={fillThresholds[1]}
              onChange={(e) =>
                setFillThresholds([fillThresholds[0], Number(e.target.value)])
              }
              className="border border-gray-300 rounded-r px-3 py-2 w-1/2"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Battery Level Thresholds</label>
          <div className="flex">
            <input
              type="number"
              value={batteryThresholds[0]}
              onChange={(e) =>
                setBatteryThresholds([
                  Number(e.target.value),
                  batteryThresholds[1],
                ])
              }
              className="border border-gray-300 rounded-l px-3 py-2 w-1/2"
            />
            <input
              type="number"
              value={batteryThresholds[1]}
              onChange={(e) =>
                setBatteryThresholds([
                  batteryThresholds[0],
                  Number(e.target.value),
                ])
              }
              className="border border-gray-300 rounded-r px-3 py-2 w-1/2"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Save Settings
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
