// Kalaimagal — Screen: Homepage (/)
// Editorial: gopuram hero + featured books grid + recent articles + subscribe.

function HomeScreen({ lang = 'ta', setLang }) {
  const featuredBooks = [
    { ta: 'பொன்னியின் செல்வன்', en: 'Ponniyin Selvan',  author: 'கல்கி கிருஷ்ணமூர்த்தி',  variant: 'burgundy' },
    { ta: 'சிலப்பதிகாரம்',       en: 'Silappathikaram',  author: 'இளங்கோ அடிகள்',         variant: 'sand', emblem: 'ஸி' },
    { ta: 'திருக்குறள்',          en: 'Thirukkural',      author: 'திருவள்ளுவர்',            variant: 'teal', emblem: 'வ' },
    { ta: 'மோகமுள்',              en: 'Mogamul',          author: 'தி. ஜானகிராமன்',          variant: 'gold', emblem: 'ம' },
  ];
  const recentArticles = [
    { ta: 'சங்க இலக்கியத்தின் இசை',      en: 'The Music of Sangam Literature',  read: '8 நிமிடம் வாசிப்பு', date: 'ஏப்ரல் 12, 2026', cat: 'இலக்கியம்' },
    { ta: 'பாரதியின் மறக்கப்பட்ட கவிதை', en: 'A Forgotten Bharati Poem',         read: '6 நிமிடம் வாசிப்பு', date: 'ஏப்ரல் 9, 2026',  cat: 'கவிதை' },
    { ta: 'புதுமைப்பித்தனுக்கு பிறகு',   en: 'After Pudhumaipithan',             read: '12 நிமிடம் வாசிப்பு', date: 'ஏப்ரல் 4, 2026', cat: 'விமர்சனம்' },
  ];

  return (
    <div className="km paper-warm" style={{ width: 1280 }}>
      <PublicHeader active="home" lang={lang} onLang={setLang} />

      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 56px 60px', textAlign: 'center', overflow: 'hidden' }}>
        {/* gopuram silhouette behind */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <Gopuram width={900} height={200} />
        </div>

        <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto' }}>
          {/* Thoranam */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, opacity: 0.85 }}>
            <Thoranam width={520} height={26} />
          </div>

          <div className="eyebrow" style={{ marginBottom: 18 }}>
            ★ &nbsp; செவ்விலக்கியம் · சமகாலம் · கட்டுரைகள் &nbsp; ★
          </div>

          <h1 className="ta-display" style={{
            fontSize: 78,
            color: 'var(--burgundy)',
            margin: '0 0 18px',
            fontWeight: 500,
            lineHeight: 1.15,
          }}>
            தமிழின் வாசிப்பு வீடு.
          </h1>
          <p className="display" style={{
            fontStyle: 'italic',
            fontSize: 22,
            color: 'var(--ink-2)',
            letterSpacing: '0.01em',
            margin: '0 0 8px',
          }}>
            A reading home for Tamil literature — from the classical to the contemporary.
          </p>
          <p className="ta" style={{ fontSize: 15, color: 'var(--ink-3)', maxWidth: 600, margin: '14px auto 0', lineHeight: 1.75 }}>
            திருக்குறள் முதல் இன்றைய சிறுகதைகள் வரை — 1,200+ நூல்கள், 400+ கட்டுரைகள், ஒரே இடத்தில். மாதம் ₹99.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 36 }}>
            <button className="btn btn-primary">
              <span className="ta">வாசிப்பைத் தொடங்குங்கள்</span>
              <span style={{ opacity: .6 }}>→</span>
            </button>
            <button className="btn btn-ghost">
              <span className="ta">கட்டுரைகள்</span>
            </button>
          </div>

          {/* metric strip */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 0, marginTop: 56,
            border: '1px solid var(--border)',
            background: 'rgba(241,230,210,.5)',
            maxWidth: 720, marginInline: 'auto',
          }}>
            {[
              { n: '1,247', ta: 'புத்தகங்கள்',  en: 'BOOKS' },
              { n: '432',   ta: 'கட்டுரைகள்',   en: 'ARTICLES' },
              { n: '86',    ta: 'ஆசிரியர்கள்',  en: 'AUTHORS' },
              { n: '₹99',   ta: 'மாதம் ஒன்றுக்கு', en: 'PER MONTH' },
            ].map((m, i, arr) => (
              <div key={m.en} style={{
                flex: 1, padding: '18px 12px',
                borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
                textAlign: 'center',
              }}>
                <div className="display" style={{ fontSize: 28, color: 'var(--burgundy)', lineHeight: 1 }}>{m.n}</div>
                <div className="ta" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{m.ta}</div>
                <div className="eyebrow eyebrow-sm" style={{ marginTop: 3, color: 'var(--gold)' }}>{m.en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="trim" style={{ margin: '0 56px' }} />

      {/* FEATURED BOOKS */}
      <section style={{ padding: '70px 56px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>தேர்வு · A Curated Selection</div>
            <h2 className="ta-display" style={{ fontSize: 44, color: 'var(--ink)' }}>இம்மாதம் சிறப்பு நூல்கள்</h2>
            <p className="display" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 16, marginTop: 6 }}>Featured this month · ஏப்ரல் 2026</p>
          </div>
          <a className="ta" style={{ color: 'var(--burgundy)', borderBottom: '1px solid var(--burgundy)', paddingBottom: 2, fontSize: 14 }}>
            அனைத்தும் →
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
          {featuredBooks.map((b, i) => (
            <article key={i} style={{ display: 'flex', flexDirection: 'column' }}>
              <Cover title={b.ta} author={b.author} variant={b.variant} emblem={b.emblem} />
              <div style={{ marginTop: 16, paddingInline: 2 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <span className={`badge ${i % 2 === 0 ? 'badge-premium' : 'badge-free'}`}>{i % 2 === 0 ? 'Premium' : 'Free'}</span>
                  <span className="badge badge-chip ta">{['செவ்விலக்கியம்','காவியம்','நீதி நூல்','நாவல்'][i]}</span>
                </div>
                <h3 className="ta-display" style={{ fontSize: 19, lineHeight: 1.3, color: 'var(--ink)' }}>{b.ta}</h3>
                <p className="display" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>{b.en}</p>
                <p className="ta" style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 8 }}>{b.author}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PEACOCK BAND — Subscribe CTA */}
      <section style={{
        padding: '70px 56px',
        background: 'var(--sandalwood)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* corner peacock feathers */}
        <div style={{ position: 'absolute', left: 56, top: 40, opacity: 0.4 }}>
          <PeacockEye size={60} />
        </div>
        <div style={{ position: 'absolute', right: 56, top: 40, opacity: 0.4, transform: 'scaleX(-1)' }}>
          <PeacockEye size={60} />
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <Divider label="சந்தா · Subscription" />
          <h2 className="ta-display" style={{ fontSize: 42, color: 'var(--burgundy)', marginTop: 24, marginBottom: 14 }}>
            மாதம் ₹99-க்கு<br />முழு நூலகம்.
          </h2>
          <p className="display" style={{ fontStyle: 'italic', fontSize: 18, color: 'var(--ink-2)', marginBottom: 8 }}>
            ₹99 a month for the whole library.
          </p>
          <p className="ta" style={{ fontSize: 14, color: 'var(--ink-2)', maxWidth: 480, margin: '14px auto 28px', lineHeight: 1.8 }}>
            இலவசத் திட்டத்தில் ஒவ்வொரு பிரீமியம் புத்தகத்தின் முதல் இரண்டு பக்கங்கள் கிடைக்கும். சந்தாதாரர்களுக்கு வரம்பற்ற வாசிப்பு.
          </p>

          <div style={{
            display: 'inline-grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            border: '1px solid var(--border)', background: 'var(--paper)',
            maxWidth: 460, width: '100%', textAlign: 'left',
          }}>
            <div style={{ padding: '22px 24px' }}>
              <div className="eyebrow">இலவசம் · Free</div>
              <div className="display" style={{ fontSize: 30, marginTop: 8, color: 'var(--ink)' }}>₹0</div>
              <ul style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li className="ta" style={{ fontSize: 13, color: 'var(--ink-2)' }}>· அனைத்து கட்டுரைகள்</li>
                <li className="ta" style={{ fontSize: 13, color: 'var(--ink-2)' }}>· முதல் 2 பக்கங்கள்</li>
              </ul>
            </div>
            <div style={{ padding: '22px 24px', background: 'var(--burgundy)', color: '#FFE8B8', position: 'relative' }}>
              <div className="eyebrow" style={{ color: '#D9B97C' }}>சந்தா · Premium</div>
              <div className="display" style={{ fontSize: 30, marginTop: 8, color: '#FFE8B8' }}>₹99<span style={{ fontSize: 13, fontStyle: 'italic', opacity: .7 }}> /மாதம்</span></div>
              <ul style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li className="ta" style={{ fontSize: 13 }}>· வரம்பற்ற நூல்கள்</li>
                <li className="ta" style={{ fontSize: 13 }}>· விரைவில் வரும் புதியவை</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <button className="btn btn-primary" style={{ padding: '13px 32px', fontSize: 14 }}>
              <span className="ta">₹99-ல் சேருங்கள்</span>
              <span style={{ opacity: .6 }}>→</span>
            </button>
          </div>
          <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)', marginTop: 14 }}>
            UPI · Cards · Net Banking · Powered by Razorpay
          </p>
        </div>
      </section>

      {/* RECENT ARTICLES */}
      <section style={{ padding: '70px 56px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>கட்டுரைகள் · From The Journal</div>
            <h2 className="ta-display" style={{ fontSize: 44, color: 'var(--ink)' }}>சமீபத்திய எழுத்து</h2>
            <p className="display" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 16, marginTop: 6 }}>Recent essays & criticism</p>
          </div>
          <a className="ta" style={{ color: 'var(--burgundy)', borderBottom: '1px solid var(--burgundy)', paddingBottom: 2, fontSize: 14 }}>
            மேலும் →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {recentArticles.map((a, i) => (
            <article key={i} className="frame" style={{ padding: 28, background: 'var(--paper)' }}>
              <div className="eyebrow" style={{ marginBottom: 18 }}>{a.cat} · 0{i+1}</div>
              <h3 className="ta-display" style={{ fontSize: 24, color: 'var(--ink)', lineHeight: 1.32, marginBottom: 12, textWrap: 'pretty' }}>{a.ta}</h3>
              <p className="display" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 14, marginBottom: 18 }}>{a.en}</p>
              <hr className="rule" style={{ margin: '14px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="ta" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{a.date}</span>
                <span className="ta" style={{ fontSize: 11, color: 'var(--burgundy)' }}>{a.read}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <PublicFooter lang={lang} />
    </div>
  );
}

window.HomeScreen = HomeScreen;
