import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import App from "@/App";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // Client-only mount — the app uses Supabase auth + browser APIs
  // that cannot run during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center kirana-bg">
        <div className="w-8 h-8 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }
  return <App />;
}
