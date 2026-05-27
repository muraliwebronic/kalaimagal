"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface VideoCardProps {
  /** YouTube video id (e.g. "Q9F3cgcqvgY"). */
  id: string;
  /** Tamil title shown beneath the player. */
  title: string;
  /** English caption shown beneath the title in italic display face. */
  description: string;
  /** When true, renders a tall featured layout (16:9 + larger title). */
  featured?: boolean;
  /** When true, applies a dark theme to text for cinematic sections. */
  darkTheme?: boolean;
}

/**
 * Thumbnail-first YouTube embed. Renders the static `hqdefault.jpg` from
 * i.ytimg.com so the page only loads one network request per video until
 * the user clicks Play; clicking swaps in the iframe with autoplay=1. This
 * keeps the homepage's video grid feather-light vs. five live iframes.
 */
export function VideoCard({ id, title, description, featured, darkTheme = false }: VideoCardProps) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/${featured ? "maxresdefault" : "hqdefault"}.jpg`;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-video overflow-hidden border border-border-warm bg-ink shadow-[0_12px_22px_-10px_rgba(20,17,12,0.35)]">
        {active ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play: ${title}`}
            className="block h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <span className="absolute inset-0 grid place-items-center">
              <span
                className="grid place-items-center rounded-full transition-transform duration-200 group-hover:scale-110"
                style={{
                  width: featured ? 76 : 56,
                  height: featured ? 76 : 56,
                  background: "var(--burgundy)",
                  color: "var(--logo-yellow)",
                  boxShadow: "0 6px 20px -6px rgba(0,0,0,0.55), inset 0 0 0 2px var(--logo-yellow)",
                }}
              >
                <Play className={featured ? "size-8" : "size-6"} fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      <h3
        lang="ta"
        className={`ta-display mt-4 transition-colors px-2 line-clamp-2 ${darkTheme ? "text-paper group-hover:text-turmeric" : "text-ink group-hover:text-burgundy"}`}
        style={{ fontSize: featured ? 22 : 16, lineHeight: 1.32 }}
      >
        {title}
      </h3>
      <p
        lang="en"
        className={`mt-1.5 px-2 ${darkTheme ? "text-paper/70" : "text-ink-2"}`}
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: featured ? 15 : 13,
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>
    </article>
  );
}
