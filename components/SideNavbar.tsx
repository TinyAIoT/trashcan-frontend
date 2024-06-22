/** @format */
"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import { useWindowWidth } from "@react-hook/window-size";

import {
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  MapIcon,
  Route,
  UsersRound,
  Trash2Icon,
  TrashIcon,
  Settings,
  Settings2,
} from "lucide-react";


export default function SideNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [projects, _setProjects] = useState(
    [
      { identifier: "laer-trash", type: "trash" },
      { identifier: "emsdetten-trash", type: "trash" },
      { identifier: "emsdetten-noise", type: "noise" },
    ]
  );

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Extract the project ID from the URL
      const path = window.location.pathname;
      const parts = path.split('/');
      const id = parts[2]; // URL is /projects/[id]/...
      setProjectId(id);
    }
  }, []);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const noiseNavGroups = [
    {
      header: isCollapsed ? null : "Overview",  // Hide header when collapsed
      links: [
        {
          title: "Noise Dashboard",
          href: "/",
          icon: LayoutDashboard,
          variant: "default",
        },
      ],
    },
    {
      header: isCollapsed ? null : "Settings",
      links: [
        {
          title: "Project",
          href: "/project-settings",
          icon: Settings2,
          variant: "ghost",
        },
        {
          title: "Account",
          href: "/settings",
          icon: Settings,
          variant: "ghost",
        },
      ],
    },
  ]

  const trashNavGroups = [
    {
      header: isCollapsed ? null : "Overview",
      links: [
        {
          title: "Dashboard",
          href: "/",
          icon: LayoutDashboard,
          variant: "default",
        },
        {
          title: "Map",
          href: "/map",
          icon: MapIcon,
          variant: "ghost",
        },
        {
          title: "Route",
          href: "/route",
          icon: Route,
          variant: "ghost",
        },
      ],
    },
    {
      header: isCollapsed ? null : "Data",
      links: [
        {
          title: "Trashbins",
          href: "/trashbins",
          icon: Trash2Icon,
          variant: "ghost",
        },
        {
          title: "Trashbins Detail",
          href: "/trashbins-detail",
          icon: TrashIcon,
          variant: "ghost",
        },
        {
          title: "Collectors",
          href: "/trash-collectors",
          icon: UsersRound,
          variant: "ghost",
        },
      ],
    },
    {
      header: isCollapsed ? null : "Settings",
      links: [
        {
          title: "Project",
          href: "/project-settings",
          icon: Settings2,
          variant: "ghost",
        },
        {
          title: "Account",
          href: "/settings",
          icon: Settings,
          variant: "ghost",
        },
      ],
    },
  ];

  const currentProject = projects.find(project => project.identifier === projectId);
  const navGroups = currentProject?.type === "trash" ? trashNavGroups : noiseNavGroups;

  // const filteredNavGroups = navGroups.map(group => ({
  //   ...group,
  //   links: group.links.filter(link => currentProject?.subpages.includes(link.title))
  // }));

  return (
    <div className="relative min-w-[80px] border-r px-3 pb-10 pt-24 d-flex flex-column justify-content-between">
      <div>
        {!mobileWidth && (
          <div className="absolute right-[-20px] top-7">
            <Button
              onClick={toggleSidebar}
              variant="secondary"
              className="rounded-full p-2"
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>
        )}
        {navGroups.map((group, index) => (
          <div key={index}>
            <div className="text-center text-lg mt-4">{group.header}</div>
            <Nav
              isCollapsed={mobileWidth ? true : isCollapsed}
              links={group.links.map((link) => ({
                ...link,
                variant:
                  link.variant === "default" || link.variant === "ghost"
                    ? link.variant
                    : "default",
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}