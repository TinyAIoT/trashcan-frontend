/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */
"use client";

import React, { useEffect, useRef } from "react";
import PageTitle from "@/components/PageTitle";
import "leaflet/dist/leaflet.css";

const MapPage = () => {
  const mapRef = useRef<null | L.Map>(null);

  useEffect(() => {
    // Dynamically import leaflet
    import("leaflet").then((L) => {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/images/leaflet/bin.png",
        iconUrl: "/images/leaflet/marker-icon.png",
        shadowUrl: "/images/leaflet/marker-shadow.png",
      });
      // Ensure window.L is available before trying to use it
      if (!mapRef.current) {
        mapRef.current = window.L.map("map").setView(
          [52.054653343935236, 7.356975282228671],
          16
        );
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap contributors",
          }
        ).addTo(mapRef.current);

        // Define markers with hover effects
        const laerBin1 = window.L.marker([52.05564102823898, 7.360054548481379])
          .addTo(mapRef.current)
          .bindPopup('Smartbin <i>Laer</i> <b>"Rathaus"</b>');
        laerBin1.on("mouseover", (e) => {
          laerBin1.openPopup();
        });
        laerBin1.on("mouseout", (e) => {
          laerBin1.closePopup();
        });

        const laerBin2 = window.L.marker([
          52.054446369474086, 7.357900783032656,
        ])
          .addTo(mapRef.current)
          .bindPopup('Smartbin <i>Laer</i> <b>"Eisdiele"</b>');
        laerBin2.on("mouseover", (e) => {
          laerBin2.openPopup();
        });
        laerBin2.on("mouseout", (e) => {
          laerBin2.closePopup();
        });
      }
    });
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
      <PageTitle title="Map" />
      <div
        id="map"
        style={{ flex: 1, margin: "2px", height: "calc(90% - 4px)" }}
      ></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    </div>
  );
};

export default MapPage;
