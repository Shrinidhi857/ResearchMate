"use client"; // Required for components with state and event handlers

import * as React from "react";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

interface DocumentSummary {
  doc_id: string;
  title: string;
}

export interface DocCardProps {
  showAnalysis: boolean;
  setShowAnalysis: React.Dispatch<React.SetStateAction<boolean>>;
  analysis: boolean;
  setAnalysis: React.Dispatch<React.SetStateAction<boolean>>;
}

const DocumentAnalysisCard: React.FC<DocCardProps> = ({
  showAnalysis,
  setShowAnalysis,
  analysis,
  setAnalysis,
}) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentSummary[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/api/documents/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, []);

  const handleAddDocument = () => {
    const documentToAdd = documents.find(
      (doc) => doc.title.toLowerCase() === selectedValue.toLowerCase()
    );
    if (
      documentToAdd &&
      !selectedDocuments.some((doc) => doc.doc_id === documentToAdd.doc_id)
    ) {
      setSelectedDocuments((prev) => [...prev, documentToAdd]);
    }
    setSelectedValue("");
  };

  const handleRemoveDocument = (idToRemove: string) => {
    setSelectedDocuments((currentDocs) =>
      currentDocs.filter((doc) => doc.doc_id !== idToRemove)
    );
  };

  const availableDocuments = documents.filter(
    (doc) =>
      !selectedDocuments.some(
        (selectedDoc) => selectedDoc.doc_id === doc.doc_id
      )
  );

  const handleSubmitAnalysis = async () => {
    if (selectedDocuments.length > 0) {
      setIsAnalyzing(true); // start loading
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(`${API_URL}/api/analyse`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedDocuments),
        });

        if (response.ok) {
          setAnalysis(true);
          setShowAnalysis(false);
        } else {
          const errorData = await response.json().catch(() => null);
          alert(`Failed to Analyse: ${errorData?.message || "Unknown error"}`);
          setAnalysis(false);
        }
      } catch (error) {
        console.error("Analysis error:", error);
        setAnalysis(false);
      } finally {
        setIsAnalyzing(false); // stop loading
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl py-2">
      <CardHeader>
        <CardTitle>Document Analysis</CardTitle>
        <CardDescription>
          Add or remove documents from the list to be included in the analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Section for adding new documents and analysis button */}
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full max-w-[250px] justify-between"
              >
                {selectedValue ? selectedValue : "Select a document..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search document..." />
                <CommandList>
                  <CommandEmpty>No document found.</CommandEmpty>
                  <CommandGroup>
                    {availableDocuments.map((doc) => (
                      <CommandItem
                        key={doc.doc_id}
                        value={doc.title}
                        onSelect={(currentValue) => {
                          setSelectedValue(
                            currentValue === selectedValue ? "" : currentValue
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValue === doc.title
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {doc.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button onClick={handleAddDocument} disabled={!selectedValue}>
            Add
          </Button>
          <Button
            disabled={selectedDocuments.length === 0 || isAnalyzing}
            className="ml-auto flex items-center justify-center gap-2"
            onClick={handleSubmitAnalysis}
          >
            {isAnalyzing && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            Analyze ({selectedDocuments.length})
          </Button>
        </div>

        <Separator />

        {/* Section for displaying selected documents */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Selected Documents:
          </h4>
          {selectedDocuments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedDocuments.map((doc) => (
                <Badge
                  key={doc.doc_id}
                  variant="secondary"
                  className="relative flex items-center pr-7 py-1.5 text-sm font-normal"
                >
                  <span>{doc.title}</span>
                  <button
                    onClick={() => handleRemoveDocument(doc.doc_id)}
                    className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    aria-label={`Remove ${doc.title}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No documents selected.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentAnalysisCard;
