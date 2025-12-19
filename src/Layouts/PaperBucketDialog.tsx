// src/components/PaperBucketDialog.tsx

import React, { useState, useEffect } from "react";
import { Plus, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

// --- Types ---
interface Paper {
  doc_id: string;
  title: string;
}

interface PaperBucketDialogProps {
  projectId?: string;
}

const PaperBucketDialog: React.FC<PaperBucketDialogProps> = ({
  projectId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availablePapers, setAvailablePapers] = useState<Paper[]>([]);
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBucket, setIsLoadingBucket] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available documents and paper bucket when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
      fetchPaperBucket();
    }
  }, [isOpen, projectId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/documents/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data: Paper[] = await response.json();
      setAvailablePapers(data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load papers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaperBucket = async () => {
    const id = projectId || "default-project-id";
    setIsLoadingBucket(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/projects/${id}/paper-bucket`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch paper bucket");
      }

      const data = await response.json();
      setSelectedPaperIds(data.paper_ids || []);
    } catch (err) {
      console.error("Error fetching paper bucket:", err);
      setSelectedPaperIds([]);
    } finally {
      setIsLoadingBucket(false);
    }
  };

  const selectedPapers = availablePapers.filter((paper) =>
    selectedPaperIds.includes(paper.doc_id)
  );
  const unselectedPapers = availablePapers.filter(
    (paper) => !selectedPaperIds.includes(paper.doc_id)
  );

  const handleSelectPaper = async (paperId: string) => {
    const id = projectId || "default-project-id";
    
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/projects/${id}/paper-bucket/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paper_id: paperId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add paper to bucket");
      }

      const data = await response.json();
      setSelectedPaperIds(data.paper_ids || []);
      console.log("Paper added successfully");
    } catch (err) {
      console.error("Error adding paper:", err);
    }
  };

  const handleRemovePaper = async (paperId: string) => {
    const id = projectId || "default-project-id";
    
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/api/projects/${id}/paper-bucket/${paperId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove paper from bucket");
      }

      const data = await response.json();
      setSelectedPaperIds(data.paper_ids || []);
      console.log("Paper removed successfully");
    } catch (err) {
      console.error("Error removing paper:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manage Research Papers
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden gap-4 pt-4">
          {/* Left Panel: Paper Selection/Search */}
          <div className="w-1/2 flex flex-col border rounded-lg overflow-hidden">
            <h3 className="p-3 text-sm font-medium bg-muted/50 border-b">
              Add Papers to Bucket
            </h3>
            
            {isLoading || isLoadingBucket ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <p className="text-sm text-destructive mb-2">{error}</p>
                  <Button size="sm" variant="outline" onClick={fetchDocuments}>
                    Retry
                  </Button>
                </div>
              </div>
            ) : (
              <Command className="flex-1 rounded-none">
                <CommandInput placeholder="Search papers by title..." />
                <CommandList className="flex-1 overflow-auto">
                  <CommandEmpty>No papers found.</CommandEmpty>
                  <CommandGroup heading="Available Papers">
                    {unselectedPapers.map((paper) => (
                      <CommandItem
                        key={paper.doc_id}
                        onSelect={() => handleSelectPaper(paper.doc_id)}
                        className="flex justify-between items-center cursor-pointer"
                      >
                        <span className="truncate">{paper.title}</span>
                        <Plus className="h-4 w-4 text-primary" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {selectedPapers.length > 0 && (
                    <CommandGroup heading="Papers Already in Bucket (Click to remove)">
                      {selectedPapers.map((paper) => (
                        <CommandItem
                          key={paper.doc_id}
                          onSelect={() => handleRemovePaper(paper.doc_id)}
                          className="flex justify-between items-center cursor-pointer opacity-50"
                        >
                          <span className="truncate">{paper.title}</span>
                          <X className="h-4 w-4 text-destructive" />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            )}
          </div>

          {/* Right Panel: Selected Papers List */}
          <div className="w-1/2 flex flex-col border rounded-lg overflow-hidden">
            <h3 className="p-3 text-sm font-medium bg-primary text-primary-foreground border-b flex justify-between items-center">
              Current Paper Bucket
              <Badge
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                {selectedPaperIds.length} papers
              </Badge>
            </h3>
            <ScrollArea className="flex-1 p-3">
              <ul className="space-y-3">
                {selectedPapers.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-2">
                    Your bucket is empty. Use the search panel to add papers.
                  </p>
                ) : (
                  selectedPapers.map((paper) => (
                    <li
                      key={paper.doc_id}
                      className="flex items-start justify-between p-3 border rounded-md transition-colors hover:bg-muted/50"
                    >
                      <span className="text-sm font-medium pr-4 line-clamp-2">
                        {paper.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 h-7 w-7 text-destructive hover:text-destructive/80"
                        onClick={() => handleRemovePaper(paper.doc_id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaperBucketDialog;
