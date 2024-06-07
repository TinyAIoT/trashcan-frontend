"use client";

import React, { useEffect, useRef } from "react";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface Trashbin {
  lat: number;
  lng: number;
  fill: number;
  fillLevelChange: number;
  battery: number;
  id: string;
  display: string;
}

interface MapProps {
  trashbinData: Trashbin[];
  isRoutePlanning?: boolean;
  onTrashbinClick?: (trashbin: Trashbin) => void;
  selectedBins?: Trashbin[];
  optimizedBins?: Trashbin[];
  showRoute?: boolean;
}

// Important Coordinates
const laerCoordinates: LatLngTuple = [52.054653343935236, 7.356975282228671];
const tripStartEnd: LatLngTuple = [52.070195792078444, 7.3630479127876205];

// TODO: Globally define thresholds and be able to set them in the Settings
const thresholds = [30, 70];

const Map = ({ trashbinData, isRoutePlanning, onTrashbinClick, selectedBins, optimizedBins, showRoute }: MapProps) => {
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
    var greenBin = new BinIcon({iconUrl: '/images/leaflet/bin_g.png'}),
        yellowBin = new BinIcon({iconUrl: '/images/leaflet/bin_y.png'}),
        redBin = new BinIcon({iconUrl: '/images/leaflet/bin_r.png'}),
        blackBin = new BinIcon({iconUrl: '/images/leaflet/bin_b.png'});

    if (!mapRef.current) {
      mapRef.current = window.L.map("map").setView(laerCoordinates, 16);
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

    // Add trashbin markers by iterating over the trashbin data in a for loop
    trashbinData.forEach(trashbin => {
      var marker = window.L.marker(
        [trashbin.lat, trashbin.lng],
        // The bin appears black, if it is selected, otherwise it is colored according to the fill level
        {icon: (selectedBins && selectedBins.some((bin) => bin.id === trashbin.id)) ? blackBin : trashbin.fill < thresholds[0] ? greenBin : trashbin.fill < thresholds[1] ? yellowBin : redBin}
      );
      const popupContent = `<div id="popup-${trashbin.id}">${trashbin.display}<hr>Fill Level: ${trashbin.fill}%<br>Battery: ${trashbin.battery}%</div>`;
      marker.bindPopup(popupContent);
      marker.on("mouseover", () => {marker.openPopup();});
      marker.on('popupopen', function(e) {
        var popup = e.popup;
        window.L.DomEvent.on(popup._contentNode, 'click', function() {
          if (isRoutePlanning && onTrashbinClick) onTrashbinClick(trashbin);
          if (!isRoutePlanning) {
            window.location.href = '/trashbins-detail/';
            // TODO: Use correct route
            // window.location.href = '/trashbins/' + trashbin.id;
          }
        });
      });
      marker.on("click", () => {
        if (isRoutePlanning && onTrashbinClick) onTrashbinClick(trashbin);
        if (!isRoutePlanning) {
          window.location.href = '/trashbins-detail/';
          // TODO: Use correct route
          // window.location.href = '/trashbins/' + trashbin.id;
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
      const waypoints = [L.latLng(tripStartEnd[0], tripStartEnd[1]), ...optimizedBins.map(bin => L.latLng(bin.lat, bin.lng)), L.latLng(tripStartEnd[0], tripStartEnd[1])];
  
      routingControlRef.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        createMarker: function() { return null; },
        show: false,
        lineOptions : {
          addWaypoints: false
        }
      }).addTo(mapRef.current);
    }
  }, [trashbinData, isRoutePlanning, onTrashbinClick, selectedBins, optimizedBins, showRoute]);

  return <div id="map" className="flex-grow h-full"></div>;
};

export default Map;
