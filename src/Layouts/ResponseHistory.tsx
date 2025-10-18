import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResponseHistory() {
  const responses = [
    {
      id: 1,
      message:
        "Analyzed paper on deep learning for healthcare — key methods extracted.",
      time: "Oct 18, 2025 • 8:10 PM",
    },
    {
      id: 2,
      message: "Detected limitations in dataset size across multiple studies.",
      time: "Oct 18, 2025 • 7:45 PM",
    },
    {
      id: 3,
      message: "Summarized research on RAG-based literature analysis.",
      time: "Oct 18, 2025 • 6:20 PM",
    },
  ];

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="text-left pb-2">
        <CardTitle className="text-xl text-muted-foreground">
          Response History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {responses.map((res) => (
          <div
            key={res.id}
            className="bg-muted/40 p-3 rounded-2xl border border-muted shadow-sm hover:bg-muted/60 transition"
          >
            <p className="text-sm text-foreground">{res.message}</p>
            <p className="text-xs text-muted-foreground mt-1">{res.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
