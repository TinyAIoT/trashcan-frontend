"use client";

import PageTitle from "@/components/PageTitle";
import Card, { CardContent, CardProps } from "@/components/Card";
import { HeatmapFillLevel } from "@/components/Heatmap/HeatmapFillLevel";
import { Trashbin } from "@/app/types";
import React, { useCallback, useState, useEffect } from "react";
import api from "@/lib/axios-api";
import { useTranslation } from "@/lib/TranslationContext"; // Import the translation hook

interface HistoryDataItem {
  timestamp: Date;
  fillLevel: number;
  batteryLevel: number;
}

// Bins currently always assigned to a single collector
// Treated like a boolean for now: assigned or not assigned
const COLLECTOR_ID = "66fab28bd6afdad80f1d8dca";

export default function Home() {
  const { t } = useTranslation(); // Translation hook
  const [trashbinData, setTrashbinData] = useState<Trashbin[]>([]);
  const [totalCardData, setTotalCardData] = useState<CardProps>({
    label: t("menu.total_number"),
    amount: "0",
    description: "",
  });
  const [nearlyFullCardData, setNearlyFullCardData] = useState<CardProps>({
    label: t("menu.nearly_full"),
    amount: "0",
    description: "",
  });
  const [lowBatteryCardData, setLowBatteryCardData] = useState<CardProps>({
    label: t("menu.low_battery"),
    amount: "0",
    description: "",
  });
  const [brokenSensorsCardData, setBrokenSensorsCardData] = useState<CardProps>({
    label: t("menu.broken_sensors"),
    amount: "0",
    description: "",
  });

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
        let transformedTrashbinData: Trashbin[] = allTrashbinsResponse.data.trashbins;

        // Get the currently assigned bins
        const assignedTrashbinsResponse = await api.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trash-collector/${COLLECTOR_ID}/trashbins`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        const assignedTrashbins = assignedTrashbinsResponse.data.assignedTrashbins.map(
          (item: Trashbin) => item._id
        );

        // Set the assigned property for each trashbin to true, if its id is in the assignedTrashbins array
        transformedTrashbinData = transformedTrashbinData.map((item: Trashbin) => ({
          ...item,
          assigned: assignedTrashbins.includes(item._id),
        }));
        setTrashbinData(transformedTrashbinData);

        setTotalCardData((prev) => ({
          ...prev,
          amount: transformedTrashbinData.length.toString(),
        }));

        const projectResponse = await api.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );

        setNearlyFullCardData((prev) => {
          const count = transformedTrashbinData.reduce(
            (acc, item) =>
              item.fillLevel > projectResponse.data.project.preferences.fillThresholds[1]
                ? acc + 1
                : acc,
            0
          );
          return { ...prev, amount: count.toString() };
        });

        setLowBatteryCardData((prev) => {
          const count = transformedTrashbinData.reduce(
            (acc, item) =>
              item.batteryLevel < projectResponse.data.project.preferences.batteryThresholds[1]
                ? acc + 1
                : acc,
            0
          );
          return { ...prev, amount: count.toString() };
        });

        setBrokenSensorsCardData((prev) => {
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const count = transformedTrashbinData.filter(
            (item) => new Date(item.updatedAt) < oneWeekAgo
          ).length;
          return { ...prev, amount: count.toString() };
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Translated title */}
      <PageTitle title={t("menu.dashboard")} />
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-1">
        <CardContent>
          <p className="p-4 text-xl font-semibold">
            {t("menu.Distribution of fill levels of all bins")}
          </p>
          <HeatmapFillLevel trashbins={trashbinData} />
        </CardContent>
      </section>
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        <Card
          key="0"
          amount={totalCardData.amount}
          description={totalCardData.description}
          label={totalCardData.label}
        />
        <Card
          key="1"
          amount={nearlyFullCardData.amount}
          description={nearlyFullCardData.description}
          label={nearlyFullCardData.label}
        />
        <Card
          key="2"
          amount={lowBatteryCardData.amount}
          description={lowBatteryCardData.description}
          label={lowBatteryCardData.label}
        />
        <Card
          key="3"
          amount={brokenSensorsCardData.amount}
          description={brokenSensorsCardData.description}
          label={brokenSensorsCardData.label}
        />
      </section>
    </div>
  );
}
