"use client";

import PageTitle from "@/components/PageTitle";
import { Info } from "lucide-react";
import { CardContent } from "@/components/Card";
import NoiseChart from "@/components/NoiseChart";

export default function NoiseDashboard() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Noise Dashboard" />
      <div className="flex items-center justify-start">
        <p className="text-lg">Active time interval: 10PM to 6AM</p>
        <Info className="text-gray-500 ml-5 mr-2" />
        <p className="text-lg text-gray-500">The time interval can be changed in the settings</p>
      </div>
      <section className="grid grid-cols-1  gap-4 transition-all">
        <CardContent>
          <p className="p-4 font-semibold">Noise Level (dB)</p>
          <NoiseChart />
        </CardContent>
      </section>
      <div className="flex items-center justify-start">
        <Info className="text-gray-500 mr-2" />
        <p className="text-lg text-gray-500">Hover over the points in the red area to see the classification of the model.</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg">
          <span className="text-red-500">Red points</span> are irregularities, as they satisfy both of the following conditions:
        </p>
        <ul className="list-disc pl-5">
          <li>Above the threshold of 80dB.</li>
          <li>Classified as noise <span className="text-gray-500">(instead of sound by cars/weather/...)</span>.</li>
        </ul>
      </div>
    </div>
  );
}
