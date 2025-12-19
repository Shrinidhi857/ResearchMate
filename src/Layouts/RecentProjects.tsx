import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

export default function ProjectsCard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Handle both array or { projects: [] } format just in case
        const projectsData = Array.isArray(data) ? data : (data.projects || []);
        
        // Transform data to match UI needs
        const formattedProjects = projectsData.map((p: any) => ({
          id: p.id || p.project_id, // Use available ID
          project_id: p.project_id, // Keep original ID for navigation
          name: p.project_name,
          // Generate mock status/time if not in backend yet, or use created_at if available
          status: "active", // Defaulting to active for now as backend doesn't seem to return status
          timestamp: p.created_at ? new Date(p.created_at).toLocaleDateString() : "Recently",
        }));
        setProjects(formattedProjects);
      }
    } catch (error) {
      console.error("Error fetching recent projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (project: any) => {
    navigate(`/project/${project.project_id || project.id}`, {
      state: { projectName: project.name },
    });
  };

  const getStatusColor = (status:any) => {
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
            {isLoading ? (
              <div className="p-4 text-muted-foreground text-sm">Loading projects...</div>
            ) : projects.length === 0 ? (
               <div className="p-4 text-muted-foreground text-sm">No recent projects</div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className={`p-4 h-40 rounded-lg border-2 justify-evenly transition-all hover:shadow-md cursor-pointer min-w-[220px] ${getStatusColor(
                    project.status
                  )}`}
                >
                  <h3 className="font-semibold text-sm mb-2 line-clamp-3">{project.name}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize opacity-75">
                      {project.status}
                    </span>
                    <span className="opacity-60">{project.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
