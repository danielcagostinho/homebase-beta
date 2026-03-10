"use client";

import { Badge } from "@repo/ui/badge";
import { Spinner } from "@repo/ui/spinner";
import { useHouseholdMembers } from "../api/get-members";
import { MemberAvatar } from "./member-avatar";

export function MemberList() {
  const { data: members, isLoading } = useHouseholdMembers();

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner />
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <p className="body text-muted-foreground">No members found.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/50"
        >
          <MemberAvatar name={member.name} image={member.image} />
          <div className="flex flex-1 flex-col">
            <span className="body font-medium text-foreground">
              {member.name ?? "Unnamed"}
            </span>
            <span className="caption text-muted-foreground">
              {member.email}
            </span>
          </div>
          <Badge variant={member.role === "owner" ? "default" : "secondary"}>
            {member.role === "owner" ? "Owner" : "Member"}
          </Badge>
        </div>
      ))}
    </div>
  );
}
