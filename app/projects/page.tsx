/** @format */
"use client";

import PageTitle from "@/components/PageTitle";
import { CardContent } from "@/components/Card";
import Link from 'next/link';
import { useEffect, useState } from "react";
import axios from "axios";

interface Project {
    identifier: string;
    name: string;
}
  
export default function Projects() {

  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await axios.get(
          `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/project`,
          {
            headers: {
              Authorization: `Bearer ${token.replace(/"/g, "")}`,
            },
          }
        );

        // console.log(response.data);

        // Step 1: Extract the projects array from the response data
        const projects = response.data.projects;

        // Step 2: Store the project ID of the first project in local storage
        // Assuming you want to store the _id of the first project
        if (projects.length > 0) {
          localStorage.setItem("projectId", projects[0]._id);
        }

        // Step 3: Map over the projects array to extract the necessary information
        const transformedData = projects.map((item: any) => {
          console.log(item);
          return {
            id: item._id,
            identifier: item.identifier,
            name: item.name,
            projectType: item.projectType.toLowerCase(),
            cityName: item.city.name.toLowerCase(),
          };
        });

        // Step 4: Update the projectData state with this mapped array
        setProjectData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Your Projects" />
      <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-3">
        {projectData.map((project) => (
          <Link
            href={`/projects/${project.cityName}/${project.projectType}`}
            key={project.identifier}
            onClick={() => localStorage.setItem("projectId", project.id)}
          >
              <CardContent>
                <p>
                  {project.name}
                  <span className="text-gray-500 ml-4">({project.identifier})</span>
                </p>
              </CardContent>
          </Link>
        ))}
      </section>
    </div>
  );
}
