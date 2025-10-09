import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyseCard() {
  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="text-left pb-4">
        <CardTitle className="text-2xl font-bold">
          Analyse and Compare Research Papers Simultaneously
        </CardTitle>
      </CardHeader>
      <CardContent className="text-left text-xl text-muted-foreground space-y-3">
        <p>
          Upload multiple research papers at once and get an in-depth analysis
          of their methodologies, findings, and overall impact.
        </p>
        <p>
          Automatically detect <strong>limitations</strong>, highlight
          <strong> contradictions</strong> across similar topics, and uncover
          <strong> research gaps</strong> that can guide your next
          investigation.
        </p>
        <p>
          Our system intelligently identifies overlapping ideas, missing
          references, and conflicting conclusions to help you understand the
          broader research landscape.
        </p>
        <p>
          Discover potential <strong>future research directions</strong> and
          generate innovative ideas based on the extracted insights.
        </p>
        <p>
          Save valuable time by letting AI read, summarize, and compare your
          papers — so you can focus on what really matters: <em>innovation</em>.
        </p>
      </CardContent>
    </Card>
  );
}
