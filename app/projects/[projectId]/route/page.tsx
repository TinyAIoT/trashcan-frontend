"use client";

import React, { useState, useCallback, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import axios from 'axios';
import Map from "@/components/Map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LatLngTuple } from 'leaflet';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from 'lucide-react';

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
    {id: 'laer-bin-0001', display: 'Rathaus', lat: 52.05564102823898, lng: 7.360054548481379, fill: 10, fillLevelChange: -50, battery: 100},
    {id: 'laer-bin-0002', display: 'Eisdiele', lat: 52.054446369474086, lng: 7.357900783032656, fill: 20, fillLevelChange: -40,  battery: 95},
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

const columns: ColumnDef<Trashbin>[] = [
    { accessorKey: "id", header: "Identifier" },
    { accessorKey: "display", header: "Name" },
    { accessorKey: "fill", header: "Fill Level" },
    { accessorKey: "fillLevelChange", header: "Fill Level Change" },
];

const tripStartEnd: LatLngTuple = [52.070195792078444, 7.3630479127876205];

const OSRM_SERVER_URL = 'http://router.project-osrm.org';

const RoutePlanning = () => {
  // Bins selected by user by clicking on map or table-row
  const [selectedBins, setSelectedBins] = useState<Trashbin[]>([]);
  // Optimized order of bins based on route optimization
  const [optimizedBins, setOptimizedBins] = useState<Trashbin[]>([]);
  // Whether to show the optimized route on the map
  const [showRoute, setShowRoute] = useState(false);
  // Active tab in the tabs component
  const [activeTab, setActiveTab] = useState('map');
  // GoogleMaps link to be exported
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  // Dialog state for showing the GoogleMaps link
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Add trashbin if not already selected, otherwise remove it
  const handleTrashbinClick = useCallback((trashbin: Trashbin) => {
    setSelectedBins((prevSelected) => {
        if (prevSelected.some((bin) => bin.id === trashbin.id)) return prevSelected.filter((bin) => bin.id !== trashbin.id);
        else return [...prevSelected, trashbin];
    });
  }, []);

  // Fetch optimized route from OSRM Trip Service
  const fetchOptimizedRoute = async (): Promise<Trashbin[]> => {
    // If no bins are selected, we cannot plan a route
    if (selectedBins.length === 0) return [];
    
    // The roundtrip starts and ends at the location indicated by `tripStartEnd`
    const coordinates: string[] = [
      `${tripStartEnd[1]},${tripStartEnd[0]}`,
      ...selectedBins.map(bin => `${bin.lng},${bin.lat}`),
      `${tripStartEnd[1]},${tripStartEnd[0]}`
    ];

    // OSRM Trip Service API URL
    const url = `${OSRM_SERVER_URL}/trip/v1/driving/${coordinates.join(';')}?source=first&destination=last&roundtrip=false`;

    try {
      const response = await axios.get(url);

      // Only handle case where we get exactly one trip
      if (response.data.trips.length === 1) {
        // The waypoint index at a given position is the new index of the bin in the selectedBins array
        const optimizedWaypoints = response.data.waypoints;
        const waypointIndices = optimizedWaypoints.map((wp: { waypoint_index: number; }) => wp.waypoint_index - 1).slice(1, -1);
        const orderedBins = new Array(waypointIndices.length);
        for (let i = 0; i < waypointIndices.length; i++) {
          orderedBins[waypointIndices[i]] = selectedBins[i];
        }
        
        // Logging for debugging purposes
        // console.log('Waypoint Indices:', waypointIndices);
        // console.log('Selected Bins:', selectedBins);
        // console.log('Ordered Bins:', orderedBins);

        // Returns the bins in the optimized order
        return orderedBins;
      }
    } catch (error) {
      console.error('Error while fetching optimized route:', error);
    }
    return [];
  };

  const handleShowRoute = async () => {
    // To show the route, we need to show the map tab
    setActiveTab('map');
    // Fetch optimized route
    const orderedBins = await fetchOptimizedRoute();
    setOptimizedBins(orderedBins);
    // Show the route
    setShowRoute(true);
  };

  // If map tab is deselected, don't show the route anymore
  useEffect(() => {
    if (activeTab !== 'map') {
      setShowRoute(false);
    }
  }, [activeTab]);

  // If selected bins change, don't show the route anymore
  useEffect(() => {
    setShowRoute(false);
  }, [selectedBins]);

  // Generate GoogleMaps link for the route and show it in a dialog
  const showGoogleMapsLink = async () => {
    // Fetch optimized route, if not already done
    var orderedBins: Trashbin[] = [];
    if (showRoute) orderedBins = optimizedBins;
    else {
      orderedBins = await fetchOptimizedRoute();
      setOptimizedBins(orderedBins);
    }

    // Use orderedBins here instead of optimizedBins, as optimizedBins might not be updated yet
    const coordinates: string[] = [
      `${tripStartEnd[0]},${tripStartEnd[1]}`,
      ...orderedBins.map(bin => `${bin.lat},${bin.lng}`),
      `${tripStartEnd[0]},${tripStartEnd[1]}`
    ];
  
    const googleMapsUrl = `https://www.google.com/maps/dir/${coordinates.join('/')}`;
    setGoogleMapsLink(googleMapsUrl);
    setIsDialogOpen(true);
  };
  
  // Handle the animation for the copy button
  const handleCopy = () => {
    // Find the button by its ID and add the effect class
    const copyButton = document.getElementById('copyLink');
    copyButton?.classList.add('button-click-effect');
    // Remove the effect class after the animation duration
    setTimeout(() => {
      copyButton?.classList.remove('button-click-effect');
    }, 500); // Duration has to match with CSS animation duration
  };

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Route Planning" />
      <h1 className="text-2xl font-bold">Trashbin Selection</h1>
      <p>Select the trashbins to be considered for a route by clicking on the trashbins on the map or table.</p>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="map" className="w-full">Map View</TabsTrigger>
          <TabsTrigger value="table" className="w-full">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="map">
          <div className="w-full h-[60vh] relative z-0">
            <Map 
              trashbinData={trashbinData}
              isRoutePlanning={true}
              onTrashbinClick={handleTrashbinClick}
              selectedBins={selectedBins}
              optimizedBins={optimizedBins}
              showRoute={showRoute}
            />
          </div>
        </TabsContent>
        <TabsContent value="table">
          <div className="w-full h-[60vh] overflow-auto">
          <DataTable
            columns={columns}
            data={trashbinData}
            onRowClick={handleTrashbinClick}
            selectedRows={selectedBins}
          />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex-col">
        <section className="grid grid-cols-2  gap-4 transition-all lg:grid-cols-4 mb-4">
          <Button className="bg-green-600 text-white" onClick={handleShowRoute}>Show Route</Button>
          <Button className="bg-green-600 text-white" onClick={showGoogleMapsLink}>Export to Maps</Button>
          <Button className="bg-green-600 text-white">Assign Route</Button>
          <Button className="bg-red-600 text-white">Unassign All Bins</Button>
        </section>
        <h1 className="text-2xl font-bold">Options</h1>
        <div className="flex items-center mb-3">
            <p>Driver: </p>
            <Select>
            <SelectTrigger className="w-[180px] ml-2">
                <SelectValue placeholder="Select Driver" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="driver_a">Alice</SelectItem>
                <SelectItem value="driver_b">Bob</SelectItem>
                <SelectItem value="driver_c">Carol</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className="flex items-center mb-3">
            <p>Time Constraint: </p>
            <Input
                type="number"
                placeholder="Minutes"
                className="w-[180px] mx-2"
                step="30"
            />
            <p>Minutes</p>
        </div>
        <div className="flex items-center">
            <p>Optimization Criterion: </p>
            <Select>
            <SelectTrigger className="w-[180px] ml-2">
                <SelectValue placeholder="Select Criterion" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="time">Time</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="z-50">
          <DialogHeader>
            <DialogTitle>Google Maps Link</DialogTitle>
            <DialogDescription>
              <div className="flex items-center justify-between">
                <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="break-all text-blue-500 underline">
                  {googleMapsLink}
                </a>
                <div className="tooltip">
                  <CopyToClipboard text={googleMapsLink} onCopy={handleCopy}>
                    <Button id="copyLink" className="bg-blue-600 text-white ml-2">
                      <Copy />
                    </Button>
                  </CopyToClipboard>
                  <span className="tooltiptext">Copy</span>
                </div>
              </div>
              </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoutePlanning;
