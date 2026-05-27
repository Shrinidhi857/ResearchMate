import { useState, useEffect } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export const useProjectUsers = (projectId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUsers = async () => {
    const id = projectId || "default-project-id";

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/projects/${id}/top-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  const handleInviteCollaborator = async () => {
    if (!collaboratorEmail.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!projectId) {
        toast.error("Project ID is missing");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: collaboratorEmail }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite collaborator");
      }

      toast.success(data.message || "Invitation sent successfully!");
      setCollaboratorEmail("");
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error inviting collaborator:", error);
      toast.error(
        error.message || "An error occurred while inviting the collaborator.",
      );
    }
  };

  const getUserInitials = (user: User): string => {
    if (user.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "?";
  };

  useEffect(() => {
    fetchUsers();
  }, [projectId]);

  return {
    users,
    collaboratorEmail,
    setCollaboratorEmail,
    isDialogOpen,
    setIsDialogOpen,
    handleInviteCollaborator,
    getUserInitials,
    fetchUsers,
  };
};
