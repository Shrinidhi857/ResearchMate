import React, { useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X, UserPlus, Download, FileText } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import SearchCard from "../Layouts/searchform";
import DocumentAnalysisCard from "../Layouts/DocumentSelectCard";
import html2pdf from "html2pdf.js";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
// 💡 NEW IMPORT: Import the PaperBucketDialog component (adjust path if needed)
import PaperBucketDialog from "../Layouts/PaperBucketDialog";

declare global {
  interface Window {
    latexjs?: {
      parse: (code: string, options?: any) => any;
      HtmlGenerator: new (options?: any) => any;
    };
  }
}

// -----------------------------------------------------------
// MessageBubble Component (Remains unchanged)
// -----------------------------------------------------------
const MessageBubble = ({
  message,
}: {
  message: { isOutgoing: boolean; text: string };
}) => {
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

// -----------------------------------------------------------
// LaTeXEditor Component (Remains unchanged - added basic TypeScript types)
// -----------------------------------------------------------
const LaTeXEditor = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [latexCode, setLatexCode] = useState(`\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

\\title{Sample LaTeX Document}
\\author{Shrinidhi Achar}
\\date{\\today}
\\maketitle

\\section{Introduction}
This is a simple LaTeX document to test the compiler.

\\section{Mathematics}
Here’s an inline equation: $E = mc^2$

And a displayed equation:
\\[
\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
\\]

\\section{List Example}
\\begin{itemize}
  \\item Apple
  \\item Banana
  \\item Mango
\\end{itemize}

\\end{document}`);

  const [compiledHTML, setCompiledHTML] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load LaTeX.js only once
  useEffect(() => {
    const loadLatexJS = async () => {
      if (!window.latexjs) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/latex.js@0.12.6/dist/latex.min.js";
        script.async = true;
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = (e) => reject(e);
        });
      }
    };
    loadLatexJS();
  }, []);

  // Compile automatically when text changes (live preview)
  useEffect(() => {
    if (isOpen && window.latexjs) {
      const delay = setTimeout(() => compileLatex(), 500);
      return () => clearTimeout(delay);
    }
  }, [latexCode, isOpen]);

  const compileLatex = async () => {
    setIsCompiling(true);
    try {
      // ... (Rest of compileLatex logic remains the same)
      if (!window.latexjs) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/latex.js@0.12.6/dist/latex.min.js";
        script.async = true;
        document.head.appendChild(script);
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = (e) => reject(e);
        });
      }

      const generator = new window.latexjs.HtmlGenerator({ hyphenate: false });
      window.latexjs.parse(latexCode, { generator });

      const frag = generator.domFragment();
      const headFrag = generator.stylesAndScripts();

      const container = document.createElement("div");
      container.appendChild(headFrag);
      container.appendChild(frag);

      const htmlBody = container.innerHTML;

      const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <style>
      body { font-family: 'Computer Modern', serif; max-width: 800px; margin: 20px auto; padding: 20px; line-height: 1.6; background: white; }
      h1,h2,h3 { margin: .6em 0; }
      .katex { font-size: 1.1em; }
      .equation { margin: 1em 0; text-align: center; }
      ul, ol { margin: 1em 0; padding-left: 2em; }
      p { margin: 1em 0; }
    </style>
  </head>
  <body>${htmlBody}</body>
</html>`;

      setCompiledHTML(htmlContent);
    } catch (err: unknown) {
      const error = err as Error;
      const errorHTML = `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8"><style>body{font-family:monospace;padding:20px;background:#fff3cd;color:#856404}pre{white-space:pre-wrap}</style></head>
  <body><h3>Compilation Error</h3><pre>${
    (error && error.message) || String(err)
  }</pre></body>
</html>`;
      setCompiledHTML(errorHTML);
    } finally {
      setIsCompiling(false);
    }
  };

  // ... (downloadHTML and downloadPDF functions remain the same)

  if (!isOpen) return null;

  const downloadPDF = () => {
    // Note: The element with ID 'latex-output' is missing in your code,
    // so this function won't work correctly unless you adjust the iframe's wrapper.
    const latexOutput = document.getElementById("latex-output");
    if (!latexOutput) return;

    const opt = {
      margin: 0.5,
      filename: "document.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(latexOutput).set(opt).save();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4 mr-2" /> Close
            </Button>
            <h2 className="text-lg font-semibold">LaTeX Editor</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={compileLatex}
              disabled={isCompiling}
              variant="outline"
              size="sm"
            >
              {isCompiling ? "Compiling..." : "Recompile"}
            </Button>
            <Button onClick={downloadPDF} size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>

        {/* Split Editor */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor */}
          <div className="w-1/2 border-r flex flex-col">
            <div className="p-3 border-b bg-muted">
              <h3 className="text-sm font-medium">LaTeX Code</h3>
            </div>
            <ScrollArea className="flex-1">
              <Textarea
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                className="w-full min-h-full resize-none border-0 focus-visible:ring-0 font-mono text-sm p-4"
                placeholder="Enter LaTeX code..."
                style={{ minHeight: "calc(100vh - 140px)" }}
              />
            </ScrollArea>
          </div>

          {/* Preview */}
          <div className="w-1/2 flex flex-col bg-gray-50">
            <div className="p-3 border-b bg-muted">
              <h3 className="text-sm font-medium">Compiled Preview</h3>
            </div>
            <ScrollArea className="flex-1">
              <iframe
                ref={iframeRef}
                srcDoc={compiledHTML}
                className="w-full h-full border-0 bg-white"
                title="LaTeX Preview"
                style={{ minHeight: "calc(100vh - 200px)" }}
              />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------
// ProjectPage Component (Modified)
// -----------------------------------------------------------
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
  const [isLatexEditorOpen, setIsLatexEditorOpen] = useState(false);

  // 💡 NEW STATE: Paper Bucket State (Set of Paper IDs)
  const [paperBucketIds, setPaperBucketIds] = useState<Set<string>>(
    new Set([])
  );

  // ... (Handler functions remain the same) ...

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleUserPrompt = (prompt: string) => {
    const newMessage = {
      id: messages.length + 1,
      text: prompt,
      isOutgoing: true,
    };
    setMessages([...messages, newMessage]);

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
    console.log("Inviting collaborator:", collaboratorEmail);
    setCollaboratorEmail("");
    setIsDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Right Side Icon Sidebar */}
        <div className="fixed right-0 mt-16 h-full w-16 border-l bg-background flex flex-col items-center py-4 gap-6 z-1">
          <PaperBucketDialog
            initialPaperIds={paperBucketIds}
            onUpdatePaperIds={setPaperBucketIds}
          />
          np
          {/* <Button variant="ghost" size="icon">
            <UserPlus className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <Download className="h-5 w-5" />
          </Button> */}
        </div>

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
          <div className="flex items-center ml-auto">
            <div className="flex -space-x-4">
              <Avatar className="h-10 w-10 rounded-full border-2 border-background">
                <AvatarImage
                  className="rounded-full object-cover"
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback className="rounded-full">CN</AvatarFallback>
              </Avatar>

              <Avatar className="h-10 w-10 rounded-full border-2 border-background">
                <AvatarImage
                  className="rounded-full object-cover"
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback className="rounded-full">LR</AvatarFallback>
              </Avatar>

              <Avatar className="h-10 w-10 rounded-full border-2 border-background">
                <AvatarImage
                  className="rounded-full object-cover"
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback className="rounded-full">ER</AvatarFallback>
              </Avatar>
            </div>
          </div>
          \{/* 💡 NEW ELEMENT: Paper Bucket Dialog */}
          <PaperBucketDialog
            initialPaperIds={paperBucketIds}
            onUpdatePaperIds={setPaperBucketIds}
          />
          {/* LaTeX Editor Button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsLatexEditorOpen(true)}
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

      {/* LaTeX Editor Overlay */}
      <LaTeXEditor
        isOpen={isLatexEditorOpen}
        onClose={() => setIsLatexEditorOpen(false)}
      />
    </SidebarProvider>
  );
}
