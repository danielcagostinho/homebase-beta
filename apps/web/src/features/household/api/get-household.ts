import { useQuery } from "@tanstack/react-query";

export type Household = {
  id: string;
  name: string;
  code: string;
  createdBy: string;
  createdAt: string;
  role: "owner" | "member";
};

async function fetchHousehold(): Promise<Household | null> {
  const res = await fetch("/api/households");
  if (!res.ok) throw new Error("Failed to fetch household");
  return res.json();
}

export function useHousehold() {
  return useQuery({
    queryKey: ["household"],
    queryFn: fetchHousehold,
  });
}
