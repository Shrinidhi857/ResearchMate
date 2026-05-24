import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X, UserPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import SearchCard from "../Layouts/searchform";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import PaperBucketDialog from "../Layouts/PaperBucketDialog";
import MessageBubble from "../components/MessageBubble";
import LaTeXEditor from "../Layouts/LaTeXEditor";

declare global {
  interface Window {
    latexjs?: {
      parse: (code: string, options?: any) => any;
      HtmlGenerator: new (options?: any) => any;
    };
  }
}

const API_URL = import.meta.env.VITE_SERVER_API_URL;
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
const AVATAR_COLORS = ["bg-red-400", "bg-blue-400", "bg-green-400"];

function ProjectPage() {
  const { projectId } = useParams<{ projectId?: string }>();
  const location = useLocation();
  const [projectTitle, setProjectTitle] = useState(
    location.state?.projectName || "Untitled 1",
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(projectTitle);
  const [messages, setMessages] = useState<
    { id: number; text: string; isOutgoing: boolean }[]
  >([]);
  const addMessage = (text: string, isOutgoing: boolean) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, text, isOutgoing }]);
  };
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<boolean>(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLatexEditorOpen, setIsLatexEditorOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Control sidebar state locally

  // Fetch users in the project
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
      // Set empty array on error
      setUsers([]);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchProjectDetails();
    if (projectId) {
      localStorage.setItem("currentProjectId", projectId);
    }
  }, [projectId]);

  const getUserEmailFromToken = (): string | null => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email || payload.sub || null;
    } catch (e) {
      console.error("Error parsing token:", e);
      return null;
    }
  };

  const fetchMessages = async () => {
    if (!projectId) return;
    try {
      const token = localStorage.getItem("authToken");
      const userEmail = getUserEmailFromToken();

      const [msgsResponse, resResponse] = await Promise.all([
        fetch(`${API_URL}/api/projects/${projectId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/projects/${projectId}/responses`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      let allMessages: any[] = [];

      if (msgsResponse.ok) {
        const msgs = await msgsResponse.json();
        const mappedMsgs = msgs.map((m: any) => ({
          id: m.id || `msg-${m.message_number}`,
          text: m.message_content,
          isOutgoing: m.message_sender === userEmail,
          timestamp: m.created_at || new Date().toISOString(),
          type: "message",
        }));
        allMessages = [...allMessages, ...mappedMsgs];
      }

      if (resResponse.ok) {
        const resps = await resResponse.json();
        const mappedResps = resps.map((r: any) => ({
          id: r.response_id || `res-${Math.random()}`,
          text: r.summary,
          isOutgoing: false, // Treat responses as incoming (AI/System) for now, or check logical flow
          timestamp: r.created_at || new Date().toISOString(),
          type: "response",
        }));
        allMessages = [...allMessages, ...mappedResps];
      }

      allMessages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      setMessages(allMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMessages();
    }
  }, [projectId]);

  const saveMessageToDB = async (content: string) => {
    if (!projectId) return;
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${API_URL}/api/projects/${projectId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
    } catch (e) {
      console.error("Failed to save message:", e);
    }
  };

  const saveResponseToDB = async (summary: string) => {
    if (!projectId) return;
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${API_URL}/api/projects/${projectId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ summary }),
      });
    } catch (e) {
      console.error("Failed to save response:", e);
    }
  };

  const handleUserPrompt = async (question: string) => {
    // Add user prompt bubble
    addMessage(question, true);
    saveMessageToDB(question);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/projects/${projectId}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");
      const data = await response.json();

      const answer = data.answer || "⚠️ No response found";

      // Add bot response bubble
      addMessage(answer, false);
      saveResponseToDB(answer);
    } catch (error) {
      console.error("Error fetching answer:", error);
      addMessage("⚠️ Error fetching response", false);
    }
  };

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

  // Helper function to get user initials
  const getUserInitials = (user: User): string => {
    if (user.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "?";
  };

  // ... (Handler functions remain the same) ...

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
      // Update local state on success
      setProjectTitle(data.project.project_name);
      setIsEditingTitle(false);
    } catch (err) {
      console.error("Error renaming project:", err);
      alert("Failed to rename project. Please check if you are the owner.");
      // Optionally keep it in edit mode if failed
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

  const handleInviteCollaborator = async () => {
    if (!collaboratorEmail.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!projectId) {
        alert("Project ID is missing");
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

      alert(data.message || "Invitation sent successfully!");
      setCollaboratorEmail("");
      setIsDialogOpen(false);
      fetchUsers(); // Refresh the list of users
    } catch (error: any) {
      console.error("Error inviting collaborator:", error);
      alert(
        error.message || "An error occurred while inviting the collaborator.",
      );
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <SidebarInset className="flex flex-row overflow-hidden h-screen">
        <div className="flex-1 flex flex-col relative min-w-0 transition-all duration-300">
          {/* Right Side Icon Sidebar - Keep it or move it? 
            Original logic had it fixed right. 
            If Editor opens, it panel slides in from right. 
            The icon sidebar might overlap or should stay on chat side?
            "right to the current window" -> Editor takes right side.
            Let's keep icons in the chat area (left pane) if possible, 
            or fixed right of SCREEN? 
            If fixed right of screen, it overlaps editor.
            Visual fix: Put it inside the Chat flex column or manage z-index.
            Let's keep it fixed but ensure Z-index is lower than editor? 
            Or move it into this container.
        */}

          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-10 shadow-sm">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* Editable Project Title */}
            <div className="flex items-center gap-2 flex-1">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-8 w-64"
                    autoFocus
                    onBlur={() => {}}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleSaveTitle}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-muted px-3 py-1 rounded-md transition-colors"
                  onClick={handleEditTitle}
                >
                  <h1 className="text-lg font-semibold">{projectTitle}</h1>
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex items-center ml-auto">
              <TooltipProvider>
                <div className="flex -space-x-4">
                  {users.length > 0 ? (
                    users.slice(0, 5).map((user, index) => (
                      <Tooltip key={user.id}>
                        <TooltipTrigger asChild>
                          <Avatar className="h-10 w-10 rounded-full border-2 border-background cursor-pointer hover:z-10 transition-transform hover:scale-110 flex items-center justify-center overflow-hidden">
                            <AvatarFallback
                              className={`flex h-full w-full items-center justify-center rounded-full text-white font-medium ${
                                AVATAR_COLORS[index % AVATAR_COLORS.length]
                              }`}
                            >
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <p className="font-semibold">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No users
                    </div>
                  )}
                </div>
              </TooltipProvider>
            </div>
            {/* 💡 NEW ELEMENT: Paper Bucket Dialog */}
            <PaperBucketDialog projectId={projectId} />
            {/* LaTeX Editor Button */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                setIsLatexEditorOpen(true);
                setSidebarOpen(false); // Close left sidebar
              }}
            >
              <FileText className="h-4 w-4" />
              LaTeX Editor
            </Button>
            {/* Collaboration Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Collaborator
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Collaborator</DialogTitle>
                  <DialogDescription>
                    Invite someone to collaborate on this project by entering
                    their email address.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="collaborator@example.com"
                      value={collaboratorEmail}
                      onChange={(e) => setCollaboratorEmail(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleInviteCollaborator}
                    disabled={!collaboratorEmail.trim()}
                  >
                    Invite
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </header>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 pb-32 mr-20">
            <div className="space-y-2">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>

          {/* Input + Analysis */}
          <div className="absolute left-4 right-20 bottom-4 z-10">
            {/* {showAnalysis && (
            <div className="flex justify-center mb-4">
              <DocumentAnalysisCard
                showAnalysis={showAnalysis}
                setShowAnalysis={setShowAnalysis}
                analysis={analysis}
                setAnalysis={setAnalysis}
                handleSubmit={handleSubmit}
              />
            </div>
          )} */}
            <SearchCard
              showAnalysis={showAnalysis}
              setShowAnalysis={setShowAnalysis}
              analysis={analysis}
              setAnalysis={setAnalysis}
              onPrompt={handleUserPrompt}
            />
          </div>
        </div>

        {/* Editor Panel */}
        {isLatexEditorOpen && (
          <LaTeXEditor
            isOpen={isLatexEditorOpen}
            onClose={() => setIsLatexEditorOpen(false)}
            projectId={projectId}
            projectTitle={projectTitle}
          />
        )}
      </SidebarInset>

      {/* Replaced: LaTeX Editor Overlay is now inline above */}
    </SidebarProvider>
  );
}

export default ProjectPage;
