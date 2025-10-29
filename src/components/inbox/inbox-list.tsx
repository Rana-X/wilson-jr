"use client";

import { EmailThread } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InboxItem } from "./inbox-item";

interface InboxListProps {
  emails: EmailThread[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function InboxList({ emails, selectedId, onSelect }: InboxListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header - Simpler */}
      <div className="border-b border-slate-200 px-4 py-3 bg-white">
        <h2 className="font-semibold text-base text-slate-900">Inbox</h2>
      </div>

      {/* Scrollable List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-slate-100">
          {emails.map((email) => (
            <InboxItem
              key={email.id}
              email={email}
              isSelected={selectedId === email.id}
              onClick={() => onSelect(email.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
