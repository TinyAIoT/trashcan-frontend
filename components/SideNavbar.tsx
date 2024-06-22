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
  Trash2Icon,
  TrashIcon,
  Settings,
  Settings2,
  CornerLeftUp,
} from "lucide-react";

export default function SideNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // TODO: This is a hacky way to obtain city and type from URL. Fix.
      const path = window.location.pathname;
      const parts = path.split('/');
      setCity(parts[2]);
      setType(parts[3]);
    }
  }, []);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const overviewLinks = [
    { title: "Dashboard", href: `/projects/${city}/${type}`, icon: LayoutDashboard, variant: "default" },
    type === "trash" ? { title: "Map", href: `/projects/${city}/${type}/map`, icon: MapIcon, variant: "ghost" } : null,
    type === "trash" ? { title: "Route", href: `/projects/${city}/${type}/route`, icon: Route, variant: "ghost" } : null,
  ].filter(link => link !== null)

  const dataLinks = [
    type === "trash" ? { title: "Trashbins", href: `/projects/${city}/${type}/trashbins`, icon: Trash2Icon, variant: "ghost" } : null,
    type === "trash" ? { title: "Trashbins Detail", href: `/projects/${city}/${type}/trashbins-detail`, icon: TrashIcon, variant: "ghost" } : null,
  ].filter(link => link !== null)
  
  const settingsLinks = [
    { title: "Project", href: `/projects/${city}/${type}/settings`, icon: Settings2, variant: "ghost" },
    { title: "Account", href: "/settings", icon: Settings, variant: "ghost" },
  ]

  return (
    <div className="relative min-w-[80px] border-r px-3 pb-10 py-6 d-flex flex-column justify-content-between h-screen">
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
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          { title: "Projects", href: "/projects", icon: CornerLeftUp, variant: "default" },
        ]}
      />
      <div className="flex flex-col gap-4 flex-grow justify-between h-full pb-6">
        {!mobileWidth && (
          <div className="absolute right-[-20px] top-7">
            <Button onClick={toggleSidebar} variant="secondary" className="rounded-full p-2">
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          </div>
        )}
        <div>
          {overviewLinks.length > 0 && (
            <div>
              {!isCollapsed && !mobileWidth && <h2 className="text-lg text-gray-600 font-seibold text-center">Overview</h2>}
              <Nav
                isCollapsed={mobileWidth ? true : isCollapsed}
                links={overviewLinks}
              />
            </div>
          )}
          {dataLinks.length > 0 && (
            <div>
              {!isCollapsed && !mobileWidth && <h2 className="text-lg text-gray-600 font-seibold text-center">Data</h2>}
              <Nav
                isCollapsed={mobileWidth ? true : isCollapsed}
                links={dataLinks}
              />
            </div>
          )}
        </div>
        <div>
          {settingsLinks.length > 0 && (
            <div>
              {!isCollapsed && !mobileWidth && <h2 className="text-lg text-gray-600 font-seibold text-center">Settings</h2>}
              <Nav
                isCollapsed={mobileWidth ? true : isCollapsed}
                links={settingsLinks}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
