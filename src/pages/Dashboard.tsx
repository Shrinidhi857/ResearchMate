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

import reportIcon from "../assets/report.png";
import analyseIcon from "../assets/Analyse.png";
import askIcon from "../assets/ask-doubt.png";
import contradictionIcon from "../assets/contradiction.png";
import logo from "@/assets/logo.png";

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
      desc: "Upload as many Papers you want simultaneously and ask any doubt",
    },
    {
      icon: analyseIcon,
      title: "Analyse Research Limitations",
      desc: "Extract limitations to find Research Gaps",
    },
    {
      icon: contradictionIcon,
      title: "Contradiction Analysis",
      desc: "Analyse the Contradiction between the Research",
    },
    {
      icon: reportIcon,
      title: "Theme and Report",
      desc: "Segregate the Research paper into themes, Generate citations and reports",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-border relative z-20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
             <img src={logo} className="w-6 h-6 rounded-2xl" />
              <span className="text-xl font-semibold text-foreground">
                ResearchMate
              </span>
              
            </div>
            <nav className="flex items-center gap-6">
              <Button
                size="sm"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                TRY FOR FREE
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <div className="relative text-center mb-32 py-20">
          {/* Gradient Background Blobs */}
          <div className="absolute inset-0 -top-40 flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Purple blob */}
            <div
              className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
              style={{ left: "20%", top: "10%" }}
            ></div>

            {/* Pink blob */}
            <div
              className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
              style={{ right: "20%", top: "20%" }}
            ></div>

            {/* Blue blob */}
            <div
              className="absolute w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
              style={{ left: "50%", top: "0%", transform: "translateX(-50%)" }}
            ></div>
          </div>
          
          {/* Foreground Content */}
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              Your intelligent companion for research, analysis, and knowledge
              discovery.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Extracted key insights, limitations, and future work
              automatically.
            </p>
          </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <Card
                  key={idx}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <img className="w-15 text-foreground" src={StepIcon} />
                  </div>
                  <CardTitle className="text-base mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {step.desc}
                  </CardDescription>
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
                    This project is in the Prototype stage, some features might
                    not work or work with limited Tokens. Help us test the next
                    generation of research tools. Thank you for checking out🤝
                  </CardDescription>
                </div>

                {/* Centered Call to Action */}
                <div className="text-center">
                  <Button
                    size="lg"
                    className="w-full max-w-xs mx-auto"
                    onClick={() => {
                      window.location.href = "/";
                    }}
                  >
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

      {/* Add animation styles */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ResearchMateDashboard;
