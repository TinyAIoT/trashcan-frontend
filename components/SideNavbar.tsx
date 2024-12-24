/** @format */
"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../lib/TranslationContext"; // Import useTranslation
import { useWindowWidth } from "@react-hook/window-size";

import {
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  MapIcon,
  Route,
  Trash2Icon,
  Settings,
  Settings2,
  CornerLeftUp,
} from "lucide-react";

export default function SideNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const city = localStorage.getItem("cityName");
  const type = localStorage.getItem("projectType");

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  const { t } = useTranslation(); // Translation hook

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  // Dynamically translated links
  const overviewLinks =
    type === "trash"
      ? [
          {
            title: t("menu.dashboard"), // Translated text
            href: `/projects/${city}/${type}`,
            icon: LayoutDashboard,
            variant: "default" as "default" | "ghost",
          },
          {
            title: t("menu.map"), // Translated text
            href: `/projects/${city}/${type}/map`,
            icon: MapIcon,
            variant: "ghost" as "default" | "ghost",
          },
          {
            title: t("menu.route"), // Translated text
            href: `/projects/${city}/${type}/route`,
            icon: Route,
            variant: "ghost" as "default" | "ghost",
          },
        ]
      : [
          {
            title: t("menu.dashboard"), // Translated text
            href: `/projects/${city}/${type}`,
            icon: LayoutDashboard,
            variant: "default" as "default" | "ghost",
          },
        ];

  const dataLinks =
    type === "trash"
      ? [
          {
            title: t("menu.trashbins"), // Translated text
            href: `/projects/${city}/${type}/trashbins`,
            icon: Trash2Icon,
            variant: "ghost" as "default" | "ghost",
          },
        ]
      : [];

  const settingsLinks = [
    {
      title: t("menu.project_setting"), // Translated text
      href: `/projects/${city}/${type}/settings`,
      icon: Settings2,
      variant: "ghost" as "default" | "ghost",
    },
    {
      title: t("menu.account"), // Translated text
      href: "/settings",
      icon: Settings,
      variant: "ghost" as "default" | "ghost",
    },
  ];

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
          {
            title: t("menu.project"), // Translated text
            href: "/projects",
            icon: CornerLeftUp,
            variant: "default",
          },
        ]}
      />
      <div className="flex flex-col gap-4 flex-grow justify-between h-full pb-6">
        <div>
          {overviewLinks.length > 0 && (
            <div>            
              <Nav
                isCollapsed={mobileWidth ? true : isCollapsed}
                links={overviewLinks}
              />
            </div>
          )}
          {dataLinks.length > 0 && (
            <div>
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
