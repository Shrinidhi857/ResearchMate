import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

interface ConversationItem {
  id: string | number;
  type: "message" | "response";
  content: string;
  timestamp?: string;
}

export const useProjectMessages = (projectId?: string) => {
  const [messages, setMessages] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMessages = async () => {
    if (!projectId) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `${API_URL}/api/projects/${projectId}/conversation`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conversation");
      }

      const conversation: ConversationItem[] = await response.json();
      // Backend returns items in chronological order, no sorting needed
      setMessages(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (content: string, type: "message" | "response") => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${type}-${Date.now()}`,
        type,
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

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

  const saveResponseToDB = async (content: string) => {
    if (!projectId) return;
    try {
      const token = localStorage.getItem("authToken");
      await fetch(`${API_URL}/api/projects/${projectId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ summary: content }),
      });
    } catch (e) {
      console.error("Failed to save response:", e);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMessages();
    }
  }, [projectId]);

  return { messages, isLoading, addMessage, saveMessageToDB, saveResponseToDB };
};
