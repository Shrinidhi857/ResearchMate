import React, { useState } from "react";
import { Send, Paperclip, Mic, Square, X } from "lucide-react";

const SearchCard: React.FC = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

  const handleSubmit = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
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

  const handleAttachment = () => {
    const fileName = `document_${Date.now()}.pdf`;
    setAttachedFiles([...attachedFiles, fileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
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
    <div className="w-full max-w-3xl mx-auto p-2">
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm">
        <div className="p-4 space-y-3">
          {/* File Attachments */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm"
                >
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{file}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

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
                onClick={handleAttachment}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <Paperclip className="h-4 w-4" />
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
