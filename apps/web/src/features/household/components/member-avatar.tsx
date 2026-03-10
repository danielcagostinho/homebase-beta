"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";

type MemberAvatarProps = {
  name: string | null;
  image: string | null;
  size?: "sm" | "md";
};

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MemberAvatar({ name, image, size = "md" }: MemberAvatarProps) {
  const sizeClasses = size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm";

  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "Member"}
        width={size === "sm" ? 24 : 32}
        height={size === "sm" ? 24 : 32}
        className={cn("rounded-full object-cover", sizeClasses)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        sizeClasses,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
