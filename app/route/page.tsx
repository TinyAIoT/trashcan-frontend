"use client";

import React, { useState } from 'react';
import PageTitle from "@/components/PageTitle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from "@/components/Map";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const columns: ColumnDef<Trashbin>[] = [
    { accessorKey: "id", header: "Identifier" },
    { accessorKey: "display", header: "Name" },
    { accessorKey: "fill", header: "Fill Level" },
    { accessorKey: "fillLevelChange", header: "Fill Level Change" },
];

const RoutePlanning = () => {
  const [selectedBins, setSelectedBins] = useState<Trashbin[]>([]);

  const handleTrashbinClick = (trashbin: Trashbin) => {
    // Add or remove the trashbin from the selected bins
    setSelectedBins((prevSelected) =>
      prevSelected.some((bin) => bin.id === trashbin.id)
        ? prevSelected.filter((bin) => bin.id !== trashbin.id)
        : [...prevSelected, trashbin]
    );
  };

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Route Planning" />
      <h1 className="text-2xl font-bold">Trashbin Selection</h1>
      <p>Select the trashbins to be considered for a route by clicking on the trashbins on the map or table.</p>
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="map" className="w-full">Map View</TabsTrigger>
          <TabsTrigger value="table" className="w-full">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="map">
          <div className="w-full h-[70vh]">
            <Map trashbinData={trashbinData} isRoutePlanning={true} onTrashbinClick={handleTrashbinClick} selectedBins={selectedBins} />
          </div>
        </TabsContent>
        <TabsContent value="table">
          <div className="w-full h-[70vh] overflow-auto">
            <DataTable columns={columns} data={trashbinData} />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex-col">
        {/* Show the Identifiers of all the selected bins */}
        <h1 className="text-2xl font-bold">Selected Bins</h1>
        <ul className="list-disc pl-5">
          {selectedBins.map((bin) => (
            <li key={bin.id}>{bin.display}</li>
          ))}
        </ul>
        
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
      <section className="grid grid-cols-2  gap-4 transition-all lg:grid-cols-4">
        <Button className="bg-green-600 text-white">Show Route</Button>
        <Button className="bg-green-600 text-white">Export to Maps</Button>
        <Button className="bg-green-600 text-white">Assign Route</Button>
        <Button className="bg-red-600 text-white" onClick={() => setSelectedBins([])}>Unassign All Bins</Button>
      </section>
    </div>
  );
};

export default RoutePlanning;
