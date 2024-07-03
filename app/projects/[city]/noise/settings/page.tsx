"use client";
import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import axios from "axios";

export default function AppSettings() {
  const [noiseThreshold, setNoiseThreshold] = useState(80);               // Over 80dB
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);    // Over 80% confidence
  const [activeTimeInterval, setActiveTimeInterval] = useState([22, 6]);  // 10PM to 6AM
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // const settingsResponse = await axios.get(
        //   `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/settings`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token?.replace(/"/g, "")}`,
        //     },
        //   }
        // );

        // const { noiseThreshold, confidenceThreshold, activeTimeInterval } =
        //   settingsResponse.data.settings;

        // setNoiseThreshold(noiseThreshold);
        // setConfidenceThreshold(confidenceThreshold);
        // setActiveTimeInterval(activeTimeInterval);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleActiveTimeChange = (index: number, value: number) => {
    const updatedInterval = [...activeTimeInterval];
    updatedInterval[index] = value;
    setActiveTimeInterval(updatedInterval);
    setUpdated(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("authToken");

      await axios.patch(
        `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/settings`,
        {
          noiseThreshold,
          confidenceThreshold,
          activeTimeInterval,
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
      <PageTitle title="App Settings" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Noise Threshold</label>
          <input
            type="number"
            value={noiseThreshold}
            onChange={(e) => setNoiseThreshold(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Confidence Threshold</label>
          <input
            type="number"
            step="0.01"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Active Time Interval (Hours)</label>
          <div className="flex">
            <input
              type="number"
              value={activeTimeInterval[0]}
              onChange={(e) =>
                handleActiveTimeChange(0, Number(e.target.value))
              }
              className="border border-gray-300 rounded-l px-3 py-2 w-1/2"
            />
            <input
              type="number"
              value={activeTimeInterval[1]}
              onChange={(e) =>
                handleActiveTimeChange(1, Number(e.target.value))
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
