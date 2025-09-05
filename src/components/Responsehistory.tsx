import * as React from "react";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
const API_URL = import.meta.env.VITE_SERVER_API_URL; // Base URL from .env file

interface DocumentSummary {
  doc_id: string;
  name: string;
}

export function ScrollAreaDemo() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/api/documents/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <ScrollArea className="h-100 w-full rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm leading-none font-medium">Documents</h4>
        {documents.map((doc) => (
          <React.Fragment key={doc.doc_id}>
            <div className="text-sm">{doc.title}</div>
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
  );
}
