import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AskaiCard() {
  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="text-left pb-4">
        <CardTitle className="text-2xl font-bold">
          Ask AI with RAG Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent className="text-left text-xl text-forground">
        Upload your research papers, and let our RAG-powered AI combine
        retrieval and generation to deliver precise, context-aware answers. It
        searches your uploaded documents in real-time to give fact-grounded,
        citation-backed responses.
      </CardContent>
    </Card>
  );
}
