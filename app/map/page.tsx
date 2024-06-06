"use client";

import React, { useState }  from "react";
import PageTitle from "@/components/PageTitle";
import Map from "@/components/Map";

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
          <Map />
        </div>
    </div>
  );
};

export default MapPage;
