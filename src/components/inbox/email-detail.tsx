"use client";

import { EmailThread } from "@/lib/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User, Bot, Truck, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailDetailProps {
  selectedEmail: EmailThread | null;
}

export function EmailDetail({ selectedEmail }: EmailDetailProps) {
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
  const getIcon = (type: EmailThread["type"]) => {
    switch (type) {
      case "customer":
        return <User className="h-6 w-6" />;
      case "wilson":
        return <Bot className="h-6 w-6" />;
      case "carrier":
        return <Truck className="h-6 w-6" />;
      case "tracking":
        return <Package className="h-6 w-6" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Content Area - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-6">
          {selectedEmail ? (
            <Card className="shadow-sm border border-slate-200 rounded-lg">
              <CardHeader className="space-y-4 pb-4">
                {/* Sender Info */}
                <div className="flex items-start gap-4">
                  <Avatar
                    className={cn(
                      "h-12 w-12 flex items-center justify-center",
                      avatarClasses[selectedEmail.type]
                    )}
                  >
                    {getIcon(selectedEmail.type)}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-base text-slate-900">
                      {selectedEmail.from}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedEmail.email}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedEmail.timestamp}
                    </p>
                  </div>
                  {selectedEmail.badge && (
                    <Badge className={cn(badgeClasses[selectedEmail.badge])}>
                      {selectedEmail.badge}
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Subject */}
                <h2 className="text-2xl font-semibold text-slate-900">
                  {selectedEmail.subject}
                </h2>
              </CardHeader>

              <CardContent className="prose prose-slate max-w-none">
                {/* Email body content - formatted */}
                <div className="space-y-4 text-slate-700 whitespace-pre-wrap">
                  {selectedEmail.body}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p>Select an email to view</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
