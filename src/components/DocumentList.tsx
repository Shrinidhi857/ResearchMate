import * as React from "react";
import { useEffect, useState } from "react";
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
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to delete document");

      alert("Document deleted successfully");
      setDocuments((prev) => prev.filter((doc) => doc.doc_id !== id));
    } catch {
      alert(`Error deleting document:`);
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
      alert("Error fetching document content");
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
