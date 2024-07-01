// app/trashbins/[id]/edit/page.tsx

"use client"; // Ensure this runs on the client side

import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Trashbin = {
  id: string;
  identifier: string;
  name: string;
  coordinates: [number, number];
  location: string;
  project: string;
  sensors: any[];
  createdAt: Date;
  updatedAt: Date;
};

const EditTrashbinPage = ({ params }: { params: { identifier: string } }) => {
  const [data, setData] = useState<Trashbin | null>(null);
  const [formData, setFormData] = useState<Partial<Trashbin>>({
    coordinates: [0, 0],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${params.identifier}`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );

        const trashbin = {
          id: response.data._id,
          identifier: response.data.identifier,
          coordinates: response.data.coordinates,
          name: response.data.name,
          location: response.data.location,
          project: response.data.project,
          sensors: response.data.sensors,
          createdAt: new Date(response.data.createdAt),
          updatedAt: new Date(response.data.updatedAt),
        };

        console.log(trashbin);
        setData(trashbin);
        setFormData(trashbin);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data.");
      }
    };

    fetchData();
  }, [params.identifier]);

  const goBack = () => {
    window.history.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "lat" || name === "lng") {
        const coordinates = [...(prev.coordinates || [0, 0])] as [number, number];
        if (name === "lat") {
          coordinates[0] = parseFloat(value);
        } else {
          coordinates[1] = parseFloat(value);
        }
        return { ...prev, coordinates };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const [lat, lng] = formData.coordinates || [0, 0];
    if (isNaN(lat) || isNaN(lng)) {
      setError("Invalid coordinates. Please enter valid latitude and longitude.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.patch(
        `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${data?.id}`,
        { ...formData, coordinates: [lat, lng] },
        {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, "")}`,
          },
        }
      );
      goBack();
    } catch (error) {
      console.error("Error updating data:", error);
      setError("Error updating data.");
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title={`Edit Trashbin ${data.identifier}`} />
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Identifier</label>
          <input
            type="text"
            name="identifier"
            value={formData.identifier || ""}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div className="flex justify-between">
          <div className="w-1/2 pr-2">
            <label className="block">Latitude</label>
            <input
              type="number"
              name="lat"
              value={formData.coordinates?.[0]?.toString() || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1"
              step="any"
            />
          </div>
          <div className="w-1/2 pl-2">
            <label className="block">Longitude</label>
            <input
              type="number"
              name="lng"
              value={formData.coordinates?.[1]?.toString() || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1"
              step="any"
            />
          </div>
        </div>
        <div>
          <label className="block">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full border px-2 py-1"
          />
        </div>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Update
          </Button>
          <Button
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={goBack}
          >
            <Link href="">Abort</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTrashbinPage;
