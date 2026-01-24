"use client";

import { useEffect } from "react";

export function MetricTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/metrics", {
      method: "POST",
      body: JSON.stringify({ slug, type: "view" }),
      headers: { "Content-Type": "application/json" },
    }).catch(err => console.error("Error tracking view", err));
  }, [slug]);

  return null;
}

export function DownloadButton({ slug, url }: { slug: string, url: string }) {
  const handleDownload = () => {
    fetch("/api/metrics", {
      method: "POST",
      body: JSON.stringify({ slug, type: "download" }),
      headers: { "Content-Type": "application/json" },
    });
    window.open(url, "_blank");
  };

  return (
    <button 
      onClick={handleDownload}
      className="bg-zinc-900 text-white px-6 py-3 rounded text-sm font-bold hover:bg-zinc-700 transition flex items-center gap-2 shadow-sm"
    >
      <span>⬇ Descargar PDF Original</span>
    </button>
  );
}
