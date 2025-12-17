import React, { useState } from "react";
import {
  Home,
  Search,
  FileText,
  Settings,
  User,
  MessageSquare,
  PlusCircle,
  History,
  BookOpen,
  Star,
  HelpCircle,
} from "lucide-react";

// ================= Tooltip Component =================
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap">
          <div className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-md shadow-lg">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

// ================= Sidebar Component =================
const IconSidebar = ({ items, onItemClick }) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm z-40">
      {/* Brand Logo */}
      <div className="mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
          A
        </div>
      </div>

      <div className="w-10 h-px bg-gray-200 mb-4" />

      {/* Main Sidebar Icons */}
      <div className="flex-1 flex flex-col items-center gap-2 w-full px-2">
        {items.map((item, index) => (
          <Tooltip key={index} content={item.label}>
            <button
              onClick={() => onItemClick(item)}
              className="relative w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />

              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-2 w-full px-2 mt-auto">
        <div className="w-10 h-px bg-gray-200 mb-2" />

        <Tooltip content="Settings">
          <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group">
            <Settings className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          </button>
        </Tooltip>

        <Tooltip content="Profile">
          <button className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors group">
            <User className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default function SidebarOnly() {
  const sidebarItems = [
    { icon: PlusCircle, label: "New Chat" },
    { icon: Home, label: "Home" },
    { icon: MessageSquare, label: "Chats", badge: 3 },
    { icon: FileText, label: "Documents" },
    { icon: BookOpen, label: "Projects" },
    { icon: History, label: "History" },
    { icon: Star, label: "Favorites" },
    { icon: Search, label: "Search" },
    { icon: HelpCircle, label: "Help" },
  ];

  return (
    <IconSidebar
      items={sidebarItems}
      onItemClick={(item) => console.log("Clicked:", item.label)}
    />
  );
}
