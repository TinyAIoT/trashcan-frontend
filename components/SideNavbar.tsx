/** @format */
"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/ui/nav";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../lib/TranslationContext"; // Import useTranslation
import { useWindowWidth } from "@react-hook/window-size";

import {
  PanelRightClose,
  PanelLeftClose,
  LayoutDashboard,
  MapIcon,
  Route,
  Trash2Icon,
  Settings2,
  CornerLeftUp,
  MessageSquareReply,
} from "lucide-react";

const handleLogout = () => {
  window.location.href = "/login"; // Redirect to login page (authToken cleared)
};

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

  // Combined navigation links for Overview and Data sections
  const navigationLinks =
    type === "trash"
      ? [
          {
            title: t("menu.dashboard"),
            href: `/projects/${city}/${type}`,
            icon: LayoutDashboard,
            variant: "default" as "default" | "ghost",
          },
          {
            title: t("menu.map"),
            href: `/projects/${city}/${type}/map`,
            icon: MapIcon,
            variant: "ghost" as "default" | "ghost",
          },
          {
            title: t("menu.route"),
            href: `/projects/${city}/${type}/route`,
            icon: Route,
            variant: "ghost" as "default" | "ghost",
          },
          {
            title: t("menu.trashbins"),
            href: `/projects/${city}/${type}/trashbins`,
            icon: Trash2Icon,
            variant: "ghost" as "default" | "ghost",
          },
        ]
      : [
          {
            title: t("menu.dashboard"),
            href: `/projects/${city}/${type}`,
            icon: LayoutDashboard,
            variant: "default" as "default" | "ghost",
          },
        ];

  // Settings links
  const settingsLinks = [
    {
      title: t("menu.project_setting"),
      href: `/projects/${city}/${type}/settings`,
      icon: Settings2,
      variant: "ghost" as "default" | "ghost",
    },
    {
      title: t("menu.logout"),
      icon: MessageSquareReply,
      href: "/login",
      variant: "ghost" as "default" | "ghost",
      custom: (
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full text-left"
        >
          {t("menu.logout")}
        </Button>
      ),
    },
  ];

  return (
    <div className="relative min-w-[80px] border-r px-3 pb-10 py-6 flex flex-col justify-between h-screen">
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-full p-2"
          >
            {isCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
          </Button>
        </div>
      )}

      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: t("menu.project"),
            href: "/projects",
            icon: CornerLeftUp,
            variant: "default",
          },
        ]}
      />

      <div className="flex flex-col gap-4 flex-grow justify-between h-full pb-6">
        <div>
          {navigationLinks.length > 0 && (
            <Nav isCollapsed={mobileWidth ? true : isCollapsed} links={navigationLinks} />
          )}
        </div>
        <div>
          {settingsLinks.length > 0 && (
            <Nav isCollapsed={mobileWidth ? true : isCollapsed} links={settingsLinks} />
          )}
        </div>
      </div>
    </div>
  );
}
