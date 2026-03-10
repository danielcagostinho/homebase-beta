"use client";

import { useState } from "react";
import { ExternalLink, Sparkles, Loader2, Plus, X } from "lucide-react";
import { Button } from "@repo/ui/button";
import { useSuggestLinks, type SuggestedLink } from "../api/suggest-links";
import { cn } from "@/utils/cn";

type LinkSuggestionsProps = {
  title: string;
  category: string;
  onAddLink: (url: string) => void;
};

export function LinkSuggestions({
  title,
  category,
  onAddLink,
}: LinkSuggestionsProps) {
  const suggestLinks = useSuggestLinks();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState<Set<string>>(new Set());

  function handleSuggest() {
    suggestLinks.mutate({ title, category });
    setDismissed(new Set());
    setAdded(new Set());
  }

  function handleAdd(link: SuggestedLink) {
    onAddLink(link.url);
    setAdded((prev) => new Set(prev).add(link.url));
  }

  function handleDismiss(url: string) {
    setDismissed((prev) => new Set(prev).add(url));
  }

  const visibleLinks =
    suggestLinks.data?.filter(
      (l) => !dismissed.has(l.url),
    ) ?? [];

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSuggest}
        disabled={suggestLinks.isPending}
        className="gap-1.5 self-start"
      >
        {suggestLinks.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        {suggestLinks.isPending ? "Finding links..." : "Suggest links"}
      </Button>

      {visibleLinks.length > 0 && (
        <div className="flex flex-col gap-2">
          {visibleLinks.map((link) => (
            <div
              key={link.url}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border p-3",
                "animate-in fade-in slide-in-from-top-1 duration-150",
                added.has(link.url) && "border-primary/30 bg-primary/5",
              )}
            >
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="body-sm font-medium text-foreground truncate">
                  {link.label}
                </p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="caption text-primary hover:underline truncate"
                >
                  {link.url}
                </a>
              </div>
              <div className="flex shrink-0 gap-1">
                {added.has(link.url) ? (
                  <span className="caption text-primary">Added</span>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAdd(link)}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDismiss(link.url)}
                  className="h-7 w-7 p-0 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestLinks.isError && (
        <p className="caption text-destructive">
          Failed to fetch link suggestions. Please try again.
        </p>
      )}

      {suggestLinks.isSuccess && visibleLinks.length === 0 && (
        <p className="caption text-muted-foreground">
          No link suggestions available for this task.
        </p>
      )}
    </div>
  );
}
