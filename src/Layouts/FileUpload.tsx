import React, { useState } from "react";
import { Upload, X, FileText, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { renderAsync } from "docx-preview";
import * as pdfjsLib from "pdfjs-dist";

// Tell pdfjs where to find its worker
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const API_URL = import.meta.env.VITE_SERVER_API_URL; // Base URL from .env file

interface DocumentData {
  file: File;
  name: string;
}

interface DocumentUploadProps {
  onSave?: (data: DocumentData) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onSave,
  acceptedTypes = ".pdf,.doc,.docx,.txt",
  maxSizeMB = 10,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelection = (file: File) => {
    setError("");

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setSelectedFile(file);

    // Auto-populate document name with filename (without extension)
    if (!documentName) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setDocumentName(nameWithoutExt);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setDocumentName("");
    setError("");
  };

  const handleSave = async () => {
    if (!selectedFile || !documentName.trim()) {
      setError("Please select a file and provide a document name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      // Extract text from file before sending
      const extractedText = await extractTextFromFile(selectedFile);

      const response = await fetch(`${API_URL}/api/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: documentName.trim(),
          content: extractedText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save document");
      }

      toast.success(`Document "${documentName}" uploaded successfully`);
      setSelectedFile(null);
      setDocumentName("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save document");
    } finally {
      setIsLoading(false);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "txt") {
      return await file.text();
    }

    if (extension === "pdf") {
      const pdfjsLib = await import("pdfjs-dist");
      const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ") + "\n";
      }
      return text;
    }

    // For DOC/DOCX you can use "mammoth"
    if (extension === "docx") {
      const buffer = await file.arrayBuffer();
      const textContainer = document.createElement("div");
      await renderAsync(buffer, textContainer);

      return textContainer.innerText; // plain text
    }

    return "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isFormValid = selectedFile && documentName.trim().length > 0;

  return (
    <Card className="w-full  ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">
              Drop your document here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported: PDF, DOC, DOCX, TXT • Max {maxSizeMB}MB
            </p>

            <input
              id="file-input"
              type="file"
              accept={acceptedTypes}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Document Name Input */}
        <div className="space-y-2">
          <Label htmlFor="document-name">Document Name</Label>
          <Input
            id="document-name"
            type="text"
            placeholder="Enter document name..."
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!isFormValid || isLoading}
          className="w-full"
          size="lg"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Document"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
