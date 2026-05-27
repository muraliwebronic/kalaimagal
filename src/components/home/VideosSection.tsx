import { VideoCard } from "./VideoCard";
import { PeacockEye, Thoranam } from "@/components/brand/Decor";

interface VideoEntry {
  title: string;
  description: string;
  /** Full embed URL — e.g. https://www.youtube.com/embed/Q9F3cgcqvgY */
  url: string;
}

const videos: VideoEntry[] = [
  {
    title:
      "திருநெல்வேலி சிறப்புச் சொற்பொழிவு Part 3 | திருக்குறளுக்கும் திருநெல்வேலிக்கும் உள்ள தொடர்பு",
    description:
      "A special discourse exploring the connection between Thirukkural and Tirunelveli, focusing on the regional vocabulary used by Thiruvalluvar.",
    url: "https://www.youtube.com/embed/Q9F3cgcqvgY",
  },
  {
    title: "காந்தியை பாரதி சந்தித்த வீடு",
    description: "A historical look into the house where Mahatma Gandhi and Subramania Bharati met.",
    url: "https://www.youtube.com/embed/RjqsA-e6nk4",
  },
  {
    title: "அமெரிக்காவில் பட்டமளிப்பு விழா",
    description: "Footage and highlights from a graduation ceremony taking place in the United States.",
    url: "https://www.youtube.com/embed/Gn5IkqUYC5A",
  },
  {
    title:
      "திருநெல்வேலி சிறப்புச் சொற்பொழிவு Part 1 | திருநெல்வேலி அல்வா வந்த கதை",
    description:
      "Part 1 of the special Tirunelveli discourse, detailing the history and origins of the famous Tirunelveli Halwa.",
    url: "https://www.youtube.com/embed/iMRptFclg8c",
  },
  {
    title: "Kulasekara Alwar Temple",
    description: "A visual tour and informational video about the historic Kulasekara Alwar Temple.",
    url: "https://www.youtube.com/embed/oDVJiiAraoE",
  },
];

function extractId(embedUrl: string): string {
  const match = embedUrl.match(/embed\/([\w-]+)/);
  return match?.[1] ?? "";
}

/**
 * Homepage videos band — one featured (2/3 width) + four secondary in a 2×2
 * grid alongside on lg. Stacks on mobile/tablet. Each card lazy-loads only
 * a thumbnail until the user clicks Play.
 */
export function VideosSection() {
  const [featured, ...rest] = videos;
  return (
    <section
      className="relative px-6 md:px-14 py-20 md:py-32 border-y border-border-warm overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
        <Thoranam width={800} height={800} className="w-full h-full object-cover text-paper" />
      </div>
      <div className="absolute right-0 top-0 opacity-[0.04] pointer-events-none translate-x-1/4 -translate-y-1/4">
        <PeacockEye size={600} className="text-paper" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-paper/10 border border-paper/10 text-paper text-[11px] font-bold tracking-wider uppercase mb-6 shadow-sm">
              <span data-bi lang="ta">வீடியோக்கள்</span>
              <span data-bi lang="en">From The Channel</span>
            </div>
            
            <h2
              className="ta-display text-paper"
              style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, lineHeight: 1.15 }}
            >
              <span data-bi lang="ta">காண்க, கேள்க</span>
              <span data-bi lang="en">Watch &amp; listen</span>
            </h2>
            <p
              className="text-paper/70 mt-3"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 16,
              }}
            >
              Talks, walks, and reflections on Tamil literature & heritage.
            </p>
          </div>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            className="ta text-turmeric text-[14px] font-semibold hover:text-white transition-colors pb-1 flex items-center gap-1.5"
            style={{ borderBottom: "1px solid currentColor" }}
          >
            <span data-bi lang="ta">அனைத்து வீடியோக்கள் →</span>
            <span data-bi lang="en">All videos →</span>
          </a>
        </div>

        {/* Featured + 2×2 grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 relative group rounded-[28px] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/10 hover:border-white/20 transition-colors">
            <VideoCard
              featured
              darkTheme
              id={extractId(featured.url)}
              title={featured.title}
              description={featured.description}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            {rest.slice(0, 2).map((v) => (
              <div key={v.url} className="relative group rounded-[20px] overflow-hidden shadow-xl border border-white/5 hover:border-white/15 transition-colors">
                <VideoCard
                  darkTheme
                  id={extractId(v.url)}
                  title={v.title}
                  description={v.description}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Remaining row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-8 lg:mt-10">
          {rest.slice(2).map((v) => (
            <div key={v.url} className="relative group rounded-[20px] overflow-hidden shadow-xl border border-white/5 hover:border-white/15 transition-colors">
              <VideoCard
                darkTheme
                id={extractId(v.url)}
                title={v.title}
                description={v.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
