"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@repo/ui/badge";

type TagPickerProps = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export function TagPicker({ value, onChange }: TagPickerProps) {
  const [input, setInput] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = input.trim().toLowerCase();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="label text-foreground">Tags</label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2">
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Add tags..." : ""}
          className="min-w-[80px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
