import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  MessageSquare,
  BarChart2,
  Table,
  Network,
} from "lucide-react";

export default function HorizontalRoundedCard() {
  const items = [
    {
      icon: FolderKanban,
      title: "Project",
      color: "bg-blue-500",
      url: "/project",
    },
    {
      icon: MessageSquare,
      title: "Chat",
      color: "bg-emerald-500",
      url: "/chat",
    },
    {
      icon: BarChart2,
      title: "Analyse",
      color: "bg-amber-500",
      url: "/analyse",
    },
    {
      icon: Table,
      title: "Survey Table",
      color: "bg-purple-500",
      url: "/table",
    },
    {
      icon: Network,
      title: "Cluster Papers",
      color: "bg-pink-500",
      url: "/themeCluster",
    },
  ];

  return (
    <div className="w-full h-full p-3 overflow-x-hidden py-4">

        <div className="flex items-center justify-around gap-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <a href={item.url}>
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 hover:scale-110 transition-transform duration-300"
                >
                  <div className={`${item.color} rounded-full p-1 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-sm font-medium text-center text-primary">
                    {item.title}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
     </div>
    
  );
}
