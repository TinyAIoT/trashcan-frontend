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
  const [formData, setFormData] = useState<Partial<Trashbin>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${params.identifier}`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
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
      }
    };

    fetchData();
  }, [params.identifier]);

  const goBack = () => {
    window.history.back();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      console.log(formData);

      await axios.patch(
        `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/trashbin/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, "")}`,
          },
        }
      );
      // Redirect to the details page
      // By removing the last part of the URL, we can redirect to the details page
      goBack();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title={`Edit Trashbin ${data.identifier}`} />
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

        <div>
          <label className="block">Coordinates</label>
          <input
            type="text"
            name="coordinates"
            value={formData.coordinates ? formData.coordinates.join(", ") : ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                coordinates: e.target.value.split(",").map(Number),
              }))
            }
            className="w-full border px-2 py-1"
          />
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