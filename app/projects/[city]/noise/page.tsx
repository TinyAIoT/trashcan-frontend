"use client";

import React, { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import { Info, Settings } from "lucide-react";
import { CardContent } from "@/components/Card";
import NoiseChart from "@/components/NoiseChart";
import axios from "axios";


export default function NoiseDashboard() {
  const [activeTimeInterval, setActiveTimeInterval] = useState<[number, number]>([0, 0]);
  const [noiseThreshold, setNoiseThreshold] = useState<number>(0);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0);

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

        const { activeTimeInterval, noiseThreshold, confidenceThreshold } =
          projectResponse.data.project;

        setNoiseThreshold(parseInt(noiseThreshold));
        setConfidenceThreshold(parseFloat(confidenceThreshold));
        // TODO: Handle both values when implemented by backend
        setActiveTimeInterval([parseInt(activeTimeInterval), parseInt(activeTimeInterval)]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Noise Dashboard" />
      <section className="grid grid-cols-1  gap-4 transition-all">
        <CardContent>
          <p className="p-4 font-semibold">Noise Level (dB)</p>
          <NoiseChart
            noiseThreshold={noiseThreshold}
            confidenceThreshold={confidenceThreshold} />
        </CardContent>
      </section>
      <div className="flex items-center justify-start">
        <Info className="text-gray-500 mr-2" />
        <p className="text-lg text-gray-500">Hover over the points in the red area to see the classification of the model.</p>
      </div>
      <div className="flex flex-col gap-2">
      <div className="flex items-center justify-start">
        <p className="text-lg">Active time interval of noise detector:&nbsp;
          <span className="text-blue-500 settings-tooltip">
            {activeTimeInterval[0].toString().padStart(2, '0')}:00 - {activeTimeInterval[1].toString().padStart(2, '0')}:00
            <span className="settings-tooltip-text">This value can be changed in the settings</span>
          </span>
        </p>
        <Settings className="text-blue-500 ml-2 settings-tooltip"/>
      </div>
        <p className="text-lg">
          <span className="text-red-500">Red points</span> are irregularities, as they satisfy both of the following conditions:
        </p>
        <ul className="list-disc pl-5">
          <li>
            <div className="flex items-center justify-start">
              <p className="text-lg">Above the threshold of&nbsp;
                <span className="text-blue-500 settings-tooltip">
                  {noiseThreshold}dB
                  <span className="settings-tooltip-text">This value can be changed in the settings</span>
                </span>
              </p>
              <Settings className="text-blue-500 ml-2 settings-tooltip"/>
            </div>
          </li>
          <li>
            <div className="flex items-center justify-start">
              <p className="text-lg">Classified as noise with a confidence greater than&nbsp;
                <span className="text-blue-500 settings-tooltip">
                {confidenceThreshold * 100}%
                  <span className="settings-tooltip-text">This value can be changed in the settings</span>
                </span>
              </p>
              <Settings className="text-blue-500 ml-2 settings-tooltip"/>
            </div>   
          </li>
        </ul>
      </div>
    </div>
  );
}

 