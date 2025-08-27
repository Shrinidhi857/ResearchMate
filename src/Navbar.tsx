import React from "react";
import type { ReactNode } from "react";

import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// ✅ Type for ListItem props
type ListItemProps = {
  title: string;
  href: string;
  children: ReactNode;
} & React.ComponentPropsWithoutRef<"li">;

// Dummy components data
const components = [
  {
    title: "Alert Dialog",
    href: "#",
    description:
      "A modal dialog that interrupts the user and expects a response.",
  },
  {
    title: "Hover Card",
    href: "#",
    description: "Preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "#",
    description: "Shows task completion progress as a bar.",
  },
  {
    title: "Scroll-area",
    href: "#",
    description: "Separates content visually or semantically.",
  },
  {
    title: "Tabs",
    href: "#",
    description: "Layered sections displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "#",
    description: "Popup displaying info on hover or focus.",
  },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {/* Home Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    href="#"
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">Demo UI</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Beautifully designed components for demonstration.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="Introduction">
                Reusable components using React and Tailwind CSS.
              </ListItem>
              <ListItem href="#" title="Installation">
                How to set up dependencies and project structure.
              </ListItem>
              <ListItem href="#" title="Typography">
                Styles for headings, paragraphs, lists, etc.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Components Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Docs Link */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a href="#">Docs</a>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* List Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>List</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Components</div>
                    <div className="text-muted-foreground">
                      Browse all components.
                    </div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Documentation</div>
                    <div className="text-muted-foreground">
                      Learn how to use the library.
                    </div>
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="font-medium">Blog</div>
                    <div className="text-muted-foreground">
                      Read latest posts.
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Simple Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">Components</a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">Documentation</a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#">Blocks</a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Menu with Icons */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleHelpIcon />
                    Backlog
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleIcon />
                    To Do
                  </a>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <a href="#" className="flex-row items-center gap-2">
                    <CircleCheckIcon />
                    Done
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// ✅ Correctly typed ListItem
function ListItem({ title, children, href, ...props }: ListItemProps) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}

export default NavigationMenuDemo;
