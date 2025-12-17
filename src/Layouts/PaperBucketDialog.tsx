// src/components/PaperBucketDialog.tsx

import React, { useState } from "react";
import { Plus, X, Search, FileText } from "lucide-react";
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

// --- Mock Data ---
interface Paper {
  id: string;
  title: string;
}

const availablePapers: Paper[] = [
  { id: "1", title: "A Survey on Transformer Models in NLP" },
  { id: "2", title: "Reinforcement Learning for Financial Modeling" },
  { id: "3", title: "The Ethics of Large Language Models: A Review" },
  { id: "4", title: "Clustering Algorithms in High-Dimensional Data" },
  { id: "5", title: "Federated Learning for Privacy-Preserving AI" },
  { id: "6", title: "Causal Inference with Deep Neural Networks" },
  { id: "7", title: "Advancements in Generative Adversarial Networks" },
  { id: "8", title: "Optimizing Database Queries using Machine Learning" },
];
// --- End Mock Data ---

const PaperBucketDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPaperIds, setSelectedPaperIds] = useState<Set<string>>(
    new Set(["1", "4"])
  ); // Initialize with a few selected papers

  const selectedPapers = availablePapers.filter((paper) =>
    selectedPaperIds.has(paper.id)
  );
  const unselectedPapers = availablePapers.filter(
    (paper) => !selectedPaperIds.has(paper.id)
  );

  const handleSelectPaper = (paperId: string) => {
    setSelectedPaperIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(paperId);
      return newSet;
    });
  };

  const handleRemovePaper = (paperId: string) => {
    setSelectedPaperIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(paperId);
      return newSet;
    });
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
          {/* Left Panel: Paper Selection/Search (Dropdownlist functionality) */}
          <div className="w-1/2 flex flex-col border rounded-lg overflow-hidden">
            <h3 className="p-3 text-sm font-medium bg-muted/50 border-b">
              Add Papers to Bucket
            </h3>
            <Command className="flex-1 rounded-none">
              <CommandInput placeholder="Search papers by title..." />
              <CommandList className="flex-1 overflow-auto">
                <CommandEmpty>No papers found.</CommandEmpty>
                <CommandGroup heading="Available Papers">
                  {unselectedPapers.map((paper) => (
                    <CommandItem
                      key={paper.id}
                      onSelect={() => handleSelectPaper(paper.id)}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <span className="truncate">{paper.title}</span>
                      <Plus className="h-4 w-4 text-primary" />
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Papers Already in Bucket (Click to remove)">
                  {selectedPapers.map((paper) => (
                    <CommandItem
                      key={paper.id}
                      onSelect={() => handleRemovePaper(paper.id)}
                      className="flex justify-between items-center cursor-pointer opacity-50"
                    >
                      <span className="truncate">{paper.title}</span>
                      <X className="h-4 w-4 text-destructive" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          {/* Right Panel: Selected Papers List */}
          <div className="w-1/2 flex flex-col border rounded-lg overflow-hidden">
            <h3 className="p-3 text-sm font-medium bg-primary text-primary-foreground border-b flex justify-between items-center">
              Current Paper Bucket
              <Badge
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                {selectedPaperIds.size} papers
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
                      key={paper.id}
                      className="flex items-start justify-between p-3 border rounded-md transition-colors hover:bg-muted/50"
                    >
                      <span className="text-sm font-medium pr-4 line-clamp-2">
                        {paper.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 h-7 w-7 text-destructive hover:text-destructive/80"
                        onClick={() => handleRemovePaper(paper.id)}
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
