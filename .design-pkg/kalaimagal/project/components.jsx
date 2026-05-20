// Kalaimagal · கலைமகள் — shared components
// Header, footer, logo, decorative motifs, cover placeholder, gopuram silhouette, peacock feather.

const { useState, useEffect } = React;

// ───── Brand mark ─────
// Stylized seal: lotus circle with Tamil "க" inside, framed by temple kalasham.
function Logo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Kalaimagal">
      {/* outer double ring */}
      <circle cx="32" cy="32" r="29" stroke="#7A1F2B" strokeWidth="1.2"/>
      <circle cx="32" cy="32" r="26" stroke="#B8884A" strokeWidth="0.6"/>
      {/* eight petal points */}
      {[0,45,90,135,180,225,270,315].map(a => (
        <g key={a} transform={`rotate(${a} 32 32)`}>
          <path d="M32 6 L33.6 9 L32 11.5 L30.4 9 Z" fill="#7A1F2B"/>
        </g>
      ))}
      {/* inner roundel */}
      <circle cx="32" cy="32" r="17" fill="#F1E6D2" stroke="#7A1F2B" strokeWidth="0.8"/>
      {/* Tamil "க" glyph */}
      <text x="32" y="40.5" textAnchor="middle"
        fontFamily="Noto Serif Tamil, serif"
        fontSize="22" fontWeight="500" fill="#7A1F2B">க</text>
      {/* kalasham finial on top */}
      <path d="M30 3 Q32 0 34 3 L33 4 L33 6 L31 6 L31 4 Z" fill="#B8884A"/>
    </svg>
  );
}

function Wordmark({ size = "lg", showEn = true, color = "#1B1410" }) {
  const sizes = {
    sm: { ta: 18, en: 9 },
    md: { ta: 22, en: 10 },
    lg: { ta: 30, en: 11 },
    xl: { ta: 44, en: 13 },
  };
  const s = sizes[size];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1, color }}>
      <span className="ta" style={{ fontSize: s.ta, fontWeight: 500, letterSpacing: '0.01em' }}>கலைமகள்</span>
      {showEn && <span style={{
        fontFamily: 'var(--display)',
        fontStyle: 'italic',
        fontSize: s.en,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        opacity: .7,
        marginTop: 1,
      }}>· Kalaimagal ·</span>}
    </div>
  );
}

// ───── Decorative SVGs ─────

// A gopuram silhouette — temple tower with stepped tiers, kalashams on top.
function Gopuram({ width = 520, height = 120, color = "#7A1F2B", opacity = 0.16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 520 120" preserveAspectRatio="xMidYMax meet"
      style={{ display: 'block' }}>
      <g fill={color} opacity={opacity}>
        {/* base */}
        <rect x="60" y="100" width="400" height="20"/>
        {/* tier 1 */}
        <path d="M 80 100 L 100 80 L 420 80 L 440 100 Z"/>
        <rect x="100" y="78" width="320" height="3"/>
        {/* tier 2 */}
        <path d="M 120 78 L 140 60 L 380 60 L 400 78 Z"/>
        <rect x="140" y="58" width="240" height="3"/>
        {/* tier 3 */}
        <path d="M 160 58 L 180 44 L 340 44 L 360 58 Z"/>
        <rect x="180" y="42" width="160" height="3"/>
        {/* tier 4 */}
        <path d="M 200 42 L 220 30 L 300 30 L 320 42 Z"/>
        {/* dome */}
        <path d="M 230 30 Q 230 14 260 14 Q 290 14 290 30 Z"/>
        {/* kalashams */}
        <circle cx="260" cy="8" r="3"/>
        <rect x="259" y="0" width="2" height="8"/>
        <circle cx="100" cy="74" r="2"/>
        <circle cx="420" cy="74" r="2"/>
        <circle cx="140" cy="54" r="2"/>
        <circle cx="380" cy="54" r="2"/>
        <circle cx="180" cy="38" r="2"/>
        <circle cx="340" cy="38" r="2"/>
      </g>
    </svg>
  );
}

// Peacock feather "eye" — used as accent. Drawn as nested ovals.
function PeacockEye({ size = 36, opacity = 1 }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 36 50" style={{ display: 'block' }}>
      <g opacity={opacity}>
        <ellipse cx="18" cy="22" rx="16" ry="22" fill="#1F5559"/>
        <ellipse cx="18" cy="22" rx="12" ry="17" fill="#7A1F2B"/>
        <ellipse cx="18" cy="22" rx="8" ry="12" fill="#D97F2E"/>
        <ellipse cx="18" cy="22" rx="4" ry="7" fill="#1B1410"/>
        <ellipse cx="18" cy="22" rx="2" ry="4" fill="#B8884A"/>
      </g>
    </svg>
  );
}

// A "thoranam" (festoon) — mango leaves across the top of a header.
function Thoranam({ width = 800, height = 28, color = "#7A1F2B" }) {
  const leaves = [];
  const n = 24;
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) * (width / n);
    leaves.push(
      <g key={i} transform={`translate(${x} 14)`}>
        <path d="M 0 -2 Q 4 4 0 14 Q -4 4 0 -2 Z" fill={color} opacity="0.55"/>
        <path d="M 0 0 L 0 12" stroke={color} strokeWidth="0.5" opacity="0.7"/>
      </g>
    );
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <path d={`M 0 4 Q ${width/4} 18 ${width/2} 6 T ${width} 4`} stroke={color} strokeWidth="0.8" fill="none" opacity="0.7"/>
      {leaves}
    </svg>
  );
}

// ───── Decorative trims ─────

function Trim({ variant = "default", color }) {
  if (variant === "thin") return <div className="trim-thin" />;
  return <div className="trim" style={color ? { filter: 'none' } : null} />;
}

function Divider({ label }) {
  return (
    <div className="divider">
      <div className="divider-diamond" />
      {label && <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-2)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>{label}</span>}
      <div className="divider-diamond" />
    </div>
  );
}

// ───── Cover placeholder ─────
function Cover({ title, author, variant = "burgundy", emblem = "க", width, style }) {
  const cls = {
    burgundy: "",
    sand: "cover-sand",
    teal: "cover-teal",
    gold: "cover-gold",
    ink: "cover-ink",
    kumkum: "cover-kumkum",
  }[variant] || "";
  return (
    <div className={`cover ${cls}`} style={{ width, ...(style || {}) }}>
      <div className="cover-emblem">{emblem}</div>
      <div className="cover-title">{title}</div>
      <div className="cover-author">{author}</div>
    </div>
  );
}

// ───── Header & Footer ─────

function PublicHeader({ active = "home", lang = "ta", onLang }) {
  const nav = [
    { id: 'books',    ta: 'புத்தகங்கள்',  en: 'Books' },
    { id: 'articles', ta: 'கட்டுரைகள்',  en: 'Articles' },
    { id: 'authors',  ta: 'ஆசிரியர்கள்', en: 'Authors' },
    { id: 'about',    ta: 'எங்களைப் பற்றி', en: 'About' },
  ];
  return (
    <header style={{
      position: 'relative',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(250,247,242,0.92)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="trim-thin" />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 56px',
        gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo size={42} />
          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: 14, height: 38, display: 'flex', alignItems: 'center' }}>
            <Wordmark size="md" />
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {nav.map(item => (
            <a key={item.id} style={{
              fontFamily: 'var(--tamil)',
              fontSize: 15,
              color: active === item.id ? 'var(--burgundy)' : 'var(--ink-2)',
              textDecoration: 'none',
              position: 'relative',
              paddingBottom: 4,
              borderBottom: active === item.id ? '1px solid var(--burgundy)' : '1px solid transparent',
              cursor: 'pointer',
            }}>{lang === 'ta' ? item.ta : item.en}</a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* search */}
          <button aria-label="Search" style={{ width: 36, height: 36, border: '1px solid var(--border)', borderRadius: 0, display: 'grid', placeItems: 'center', color: 'var(--ink-2)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
          {/* lang toggle */}
          <LangToggle lang={lang} onLang={onLang} />
          {/* auth */}
          <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>
            {lang === 'ta' ? 'உள்நுழை' : 'Sign in'}
          </button>
          <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
            {lang === 'ta' ? 'சந்தா' : 'Subscribe'}
          </button>
        </div>
      </div>
    </header>
  );
}

function LangToggle({ lang = "ta", onLang }) {
  return (
    <div style={{
      display: 'inline-flex',
      border: '1px solid var(--border)',
      background: 'var(--paper)',
      padding: 2,
      position: 'relative',
    }}>
      {['ta','en'].map(l => (
        <button key={l}
          onClick={() => onLang && onLang(l)}
          style={{
            padding: '6px 11px',
            fontSize: 12,
            letterSpacing: '0.1em',
            fontFamily: l === 'ta' ? 'var(--tamil)' : 'var(--display)',
            fontStyle: l === 'en' ? 'italic' : 'normal',
            background: lang === l ? 'var(--burgundy)' : 'transparent',
            color: lang === l ? '#FFE8B8' : 'var(--ink-2)',
            transition: 'all .25s ease',
            minWidth: 32,
          }}>
          {l === 'ta' ? 'த' : 'EN'}
        </button>
      ))}
    </div>
  );
}

function PublicFooter({ lang = "ta" }) {
  return (
    <footer style={{ background: 'var(--ink)', color: '#E8DAC0', marginTop: 0 }}>
      <div style={{ height: 4, background: 'linear-gradient(to right, var(--burgundy), var(--turmeric), var(--gold), var(--burgundy))' }} />
      <div style={{ padding: '48px 56px 28px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <Logo size={40} />
            <Wordmark size="md" color="#F1E6D2" />
          </div>
          <p className="ta" style={{ fontSize: 14, color: '#D9B97C', lineHeight: 1.7, maxWidth: 320, marginBottom: 16 }}>
            தமிழ் இலக்கியத்தின் வாசிப்பு வீடு — செவ்விலக்கியம் முதல் சமகால எழுத்து வரை.
          </p>
          <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: '#B8884A', letterSpacing: '0.04em' }}>
            A reading home for Tamil literature — from the classical to the contemporary.
          </p>
          <p style={{ marginTop: 18, fontSize: 12, color: '#8A7A60', fontFamily: 'var(--mono)' }}>support@kalaimagal.in</p>
        </div>
        {[
          { title: lang==='ta'?'தளம்':'Site',  items: lang==='ta'?['புத்தகங்கள்','கட்டுரைகள்','ஆசிரியர்கள்','சந்தா திட்டம்']:['Books','Articles','Authors','Subscribe'] },
          { title: lang==='ta'?'சட்டம்':'Legal', items: lang==='ta'?['பயன்பாட்டு நிபந்தனைகள்','தனியுரிமை','கொள்கைகள்','தொடர்பு']:['Terms','Privacy','Policies','Contact'] },
          { title: lang==='ta'?'பின்தொடர்':'Follow', items: ['Instagram','X / Twitter','YouTube','RSS'] },
        ].map(col => (
          <div key={col.title}>
            <div className="eyebrow" style={{ color: '#D97F2E', marginBottom: 14 }}>{col.title}</div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {col.items.map(i => (
                <li key={i} style={{ fontFamily: col.title.match(/[a-zA-Z]/)?'var(--display)':'var(--tamil)', fontSize: 13, color: '#D9B97C' }}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(216,184,124,.15)', padding: '18px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#8A7A60', letterSpacing: '0.04em' }}>© 2026 KALAIMAGAL  ·  சர்வ உரிமைகள் பாதுகாக்கப்பட்டவை</span>
        <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, color: '#8A7A60' }}>Made with care in Chennai · சென்னை</span>
      </div>
    </footer>
  );
}

// Make components globally available across babel scripts
Object.assign(window, {
  Logo, Wordmark, Gopuram, PeacockEye, Thoranam,
  Trim, Divider, Cover,
  PublicHeader, PublicFooter, LangToggle,
});
