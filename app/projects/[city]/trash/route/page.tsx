"use client";

import React, { useState, useCallback, useEffect } from 'react';
import PageTitle from "@/components/PageTitle";
import axios from 'axios';
import Map from "@/components/Map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LatLngTuple } from 'leaflet';
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy, Info } from 'lucide-react';
import { Trashbin } from '@/app/types';

const headerSortButton = (column: any, displayname: string) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {displayname}
    </Button>
  );
};

const columns: ColumnDef<Trashbin>[] = [
    { accessorKey: "identifier", 
      header: ({ column }) => {
        return headerSortButton(column, "Identifier");
      },
    },
    { accessorKey: "name", 
      header: ({ column }) => {
        return headerSortButton(column, "Name");
      },
    },
    { accessorKey: "fillLevel",
      header: ({ column }) => {
        return headerSortButton(column, "Fill Level");
      },
    },
    { accessorKey: "fillLevelChange",
      header: ({ column }) => {
        return headerSortButton(column, "Fill Level Change");
      },
    },
];

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
  // Trashbin data fetched from the our backend
  const [trashbinData, setTrashbinData] = useState([]);
  const [centerCoordinates, setCenterCoordinates] = useState<LatLngTuple | null>(null);
  const [tripStartEnd, setTripStartEnd] = useState<LatLngTuple | null>(null);
  const [initialZoom, setInitialZoom] = useState<number | null>(null);
  const [fillThresholds, setFillThresholds] = useState<[number, number] | null>(null);
  const [batteryThresholds, setBatteryThresholds] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const projectId = localStorage.getItem("projectId");

        const trashbinResponse = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin?project=${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );

        const transformedTrashbinData = trashbinResponse.data.trashbins.map((item: any) => {
          return {
            // id: item._id,
            identifier: item.identifier,
            name: item.name,
            // coordinates: item.coordinates,
            coordinates: item.coordinates,
            fillLevel: item.fillLevel,
            fillLevelChange: item.fillLevelChange,
            batteryLevel: item.batteryLevel,
            signalStrength: item.signalStrength,
          };
        });

        setTrashbinData(transformedTrashbinData);

        const projectResponse = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );
        setInitialZoom(projectResponse.data.project.initialZoom);
        // TODO: Wait for backend to implement
        // setTripStartEnd(projectResponse.data.project.tripStartEnd);
        setTripStartEnd([52.070195792078444, 7.3630479127876205]);
        setCenterCoordinates(projectResponse.data.project.centerCoords);
        setFillThresholds(projectResponse.data.project.preferences.fillThresholds);
        setBatteryThresholds(projectResponse.data.project.preferences.batteryThresholds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Add trashbin if not already selected, otherwise remove it
  const handleTrashbinClick = useCallback((trashbin: Trashbin) => {
    setSelectedBins((prevSelected) => {
        if (prevSelected.some((bin) => bin.identifier === trashbin.identifier)) return prevSelected.filter((bin) => bin.identifier !== trashbin.identifier);
        else return [...prevSelected, trashbin];
    });
  }, []);

  // Fetch optimized route from OSRM Trip Service
  const fetchOptimizedRoute = async (): Promise<Trashbin[]> => {
    // If no bins are selected, we cannot plan a route
    if (selectedBins.length === 0 || !tripStartEnd) return [];
    
    // The roundtrip starts and ends at the location indicated by `tripStartEnd`
    const coordinates: string[] = [
      `${tripStartEnd[1]},${tripStartEnd[0]}`,
      ...selectedBins.map(bin => `${bin.coordinates[1]},${bin.coordinates[0]}`),
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
    if (!tripStartEnd) return;

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
      ...orderedBins.map(bin => `${bin.coordinates[0]},${bin.coordinates[1]}`),
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
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Route Planning" />
      {/* <h1 className="text-2xl font-bold">Trashbin Selection</h1> */}
      <div className="flex items-center justify-start">
        <Info className="text-gray-500 mr-2" />
        <p className="text-lg text-gray-500">Select the trashbins to be considered for a route by clicking on the trashbins on the map or table</p>
      </div>
      <section className="grid grid-cols-2  gap-4 transition-all lg:grid-cols-4">
        <Button className="bg-green-600 text-white" onClick={handleShowRoute}>Show Route</Button>
        <Button className="bg-green-600 text-white" onClick={showGoogleMapsLink}>Export to Maps</Button>
        <Button className="bg-green-600 text-white">Assign Route</Button>
        <Button className="bg-red-600 text-white">Unassign All Bins</Button>
      </section>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="map" className="w-full">Map View</TabsTrigger>
          <TabsTrigger value="table" className="w-full">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="map">
          { centerCoordinates && initialZoom && fillThresholds && batteryThresholds && handleTrashbinClick && tripStartEnd &&(
          <div className="w-full h-[80vh] relative z-0">
            <Map 
              trashbinData={trashbinData}
              centerCoordinates={centerCoordinates}
              initialZoom={initialZoom}
              fillThresholds={fillThresholds}
              batteryThresholds={batteryThresholds}
              isRoutePlanning={true}
              onTrashbinClick={handleTrashbinClick}
              tripStartEnd={tripStartEnd}
              selectedBins={selectedBins}
              optimizedBins={optimizedBins}
              showRoute={showRoute}
            />
          </div>
          )}
        </TabsContent>
        <TabsContent value="table">
          <div className="w-full h-[80vh] overflow-auto">
          <DataTable
            columns={columns}
            data={trashbinData}
            onRowClick={handleTrashbinClick}
            selectedRows={selectedBins}
            showSearchBar={true}
            showExportButton={false}
          />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex-col">
        <h1 className="text-2xl font-bold">Options</h1>
        <div className="flex items-center mb-3">
            <p>Assignee: </p>
            <Select>
            <SelectTrigger className="w-[180px] ml-2">
                <SelectValue placeholder="Select Assignee" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="driver_a">Alice</SelectItem>
                <SelectItem value="driver_b">Bob</SelectItem>
                <SelectItem value="driver_c">Carol</SelectItem>
            </SelectContent>
            </Select>
        </div>
        {/* The following options are not supported yet */}
        {/* <div className="flex items-center mb-3">
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
        </div> */}
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
