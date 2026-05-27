import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const API_URL = import.meta.env.VITE_SERVER_API_URL;

interface DocumentSummary {
  doc_id: string;
  title: string;
}

export function DocumentList() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([
    { doc_id: "hello", title: "hello" },
  ]);
  const [selectedDocContent, setSelectedDocContent] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    setDocToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/documents/${docToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to delete document");

      toast.success("Document deleted successfully");
      setDocuments((prev) => prev.filter((doc) => doc.doc_id !== docToDelete));
    } catch {
      toast.error(`Error deleting document`);
    } finally {
      setDeleteConfirmOpen(false);
      setDocToDelete(null);
    }
  };

  const handleView = async (doc: DocumentSummary) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/documents/${doc.doc_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch document content");
      const data = await response.json();
      setSelectedDocContent(data.content || "No content available");
      setIsDialogOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching document content");
    }
  };

  return (
    <>
      <ScrollArea className="h-100 w-full rounded-md border  ">
        <div className="p-4 ">
          {documents.map((doc) => (
            <React.Fragment key={doc.doc_id}>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="text-left w-full text-sm font-medium hover:bg-muted/20 px-2 py-1 rounded">
                    {doc.title}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleView(doc)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(doc.doc_id)}>
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(doc.doc_id)}>
                    Copy
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator className="my-2" />
            </React.Fragment>
          ))}

          {documents.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No documents found
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="w-[90%] max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing document */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl w-[80%] h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Document Content</DialogTitle>
            <DialogDescription>
              Scrollable document view. Content may contain multiple pages.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 whitespace-pre-wrap text-sm">
            {selectedDocContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
