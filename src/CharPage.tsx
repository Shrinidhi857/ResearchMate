import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NavigationMenuDemo from "./Layouts/Navbar";
import { Card } from "./components/ui/card";
import SearchCard from "./Layouts/searchform";
import * as React from "react";
// Sample messages - replace with your actual message data
const messages = [
  {
    id: 1,
    text: "Hey! How are you doing today?",
    isOutgoing: false,
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    text: "I'm doing great! Just working on some React components. How about you?",
    isOutgoing: true,
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    text: "That sounds awesome! I'm learning about chat interfaces myself.",
    isOutgoing: false,
    timestamp: "10:33 AM",
  },
  {
    id: 4,
    text: "Nice! Chat apps are really fun to build. The real-time aspect makes them feel so interactive.",
    isOutgoing: true,
    timestamp: "10:35 AM",
  },
  {
    id: 5,
    text: "Absolutely! The user experience is so important in chat applications.",
    isOutgoing: false,
    timestamp: "10:36 AM",
  },
  {
    id: 6,
    text: "Absolutely! The user experience is so important in chat applications.",
    isOutgoing: false,
    timestamp: "10:36 AM",
  },
  {
    id: 7,
    text: "Absolutely! The user experience is so important in chat applications.",
    isOutgoing: false,
    timestamp: "10:36 AM",
  },
  {
    id: 8,
    text: "Absolutely! The user experience is so important in chat applications.",
    isOutgoing: true,
    timestamp: "10:36 AM",
  },
  {
    id: 9,
    text: "Absolutely! The user experience is so important in chat applications.",
    isOutgoing: true,
    timestamp: "10:36 AM",
  },
  {
    id: 10,
    text: "Absolutely! The user experience is so important in chat applications.",
    isOutgoing: true,
    timestamp: "10:36 AM",
  },
  {
    id: 11,
    text: "Absolutely! The user experience is so important in chat applications.",
    isOutgoing: true,
    timestamp: "10:36 AM",
  },
];

const MessageBubble = ({ message }) => {
  return (
    <div
      className={`flex w-full mb-4 ${
        message.isOutgoing ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          message.isOutgoing
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-muted-foreground rounded-bl-sm"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
      </div>
    </div>
  );
};

export default function ChatPage() {
  // NOTE: I've added a unique key for each message to fix the duplicate key warning.
  const uniqueMessages = messages.map((msg, index) => ({
    ...msg,
    id: index + 1,
  }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* I've added shadow-md and bg-background here */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-10 shadow-md">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <NavigationMenuDemo />
        </header>

        <ScrollArea className="flex-1 p-4 pb-32 ">
          <div className="space-y-2">
            {uniqueMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>
        <div className="absolute bottom-4 left-4 right-4 sticky bottom-0 z-10">
          <SearchCard />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
