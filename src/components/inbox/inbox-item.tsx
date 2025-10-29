"use client";

import { EmailThread } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, Bot, Truck, Package } from "lucide-react";

interface InboxItemProps {
  email: EmailThread;
  isSelected: boolean;
  onClick: () => void;
}

export function InboxItem({ email, isSelected, onClick }: InboxItemProps) {
  // Avatar colors - simplified to blue only
  const avatarClasses = {
    customer: "bg-blue-100 text-blue-600",
    wilson: "bg-blue-100 text-blue-600",
    carrier: "bg-blue-100 text-blue-600",
    tracking: "bg-blue-100 text-blue-600",
  };

  // Badge variants - simplified to blue only
  const badgeClasses = {
    NEW: "bg-blue-500 text-white",
    QUOTE: "bg-blue-500 text-white",
    RECOMMEND: "bg-blue-500 text-white",
    BOOKED: "bg-blue-500 text-white",
    URGENT: "bg-blue-500 text-white",
  };

  // Icon by type
  const getIcon = () => {
    switch (email.type) {
      case "customer":
        return <User className="h-5 w-5" />;
      case "wilson":
        return <Bot className="h-5 w-5" />;
      case "carrier":
        return <Truck className="h-5 w-5" />;
      case "tracking":
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div
      className={cn(
        "px-4 py-3 cursor-pointer transition-all duration-150 min-h-[88px]",
        "hover:bg-slate-50",
        isSelected ? "bg-blue-50 border-l-4 border-blue-500" : "bg-white"
      )}
      onClick={onClick}
    >
      {/* Row 1: Avatar + From + Time */}
      <div className="flex items-start gap-3">
        <Avatar className={cn("h-10 w-10 flex-shrink-0 flex items-center justify-center", avatarClasses[email.type])}>
          {getIcon()}
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* From + Time on same line */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium text-sm text-slate-900 truncate">
              {email.from}
            </span>
            <span className="text-xs text-slate-500 flex-shrink-0">
              {email.timestamp}
            </span>
          </div>

          {/* Row 2: Subject + Badge */}
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-slate-700 truncate flex-1">
              {email.subject}
            </p>
            {email.badge && (
              <Badge className={cn("text-xs flex-shrink-0", badgeClasses[email.badge])}>
                {email.badge}
              </Badge>
            )}
          </div>

          {/* Row 3: Preview */}
          <p className="text-sm text-slate-500 line-clamp-1">
            {email.preview}
          </p>
        </div>
      </div>
    </div>
  );
}
