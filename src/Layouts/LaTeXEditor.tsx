import React, { useState, useEffect, useRef } from "react";
import { Download, FileText, Loader2, History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import CodeEditor from "./CodeEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // ... (latexCode state)
  const [activeTab, setActiveTab] = useState<
    "code" | "preview" | "agent" | "history"
  >("code");
  const [compiledHTML, setCompiledHTML] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);

  // Agent State
  const [agentPrompt, setAgentPrompt] = useState("");
  const [agentStatus, setAgentStatus] = useState<
    "idle" | "thinking" | "generating" | "fixing" | "success" | "error"
  >("idle");
  const [agentMessage, setAgentMessage] = useState("");
  const [compilationAttempts, setCompilationAttempts] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const clientId = useRef(`client_${Math.random().toString(36).substr(2, 9)}`);

  // Document Selection State
  interface Document {
    doc_id: string;
    title: string;
  }
  const [availableDocuments, setAvailableDocuments] = useState<Document[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

  // Version History State
  interface HistoryEntry {
    timestamp: number;
    code: string;
    description?: string;
  }
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Initialize history with initial code
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

  // Debounced history update
  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory((prev) => {
        const lastEntry = prev[prev.length - 1];
        // Only add if code has changed significantly or enough time passed,
        // but for now let's just check if it's different from the last entry
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
    }, 2000); // Wait 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [latexCode]);

  const handleRevert = (entry: HistoryEntry) => {
    if (
      confirm(
        "Are you sure you want to revert to this version? Current changes will be saved in history before reverting.",
      )
    ) {
      setLatexCode(entry.code);
      // The revert itself will trigger the debounced save, effectively saving the state BEFORE revert as an "Auto-save"
      // and then eventually the reverted state as another "Auto-save".
      // Use a customized description if desired, but simple "Auto-save" is fine for now on the debouncer.
    }
  };

  // ... (rest of state)
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Robust Synchronization State
  const lastCodeReported = useRef<string>("");
  const compilationFinished = useRef<boolean>(true);
  const [compilationVersion, setCompilationVersion] = useState(0);
  const lastReportedVersion = useRef(0);

  const [reconnectTrigger, setReconnectTrigger] = useState(0);

  // LaTeX Agent WebSocket logic
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
        console.log("Cleaning up WebSocket connection");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen, projectId, reconnectTrigger]);

  const connectToAgent = () => {
    const wsUrl = `ws://localhost:8001/ws/${clientId.current}/${projectId}`;
    console.log("Attempting to connect to LaTeX Agent:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket Connection Opened: LaTeX Agent");
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Message Received:", data);

      switch (data.type) {
        case "CONNECTED":
          setAgentMessage(data.content);
          break;
        case "AGENT_THINKING":
          setAgentStatus("thinking");
          setAgentMessage(data.content);
          break;
        case "CODE_GENERATED":
          console.log(
            `Agent generated code (length: ${data.content?.length || 0}). Content preview:`,
            data.content?.substring(0, 100),
          );
          setAgentStatus("generating");
          lastCodeReported.current = data.content; // Track what the agent sent
          setLatexCode(data.content);
          setCompilationAttempts(data.attempt);
          break;
        case "COMPILATION_COMPLETE":
          setAgentStatus("success");
          setAgentMessage(data.content);
          setCompilationAttempts(data.total_attempts);
          break;
        case "ERROR":
          console.error("Agent reported error:", data.content);
          setAgentStatus("error");
          setAgentMessage(data.content);
          break;
        case "SAVE_STATUS":
          console.log("Save status received:", data.success);
          alert(data.content);
          break;
        default:
          console.log("Unhandled message type:", data.type);
          break;
      }
    };

    ws.onclose = (event) => {
      console.log(
        "WebSocket Connection Closed:",
        event.code,
        event.reason,
        "Clean:",
        event.wasClean,
      );
      setWsConnected(false);
      wsRef.current = null;

      // Auto-reconnect if not a clean close and editor is still open
      if (!event.wasClean) {
        console.log("Attempting auto-reconnect in 3s...");
        setTimeout(() => setReconnectTrigger((prev) => prev + 1), 3000);
      }
    };

    ws.onerror = (error) => {
      console.error(
        "WebSocket Connection Error. This usually means the server at localhost:8001 is not running or unreachable.",
        error,
      );
      setAgentStatus("error");
      setAgentMessage(
        "Connection error. Is the agent server running on port 8001?",
      );
    };

    wsRef.current = ws;
  };

  const sendAgentRequest = () => {
    if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN &&
      agentPrompt.trim()
    ) {
      const payload = {
        type: "USER_MESSAGE",
        content: agentPrompt,
        document_ids:
          selectedDocumentIds.length > 0 ? selectedDocumentIds : undefined,
      };
      wsRef.current.send(JSON.stringify(payload));
      setAgentPrompt("");
      setAgentStatus("thinking");
    } else {
      if (!wsConnected) {
        setReconnectTrigger((prev) => prev + 1);
      }
    }
  };

  const saveToPaperAgent = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "SAVE_TO_PAPER",
          content: latexCode,
        }),
      );
    }
  };

  // Debounced Compilation Error reporting back to agent
  useEffect(() => {
    // Only report if we are actively in an agent flow
    if (agentStatus !== "generating" && agentStatus !== "fixing") return;

    // Only report if a NEW compilation has actually finished
    if (compilationVersion === lastReportedVersion.current) return;

    // Only report if the code matches what we last received (avoid reporting intermediate user edits during agent flow)
    if (
      lastCodeReported.current !== latexCode &&
      lastCodeReported.current !== ""
    ) {
      console.log(
        "Code mismatch, skipping auto-report. Received:",
        lastCodeReported.current?.length,
        "Current:",
        latexCode.length,
      );
      return;
    }

    const timer = setTimeout(() => {
      if (compiledHTML.includes("Compilation Error")) {
        const errorLogs =
          compiledHTML.match(/<pre>(.*?)<\/pre>/s)?.[1] || "Compilation failed";
        console.log("Reporting EXECUTION_ERROR to agent...");
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "EXECUTION_ERROR",
              logs: errorLogs,
            }),
          );
          setAgentStatus("fixing");
          lastReportedVersion.current = compilationVersion;
        }
      } else if (compiledHTML && !compiledHTML.includes("Compilation Error")) {
        console.log(
          "Reporting EXECUTION_SUCCESS to agent version:",
          compilationVersion,
        );
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "EXECUTION_SUCCESS",
            }),
          );
          lastReportedVersion.current = compilationVersion;
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [compiledHTML, compilationVersion, agentStatus, latexCode]);

  // Fetch paper content and documents when editor opens
  useEffect(() => {
    if (isOpen && projectId) {
      fetchPaper();
      fetchPaperBucketDocuments();
    }
  }, [isOpen, projectId]);

  // Fetch paper bucket documents
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

      if (!response.ok) {
        throw new Error("Failed to fetch paper bucket");
      }

      const data = await response.json();
      const paperIds = data.paper_ids || [];

      // Fetch document details
      if (paperIds.length > 0) {
        const docsResponse = await fetch(`${API_URL}/api/documents/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (docsResponse.ok) {
          const allDocs: Document[] = await docsResponse.json();
          const bucketDocs = allDocs.filter((doc) =>
            paperIds.includes(doc.doc_id),
          );
          setAvailableDocuments(bucketDocs);
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
        if (data.content) {
          setLatexCode(data.content);
        }
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

  // Debounced save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectId && latexCode) {
        // Only save if it's not the default template?
        // Or just save. The default template is useful.
        savePaper(latexCode);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [latexCode, projectId]);

  // Load LaTeX.js only once
  useEffect(() => {
    // 🛠️ SHIM: Fix "ReferenceError: require is not defined" in browser/Vite
    if (typeof (window as any).require === "undefined") {
      (window as any).require = (name: string) => {
        console.warn(
          `Latex.js tried to require package "${name}". Returning empty module to avoid crash.`,
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

  // Compile automatically when text changes (live preview)
  useEffect(() => {
    if (isOpen && window.latexjs) {
      const delay = setTimeout(() => compileLatex(), 500);
      return () => clearTimeout(delay);
    }
  }, [latexCode, isOpen]);

  const compileLatex = async () => {
    setIsCompiling(true);
    compilationFinished.current = false;

    // Capture silent console errors from the library
    let capturedSilentErrors = "";
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      capturedSilentErrors += args.join(" ") + "\n";
      originalConsoleError.apply(console, args);
    };

    try {
      if (!window.latexjs) {
        throw new Error("LaTeX.js library not loaded.");
      }

      console.log("Compiling LaTeX code length:", latexCode.length);
      const generator = new window.latexjs.HtmlGenerator({ hyphenate: false });
      window.latexjs.parse(latexCode, { generator });

      // If library logged "error loading package" but didn't throw, we force an error
      if (
        capturedSilentErrors.includes("error loading package") ||
        capturedSilentErrors.includes("ReferenceError")
      ) {
        console.warn("Caught silent compilation error:", capturedSilentErrors);
        throw new Error(capturedSilentErrors);
      }

      const frag = generator.domFragment();
      // headFrag often contains relative links like js/base.js which fail in srcdoc.
      const headFrag = generator.stylesAndScripts();

      // Filter out relative scripts that cause 404s
      const scripts = headFrag.querySelectorAll("script");
      scripts.forEach((s: any) => {
        if (s.src && !s.src.startsWith("http") && !s.src.startsWith("https")) {
          console.log("Removing relative script to avoid 404:", s.src);
          s.remove();
        }
      });

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
      const errorMessage = error.message || String(err);
      const errorHTML = `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8"><style>body{font-family:monospace;padding:20px;background:#fff3cd;color:#856404}pre{white-space:pre-wrap}</style></head>
  <body><h3>Compilation Error</h3><pre>${errorMessage}</pre></body>
</html>`;
      setCompiledHTML(errorHTML);
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
        alert("Please log in first");
        return;
      }

      if (!projectId) {
        alert("No project selected");
        return;
      }

      // ✅ Use the simple GET endpoint - no LaTeX required!
      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/generate-pdf`,
        {
          method: "GET", // Changed from POST to GET
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // No body needed - it reads from database
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`PDF generation failed: ${errorData.error}`);
        console.error("PDF generation error:", errorData);
        return;
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        alert("PDF is empty. Please make sure there is content in the paper.");
        return;
      }

      // Download the PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectTitle || "document"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-col border-l bg-background w-[50%] shrink-0 transition-all duration-300 ease-in-out shadow-xl z-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">LaTeX Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">
            {isSaving ? "Saving..." : "Saved"}
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Close
          </Button>
        </div>
      </div>

      {/* Agent Status Bar */}
      {(agentStatus !== "idle" || wsConnected || !wsConnected) && (
        <div
          className={`px-4 py-1 text-xs border-b flex justify-between items-center ${
            agentStatus === "thinking" || agentStatus === "fixing"
              ? "bg-blue-50 text-blue-700 animate-pulse"
              : agentStatus === "success"
                ? "bg-green-50 text-green-700"
                : agentStatus === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-muted text-muted-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500 animate-pulse"}`}
            ></span>
            <span>
              {agentMessage ||
                (wsConnected
                  ? "Agent Connected"
                  : "Connecting to localhost:8001...")}
            </span>
            {compilationAttempts > 0 && (
              <span>(Attempt {compilationAttempts})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!wsConnected && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px] px-2 bg-background border"
                onClick={() => setReconnectTrigger((p) => p + 1)}
              >
                Retry Connection
              </Button>
            )}
            {agentStatus === "success" && <span className="font-bold">✓</span>}
          </div>
        </div>
      )}

      {/* Tabs and Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-2">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "code" | "preview")}
          className="flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-2 px-2">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="agent" className="gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${wsConnected ? "bg-green-400" : "bg-red-400"}`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${wsConnected ? "bg-green-500" : "bg-red-500"}`}
                  ></span>
                </span>
                LaTeX Agent
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                onClick={compileLatex}
                disabled={isCompiling}
                variant="outline"
                size="sm"
              >
                {isCompiling ? "Compiling..." : "Recompile"}
              </Button>
              {/* <Button onClick={saveToPaperAgent} variant="secondary" size="sm" className="gap-2">
                       Save to Project
                    </Button> */}
              <Button onClick={downloadPDF} size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>

          <div className="flex-1 relative border rounded-md overflow-hidden">
            <TabsContent
              value="code"
              className="h-full mt-0 data-[state=active]:block hidden"
            >
              <div className="absolute inset-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Loading...
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

            <TabsContent
              value="preview"
              className="h-full mt-0 data-[state=active]:block hidden"
            >
              <div className="absolute inset-0 bg-white">
                <iframe
                  ref={iframeRef}
                  srcDoc={compiledHTML}
                  className="w-full h-full border-0"
                  title="LaTeX Preview"
                />
              </div>
            </TabsContent>

            <TabsContent
              value="agent"
              className="h-full mt-0 data-[state=active]:block hidden"
            >
              <div className="flex flex-col h-full bg-muted/30 p-4">
                <div className="flex-1 overflow-auto mb-4 space-y-4">
                  {/* Document Selector */}
                  {availableDocuments.length > 0 && (
                    <div className="bg-background border rounded-lg p-4 shadow-sm overflow-auto">
                      <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Select Documents for Context
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Choose which documents from your paper bucket to include
                        as context for the agent.
                      </p>
                      {isLoadingDocuments ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <ScrollArea className="max-h-[150px]">
                          <div className="space-y-2">
                            {availableDocuments.map((doc) => (
                              <label
                                key={doc.doc_id}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedDocumentIds.includes(
                                    doc.doc_id,
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedDocumentIds([
                                        ...selectedDocumentIds,
                                        doc.doc_id,
                                      ]);
                                    } else {
                                      setSelectedDocumentIds(
                                        selectedDocumentIds.filter(
                                          (id) => id !== doc.doc_id,
                                        ),
                                      );
                                    }
                                  }}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm flex-1 truncate">
                                  {doc.title}
                                </span>
                              </label>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                      {selectedDocumentIds.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {selectedDocumentIds.length} document
                          {selectedDocumentIds.length !== 1 ? "s" : ""} selected
                        </div>
                      )}
                    </div>
                  )}

                  {agentStatus !== "idle" && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        agentStatus === "error"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-primary/10 text-primary border-primary/20"
                      } border`}
                    >
                      <strong>Agent:</strong> {agentMessage}
                      {compilationAttempts > 0 && (
                        <p className="mt-1 text-xs opacity-70 italic">
                          Attempting to compile and fix... (Attempt{" "}
                          {compilationAttempts})
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor="agent-prompt" className="sr-only">
                      Request
                    </Label>
                    <textarea
                      id="agent-prompt"
                      placeholder="e.g., Create a research paper structure with a table of contents and a math section..."
                      className="w-full min-h-[100px] p-3 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      value={agentPrompt}
                      onChange={(e) => setAgentPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (wsConnected && agentPrompt.trim()) {
                            sendAgentRequest();
                          }
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={sendAgentRequest}
                    disabled={
                      !agentPrompt.trim() ||
                      !wsConnected ||
                      agentStatus === "thinking" ||
                      agentStatus === "fixing"
                    }
                    className="h-10"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="history"
              className="h-full mt-0 data-[state=active]:block hidden"
            >
              <div className="flex flex-col h-full bg-muted/30 p-4 overflow-auto">
                <div className="bg-background border rounded-lg p-4 shadow-sm mb-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Version History
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Local history of your changes. Revert to a previous version
                    if needed.
                  </p>
                </div>

                <div className="space-y-3">
                  {history
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <div
                        key={entry.timestamp}
                        className="bg-background border rounded-lg p-3 shadow-sm flex items-center justify-between"
                      >
                        <div className="overflow-hidden mr-4">
                          <div className="text-sm font-medium">
                            {entry.description || "Version"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleTimeString()} -{" "}
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 truncate font-mono bg-muted p-1 rounded">
                            {entry.code.substring(0, 50).replace(/\n/g, " ")}...
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevert(entry)}
                          className="shrink-0"
                        >
                          Revert
                        </Button>
                      </div>
                    ))}
                  {history.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No history yet. Start typing to create versions.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
export default LaTeXEditor;
