"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogOut, ShieldCheck, CreditCard, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: "USER" | "EDITOR" | "ADMIN" | "SUPER_ADMIN";
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [busy, setBusy] = useState(false);
  const isAdmin =
    user.role === "EDITOR" || user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  // First letter of the user's name (fallback to email)
  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2" aria-label="Account menu" />
        }
      >
        <span className="grid place-items-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
          {initial}
        </span>
        <span className="hidden md:inline-block text-sm">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate font-normal">{user.email}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/account" />}>
            <User className="size-4" />
            <span data-bi lang="ta">என் கணக்கு</span>
            <span data-bi lang="en">My Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/account/subscription" />}>
            <CreditCard className="size-4" />
            <span data-bi lang="ta">சந்தா</span>
            <span data-bi lang="en">Subscription</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/account/security" />}>
            <BookMarked className="size-4" />
            <span data-bi lang="ta">பாதுகாப்பு</span>
            <span data-bi lang="en">Security</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/admin" />}>
                <ShieldCheck className="size-4" />
                Admin
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logout} disabled={busy}>
            <LogOut className="size-4" />
            <span data-bi lang="ta">வெளியேறு</span>
            <span data-bi lang="en">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
