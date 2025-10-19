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

// Sample messages - replace with your actual message data
const API_URL = import.meta.env.VITE_SERVER_API_URL; // Base URL from .env file
const sampleResponse = `Based on the research papers you've uploaded, here are the key findings:

1. **Main Research Gap**: The current literature shows a significant gap in understanding the long-term effects of AI-assisted learning in educational environments. While short-term studies (3-6 months) show positive results, there's limited data on retention and skill development over 12+ months.

2. **Methodological Limitations**: 
   - Small sample sizes (n<100) in 78% of reviewed studies
   - Lack of diverse demographic representation
   - Limited cross-cultural validation

3. **Contradictions Identified**:
   - Study A (2023) reports 45% improvement in learning outcomes
   - Study B (2023) reports only 12% improvement with similar methodologies
   - Possible confounding variables: instructor experience, technology infrastructure

4. **Future Research Directions**:
   - Longitudinal studies spanning multiple academic years
   - Mixed-methods approaches combining quantitative and qualitative data
   - Investigation of individual learning style interactions with AI tools

These insights suggest that while AI-assisted learning shows promise, more rigorous and long-term research is needed to establish best practices and understand the full impact on educational outcomes.`;

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

// ChatPage.tsx
export default function AnalysisPage() {
  const [messages, setMessages] = React.useState<
    { id: number; text: string; isOutgoing: boolean }[]
  >([]);
  const [showAnalysis, setShowAnalysis] = React.useState(true);
  const [analysis, setAnalysis] = React.useState(false);

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

  /* const handleSubmitAnalysis = async (selectedDocuments) => {
    try {
      const token = localStorage.getItem("authToken");

      // Create a new EventSource to stream from backend
      const eventSource = new EventSource(`${API_URL}/api/test`, {
        withCredentials: false,
      });

      setAnalysis(true);
      setShowAnalysis(false);

      // Send selectedDocuments as a POST request (we can’t send body via EventSource directly)
      // So, create a fetch POST first to trigger backend processing
      await fetch(`${API_URL}/api/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedDocuments),
      });

      // Now, listen to SSE messages
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Stream update:", data);

        // Display updates as they arrive
        if (data.phase === "error") {
          addMessage(`❌ Error: ${data.error}`, false);
          eventSource.close();
        } else if (data.status === "start") {
          addMessage(`🟡 ${data.message}`, false);
        } else if (data.status === "done") {
          addMessage(`✅ Phase ${data.phase} done`, false);
        } else if (data.status === "complete") {
          addMessage(`🎉 ${data.message}`, false);
          eventSource.close();
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        addMessage("⚠️ Stream connection lost.", false);
        eventSource.close();
      };
    } catch (error) {
      console.error("Analysis error:", error);
      addMessage("⚠️ Failed to start analysis.", false);
      setAnalysis(false);
    }
  }; */

  const handleSubmitAnalysis = async (selectedDocuments) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${API_URL}/api/nlp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedDocuments),
      });

      if (!response.body) {
        console.error("Streaming not supported");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n\n")
          .filter((line) => line.startsWith("data:"));

        for (const line of lines) {
          const data = JSON.parse(line.replace("data: ", ""));
          console.log("📩", data);

          if (data.status === "start") {
            addMessage(`🟡 ${data.message}`, false);
          } else if (data.status === "running") {
            addMessage(`🔄 ${data.message}`, false);
          } else if (data.status === "done") {
            addMessage(`✅ Phase ${data.phase} done`, false);
          } else if (data.status === "complete") {
            addMessage(`🎉 ${data.message}`, false);
          } else if (data.phase === "error") {
            addMessage(`❌ ${data.error}`, false);
          }
        }
      }
    } catch (err) {
      console.error("Error:", err);
      addMessage("⚠️ Streaming error.", false);
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
          <div className="space-y-2">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
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
