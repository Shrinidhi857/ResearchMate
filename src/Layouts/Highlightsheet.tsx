import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface AIResponseCardProps {
  heading: string;
  description: string;
}

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
    <Card className="w-full max-w-3xl m-10">
      <CardHeader className="relative pb-3">
        <div className="pr-12">
          <CardTitle className="text-xl font-semibold mb-2">
            {heading}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-8 w-8"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-forground leading-relaxed whitespace-pre-wrap text-sm">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
