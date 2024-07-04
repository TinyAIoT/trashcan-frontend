"use client";
import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import axios from "axios";

export default function AppSettings() {
  const [noiseThreshold, setNoiseThreshold] = useState<string>("");
  const [confidenceThreshold, setConfidenceThreshold] = useState<string>("");
  const [activeTimeInterval, setActiveTimeInterval] = useState<[string, string]>(["", ""]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [errors, setErrors] = useState({ noiseThreshold: "", confidenceThreshold: "", activeTimeInterval: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // TODO: Wait for backend to implement

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

        const noiseThreshold = String(80);          // Over 80dB
        const confidenceThreshold = String(0.8);    // Over 80% confidence
        const activeTimeInterval: [string, string] = ["22", "6"]; // 10PM to 6AM

        setNoiseThreshold(noiseThreshold);
        setConfidenceThreshold(confidenceThreshold);
        setActiveTimeInterval(activeTimeInterval);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // Validate all fields
    let isValid = true;
    let newErrors = { noiseThreshold: "", confidenceThreshold: "", activeTimeInterval: "" }
    try {
      var noiseThresholdNum = parseInt(noiseThreshold);
      if (isNaN(noiseThresholdNum) || noiseThresholdNum < 0 || noiseThresholdNum > 120) {
        newErrors.noiseThreshold = "Noise threshold must be a number between 0 and 120.";
        isValid = false;
      }
    }
    catch (error) {
      isValid = false;
      newErrors.noiseThreshold = "Noise threshold must be a number between 0 and 120.";
    }

    try {
      var confidenceThresholdNum = parseFloat(confidenceThreshold);
      if (isNaN(confidenceThresholdNum) || confidenceThresholdNum < 0 || confidenceThresholdNum > 1) {
        newErrors.confidenceThreshold = "Confidence threshold must be a number between 0 and 1.";
        isValid = false;
      }
    }
    catch (error) {
      isValid = false;
      newErrors.confidenceThreshold = "Confidence threshold must be a number between 0 and 1.";
    }

    try {
      var startHour = parseInt(activeTimeInterval[0]);
      var endHour = parseInt(activeTimeInterval[1]);
      if (isNaN(startHour) || startHour < 0 || startHour > 24 || isNaN(endHour) || endHour < 0 || endHour > 23) {
        newErrors.activeTimeInterval = "Active time interval must be a number between 0 and 24.";
        isValid = false;
      }
      if (startHour >= endHour) {
        newErrors.activeTimeInterval = "Start hour must be before end hour.";
        isValid = false;
      }
    }
    catch (error) {
      isValid = false;
      newErrors.activeTimeInterval = "Active time interval must be a number between 0 and 24.";
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

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
            type="text"
            value={noiseThreshold}
            onChange={(e) => setNoiseThreshold(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        {errors.noiseThreshold && <p className="text-red-500">{errors.noiseThreshold}</p>}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Confidence Threshold</label>
          <input
            type="text"
            step="0.01"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        {errors.confidenceThreshold && <p className="text-red-500">{errors.confidenceThreshold}</p>}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Active Time Interval (Hours)</label>
          <div className="flex">
            <input
              type="text"
              value={activeTimeInterval[0]}
              onChange={(e) => setActiveTimeInterval([e.target.value, activeTimeInterval[1]])}
              className="border border-gray-300 rounded-l px-3 py-2 w-1/2"
            />
            <input
              type="text"
              value={activeTimeInterval[1]}
              onChange={(e) => setActiveTimeInterval([activeTimeInterval[0], e.target.value])}
              className="border border-gray-300 rounded-r px-3 py-2 w-1/2"
            />
          </div>
        </div>
        {errors.activeTimeInterval && <p className="text-red-500">{errors.activeTimeInterval}</p>}
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
