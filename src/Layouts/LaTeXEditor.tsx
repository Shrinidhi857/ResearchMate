import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  FileText,
  Loader2,
  History,
  X,
  Zap,
  ChevronRight,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CodeEditor from "./CodeEditor";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

declare global {
  interface Window {
    latexjs?: {
      parse: (code: string, options?: any) => any;
      HtmlGenerator: new (options?: any) => any;
    };
  }
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface Document {
  doc_id: string;
  title: string;
}

interface HistoryEntry {
  timestamp: number;
  code: string;
  description?: string;
}

type AgentStatus =
  | "idle"
  | "thinking"
  | "generating"
  | "fixing"
  | "success"
  | "error";
type ActiveTab = "code" | "preview" | "agent" | "history";

const StatusIndicator = ({
  status,
  connected,
}: {
  status: AgentStatus;
  connected: boolean;
}) => {
  if (!connected)
    return (
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <span className="text-xs text-red-400 font-medium tracking-wide">
          Disconnected
        </span>
      </div>
    );
  if (status === "thinking" || status === "fixing")
    return (
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="text-xs text-amber-400 font-medium tracking-wide uppercase">
          {status}
        </span>
      </div>
    );
  if (status === "success")
    return (
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        <span className="text-xs text-emerald-400 font-medium tracking-wide">
          Compiled
        </span>
      </div>
    );
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-xs text-emerald-400 font-medium tracking-wide">
        Ready
      </span>
    </div>
  );
};

const LaTeXEditor = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectTitle?: string;
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const response = await fetch(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const [latexCode, setLatexCode] = useState(`\\documentclass{article}
\\begin{document}

\\title{Sample LaTeX Document}
\\author{${user?.first_name || "Unknown"} ${user?.last_name || "User"}}
\\date{\\today}
\\maketitle

\\section{Introduction}
This is a simple LaTeX document to test the compiler.

\\section{Mathematics}
Here's an inline equation: $E = mc^2$

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

  const [activeTab, setActiveTab] = useState<ActiveTab>("code");
  const [compiledHTML, setCompiledHTML] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState("");
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle");
  const [agentMessage, setAgentMessage] = useState("");
  const [compilationAttempts, setCompilationAttempts] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const clientId = useRef(`client_${Math.random().toString(36).substr(2, 9)}`);
  const [availableDocuments, setAvailableDocuments] = useState<Document[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastCodeReported = useRef<string>("");
  const compilationFinished = useRef<boolean>(true);
  const [compilationVersion, setCompilationVersion] = useState(0);
  const lastReportedVersion = useRef(0);
  const [reconnectTrigger, setReconnectTrigger] = useState(0);

  useEffect(() => {
    if (history.length === 0 && latexCode) {
      setHistory([
        {
          timestamp: Date.now(),
          code: latexCode,
          description: "Initial version",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory((prev) => {
        const lastEntry = prev[prev.length - 1];
        if (!lastEntry || lastEntry.code !== latexCode) {
          return [
            ...prev,
            {
              timestamp: Date.now(),
              code: latexCode,
              description: "Auto-save",
            },
          ];
        }
        return prev;
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [latexCode]);

  const handleRevert = (entry: HistoryEntry) => {
    if (
      confirm(
        "Revert to this version? Current changes will be saved in history.",
      )
    ) {
      setLatexCode(entry.code);
    }
  };

  useEffect(() => {
    if (
      isOpen &&
      projectId &&
      (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED)
    ) {
      connectToAgent();
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen, projectId, reconnectTrigger]);

  const connectToAgent = () => {
    const wsUrl = `ws://localhost:8001/ws/${clientId.current}/${projectId}`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "CONNECTED":
          setAgentMessage(data.content);
          break;
        case "AGENT_THINKING":
          setAgentStatus("thinking");
          setAgentMessage(data.content);
          break;
        case "CODE_GENERATED":
          setAgentStatus("generating");
          lastCodeReported.current = data.content;
          setLatexCode(data.content);
          setCompilationAttempts(data.attempt);
          break;
        case "COMPILATION_COMPLETE":
          setAgentStatus("success");
          setAgentMessage(data.content);
          setCompilationAttempts(data.total_attempts);
          break;
        case "ERROR":
          setAgentStatus("error");
          setAgentMessage(data.content);
          break;
        case "SAVE_STATUS":
          toast.info(data.content);
          break;
      }
    };
    ws.onclose = (event) => {
      setWsConnected(false);
      wsRef.current = null;
      if (!event.wasClean)
        setTimeout(() => setReconnectTrigger((prev) => prev + 1), 3000);
    };
    ws.onerror = () => {
      setAgentStatus("error");
      setAgentMessage(
        "Connection error. Is the agent server running on port 8001?",
      );
    };
    wsRef.current = ws;
  };

  const sendAgentRequest = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN && agentPrompt.trim()) {
      wsRef.current.send(
        JSON.stringify({
          type: "USER_MESSAGE",
          content: agentPrompt,
          document_ids:
            selectedDocumentIds.length > 0 ? selectedDocumentIds : undefined,
        }),
      );
      setAgentPrompt("");
      setAgentStatus("thinking");
    } else if (!wsConnected) {
      setReconnectTrigger((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (agentStatus !== "generating" && agentStatus !== "fixing") return;
    if (compilationVersion === lastReportedVersion.current) return;
    if (
      lastCodeReported.current !== latexCode &&
      lastCodeReported.current !== ""
    )
      return;
    const timer = setTimeout(() => {
      if (compiledHTML.includes("Compilation Error")) {
        const errorLogs =
          compiledHTML.match(/<pre>(.*?)<\/pre>/s)?.[1] || "Compilation failed";
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({ type: "EXECUTION_ERROR", logs: errorLogs }),
          );
          setAgentStatus("fixing");
          lastReportedVersion.current = compilationVersion;
        }
      } else if (compiledHTML && !compiledHTML.includes("Compilation Error")) {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "EXECUTION_SUCCESS" }));
          lastReportedVersion.current = compilationVersion;
        }
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [compiledHTML, compilationVersion, agentStatus, latexCode]);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchPaper();
      fetchPaperBucketDocuments();
    }
  }, [isOpen, projectId]);

  const fetchPaperBucketDocuments = async () => {
    if (!projectId) return;
    setIsLoadingDocuments(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/paper-bucket`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch paper bucket");
      const data = await response.json();
      const paperIds = data.paper_ids || [];
      if (paperIds.length > 0) {
        const docsResponse = await fetch(`${API_URL}/api/documents/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (docsResponse.ok) {
          const allDocs: Document[] = await docsResponse.json();
          setAvailableDocuments(
            allDocs.filter((doc) => paperIds.includes(doc.doc_id)),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching paper bucket documents:", error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const fetchPaper = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/paper`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        const data = await response.json();
        if (data.content) setLatexCode(data.content);
      }
    } catch (error) {
      console.error("Error fetching paper:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePaper = async (content: string) => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${API_URL}/api/projects/${projectId}/paper`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error("Error saving paper:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectId && latexCode) savePaper(latexCode);
    }, 2000);
    return () => clearTimeout(timer);
  }, [latexCode, projectId]);

  useEffect(() => {
    if (typeof (window as any).require === "undefined") {
      (window as any).require = (name: string) => {
        console.warn(
          `Latex.js tried to require package "${name}". Returning empty module.`,
        );
        return {};
      };
    }
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

  useEffect(() => {
    if (isOpen && window.latexjs) {
      const delay = setTimeout(() => compileLatex(), 500);
      return () => clearTimeout(delay);
    }
  }, [latexCode, isOpen]);

  const compileLatex = async () => {
    setIsCompiling(true);
    compilationFinished.current = false;
    let capturedSilentErrors = "";
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      capturedSilentErrors += args.join(" ") + "\n";
      originalConsoleError.apply(console, args);
    };
    try {
      if (!window.latexjs) throw new Error("LaTeX.js library not loaded.");
      const generator = new window.latexjs.HtmlGenerator({ hyphenate: false });
      window.latexjs.parse(latexCode, { generator });
      if (
        capturedSilentErrors.includes("error loading package") ||
        capturedSilentErrors.includes("ReferenceError")
      ) {
        throw new Error(capturedSilentErrors);
      }
      const frag = generator.domFragment();
      const headFrag = generator.stylesAndScripts();
      const scripts = headFrag.querySelectorAll("script");
      scripts.forEach((s: any) => {
        if (s.src && !s.src.startsWith("http") && !s.src.startsWith("https"))
          s.remove();
      });
      const container = document.createElement("div");
      container.appendChild(headFrag);
      container.appendChild(frag);
      const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"><style>body{font-family:'Computer Modern',serif;max-width:800px;margin:20px auto;padding:20px;line-height:1.6;background:white;}h1,h2,h3{margin:.6em 0;}.katex{font-size:1.1em;}.equation{margin:1em 0;text-align:center;}ul,ol{margin:1em 0;padding-left:2em;}p{margin:1em 0;}</style></head><body>${container.innerHTML}</body></html>`;
      setCompiledHTML(htmlContent);
    } catch (err: unknown) {
      const error = err as Error;
      setCompiledHTML(
        `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:monospace;padding:20px;background:#fff3cd;color:#856404}pre{white-space:pre-wrap}</style></head><body><h3>Compilation Error</h3><pre>${error.message || String(err)}</pre></body></html>`,
      );
    } finally {
      console.error = originalConsoleError;
      setIsCompiling(false);
      compilationFinished.current = true;
      setCompilationVersion((v) => v + 1);
    }
  };

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in first");
        return;
      }
      if (!projectId) {
        toast.warning("No project selected");
        return;
      }
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/generate-pdf`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`PDF generation failed: ${errorData.error}`);
        return;
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        toast.warning("PDF is empty.");
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectTitle || "document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col border-l bg-background w-[50%] shrink-0 shadow-2xl z-20 transition-all duration-300 ease-in-out">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
              <FileText className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight leading-none">
                {projectTitle || "LaTeX Editor"}
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                {projectTitle ? `${projectTitle}.tex` : "document.tex"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save status */}
            <div className="flex items-center gap-1.5">
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    Saving
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">
                    Saved
                  </span>
                </>
              )}
            </div>

            <Separator orientation="vertical" className="h-4" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={compileLatex}
                  disabled={isCompiling}
                  className="h-7 px-3 text-xs gap-1.5"
                >
                  {isCompiling ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Zap className="h-3 w-3" />
                  )}
                  {isCompiling ? "Compiling" : "Compile"}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Recompile LaTeX</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={downloadPDF}
                  className="h-7 px-3 text-xs gap-1.5"
                >
                  <Download className="h-3 w-3" /> Export PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Download as PDF</p>
              </TooltipContent>
            </Tooltip>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* ── Agent Status Strip ── */}
        <div
          className={`px-5 py-2 border-b flex items-center justify-between transition-colors ${
            agentStatus === "thinking" || agentStatus === "fixing"
              ? "bg-amber-500/5 border-amber-500/20"
              : agentStatus === "success"
                ? "bg-emerald-500/5 border-emerald-500/20"
                : agentStatus === "error"
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-muted/30"
          }`}
        >
          <StatusIndicator status={agentStatus} connected={wsConnected} />

          <div className="flex items-center gap-2">
            {agentMessage && agentStatus !== "idle" && (
              <span className="text-[10px] text-muted-foreground max-w-[200px] truncate">
                {agentMessage}
              </span>
            )}
            {compilationAttempts > 0 && (
              <Badge
                variant="secondary"
                className="text-[10px] h-4 px-1.5 font-mono"
              >
                attempt {compilationAttempts}
              </Badge>
            )}
            {!wsConnected && (
              <Button
                variant="outline"
                size="sm"
                className="h-5 text-[10px] px-2"
                onClick={() => setReconnectTrigger((p) => p + 1)}
              >
                Reconnect
              </Button>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ActiveTab)}
            className="flex flex-col h-full"
          >
            {/* Tab Bar */}
            <div className="px-4 pt-3 pb-0 border-b bg-card">
              <TabsList className="h-8 bg-muted/50 p-0.5 gap-0.5">
                {[
                  { value: "code", label: "Code" },
                  { value: "preview", label: "Preview" },
                  { value: "history", label: "History" },
                  { value: "agent", label: "AI Agent" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="h-7 px-3 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all relative"
                  >
                    {tab.value === "agent" && (
                      <span
                        className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${wsConnected ? "bg-emerald-500" : "bg-red-500"}`}
                      />
                    )}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative">
              {/* Code Tab */}
              <TabsContent
                value="code"
                className="h-full mt-0 data-[state=active]:flex flex-col hidden"
              >
                <div className="absolute inset-0">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-xs">Loading document…</span>
                    </div>
                  ) : (
                    <CodeEditor
                      value={latexCode}
                      onChange={setLatexCode}
                      minHeight="100%"
                      className="h-full"
                    />
                  )}
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent
                value="preview"
                className="h-full mt-0 data-[state=active]:block hidden"
              >
                <div className="absolute inset-0 bg-white">
                  {isCompiling && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-background/90 backdrop-blur-sm border rounded-full px-2.5 py-1 shadow-sm">
                      <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Compiling…
                      </span>
                    </div>
                  )}
                  <iframe
                    ref={iframeRef}
                    srcDoc={compiledHTML}
                    className="w-full h-full border-0"
                    title="LaTeX Preview"
                  />
                </div>
              </TabsContent>

              {/* Agent Tab */}
              <TabsContent
                value="agent"
                className="h-full mt-0 data-[state=active]:flex flex-col hidden"
              >
                <ScrollArea className="flex-1 px-4 py-3">
                  <div className="space-y-3">
                    {/* Document Selector */}
                    {availableDocuments.length > 0 && (
                      <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs font-semibold tracking-tight">
                            Context Documents
                          </span>
                          {selectedDocumentIds.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-[10px] h-4 px-1.5"
                            >
                              {selectedDocumentIds.length} selected
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                          Include documents from your paper bucket as context
                          for the AI agent.
                        </p>
                        {isLoadingDocuments ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {availableDocuments.map((doc) => (
                              <label
                                key={doc.doc_id}
                                className="flex items-center gap-2.5 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
                              >
                                <Checkbox
                                  checked={selectedDocumentIds.includes(
                                    doc.doc_id,
                                  )}
                                  onCheckedChange={(checked) => {
                                    setSelectedDocumentIds(
                                      checked
                                        ? [...selectedDocumentIds, doc.doc_id]
                                        : selectedDocumentIds.filter(
                                            (id) => id !== doc.doc_id,
                                          ),
                                    );
                                  }}
                                  className="h-3.5 w-3.5"
                                />
                                <span className="text-xs flex-1 truncate group-hover:text-foreground transition-colors">
                                  {doc.title}
                                </span>
                                <ChevronRight className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Agent Message */}
                    {agentStatus !== "idle" && agentMessage && (
                      <div
                        className={`rounded-lg border p-3.5 ${
                          agentStatus === "error"
                            ? "bg-red-500/5 border-red-200 dark:border-red-900"
                            : agentStatus === "success"
                              ? "bg-emerald-500/5 border-emerald-200 dark:border-emerald-900"
                              : "bg-primary/5 border-primary/20"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {agentStatus === "error" ? (
                            <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                          ) : agentStatus === "success" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <Loader2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0 animate-spin" />
                          )}
                          <div>
                            <p className="text-xs font-medium mb-0.5">Agent</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {agentMessage}
                            </p>
                            {compilationAttempts > 0 && (
                              <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-mono">
                                Attempt {compilationAttempts}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Agent Input */}
                <div className="border-t bg-card p-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Describe what you want to write or change… (Shift+Enter for newline)"
                      className="min-h-[80px] text-xs resize-none bg-background border-muted focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                      value={agentPrompt}
                      onChange={(e) => setAgentPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (wsConnected && agentPrompt.trim())
                            sendAgentRequest();
                        }
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground/60">
                        Enter to send · Shift+Enter for newline
                      </span>
                      <Button
                        onClick={sendAgentRequest}
                        disabled={
                          !agentPrompt.trim() ||
                          !wsConnected ||
                          agentStatus === "thinking" ||
                          agentStatus === "fixing"
                        }
                        size="sm"
                        className="h-7 px-3 text-xs gap-1.5"
                      >
                        {agentStatus === "thinking" ||
                        agentStatus === "fixing" ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />{" "}
                            Working…
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" /> Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent
                value="history"
                className="h-full mt-0 data-[state=active]:flex flex-col hidden"
              >
                <div className="px-4 py-3 border-b bg-card">
                  <div className="flex items-center gap-2">
                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold tracking-tight">
                      Version History
                    </span>
                    <Badge
                      variant="outline"
                      className="ml-auto text-[10px] h-4 px-1.5 font-mono"
                    >
                      {history.length} versions
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    Auto-saved snapshots. Revert to any previous state.
                  </p>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {history.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                        <Clock className="h-8 w-8 opacity-20" />
                        <p className="text-xs">
                          No history yet. Start typing to create snapshots.
                        </p>
                      </div>
                    ) : (
                      history
                        .slice()
                        .reverse()
                        .map((entry, index) => (
                          <div
                            key={entry.timestamp}
                            className={`rounded-lg border bg-card p-3 flex items-center gap-3 hover:border-primary/30 transition-colors ${index === 0 ? "border-primary/30 bg-primary/5" : ""}`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium">
                                  {entry.description || "Version"}
                                </span>
                                {index === 0 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[9px] h-3.5 px-1"
                                  >
                                    current
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1.5">
                                <Clock className="h-2.5 w-2.5" />
                                {new Date(
                                  entry.timestamp,
                                ).toLocaleTimeString()}{" "}
                                ·{" "}
                                {new Date(entry.timestamp).toLocaleDateString()}
                              </div>
                              <div className="font-mono text-[9px] text-muted-foreground/60 bg-muted rounded px-2 py-1 truncate">
                                {entry.code
                                  .substring(0, 60)
                                  .replace(/\n/g, " ")}
                                …
                              </div>
                            </div>
                            {index !== 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 shrink-0"
                                    onClick={() => handleRevert(entry)}
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  <p>Revert to this version</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LaTeXEditor;
