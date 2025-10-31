import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsCard() {
  const projects = [
    {
      id: 3,
      name: "Visualization of Research Gaps in Climate Studies",
      status: "completed",
      timestamp: "2 days ago",
    },
    {
      id: 4,
      name: "Automated Hypothesis Generation from Biomedical Data",
      status: "active",
      timestamp: "1 hour ago",
    },
    {
      id: 5,
      name: "Knowledge Graphs for Cross-Disciplinary Research",
      status: "completed",
      timestamp: "3 days ago",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="w-full h-full p-3 overflow-x-hidden">
      <CardHeader>
        <CardTitle className="text-xl text-muted-foreground">
          Recent Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-3 min-w-max ">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 h-40 rounded-lg border-2 justify-evenly transition-all hover:shadow-md cursor-pointer min-w-[220px] ${getStatusColor(
                  project.status
                )}`}
              >
                <h3 className="font-semibold text-sm mb-2">{project.name}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize opacity-75">
                    {project.status}
                  </span>
                  <span className="opacity-60">{project.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
