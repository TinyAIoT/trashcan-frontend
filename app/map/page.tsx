"use client";

import React from "react";
import PageTitle from "@/components/PageTitle";
import Map from "@/components/Map";

interface Trashbin {
  lat: number;
  lng: number;
  fill: number;
  fillLevelChange: number;
  battery: number;
  id: string;
  display: string;
}

const trashbinData: Trashbin[] = [
  {id: 'laer-bin-0001', display: '<b>Rathaus</b>', lat: 52.05564102823898, lng: 7.360054548481379, fill: 10, fillLevelChange: -50, battery: 100},
  {id: 'laer-bin-0002', display: '<b>Eisdiele</b>', lat: 52.054446369474086, lng: 7.357900783032656, fill: 20, fillLevelChange: -40,  battery: 95},
  {id: 'laer-bin-0003', display: 'Mock 1', lat: 52.05740200167625, lng: 7.358153181917018, fill: 30, fillLevelChange: -30,  battery: 90},
  {id: 'laer-bin-0004', display: 'Mock 2', lat: 52.05984470069173, lng: 7.354508167781202, fill: 40, fillLevelChange: -20,  battery: 85},
  {id: 'laer-bin-0005', display: 'Mock 3', lat: 52.05858758029923, lng: 7.348339576126552, fill: 50, fillLevelChange: -10,  battery: 80},
  {id: 'laer-bin-0006', display: 'Mock 4', lat: 52.056849321616546, lng: 7.348257774319442, fill: 60, fillLevelChange: 10,  battery: 75},
  {id: 'laer-bin-0007', display: 'Mock 5', lat: 52.05484146301711, lng: 7.344537017805167, fill: 70, fillLevelChange: 20,  battery: 70},
  {id: 'laer-bin-0008', display: 'Mock 6', lat: 52.053822275411655, lng: 7.350998965386141, fill: 80, fillLevelChange: 30,  battery: 65},
  {id: 'laer-bin-0009', display: 'Mock 7', lat: 52.05089302486732, lng: 7.356591490962451, fill: 90, fillLevelChange: 40,  battery: 60},
  {id: 'laer-bin-0010', display: 'Mock 8', lat: 52.052561689808336, lng: 7.359980721247052, fill: 100, fillLevelChange: 50,  battery: 55},
  {id: 'laer-bin-0012', display: 'Mock 9', lat: 52.049990684460234, lng: 7.36145800003346, fill: 10, fillLevelChange: -50,  battery: 50},
  {id: 'laer-bin-0011', display: 'Mock 10', lat: 52.050934789062104, lng: 7.364132550516044, fill: 20, fillLevelChange: -40,  battery: 45},
];

const MapPage = () => {
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
        <Map trashbinData={trashbinData} />
      </div>
    </div>
  );
};

export default MapPage;
