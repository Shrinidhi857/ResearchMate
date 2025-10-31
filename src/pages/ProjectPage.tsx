import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X, UserPlus } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import SearchCard from "../Layouts/searchform";
import DocumentAnalysisCard from "../Layouts/DocumentSelectCard";

const MessageBubble = ({ message }) => {
  return (
    <div
      className={`flex w-full mb-4 ${
        message.isOutgoing ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          message.isOutgoing
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-muted-foreground rounded-bl-sm"
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default function ProjectPage() {
  const [projectTitle, setProjectTitle] = useState("Untitled 1");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(projectTitle);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isOutgoing: false },
    { id: 2, text: "I need help with my project", isOutgoing: true },
  ]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditTitle = () => {
    setTempTitle(projectTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setProjectTitle(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setTempTitle(projectTitle);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleUserPrompt = (prompt) => {
    // Dummy function - add new message to conversation
    const newMessage = {
      id: messages.length + 1,
      text: prompt,
      isOutgoing: true,
    };
    setMessages([...messages, newMessage]);

    // Simulate a response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: messages.length + 2,
        text: "This is a dummy response to your prompt.",
        isOutgoing: false,
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  const handleInviteCollaborator = () => {
    // Dummy function - handle invite
    console.log("Inviting collaborator:", collaboratorEmail);
    // Reset and close
    setCollaboratorEmail("");
    setIsDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
                  onBlur={handleSaveTitle}
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
          {/*           <NavigationBar />
           */}{" "}
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 pb-32">
          <div className="space-y-2">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>

        {/* Input + Analysis */}
        <div className="absolute left-4 right-4 bottom-4 z-10">
          {showAnalysis && (
            <div className="flex justify-center mb-4">
              <DocumentAnalysisCard
                showAnalysis={showAnalysis}
                setShowAnalysis={setShowAnalysis}
                analysis={analysis}
                setAnalysis={setAnalysis}
              />
            </div>
          )}
          <SearchCard
            showAnalysis={showAnalysis}
            setShowAnalysis={setShowAnalysis}
            analysis={analysis}
            setAnalysis={setAnalysis}
            onPrompt={handleUserPrompt}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
