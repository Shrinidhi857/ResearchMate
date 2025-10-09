import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  BookOpen,
  Play,
  CheckCircle2,
  Brain,
  Globe,
  Target,
} from "lucide-react";
import logo from "./assets/logo.png";

interface Tutorial {
  id: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
}

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const ResearchMateDashboard: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Getting Started with Research Mate",
      duration: "3:45",
      description:
        "Learn the basics of navigating and using Research Mate's AI-powered features",
      thumbnail: "bg-gradient-to-br from-blue-500 to-purple-600",
    },
    {
      id: 2,
      title: "Advanced Search Techniques",
      duration: "5:20",
      description:
        "Master powerful search operators and filters to find exactly what you need",
      thumbnail: "bg-gradient-to-br from-green-500 to-teal-600",
    },
    {
      id: 3,
      title: "AI-Powered Summarization",
      duration: "4:15",
      description:
        "Discover how to generate insightful summaries from complex research papers",
      thumbnail: "bg-gradient-to-br from-orange-500 to-red-600",
    },
    {
      id: 4,
      title: "Organizing Your Research",
      duration: "6:10",
      description:
        "Best practices for managing citations, notes, and research collections",
      thumbnail: "bg-gradient-to-br from-purple-500 to-pink-600",
    },
  ];

  const proFeatures: string[] = [
    "Unlimited Research Projects",
    "AI-Powered Summaries",
    "Custom Citations",
    "Unlimited Users",
    "Advanced Analytics",
    "Premium Support",
  ];

  const steps: Step[] = [
    {
      icon: Target,
      title: "Ask doubts about of papers",
      desc: "Upload as many Papers you want simultainiously and ask any doubt",
    },
    {
      icon: Globe,
      title: "Analyse Research Limitations",
      desc: "Extract limitations to find Research Gaps",
    },
    {
      icon: Brain,
      title: "Contradiction Analysis",
      desc: "Analyse the Contradition between the Research",
    },
    {
      icon: BookOpen,
      title: "Theme and Report",
      desc: "Segregate the Research paper into themes ,Generate citations and reports",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                className="w-6 text-primary-foreground rounded-2xl"
                src={logo}
                alt="Research Mate"
              />
              <span className="text-xl font-semibold text-foreground">
                ResearchMate
              </span>
              <Badge variant="secondary" className="ml-2">
                Beta
              </Badge>
            </div>
            <nav className="flex items-center gap-6">
              <Button size="sm">TRY FOR FREE</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-70 mt-50">
          <h1 className="text-6xl font-bold text-foreground mb-4">
            ResearchMate analyzed 12 research papers in 3 minutes.{" "}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Extracted key insights, limitations, and future work automatically.
          </p>
        </div>

        {/* Getting Started Section */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Get started in minutes
            </h2>
            <p className="text-lg text-muted-foreground">
              Follow these simple steps to begin your research journey
            </p>
          </div>
          <div className=" my-20 justify-start">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Get started in minutes
              </h2>
              <p className="text-lg text-muted-foreground">
                Follow these simple steps to begin your research journey
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <Card key={idx} className="text-center p-10">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <StepIcon className="w-8 h-8 text-foreground" />
                  </div>
                  <CardTitle className="text-base mb-1">{step.title}</CardTitle>
                  <CardDescription>{step.desc}</CardDescription>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tutorial Videos */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Tutorial Videos
            </h2>
            <p className="text-lg text-muted-foreground">
              Learn how to make the most of Research Mate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => (
              <Card
                key={tutorial.id}
                className="group cursor-pointer overflow-hidden hover:border-primary/50 transition-colors"
                onClick={() => setActiveVideo(tutorial.id)}
              >
                <div
                  className={`${tutorial.thumbnail} aspect-video flex items-center justify-center relative`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="relative w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-foreground ml-1" />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {tutorial.duration}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {tutorial.title}
                  </CardTitle>
                  <CardDescription>{tutorial.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          {/* Pricing Card */}

          <div className="max-w-3xl mx-auto mt-20">
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <CardTitle className="text-2xl font-bold mb-2">
                    Explore Prototype Features
                  </CardTitle>
                  <CardDescription className="text-xl">
                    This is project is in the Prototype stage , some features
                    might not work or works with limited Tokens. Help us test
                    the next generation of research tools. Thank you for
                    checking out🤝
                  </CardDescription>
                </div>

                {/* New Grid Layout for Features */}
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-8"></div>

                {/* Centered Call to Action */}
                <div className="text-center">
                  <Button size="lg" className="w-full max-w-xs mx-auto">
                    TRY FOR FREE
                  </Button>
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Research Mate is a demo app. You can test all features and
                    won't be charged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResearchMateDashboard;
