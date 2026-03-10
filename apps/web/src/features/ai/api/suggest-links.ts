import { useMutation } from "@tanstack/react-query";

export type SuggestedLink = {
  url: string;
  label: string;
};

async function suggestLinks(input: {
  title: string;
  category: string;
}): Promise<SuggestedLink[]> {
  const res = await fetch("/api/ai/suggest-links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to suggest links");
  }
  const data = await res.json();
  return data.links;
}

export function useSuggestLinks() {
  return useMutation({
    mutationFn: suggestLinks,
  });
}
