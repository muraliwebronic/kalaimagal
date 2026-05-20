"use client";

import { useState } from "react";

export function LogoutButton({ all = false }: { all?: boolean }) {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch(all ? "/api/auth/logout-all" : "/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="btn btn-ghost"
      style={{ padding: "10px 22px", fontSize: 13 }}
    >
      {pending ? (
        "..."
      ) : all ? (
        <>
          <span data-bi lang="ta">எல்லா சாதனங்களிலிருந்தும் வெளியேறு</span>
          <span data-bi lang="en">Sign out everywhere</span>
        </>
      ) : (
        <>
          <span data-bi lang="ta">வெளியேறு</span>
          <span data-bi lang="en">Sign out</span>
        </>
      )}
    </button>
  );
}
