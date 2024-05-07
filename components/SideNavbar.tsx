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

  return (
    <div className="relative min-w-[80px] border-r px-3  pb-10 pt-24 ">
      {!mobileWidth && (
        <div className="absolute right-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className=" rounded-full p-2"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={[
          {
            title: "Dashboard",
            href: "/",
            icon: LayoutDashboard,
            variant: "default",
          },
          {
            title: "Trash Collectors",
            href: "/trash-collectors",
            icon: UsersRound,
            variant: "ghost",
          },
          {
            title: "Trash Cans",
            href: "/trash-cans",
            icon: ShoppingCart,
            variant: "ghost",
          },
          {
            title: "Visual",
            href: "/visual",
            icon: MapIcon,
            variant: "ghost",
          },
          {
            title: "Map",
            href: "/map",
            icon: MapIcon,
            variant: "ghost",
          },
          {
            title: "Cities",
            href: "/cities",
            icon: Settings,
            variant: "ghost",
          },
        ]}
      />
    </div>
  );
}
