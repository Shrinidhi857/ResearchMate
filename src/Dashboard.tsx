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
import { Sparkles, Play } from "lucide-react";

import reportIcon from "./assets/report.png";
import analyseIcon from "./assets/Analyse.png";
import askIcon from "./assets/ask-doubt.png";
import contradictionIcon from "./assets/contradiction.png";
import Lot from "./Layouts/test";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Tutorial {
  id: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
}

interface Step {
  icon: string;
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

  const steps: Step[] = [
    {
      icon: askIcon,
      title: "Ask doubts about papers",
      desc: "Upload as many papers as you want and ask any question instantly.",
    },
    {
      icon: analyseIcon,
      title: "Analyse Research Limitations",
      desc: "Extract limitations to identify research gaps effectively.",
    },
    {
      icon: contradictionIcon,
      title: "Contradiction Analysis",
      desc: "Compare multiple papers and detect conflicting findings.",
    },
    {
      icon: reportIcon,
      title: "Theme and Report Generation",
      desc: "Generate thematic summaries, citations, and detailed reports.",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-border relative z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">
              ResearchMate
            </span>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </div>
          <Button size="sm">TRY FOR FREE</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "50vh",
            padding: "100", // full viewport height for nice hero effect
            overflow: "hidden",
          }}
        >
          {/* Lottie background */}
          <DotLottieReact
            src="https://lottie.host/edf6f15e-4a89-40b0-8436-ccc14c2e62ab/i8iafPho2c.lottie"
            loop
            autoplay
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />

          {/* Overlay text */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              ResearchMate analyzed 12 research papers in 3 minutes.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Extracted key insights, limitations, and future work
              automatically.
            </p>
          </div>

          {/* Optional overlay tint for better readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-16">
          {/* Getting Started Section */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Get started in minutes
              </h2>
              <p className="text-lg text-muted-foreground">
                Follow these simple steps to begin your research journey
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <Card
                  key={idx}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <img
                      src={step.icon}
                      alt={step.title}
                      className="w-12 h-12"
                    />
                  </div>
                  <CardTitle className="text-base mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {step.desc}
                  </CardDescription>
                </Card>
              ))}
            </div>
          </section>

          {/* Tutorial Videos */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Tutorial Videos
              </h2>
              <p className="text-lg text-muted-foreground">
                Learn how to make the most of ResearchMate
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

            {/* Pricing / Info Card */}
            <div className="max-w-3xl mx-auto mt-20">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <CardTitle className="text-2xl font-bold mb-2">
                      Explore Prototype Features
                    </CardTitle>
                    <CardDescription className="text-xl">
                      This project is in the Prototype stage — some features
                      might work with limited tokens. Thank you for testing
                      ResearchMate! 🤝
                    </CardDescription>
                  </div>

                  <div className="text-center">
                    <Button size="lg" className="w-full max-w-xs mx-auto">
                      TRY FOR FREE
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                      ResearchMate is a demo app. You can test all features and
                      won't be charged.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* Optional Blob Animations (not used now but kept for later use) */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default ResearchMateDashboard;
