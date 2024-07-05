"use client";
import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import axios from "axios";

export default function ProjectSettings() {
  const [mapCenterCoordinates, setMapCenterCoordinates] = useState<[string, string]>(["0", "0"]);
  const [startEndCoordinates, setStartEndCoordinates] = useState<[string, string]>(["0", "0"]);
  const [zoomLevel, setZoomLevel] = useState<string>("0");
  const [fillLevelInterval, setFillLevelInterval] = useState<string>("0");
  const [fillThresholds, setFillThresholds] = useState<[string, string]>(["0", "0"]);
  const [batteryThresholds, setBatteryThresholds] = useState<[string, string]>(["0", "0"]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [errors, setErrors] = useState({ mapCenter: "", startEnd: "", zoomLevel: "", fillLevelInterval: "", fillThresholds: "", batteryThresholds: ""});

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

        const { centerCoords, initialZoom, preferences, fillLevelChangeHours } =
          projectResponse.data.project;

        setMapCenterCoordinates([centerCoords[0], centerCoords[1]]);
        setStartEndCoordinates([centerCoords[0] + 1, centerCoords[1] + 1]);   // TODO: Wait for backend to implement
        setZoomLevel(initialZoom);
        setFillLevelInterval(fillLevelChangeHours);
        setFillThresholds(preferences.fillThresholds);
        setBatteryThresholds(preferences.batteryThresholds);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleMapCenterCoordinateChange = (key: string, value: string): void => {
    if ( !/^[0-9.-]*$/.test(value) ) {value = "0"}  // Check if value contains something else than numbers or dots
    if (key === "latitude") setMapCenterCoordinates((prevCoordinates) => [value, prevCoordinates[1]]);
    if (key === "longitude") setMapCenterCoordinates((prevCoordinates) => [prevCoordinates[0], value]);
    setUpdated(false);
  };

  const handleStartEndCoordinateChange = (key: string, value: string): void => {
    if ( !/^[0-9.-]*$/.test(value) ) {value = "0"}  // Check if value contains something else than numbers or dots
    if (key === "latitude") setStartEndCoordinates((prevCoordinates) => [value, prevCoordinates[1]]);
    if (key === "longitude") setStartEndCoordinates((prevCoordinates) => [prevCoordinates[0], value]);
    setUpdated(false);
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // Validate all fields
    let isValid = true;
    let newErrors = { mapCenter: "", startEnd: "", zoomLevel: "", fillLevelInterval: "", fillThresholds: "", batteryThresholds: ""};

    // Check latitude and longitude of map center
    try {
      var mapCenterLat = parseFloat(mapCenterCoordinates[0]);
      var mapCenterLng = parseFloat(mapCenterCoordinates[1]);
      if (
        mapCenterLat < -90 || mapCenterLat > 90 ||
        mapCenterLng < -180 || mapCenterLng > 180
      ) {
        isValid = false;
        newErrors.mapCenter = "Map center coordinates must be valid latitude (-90 to 90) and longitude (-180 to 180).";
      }
    }
    catch (error) {
      isValid = false;
      newErrors.mapCenter = "Map center coordinates must be real numbers.";
    }
    // Check latitude and longitude of start and end location of routes
    try {
      var startEndLat = parseFloat(startEndCoordinates[0]);
      var startEndLng = parseFloat(startEndCoordinates[1]);
      if (
        startEndLat < -90 || startEndLat > 90 ||
        startEndLng < -180 || startEndLng > 180
      ) {
        isValid = false;
        newErrors.startEnd = "Start and end coordinates must be valid latitude (-90 to 90) and longitude (-180 to 180).";
      }
    }
    catch (error) {
      isValid = false;
      newErrors.startEnd = "Start and end coordinates must be real numbers.";
    }

    // Check zoom level
    try {
      var zoom = parseFloat(zoomLevel);
      if (zoom < 0 || zoom > 20) {
        isValid = false;
        newErrors.zoomLevel = "Zoom level must be a number between 0 and 20.";
      }
    }
    catch (error) {
      isValid = false;
      newErrors.zoomLevel = "Zoom level must be a real number.";
    }

    // Check fill level interval
    try {
      var interval = parseFloat(fillLevelInterval);
      if (interval < 0) {
        isValid = false;
        newErrors.fillLevelInterval = "Fill level interval must be a positive number.";
      }
    }
    catch (error) {
      isValid = false;
      newErrors.fillLevelInterval = "Fill level interval must be a real number.";
    }

    // Check fill level thresholds
    try {
      var fill1 = parseFloat(fillThresholds[0]);
      var fill2 = parseFloat(fillThresholds[1]);
      if (fill1 < 0 || fill1 > 100 || fill2 < 0 || fill2 > 100) {
        isValid = false;
        newErrors.fillThresholds = "Fill level thresholds must be numbers between 0 and 100.";
      }
      // First number must be smaller than the second number
      if (fill1 > fill2) {
        isValid = false;
        newErrors.fillThresholds = "First fill level threshold must not be larger than the second threshold.";
      }
    }
    catch (error) {
      isValid = false;
      newErrors.fillThresholds = "Fill level thresholds must be real numbers.";
    }

    // Check battery level thresholds
    try {
      var battery1 = parseFloat(batteryThresholds[0]);
      var battery2 = parseFloat(batteryThresholds[1]);
      if (battery1 < 0 || battery1 > 100 || battery2 < 0 || battery2 > 100) {
        isValid = false;
        newErrors.batteryThresholds = "Battery level thresholds must be numbers between 0 and 100.";
      }
      if (battery1 < battery2) {
        isValid = false;
        newErrors.batteryThresholds = "First battery level threshold must not be smaller than the second threshold.";
      }
    }
    catch (error) {
      isValid = false;
      newErrors.batteryThresholds = "Battery level thresholds must be real numbers.";
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const projectId = localStorage.getItem("projectId");

      // TODO: Patch startEndCoords (wait for backend to implement)

      await axios.patch(
        `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/project/${projectId}`,
        {
          centerCoords: [mapCenterCoordinates[0], mapCenterCoordinates[1]],
          initialZoom: zoomLevel,
          preferences: {
            fillThresholds,
            batteryThresholds,
          },
          fillLevelChangeHours: fillLevelInterval,
        },
        {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, "")}`,
          },
        }
      );

      console.log("Settings updated successfully!");
      setUpdated(true);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleCancel = () => {
    window.location.href = window.location.href.replace("/settings", "");
    setUpdated(false);
  };

  useEffect(() => {
    if (updated) {
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
          <label className="mb-1 font-medium">Latitude & Longitude of map center</label>
          <div className="flex">
            <input
              type="text"
              value={mapCenterCoordinates[0]}
              onChange={(e) =>
                handleMapCenterCoordinateChange("latitude", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              value={mapCenterCoordinates[1]}
              onChange={(e) =>
                handleMapCenterCoordinateChange("longitude", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          {errors.mapCenter && <p className="text-red-500">{errors.mapCenter}</p>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Latitude & Longitude of start and end location of routes</label>
          <div className="flex">
            <input
              type="text"
              value={startEndCoordinates[0]}
              onChange={(e) =>
                handleStartEndCoordinateChange("latitude", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              value={startEndCoordinates[1]}
              onChange={(e) =>
                handleStartEndCoordinateChange("longitude", e.target.value)
              }
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          {errors.startEnd && <p className="text-red-500">{errors.startEnd}</p>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Zoom Level</label>
          <input
            type="text"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {errors.zoomLevel && <p className="text-red-500">{errors.zoomLevel}</p>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">
            Fill Level Interval (Hours)
          </label>
          <input
            type="text"
            value={fillLevelInterval}
            onChange={(e) => setFillLevelInterval(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          {errors.fillLevelInterval && <p className="text-red-500">{errors.fillLevelInterval}</p>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Fill Level Thresholds</label>
          <div className="flex">
            <input
              type="text"
              value={fillThresholds[0]}
              onChange={(e) => setFillThresholds([e.target.value, fillThresholds[1]])}
              className="border border-gray-300 rounded-l px-3 py-2 w-1/2"
            />
            <input
              type="text"
              value={fillThresholds[1]}
              onChange={(e) => setFillThresholds([fillThresholds[0], e.target.value])}
              className="border border-gray-300 rounded-r px-3 py-2 w-1/2"
            />
          </div>
          {errors.fillThresholds && <p className="text-red-500">{errors.fillThresholds}</p>}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Battery Level Thresholds</label>
          <div className="flex">
            <input
              type="text"
              value={batteryThresholds[0]}
              onChange={(e) => setBatteryThresholds([e.target.value, batteryThresholds[1]])}
              className="border border-gray-300 rounded-l px-3 py-2 w-1/2"
            />
            <input
              type="text"
              value={batteryThresholds[1]}
              onChange={(e) => setBatteryThresholds([batteryThresholds[0], e.target.value])}
              className="border border-gray-300 rounded-r px-3 py-2 w-1/2"
            />
          </div>
          {errors.batteryThresholds && <p className="text-red-500">{errors.batteryThresholds}</p>}
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
