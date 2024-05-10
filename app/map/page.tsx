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
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";

// Important Coordinates
const laerCoordinates: LatLngTuple = [52.054653343935236, 7.356975282228671];

// Trashbin coordinates
const trashbinData = [
  {id: 1, display: 'Smartbin <i>Laer</i> <b>"Rathaus"</b>', lat: 52.05564102823898, lng: 7.360054548481379, fill: 10, battery: 100},
  {id: 2, display: 'Smartbin <i>Laer</i> <b>"Eisdiele"</b>', lat: 52.054446369474086, lng: 7.357900783032656, fill: 20, battery: 95},
  {id: 3, display: 'Mock 1', lat: 52.05740200167625, lng: 7.358153181917018, fill: 30, battery: 90},
  {id: 4, display: 'Mock 2', lat: 52.05984470069173, lng: 7.354508167781202, fill: 40, battery: 85},
  {id: 5, display: 'Mock 3', lat: 52.05858758029923, lng: 7.348339576126552, fill: 50, battery: 80},
  {id: 6, display: 'Mock 4', lat: 52.056849321616546, lng: 7.348257774319442, fill: 60, battery: 75},
  {id: 7, display: 'Mock 5', lat: 52.05484146301711, lng: 7.344537017805167, fill: 70, battery: 70},
  {id: 8, display: 'Mock 6', lat: 52.053822275411655, lng: 7.350998965386141, fill: 80, battery: 65},
  {id: 9, display: 'Mock 7', lat: 52.05089302486732, lng: 7.356591490962451, fill: 90, battery: 60},
  {id: 10, display: 'Mock 8', lat: 52.052561689808336, lng: 7.359980721247052, fill: 100, battery: 55},
  {id: 12, display: 'Mock 9', lat: 52.049990684460234, lng: 7.36145800003346, fill: 10, battery: 50},
  {id: 11, display: 'Mock 10', lat: 52.050934789062104, lng: 7.364132550516044, fill: 20, battery: 45},
];

const thresholds = [30, 70];

const MapPage = () => {
  const mapRef = useRef<null | L.Map>(null);

  useEffect(() => {
    // Dynamic imports
    const L = require('leaflet');
    require('leaflet-routing-machine');

    // See: https://leafletjs.com/examples/custom-icons/
    var BinIcon = L.Icon.extend({
      options: {
          shadowUrl: '/images/leaflet/bin_s.png',  // Bin icons based on: https://www.vecteezy.com/vector-art/7820754-recycle-icon-garbage-icon-vector-logo-design-template
          iconSize:     [26, 33], // size of icon
          shadowSize:   [26, 25], // size of shadow
          iconAnchor:   [26/2, 33/2], // point of icon which will correspond to marker's location
          shadowAnchor: [26/2 - 10, 25/2],  // the same for the shadow
          popupAnchor:  [0, -33/4], // point from which popup should open relative to iconAnchor
      }
    });
    var greenBin = new BinIcon({iconUrl: '/images/leaflet/bin_g.png'}),
      yellowBin = new BinIcon({iconUrl: '/images/leaflet/bin_y.png'}),
      redBin = new BinIcon({iconUrl: '/images/leaflet/bin_r.png'});

    // Ensure window.L is available before trying to use it
    if (!mapRef.current) {
      mapRef.current = window.L.map("map").setView(laerCoordinates, 16);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {attribution: "© OpenStreetMap contributors"}
      ).addTo(mapRef.current);

      for (let i = 0; i < trashbinData.length; i++) {
        const trashbin = trashbinData[i];
        // Assign color based on fill level and thresholds
        const type = trashbin.fill <= thresholds[0] ? greenBin : (trashbin.fill <= thresholds[1] ? yellowBin : redBin);
        const marker = window.L.marker([trashbin.lat, trashbin.lng], {icon: type})
          .addTo(mapRef.current)
          .bindPopup(trashbin.display + "<hr>" +
            "Fill Level: " + trashbin.fill + "%<br>" + 
            "Battery: " + trashbin.battery + "%");
        marker.on("mouseover", () => { marker.openPopup(); });
        marker.on("mouseout", () => { marker.closePopup(); });

        // // Show routes as lines between trashbins
        // if (i > 0) {
        //   const prev = trashbinData[i - 1];
        //   window.L.Routing.control({
        //     waypoints: [
        //       window.L.latLng(prev.lat, prev.lng),
        //       window.L.latLng(trashbin.lat, trashbin.lng)
        //     ],
        //     routeWhileDragging: false,
        //     show: false
        //   }).addTo(mapRef.current);
        // }
      }
    };
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <PageTitle title="Map" />
      <Button>Plan Route</Button>
    </div>
    <div id="map" style={{ flex: 1, margin: "2px", height: "calc(90% - 4px)" }}></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    </div>
  );
};

export default MapPage;
