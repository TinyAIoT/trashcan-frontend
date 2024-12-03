/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from 'react-dom/client';
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Trash2, BatteryFull, Signal } from "lucide-react";
import { Trashbin } from '@/app/types';

interface MapProps {
  trashbinData: Trashbin[];
  centerCoordinates: LatLngTuple;
  initialZoom: number;
  fillThresholds: [number, number];
  batteryThresholds: [number, number];
  onTrashbinClick: (trashbin: Trashbin) => void;
  isRoutePlanning: boolean;  // true on route planning page, false on map page
  // The following fields must only be set if isRoutePlanning is true
  tripStartEnd?: LatLngTuple;
  selectedBins?: Trashbin[];
  optimizedBins?: Trashbin[];
  showRoute?: boolean;
}

function PopupContent({ trashbin, routePlanning, fillThresholds, batteryThresholds } : {
  trashbin: Trashbin, 
  routePlanning: boolean, 
  fillThresholds: [number, number], 
  batteryThresholds: [number, number],
}) {
  return (
    <div id={`popup-${trashbin.identifier}`}>
      <div className="text-base font-semibold flex justify-center items-center">
        {trashbin.name}
      </div>
      <hr />
      <div className="flex flex-row items-center justify-between mt-1">
        <div className="flex items-center mr-3">
          <Trash2 size="16px" className={`mr-1 ${trashbin.fillLevel < fillThresholds[0] ? 'text-green-500' : trashbin.fillLevel < fillThresholds[1] ? 'text-yellow-500' : 'text-red-500'}`} />
          <span className={`${trashbin.fillLevel < fillThresholds[0] ? 'text-green-500' : trashbin.fillLevel < fillThresholds[1] ? 'text-yellow-500' : 'text-red-500'}`}>{trashbin.fillLevel}%</span>
        </div>
        {/* Only render the battery level in map page */}
        {!routePlanning && (
          <div className="flex items-center mr-3">
          <BatteryFull size="16px" className={`mr-1 ${trashbin.batteryLevel > batteryThresholds[0] ? 'text-green-500' : trashbin.batteryLevel > batteryThresholds[1] ? 'text-yellow-500' : 'text-red-500'}`} />
          <span className={`mr-1 ${trashbin.batteryLevel > batteryThresholds[0] ? 'text-green-500' : trashbin.batteryLevel > batteryThresholds[1] ? 'text-yellow-500' : 'text-red-500'}`}>{trashbin.batteryLevel}%</span>
        </div>
        )}
        {/* Only render the signal strength in map page */}
        {!routePlanning && (
        <div className="flex items-center">
          <Signal size="16px" className="mr-1" />
          <span>{trashbin.signalStrength}%</span>
        </div>
        )}
      </div>
      {/* Only render the image in map page and if an image exists */}
      {!routePlanning && trashbin.image && (
        <div className="flex justify-center items-center h-full mt-1">
          <img src={trashbin.image} className="max-h-[150px]" alt=""/>
          {/* Alternative placeholder image */}
          {/* <img src="/images/leaflet/bin_bl.png" className="h-[50px]" /> */}
        </div>
      )}
    </div>
  );
}

// Bin icons based on: https://www.vecteezy.com/vector-art/7820754-recycle-icon-garbage-icon-vector-logo-design-template
const createBinIcons = (L: any) => {
  const BinIcon = L.Icon.extend({
    options: {
      shadowUrl: '/images/leaflet/bin_s.png',
      iconSize: [26, 33], // size of icon
      shadowSize: [26, 25], // size of shadow
      iconAnchor: [26 / 2, 33 / 2], // point of icon which will correspond to marker's location
      shadowAnchor: [26 / 2 - 10, 25 / 2], // the same for the shadow
      popupAnchor: [0, -33 / 4], // point from which popup should open relative to iconAnchor
    },
  });

  const BinIconSelected = BinIcon.extend({
    options: {
      iconSize: [35, 35], // size of icon
      popupAnchor: [0, -35 / 4], // point from which popup should open relative to iconAnchor
    },
  });

  return {
    greenBin: new BinIcon({ iconUrl: '/images/leaflet/bin_g.png' }),
    greenBinSelected: new BinIconSelected({ iconUrl: '/images/leaflet/bin_g_b.png' }),
    yellowBin: new BinIcon({ iconUrl: '/images/leaflet/bin_y.png' }),
    yellowBinSelected: new BinIconSelected({ iconUrl: '/images/leaflet/bin_y_b.png' }),
    redBin: new BinIcon({ iconUrl: '/images/leaflet/bin_r.png' }),
    redBinSelected: new BinIconSelected({ iconUrl: '/images/leaflet/bin_r_b.png' }),
    greyBin: new BinIcon({ iconUrl: '/images/leaflet/bin_grey.png' }), // New grey bin icon
    greyBinSelected: new BinIconSelected({ iconUrl: '/images/leaflet/bin_grey_b.png' }), // Selected grey bin
  };
};
// Map initialization
const initializeMap = (L: any, centerCoordinates: LatLngTuple, initialZoom: number, mapRef: any, markersRef: any) => {
  if (!mapRef.current) {
    mapRef.current = L.map("map").setView(centerCoordinates, initialZoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(mapRef.current);
  }

  if (markersRef.current) {
    markersRef.current.clearLayers();
  } else {
    markersRef.current = L.markerClusterGroup({ maxClusterRadius: 40 });    
    if (markersRef.current) {
      mapRef.current.addLayer(markersRef.current);
      markersRef.current.clearLayers();
    }
  }
};

// Markers addition
const addMarkersToMap = async (
  L: any,
  trashbinData: Trashbin[],
  fillThresholds: [number, number],
  batteryThresholds: [number, number],
  selectedBins: Trashbin[] | undefined,
  isRoutePlanning: boolean,
  onTrashbinClick: (trashbin: Trashbin) => void | undefined,
  markersRef: any
) => {
  const {
    greenBin,
    greenBinSelected,
    yellowBin,
    yellowBinSelected,
    redBin,
    redBinSelected,
    greyBin,
    greyBinSelected,
  } = createBinIcons(L);

  // const token = process.env.NEXT_PUBLIC_API_TOKEN;
  const token = localStorage.getItem("authToken");
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Helper function to fetch sensor history
  const fetchSensorHistory = async (sensorId: string): Promise<any[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history/sensor/${sensorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      const data = await response.json();
      return data.map((item: any) => ({
        timestamp: new Date(item.createdAt), // Convert to Date object
        measurement: item.measurement,
        measureType: item.measureType,
        sensor: item.sensor,
      }));
    } catch (error) {
   
      return [];
    }
  };

  const seenCoordinates = new Set<string>();
  const filteredTrashbinData = trashbinData.filter((trashbin) => {
    if (
      !trashbin.coordinates ||
      trashbin.coordinates[0] === null ||
      trashbin.coordinates[1] === null ||
      trashbin.coordinates[0] < -90 ||
      trashbin.coordinates[0] > 90 ||
      trashbin.coordinates[1] < -180 ||
      trashbin.coordinates[1] > 180
    ) {
      return false;
    }
    const coordinateKey = `${trashbin.coordinates[0].toFixed(6)},${trashbin.coordinates[1].toFixed(6)}`;
    if (seenCoordinates.has(coordinateKey)) {
      return false;
    }
    seenCoordinates.add(coordinateKey);
    return true;
  });

  if (markersRef.current) {
    markersRef.current.clearLayers(); // Clear existing markers
  }

  const addedMarkers = new Set<string>();
  for (const trashbin of filteredTrashbinData) {
    const coordinateKey = `${trashbin.coordinates[0].toFixed(6)},${trashbin.coordinates[1].toFixed(6)}`;

    if (addedMarkers.has(coordinateKey)) {
      continue; // Skip duplicates
    }
    addedMarkers.add(coordinateKey);
    // Check if required data is missing
    const isDataMissing =
      !trashbin.name ||
      !trashbin.coordinates ||
      trashbin.coordinates.length !== 2 ||
      !trashbin.sensors?.length;

    let allSensorsHaveOldData = false;

    if (!isDataMissing && trashbin.sensors?.length > 0) {
      const sensorData = await Promise.all(
        trashbin.sensors.map((sensorId) => fetchSensorHistory(sensorId))
      );

      // Check if all sensors lack recent data
      allSensorsHaveOldData = sensorData.every((historyData) =>
        historyData.every((data: { timestamp: Date }) => {
          const lastHistoryDate = new Date(data.timestamp);
       
          return lastHistoryDate.getTime() < oneWeekAgo.getTime();
        })
      );
    }
    const getIcon = () => {
      if (isDataMissing || allSensorsHaveOldData) {
        return greyBinSelected; // Grey if missing data or all sensors have old data
      }
      if (selectedBins?.some((bin) => bin.identifier === trashbin.identifier)) {
        return trashbin.fillLevel < fillThresholds[0]
          ? greenBinSelected
          : trashbin.fillLevel < fillThresholds[1]
          ? yellowBinSelected
          : redBinSelected;
      }
      return trashbin.fillLevel < fillThresholds[0]
        ? greenBin
        : trashbin.fillLevel < fillThresholds[1]
        ? yellowBin
        : redBin;
    };

    const marker = L.marker(
      [trashbin.coordinates[0] ?? 0, trashbin.coordinates[1] ?? 0],
      {
        icon: getIcon(),
      }
    );

    const container = document.createElement("div");
    const popupElement = (
      <PopupContent
        trashbin={trashbin}
        routePlanning={isRoutePlanning}
        fillThresholds={fillThresholds}
        batteryThresholds={batteryThresholds}
      />
    );
    createRoot(container).render(popupElement);
    marker.bindPopup(container);

    marker.on("mouseover", () => marker.openPopup());
    marker.on("click", () => onTrashbinClick(trashbin));
    marker.on("popupopen", (e: any) => {
      L.DomEvent.on(e.popup._contentNode, "click", () => {
        onTrashbinClick(trashbin);
      });
    });

    markersRef.current.addLayer(marker); // Add marker to layer
  }
};

// Route handling
const handleRoutingControl = (L: any, showRoute: boolean = false, optimizedBins: Trashbin[] | undefined, tripStartEnd: LatLngTuple | undefined, mapRef: any, routingControlRef: any) => {
  if (routingControlRef.current && mapRef.current) {
    mapRef.current.removeControl(routingControlRef.current);
    routingControlRef.current = null;
  }

  if (mapRef.current && showRoute && tripStartEnd && optimizedBins && optimizedBins.length > 0) {
    const waypoints = [
      L.Routing.waypoint(L.latLng(tripStartEnd[0], tripStartEnd[1]), null, { allowUTurn: true }),
      ...optimizedBins.map(bin => L.Routing.waypoint(L.latLng(bin.coordinates[0], bin.coordinates[1]), null, { allowUTurn: true })),
      L.Routing.waypoint(L.latLng(tripStartEnd[0], tripStartEnd[1]), null, { allowUTurn: true }),
    ];

    routingControlRef.current = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: true,
      createMarker: () => null,
      show: false,
      allowUTurns: true,
      lineOptions: {
        addWaypoints: false
      }
    }).addTo(mapRef.current);
  }
};

const Map = ({ trashbinData, centerCoordinates, initialZoom = 20, fillThresholds, batteryThresholds, isRoutePlanning, onTrashbinClick, tripStartEnd, selectedBins, optimizedBins, showRoute }: MapProps) => {  
  const mapRef = useRef<null | L.Map>(null);

  const markersRef = useRef<null | L.MarkerClusterGroup>(null);
  const routingControlRef = useRef<null | L.Routing.Control>(null);
    //const markersAddedRef = useRef(false); // Track whether markers have been added
  useEffect(() => {
    if (typeof window !== 'undefined'&& mapRef.current== null) {
      // Load the leaflet library and the marker cluster plugin
      const L = require('leaflet');
      require('leaflet.markercluster');
      require('leaflet-routing-machine');
      
      initializeMap(L, centerCoordinates, initialZoom, mapRef, markersRef);

      if (mapRef.current && markersRef.current) {
        markersRef.current.clearLayers();
        addMarkersToMap(L, trashbinData, fillThresholds, batteryThresholds, selectedBins, isRoutePlanning, onTrashbinClick, markersRef);
        handleRoutingControl(L, showRoute, optimizedBins, tripStartEnd, mapRef, routingControlRef);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return <div id="map" className="flex-grow h-full"></div>;
};

export default Map;
