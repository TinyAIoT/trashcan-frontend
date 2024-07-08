// app/trashbins/[id]/edit/page.tsx

"use client"; // Ensure this runs on the client side

import React, { useEffect, useState } from "react";
import axios from "axios";
import PageTitle from "@/components/PageTitle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trashbin } from "@/app/types";
import { Info } from "lucide-react";

const EditTrashbinPage = ({ params }: { params: { identifier: string } }) => {
  type trashBinUpdate = {
    coordinates: [number | null, number | null];
    location: string;
    name: string;
    image: string;
  };
  const [trashbin, setTrashbin] = useState<trashBinUpdate | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    coordinates: "",
    location: "",
    image: "",
  });

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

        setTrashbin(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.identifier]);

  const goBack = () => {
    window.history.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trashbin) return;

    // Validate all fields
    let isValid = true;
    let newErrors = { name: "", coordinates: "", location: "", image: "" };

    // Check name
    if (trashbin.name === "") {
      isValid = false;
      newErrors.name = "Name cannot be empty.";
    }

    // Check coordinates
    try {
      const lat = parseFloat(trashbin.coordinates[0]?.toString() || "0");
      const lng = parseFloat(trashbin.coordinates[1]?.toString() || "0");
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        isValid = false;
        newErrors.coordinates =
          "Coordinates must be valid latitude (-90 to 90) and longitude (-180 to 180).";
      }
    } catch (error) {
      isValid = false;
      newErrors.coordinates = "Coordinates must be real numbers.";
    }

    // Check location
    // Currently nothing to check

    // Check image URL
    try {
      new URL(trashbin.image || "");
    } catch (err) {
      newErrors.image = "Image URL must be a valid URL.";
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // Ensure coordinates are numbers
      const payload = {
        ...trashbin,
        coordinates: [
          parseFloat(trashbin.coordinates[0]?.toString() || "0"),
          parseFloat(trashbin.coordinates[1]?.toString() || "0"),
        ],
      };

      console.log(trashbin);

      await axios.patch(
        `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${trashbin._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, "")}`,
          },
        }
      );
      goBack();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  if (!trashbin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle
        title={`Edit Trashbin ${trashbin.name} (${trashbin.identifier})`}
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            value={trashbin.name || ""}
            onChange={(e) => setTrashbin({ ...trashbin, name: e.target.value })}
            className="w-full border px-2 py-1"
          />
        </div>
        {errors.name && <p className="text-red-500">{errors.name}</p>}
        <div className="flex items-center justify-start">
          <Info className="text-gray-500 mr-2" />
          <p className="text-lg text-gray-500">
            Latitude and longitude are the first entry in the list when
            right-clicking on the map in Google Maps.
          </p>
        </div>
        <div className="flex justify-between">
          <div className="w-1/2 pr-2">
            <label className="block">Latitude</label>
            <input
              type="number"
              name="lat"
              value={trashbin.coordinates[0]?.toString() || ""}
              onChange={(e) =>
                setTrashbin({
                  ...trashbin,
                  coordinates: [
                    parseFloat(e.target.value),
                    trashbin.coordinates[1],
                  ],
                })
              }
              className="w-full border px-2 py-1"
              step="any"
            />
          </div>
          <div className="w-1/2 pl-2">
            <label className="block">Longitude</label>
            <input
              type="number"
              name="lng"
              value={trashbin.coordinates[1]?.toString() || ""}
              onChange={(e) =>
                setTrashbin({
                  ...trashbin,
                  coordinates: [
                    trashbin.coordinates[0],
                    parseFloat(e.target.value),
                  ],
                })
              }
              className="w-full border px-2 py-1"
              step="any"
            />
          </div>
        </div>
        {errors.coordinates && (
          <p className="text-red-500">{errors.coordinates}</p>
        )}
        <div>
          <label className="block">Location</label>
          <input
            type="text"
            name="location"
            value={trashbin.location || ""}
            onChange={(e) =>
              setTrashbin({ ...trashbin, location: e.target.value })
            }
            className="w-full border px-2 py-1"
          />
        </div>
        {errors.location && <p className="text-red-500">{errors.location}</p>}
        <div>
          <label className="block">Image URL</label>
          <input
            type="text"
            name="image"
            value={trashbin.image || ""}
            onChange={(e) =>
              setTrashbin({ ...trashbin, image: e.target.value })
            }
            className="w-full border px-2 py-1"
          />
        </div>
        {errors.image && <p className="text-red-500">{errors.image}</p>}
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
