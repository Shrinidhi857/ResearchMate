import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface AIResponseCardProps {
  heading: string;
  description: string;
}

const FormattedMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split("\n");

  const parseInlineBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        if (line.trim() === "") return <div key={idx} className="h-2" />;

        // Handle Headings
        if (line.startsWith("### ")) {
          return (
            <h3 key={idx} className="text-lg font-bold text-primary mt-6 mb-2">
              {parseInlineBold(line.slice(4))}
            </h3>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={idx} className="text-xl font-extrabold text-primary mt-8 mb-3">
              {parseInlineBold(line.slice(3))}
            </h2>
          );
        }

        // Handle Lists
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          return (
            <div key={idx} className="flex gap-2 ml-4 mb-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground leading-relaxed text-sm">
                {parseInlineBold(line.trim().slice(2))}
              </span>
            </div>
          );
        }

        // Default Paragraph
        return (
          <p key={idx} className="text-muted-foreground leading-relaxed text-sm">
            {parseInlineBold(line)}
          </p>
        );
      })}
    </div>
  );
};

export const AIResponseCard: React.FC<AIResponseCardProps> = ({
  heading,
  description,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Card className="w-full max-w-3xl my-6 mx-auto">
      <CardHeader className="relative pb-3 border-b mb-4">
        <div className="pr-12">
          <CardTitle className="text-xl font-bold text-foreground">
            {heading}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8 hover:bg-muted"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <FormattedMarkdown content={description} />
        </div>
      </CardContent>
    </Card>
  );
};
