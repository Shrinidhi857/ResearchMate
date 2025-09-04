import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import researchImg from "@/assets/Dark-image.png";

export default function WelcomeCard() {
  return (
    <Card className="w-full h-full p-3">
      <CardHeader className="text-left pb-4">
        <CardTitle className="text-2xl font-bold ">
          What’s New in Mind Researcher?
        </CardTitle>
      </CardHeader>
      <img
        src={researchImg}
        alt="Research illustration"
        className="w-full h-35 rounded-lg object-cover"
      />

      <CardContent className="text-left text-xl text-muted-foreground">
        Upload your research papers and get instant answers to your questions.
        Gain deeper insights with AI-driven analysis tailored to your work.
      </CardContent>
      <Button>Explore</Button>
    </Card>
  );
}
