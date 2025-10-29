"use client";

import { useState } from "react";
import { mockEmails } from "@/lib/mock-data";
import { InboxList } from "./inbox-list";
import { EmailDetail } from "./email-detail";
import { FloatingAISearch } from "./floating-ai-search";

export function InboxLayout() {
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(1);

  const selectedEmail =
    mockEmails.find((email) => email.id === selectedEmailId) || null;

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header - Clean and minimal */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Wilson Jr 🏐</h1>
        <span className="text-sm text-slate-500">Shipment #CART-2025-00123</span>
      </header>

      {/* Main Content - 2 columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Inbox List */}
        <div className="w-[35%] border-r border-slate-200 bg-white">
          <InboxList
            emails={mockEmails}
            selectedId={selectedEmailId}
            onSelect={setSelectedEmailId}
          />
        </div>

        {/* Right: Email Detail */}
        <div className="flex-1 bg-white">
          <EmailDetail selectedEmail={selectedEmail} />
        </div>
      </div>

      {/* Floating AI Search - Hovers over everything */}
      <FloatingAISearch />
    </div>
  );
}
