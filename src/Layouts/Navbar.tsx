import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "../components/theme/theme-toggle";

export function NavigationBar() {
  return (
    <NavigationMenu viewport={false} className="w-full border-b z-20 ">
      <NavigationMenuList className="flex w-full items-center px-4">
        {/* Left side: App title */}
        <NavigationMenuItem>
          <span className="text-lg font-semibold">Research Mate</span>
        </NavigationMenuItem>

        {/* Spacer pushes toggle to the right */}
        <div className="flex-1" />

        {/* Right side: Theme toggle */}
        <NavigationMenuItem>
          <ThemeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavigationBar;
