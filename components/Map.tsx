"use client";

import React, { useEffect, useRef } from "react";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Trash2, BatteryFull, Signal } from "lucide-react";
import { createRoot } from 'react-dom/client';

// Import image from public folder
import binImage from '../../../../public/images/leaflet/bin_bl.png';

interface Trashbin {
  identifier: string;
  name: string;
  lat: number | null;
  lng: number | null;
  fillLevel: number;
  fillLevelChange: number;
  batteryLevel: number;
  signalStrength: number;
  imageUrl: string;
}

interface MapProps {
  trashbinData: Trashbin[];
  centerCoordinates: LatLngTuple;
  initialZoom: number;
  isRoutePlanning?: boolean;
  onTrashbinClick?: (trashbin: Trashbin) => void;
  selectedBins?: Trashbin[];
  optimizedBins?: Trashbin[];
  showRoute?: boolean;
}

// Important Coordinates
// const centerCoordinates: LatLngTuple = [52.054653343935236, 7.356975282228671];
const tripStartEnd: LatLngTuple = [52.070195792078444, 7.3630479127876205];

// TODO: Globally define thresholds and be able to set them in the Settings
const binThresholds = [30, 70];
const batteryThresholds = [50, 20];

function PopupContent({ trashbin, routePlanning }: { trashbin: Trashbin, routePlanning?: boolean }) {  return (
    <div id={`popup-${trashbin.identifier}`}>
      <div className="text-base font-semibold flex justify-center items-center">
        {trashbin.name}
      </div>
      <hr />
      <div className="flex flex-row items-center justify-between mt-1">
        <div className="flex items-center mr-3">
          <Trash2 size="16px" className={`mr-1 ${trashbin.fillLevel < binThresholds[0] ? 'text-green-500' : trashbin.fillLevel < binThresholds[1] ? 'text-yellow-500' : 'text-red-500'}`} />
          <span className={`${trashbin.fillLevel < binThresholds[0] ? 'text-green-500' : trashbin.fillLevel < binThresholds[1] ? 'text-yellow-500' : 'text-red-500'}`}>{trashbin.fillLevel}%</span>
        </div>
        {routePlanning === undefined && (
          <div className="flex items-center mr-3">
          <BatteryFull size="16px" className={`mr-1 ${trashbin.batteryLevel > batteryThresholds[0] ? 'text-green-500' : trashbin.batteryLevel > batteryThresholds[1] ? 'text-yellow-500' : 'text-red-500'}`} />
          <span className={`mr-1 ${trashbin.batteryLevel > batteryThresholds[0] ? 'text-green-500' : trashbin.batteryLevel > batteryThresholds[1] ? 'text-yellow-500' : 'text-red-500'}`}>{trashbin.batteryLevel}%</span>
        </div>
        )}
        {routePlanning === undefined && (
        <div className="flex items-center">
          <Signal size="16px" className="mr-1" />
          <span>{trashbin.signalStrength}</span>
        </div>
        )}
      </div>
      {/* Do not render the image in route planning mode */}
      {routePlanning === undefined && (
        <div className="flex justify-center items-center h-full mt-1">
          <>
          { trashbin.imageUrl && (
              <img src={trashbin.imageUrl} className="max-h-[150px]" />
              // Alternative placeholder image
              // <img src="/images/leaflet/bin_bl.png" className="h-[50px]" />
          )}
          </>
        </div>
      )}
    </div>
  );
}

function redirectToTrashbinDetail(trashbin: Trashbin) {
  // Get the city from the url
  var current_url = window.location.pathname;
  console.log(current_url);
  // Remove map from the url
  var modified_url = current_url.replace("map", "");
  // Append trashbins/trashbin_identifier to the url
  var new_url = modified_url + "trashbins/" + trashbin.identifier;
  // Redirect to the new url
  window.location.href = new_url;
}

const Map = ({ trashbinData, centerCoordinates, initialZoom, isRoutePlanning, onTrashbinClick, selectedBins, optimizedBins, showRoute }: MapProps) => {
  const mapRef = useRef<null | L.Map>(null);
  const markersRef = useRef<null | L.MarkerClusterGroup>(null);
  const routingControlRef = useRef<null | L.Routing.Control>(null);

  useEffect(() => {
    // Load the leaflet library and the marker cluster plugin
    const L = require('leaflet');
    require('leaflet.markercluster');
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
    var BinIconSelected = L.Icon.extend({
      options: {
          iconSize:     [35, 35], // size of icon
          popupAnchor:  [0, -35/4], // point from which popup should open relative to iconAnchor
      }
    });
    var greenBin = new BinIcon({iconUrl: '/images/leaflet/bin_g.png'}),
        greenBinSelected = new BinIconSelected({iconUrl: '/images/leaflet/bin_g_b.png'}),
        yellowBin = new BinIcon({iconUrl: '/images/leaflet/bin_y.png'}),
        yellowBinSelected = new BinIconSelected({iconUrl: '/images/leaflet/bin_y_b.png'}),
        redBin = new BinIcon({iconUrl: '/images/leaflet/bin_r.png'}),
        redBinSelected = new BinIconSelected({iconUrl: '/images/leaflet/bin_r_b.png'});
        // blueBin = new BinIcon({iconUrl: '/images/leaflet/bin_bl.png'}),
        // blueBinSelected = new BinIconSelected({iconUrl: '/images/leaflet/bin_bl_b.png'}),
        // blackBin = new BinIcon({iconUrl: '/images/leaflet/Trashbin_green_black.svg'}),

    // Set initial zoom to 20, if not set
    if (!initialZoom) { initialZoom = 20; }

    if (!mapRef.current) {
      mapRef.current = window.L.map("map").setView(centerCoordinates, initialZoom);
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {attribution: "© OpenStreetMap contributors"}
      ).addTo(mapRef.current);
    }

    if (markersRef.current) {
      markersRef.current.clearLayers();
    } else {
      // Cluster markers when zooming out
      markersRef.current = L.markerClusterGroup({ maxClusterRadius: 40 });
      mapRef.current.addLayer(markersRef.current);
    }

    // Filter trashbinData to only include bins with valid lat and lng
    const filteredTrashbinData = trashbinData.filter(trashbin => 
      trashbin.lat !== (null && undefined) &&
      trashbin.lng !== (null && undefined) && 
      trashbin.lat >= -90 && trashbin.lat <= 90 &&
      trashbin.lng >= -180 && trashbin.lng <= 180
    );

    // Add trashbin markers by iterating over the trashbin data in a for loop
    filteredTrashbinData.forEach(trashbin => {
      var marker = window.L.marker(
        [trashbin.lat, trashbin.lng],
      );
      // Set the color of the marker according to fill level and selection
      if (selectedBins && selectedBins.some((bin) => bin.identifier === trashbin.identifier)) {
        marker.setIcon(trashbin.fillLevel < binThresholds[0] ? greenBinSelected : trashbin.fillLevel < binThresholds[1] ? yellowBinSelected : redBinSelected);
      } else {
        marker.setIcon(trashbin.fillLevel < binThresholds[0] ? greenBin : trashbin.fillLevel < binThresholds[1] ? yellowBin : redBin);
      }

      const container = document.createElement('div');
      const popupElement = <PopupContent trashbin={trashbin} routePlanning={isRoutePlanning}/>;
      createRoot(container).render(popupElement);
      marker.bindPopup(container);

      marker.on("mouseover", () => {marker.openPopup();});
      marker.on('popupopen', function(e) {
        var popup = e.popup;
        window.L.DomEvent.on(popup._contentNode, 'click', function() {
          if (isRoutePlanning && onTrashbinClick) onTrashbinClick(trashbin);
          if (!isRoutePlanning) {
            redirectToTrashbinDetail(trashbin);
          }
        });
      });
      marker.on("click", () => {
        if (isRoutePlanning && onTrashbinClick) onTrashbinClick(trashbin);
        if (!isRoutePlanning) {
          redirectToTrashbinDetail(trashbin);
        }
      });
      markersRef.current.addLayer(marker);
    });

    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
  
    // Itinerary instructions are disabled via css
    if (showRoute && optimizedBins && optimizedBins.length > 0) {
      // Allow U-turns on waypoints
      var waypoints = [
        L.Routing.waypoint(L.latLng(tripStartEnd[0], tripStartEnd[1]), null, { allowUTurn: true }),
        ...optimizedBins.map(bin => L.Routing.waypoint(L.latLng(bin.lat, bin.lng), null, { allowUTurn: true })),
        L.Routing.waypoint(L.latLng(tripStartEnd[0], tripStartEnd[1]), null, { allowUTurn: true }),
      ];

      routingControlRef.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        createMarker: function() { return null; },
        show: false,
        allowUTurns: true,
        lineOptions : {
          addWaypoints: false
        }
      }).addTo(mapRef.current);
    }
  }, [trashbinData, isRoutePlanning, onTrashbinClick, selectedBins, optimizedBins, showRoute]);

  return <div id="map" className="flex-grow h-full"></div>;
};

export default Map;
