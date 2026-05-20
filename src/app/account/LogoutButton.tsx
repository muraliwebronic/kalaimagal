"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton({ all = false }: { all?: boolean }) {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch(all ? "/api/auth/logout-all" : "/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <Button variant="outline" onClick={logout} disabled={pending}>
      {pending
        ? "..."
        : all
          ? "எல்லா சாதனங்களிலிருந்தும் வெளியேறு / Logout everywhere"
          : "வெளியேறு / Logout"}
    </Button>
  );
}
