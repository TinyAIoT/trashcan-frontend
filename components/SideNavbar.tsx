/** @format */
"use client";

import { useState } from "react";
import { Nav } from "./ui/nav";

type Props = {};

import {
  ShoppingCart,
  LayoutDashboard,
  UsersRound,
  Settings,
  ChevronRight,
  ChevronLeft,
  MapIcon,
} from "lucide-react";
import { Button } from "./ui/button";

import { useWindowWidth } from "@react-hook/window-size";

export default function SideNavbar({}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  const navGroups = [
    {
      header: "Overview",
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
      ],
    },
    {
      header: "Data",
      links: [
        {
          title: "Trashbins",
          href: "/trashbins",
          icon: ShoppingCart,
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
  ];

  // TODO: Display at the bottom of the sidebar
  const settingsLink = {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    variant: "ghost",
  };

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
              links={group.links.map(link => ({
                ...link,
                variant: link.variant === "default" || link.variant === "ghost" ? link.variant : "default"
              }))}
            />
          </div>
        ))}
      </div>
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[{ ...settingsLink, variant: "default" }]}
      />
    </div>
  );
}
