import { useState, useEffect } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

export const useProjectDetails = (
  projectId?: string,
  initialTitle?: string,
) => {
  const [projectTitle, setProjectTitle] = useState(
    initialTitle || "Untitled 1",
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(projectTitle);

  const fetchProjectDetails = async () => {
    if (!projectId) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const projects = data.projects || [];
        const currentProject = projects.find(
          (p: any) => p.project_id === projectId,
        );
        if (currentProject) {
          setProjectTitle(currentProject.project_name);
        }
      }
    } catch (err) {
      console.error("Error fetching project details:", err);
    }
  };

  const handleEditTitle = () => {
    setTempTitle(projectTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = async () => {
    const newTitle = tempTitle.trim();
    if (!newTitle || newTitle === projectTitle) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/rename`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ project_name: newTitle }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to rename project");
      }

      const data = await response.json();
      setProjectTitle(data.project.project_name);
      setIsEditingTitle(false);
    } catch (err) {
      console.error("Error renaming project:", err);
      toast.error(
        "Failed to rename project. Please check if you are the owner.",
      );
    }
  };

  const handleCancelEdit = () => {
    setTempTitle(projectTitle);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  return {
    projectTitle,
    setProjectTitle,
    isEditingTitle,
    setIsEditingTitle,
    tempTitle,
    setTempTitle,
    handleEditTitle,
    handleSaveTitle,
    handleCancelEdit,
    handleKeyDown,
  };
};
