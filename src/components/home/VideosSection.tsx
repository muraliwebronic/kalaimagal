import { VideoCard } from "./VideoCard";

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
      className="px-6 md:px-14 py-16 md:py-20 border-t border-border-warm"
      style={{ background: "var(--sandalwood)", backgroundImage: "linear-gradient(180deg, rgba(25,99,145,0.04), transparent 30%)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="eyebrow mb-2">
              <span data-bi lang="ta">வீடியோக்கள் · From The Channel</span>
              <span data-bi lang="en">From The Channel</span>
            </div>
            <h2
              className="ta-display text-burgundy"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              <span data-bi lang="ta">காண்க, கேள்க</span>
              <span data-bi lang="en">Watch &amp; listen</span>
            </h2>
            <p
              className="text-ink-3 mt-1.5"
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
            className="ta text-burgundy text-sm hover:text-peacock hidden sm:inline-block"
            style={{ borderBottom: "1px solid currentColor", paddingBottom: 2 }}
          >
            <span data-bi lang="ta">அனைத்து வீடியோக்கள் →</span>
            <span data-bi lang="en">All videos →</span>
          </a>
        </div>

        {/* Featured + 2×2 grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8">
          <div className="lg:col-span-2">
            <VideoCard
              featured
              id={extractId(featured.url)}
              title={featured.title}
              description={featured.description}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {rest.slice(0, 2).map((v) => (
              <VideoCard
                key={v.url}
                id={extractId(v.url)}
                title={v.title}
                description={v.description}
              />
            ))}
          </div>
        </div>

        {/* Remaining row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 mt-7 lg:mt-8">
          {rest.slice(2).map((v) => (
            <VideoCard
              key={v.url}
              id={extractId(v.url)}
              title={v.title}
              description={v.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
