"use client";

import { useEffect, useState } from "react";
import api from '@/lib/axios-api'
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/Card";
import LoadingComponent from "@/components/LoadingComponent";

interface Project {
  _id: string;
  identifier: string;
  name: string;
  projectType: string;
  cityName: string;
}

function removeProjectDataLocally() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("projectId");
    localStorage.removeItem("cityName");
    localStorage.removeItem("projectType");
  }
}

function saveProjectDataLocally(project: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("projectId", project.id);
    localStorage.setItem("cityName", project.cityName);
    localStorage.setItem("projectType", project.projectType);
  }
}

export default function Projects() {
  const [projectData, setProjectData] = useState<Project[] | null>(null);

  // Remove any project data that might be stored locally when navigating back to the projects page
  removeProjectDataLocally();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await api.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/project`,
          {
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );

        const projects = response.data.projects;

        const transformedData = projects.map((item: any) => {
          return {
            id: item._id,
            identifier: item.identifier,
            name: item.name,
            projectType: item.projectType.toLowerCase(),
            cityName: item.city.name.toLowerCase(),
          };
        });

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
      { !projectData ?
        <LoadingComponent text="Loading projects..." /> :
        <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-3">
          {projectData.map((project) => (
            <Button
              variant="outline"
              onClick={() => {
                saveProjectDataLocally(project);
                window.location.href = `/projects/${project.cityName}/${project.projectType}`;
              }}
              key={project.identifier}
            >
              <span className="text-2xl">{project.name}</span>
            </Button>
          ))}
        </section>
      }
    </div>
  );
}
