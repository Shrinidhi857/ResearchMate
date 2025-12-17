import React, { useState } from "react";
import { Send, Paperclip, Mic, Square } from "lucide-react";
import checked from "@/assets/checked.png";
const API_URL = import.meta.env.VITE_SERVER_API_URL; // Base URL from .env file

// ✅ Accept showAnalysis + setShowAnalysis as props
interface SearchCardProps {
  showAnalysis: boolean;
  setShowAnalysis: React.Dispatch<React.SetStateAction<boolean>>;
  analysis: boolean;
  setAnalysis: React.Dispatch<React.SetStateAction<boolean>>;
  onPrompt: (question: string) => void; // ✅ new
}

const SearchCard: React.FC<SearchCardProps> = ({
  showAnalysis,
  setShowAnalysis,
  analysis,
  /*   setAnalysis,
   */ onPrompt,
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const handleSubmit = () => {
    if (message.trim()) {
      onPrompt(message.trim()); // ✅ send prompt up
      setMessage("");
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    setMessage(textarea.value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-2 z-100">
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm">
        <div className="p-4 space-y-3">
          {/* Input Container */}
          <div className="relative">
            <textarea
              value={message}
              onChange={adjustTextareaHeight}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isRecording}
              className="w-full min-h-[52px] max-h-[150px] px-4 py-3 pr-20 text-base bg-muted border-0 rounded-lg resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-colors"
              rows={1}
            />

            {/* Action Buttons */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {analysis ? (
                  <img
                    src={checked}
                    alt="checked"
                    className="h-5 w-5 rounded-2xl"
                  />
                ) : (
                  <Paperclip className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={toggleRecording}
                className={`p-2 rounded-md transition-colors ${
                  isRecording
                    ? "text-destructive hover:bg-destructive/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={handleSubmit}
                disabled={!message.trim() || isRecording}
                className={`p-2 rounded-md transition-colors ${
                  message.trim() && !isRecording
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              Recording audio... Click stop when finished
            </div>
          )}

          {/* Keyboard Shortcut Hint */}
          <div className="text-xs text-muted-foreground">
            Press ⌘ + Enter to send
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
