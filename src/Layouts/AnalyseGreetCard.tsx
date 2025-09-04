import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyseCard() {
  return (
    <Card className="w-full h-full overflow-hidden">
      <CardHeader className="text-left pb-4">
        <CardTitle className="text-2xl font-bold">
          Ask ai based on Document
        </CardTitle>
      </CardHeader>

      <CardContent className="text-left text-xl text-muted-foreground">
        Upload your research papers and get instant answers to your questions.
        Gain deeper insights with AI-driven analysis tailored to your work.
      </CardContent>
    </Card>
  );
}
