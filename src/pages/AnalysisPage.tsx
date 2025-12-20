import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NavigationMenuDemo from "../Layouts/Navbar";
//import { Card } from "../components/ui/card";
import SearchCard from "../Layouts/searchform";
import * as React from "react";
import AnalyseAnimation from "../animation/Analyse";
import DocumentAnalysisCard from "../Layouts/DocumentSelectCard";
//import { AIResponseCard } from "../Layouts/Highlightsheet";
import AnimatedGradientProgressBar from "../Layouts/Progressbar";
import { useState } from "react";
import { AIResponseCard } from "@/Layouts/Highlightsheet";

// Sample messages - replace with your actual message data
const API_URL = import.meta.env.VITE_SERVER_API_URL; // Base URL from .env file



const MessageBubble = ({ message }:any) => {
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

// ChatPage.tsx
export default function AnalysisPage() {
  const [messages, setMessages] = React.useState<
    { id: number; text: string; isOutgoing: boolean }[]
  >([]);


  const [showAnalysis, setShowAnalysis] = React.useState(true);
  const [analysis, setAnalysis] = React.useState(false);
  const [docProgress, setDocProgress] = useState<Record<string, { title: string, progress: number }>>({});
  const [results, setResults] = useState<{ doc_id: string; title: string; highlight: string; confidence: number }[]>([]);

  // helper: add new message
  const addMessage = (text: string, isOutgoing: boolean) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, text, isOutgoing }]);
  };

  // handle user prompt + fetch
  const handleUserPrompt = async (question: string) => {
    // Add user prompt bubble
    addMessage(question, true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");
      const data = await response.json();

      // Add bot response bubble
      addMessage(data.answer || "⚠️ No response found", false);
    } catch (error) {
      console.error("Error fetching answer:", error);
      addMessage("⚠️ Error fetching response", false);
    }
  };



  const handleSubmitAnalysis = async (selectedDocuments: any[]) => {
    try {
      const token = localStorage.getItem("authToken");

      // Initialize progress for selected documents
      const initialProgress: Record<string, { title: string, progress: number }> = {};
      selectedDocuments.forEach(doc => {
        initialProgress[doc.doc_id] = { title: doc.title || `Doc ${doc.doc_id}`, progress: 0 };
      });
      setDocProgress(initialProgress);
      setResults([]);

      // Step 1: Start analysis and get session ID
      const response = await fetch(`${API_URL}/api/nlp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedDocuments.map(d => d.doc_id)), // Server expects list of IDs
      });

      if (!response.ok) throw new Error("Failed to start analysis");

      const { session_id } = await response.json();

      setAnalysis(true);
      setShowAnalysis(false);

      // Step 2: Connect to SSE stream with session ID
      const eventSource = new EventSource(
        `${API_URL}/api/nlp/stream/${session_id}?token=${token}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Received:", data);

        if (data.phase === "error") {
          addMessage(`❌ Error: ${data.error}`, false);
          eventSource.close();
          setAnalysis(false);
        } else if (data.status === "start") {
          console.log(`🟡 ${data.message}`);
        } else if (data.status === "processing") {
          console.log(`🔄 ${data.message}`);
        } else if (data.status === "done") {
          console.log(`✅ ${data.message}`);
          eventSource.close();
          setAnalysis(false);
        } else if (data.sentence) {
          // Update individual document progress
          setDocProgress(prev => ({
            ...prev,
            [data.doc_id]: { ...prev[data.doc_id], progress: 100 }
          }));

          // Add highlight result
          setResults(prev => [
            ...prev,
            {
              doc_id: data.doc_id,
              title: initialProgress[data.doc_id]?.title || "Research Document",
              highlight: data.sentence,
              confidence: data.confidence
            }
          ]);

          console.log(`📝 Highlight received for ${data.doc_id}`);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        addMessage("⚠️ Stream connection lost", false);
        eventSource.close();
        setAnalysis(false);
      };
    } catch (error) {
      console.error("Analysis error:", error);
      addMessage("⚠️ Failed to start analysis", false);
      setAnalysis(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-10 shadow-md">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <NavigationMenuDemo />
        </header>

        {/* Messages */}
        {analysis && <AnalyseAnimation />}

        <ScrollArea className="flex-1 p-4 pb-32">
          <div className="max-w-4xl mx-auto w-full space-y-6 flex flex-col items-center">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            <div className="flex flex-col items-center gap-4 w-full px-4">
              {Object.entries(docProgress).map(([id, info]) => (
                <AnimatedGradientProgressBar
                  key={id} 
                  title={info.title} 
                  progress={info.progress} 
                />
              ))}
              {results.map((result, idx) => (
                <AIResponseCard 
                  key={idx} 
                  heading={`Highlight: ${result.title}`} 
                  description={result.highlight} 
                />
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Input + Analysis */}
        <div className="absolute   left-4 right-4 sticky bottom-10 z-10">
          {showAnalysis && (
            <div className="flex justify-center ">
              <DocumentAnalysisCard
                showAnalysis={showAnalysis}
                setShowAnalysis={setShowAnalysis}
                analysis={analysis}
                setAnalysis={setAnalysis}
                handleSubmit={handleSubmitAnalysis}
              />
            </div>
          )}
          {/*         {<AnimatedGradientProgressBar progress={progress1} height={10} />}
           */}
          <SearchCard
            showAnalysis={showAnalysis}
            setShowAnalysis={setShowAnalysis}
            analysis={analysis}
            setAnalysis={setAnalysis}
            onPrompt={handleUserPrompt} // ✅ pass callback
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
