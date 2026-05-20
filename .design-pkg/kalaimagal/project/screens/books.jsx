// Kalaimagal — Screens: Books Grid (/books) + Book Detail (/books/[slug])

const KM_BOOKS = [
  { ta: 'பொன்னியின் செல்வன்',       en: 'Ponniyin Selvan',     author: 'கல்கி கிருஷ்ணமூர்த்தி',  variant: 'burgundy', cat: 'நாவல்',         premium: true,  pages: 2412 },
  { ta: 'சிலப்பதிகாரம்',             en: 'Silappathikaram',     author: 'இளங்கோ அடிகள்',           variant: 'sand',  cat: 'காவியம்',         premium: false, pages: 504,  emblem: 'ஸி' },
  { ta: 'திருக்குறள்',                en: 'Thirukkural',         author: 'திருவள்ளுவர்',             variant: 'teal',  cat: 'நீதி நூல்',       premium: false, pages: 280, emblem: 'வ' },
  { ta: 'மோகமுள்',                    en: 'Mogamul',             author: 'தி. ஜானகிராமன்',           variant: 'gold',  cat: 'நாவல்',         premium: true,  pages: 432, emblem: 'ம' },
  { ta: 'மணிமேகலை',                  en: 'Manimekalai',         author: 'சாத்தனார்',                variant: 'kumkum', cat: 'காவியம்',        premium: true,  pages: 380, emblem: 'மே' },
  { ta: 'சிவகாமியின் சபதம்',          en: 'Sivakami\'s Vow',     author: 'கல்கி',                    variant: 'ink',   cat: 'நாவல்',         premium: true,  pages: 612, emblem: 'சி' },
  { ta: 'அலை ஓசை',                    en: 'The Sound of Waves', author: 'எம். வை. வெங்கட்ராமன்',     variant: 'sand',  cat: 'நாவல்',         premium: true,  pages: 348, emblem: 'அ' },
  { ta: 'ஜே.ஜே. சில குறிப்புகள்',     en: 'J.J. — Some Jottings',author: 'சுந்தர ராமசாமி',            variant: 'burgundy', cat: 'நாவல்',     premium: true,  pages: 256, emblem: 'ஜே' },
  { ta: 'புதுமைப்பித்தன் கதைகள்',     en: 'Pudhumaipithan Stories', author: 'புதுமைப்பித்தன்',        variant: 'gold',  cat: 'சிறுகதை',       premium: false, pages: 510, emblem: 'பு' },
  { ta: 'திருவாசகம்',                  en: 'Tiruvachakam',        author: 'மாணிக்கவாசகர்',           variant: 'teal',  cat: 'பக்தி',          premium: false, pages: 312, emblem: 'தி' },
  { ta: 'கொற்கை',                      en: 'Korkai',              author: 'சு. வெங்கடேசன்',           variant: 'kumkum', cat: 'வரலாற்று நாவல்',premium: true,  pages: 568, emblem: 'கொ' },
  { ta: 'பாரதியார் கவிதைகள்',         en: 'Bharathi · Poems',   author: 'சுப்பிரமணிய பாரதி',         variant: 'burgundy', cat: 'கவிதை',     premium: false, pages: 396, emblem: 'பா' },
];

function BooksGridScreen({ lang = 'ta', setLang }) {
  return (
    <div className="km paper-warm" style={{ width: 1280 }}>
      <PublicHeader active="books" lang={lang} onLang={setLang} />

      {/* Page header */}
      <section style={{ padding: '56px 56px 32px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>நூலகம் · The Library</div>
            <h1 className="ta-display" style={{ fontSize: 56, color: 'var(--burgundy)', marginBottom: 8 }}>புத்தகங்கள்</h1>
            <p className="display" style={{ fontStyle: 'italic', fontSize: 18, color: 'var(--ink-2)' }}>
              <span>1,247 titles</span>
              <span style={{ color: 'var(--gold)', margin: '0 10px' }}>·</span>
              <span className="ta" style={{ fontFamily: 'var(--tamil)', fontStyle: 'normal' }}>பக்கம் 1 / 104</span>
            </p>
          </div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Pill label={lang==='ta'?'அனைத்தும்':'All'} active />
            <Pill label={lang==='ta'?'இலவசம்':'Free'} />
            <Pill label={lang==='ta'?'சந்தா':'Premium'} />
            <Pill label={lang==='ta'?'செவ்விலக்கியம்':'Classical'} />
            <Pill label={lang==='ta'?'நாவல்':'Novels'} />
            <div style={{ borderLeft: '1px solid var(--border)', height: 22, marginLeft: 4 }}/>
            <Sort label={lang==='ta'?'புதியது முதலில்':'Newest first'} />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '40px 56px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px 28px' }}>
          {KM_BOOKS.map((b, i) => (
            <article key={i}>
              <div style={{ position: 'relative' }}>
                <Cover {...b} />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className={`badge ${b.premium ? 'badge-premium' : 'badge-free'}`} style={{ fontSize: 10 }}>
                    {b.premium ? (lang==='ta'?'சந்தா':'Premium') : (lang==='ta'?'இலவசம்':'Free')}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div className="eyebrow eyebrow-sm" style={{ marginBottom: 4 }}>{b.cat}</div>
                <h3 className="ta-display" style={{ fontSize: 18, lineHeight: 1.3, color: 'var(--ink)', textWrap: 'pretty' }}>{b.ta}</h3>
                <p className="display" style={{ fontStyle: 'italic', color: 'var(--ink-3)', fontSize: 13, marginTop: 2 }}>{b.en}</p>
                <p className="ta" style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 6 }}>{b.author} · {b.pages}{lang==='ta'?' பக்.':' pp'}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <PaginatorBtn dir="prev" />
          {[1,2,3,4,5].map(n => (
            <button key={n} style={{
              width: 36, height: 36,
              fontFamily: 'var(--display)', fontSize: 14, fontWeight: 500,
              border: n === 1 ? '1px solid var(--burgundy)' : '1px solid transparent',
              background: n === 1 ? 'var(--burgundy)' : 'transparent',
              color: n === 1 ? '#FFE8B8' : 'var(--ink-2)',
            }}>{n}</button>
          ))}
          <span style={{ color: 'var(--ink-3)', padding: '0 4px' }}>···</span>
          <button style={{ width: 36, height: 36, fontFamily: 'var(--display)', fontSize: 14, color: 'var(--ink-2)' }}>104</button>
          <PaginatorBtn dir="next" />
        </div>
      </section>

      <PublicFooter lang={lang} />
    </div>
  );
}

function Pill({ label, active }) {
  return (
    <button style={{
      padding: '7px 16px',
      fontFamily: 'var(--tamil)',
      fontSize: 13,
      border: '1px solid',
      borderColor: active ? 'var(--burgundy)' : 'var(--border)',
      background: active ? 'var(--burgundy)' : 'transparent',
      color: active ? '#FFE8B8' : 'var(--ink-2)',
      borderRadius: 999,
    }}>{label}</button>
  );
}

function Sort({ label }) {
  return (
    <button style={{
      padding: '7px 12px',
      fontFamily: 'var(--display)',
      fontStyle: 'italic',
      fontSize: 13,
      color: 'var(--ink-2)',
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center',
    }}>
      {label}
      <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 3.5 L5 7.5 L9 3.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>
    </button>
  );
}

function PaginatorBtn({ dir }) {
  return (
    <button style={{
      width: 40, height: 36,
      border: '1px solid var(--border)',
      color: 'var(--ink-2)',
      display: 'grid', placeItems: 'center',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" style={{ transform: dir === 'next' ? 'rotate(180deg)' : null }}>
        <path d="M9 2 L4 7 L9 12" fill="none" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// BOOK DETAIL
// ─────────────────────────────────────────────────────────

function BookDetailScreen({ lang = 'ta', setLang }) {
  const book = KM_BOOKS[0]; // Ponniyin Selvan

  return (
    <div className="km paper-warm" style={{ width: 1280 }}>
      <PublicHeader active="books" lang={lang} onLang={setLang} />

      {/* Breadcrumb */}
      <div style={{ padding: '20px 56px 0', display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)' }}>
        <span>Home</span>
        <span style={{ color: 'var(--gold)' }}>›</span>
        <span>Books</span>
        <span style={{ color: 'var(--gold)' }}>›</span>
        <span style={{ color: 'var(--burgundy)' }}>{book.en}</span>
      </div>

      {/* Detail */}
      <section style={{ padding: '32px 56px 60px', display: 'grid', gridTemplateColumns: '380px 1fr', gap: 64, alignItems: 'start' }}>
        {/* Cover column */}
        <div>
          <Cover {...book} />
          <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" style={{ flex: 1, padding: '10px 12px', fontSize: 13 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M7 1v12M1 7h12"/></svg>
              <span className="ta">அலமாரிக்கு</span>
            </button>
            <button className="btn btn-ghost" style={{ flex: 1, padding: '10px 12px', fontSize: 13 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 2v11l4-3 4 3V2z"/></svg>
              <span className="ta">அடையாளம்</span>
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="badge badge-premium">Premium</span>
            <span className="badge badge-gold">★ Featured</span>
            <span className="badge badge-chip ta">{book.cat}</span>
            <span className="badge badge-chip ta">செவ்விலக்கியம்</span>
            <span className="badge badge-chip ta">சோழ வரலாறு</span>
          </div>

          <h1 className="ta-display" style={{ fontSize: 62, color: 'var(--burgundy)', lineHeight: 1.1, marginBottom: 14 }}>{book.ta}</h1>
          <p className="display" style={{ fontStyle: 'italic', fontSize: 24, color: 'var(--ink-2)', marginBottom: 24 }}>{book.en}</p>

          {/* Author + dates strip */}
          <div style={{ display: 'flex', gap: 24, paddingBlock: 16, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
            <div>
              <div className="eyebrow eyebrow-sm">Author</div>
              <p className="ta" style={{ fontSize: 16, color: 'var(--ink)', marginTop: 4 }}>{book.author}</p>
              <p className="display" style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)' }}>Kalki Krishnamurthy</p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)' }}/>
            <div>
              <div className="eyebrow eyebrow-sm">First Published</div>
              <p style={{ fontFamily: 'var(--display)', fontSize: 16, marginTop: 4, color: 'var(--ink)' }}>1950–1954</p>
              <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)' }}>serialized in Kalki magazine</p>
            </div>
            <div style={{ borderLeft: '1px solid var(--border)' }}/>
            <div>
              <div className="eyebrow eyebrow-sm">Added</div>
              <p style={{ fontFamily: 'var(--display)', fontSize: 16, marginTop: 4, color: 'var(--ink)' }}>March 2026</p>
            </div>
          </div>

          {/* Description */}
          <p className="ta" style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.85, marginBottom: 18, textWrap: 'pretty' }}>
            சோழப் பேரரசின் பொன்னியின் செல்வன் ராஜராஜனின் கதையை விரிவாக கூறும் ஐந்து பாகங்கள் கொண்ட காவிய நாவல். அரியணைக்கான போராட்டம், அரசியல், காதல், சாகசம் ஆகியவற்றின் கலவையாக கல்கி எழுதிய மாபெரும் படைப்பு.
          </p>
          <p className="display" style={{ fontStyle: 'italic', fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.7, marginBottom: 32 }}>
            Kalki Krishnamurthy's sweeping historical novel of the Chola emperor Rajaraja, originally serialized in Kalki magazine between 1950 and 1954.
          </p>

          {/* Key/value grid */}
          <div className="frame" style={{ padding: 0, marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {[
                { k: lang==='ta'?'பக்கங்கள்':'Pages',       v: '2,412' },
                { k: lang==='ta'?'மொழி':'Language',         v: 'Tamil · தமிழ்' },
                { k: lang==='ta'?'பாகம்':'Parts',           v: '5' },
                { k: 'ISBN',                                v: '978-81-7276-468-7' },
                { k: lang==='ta'?'பதிப்பகம்':'Publisher',  v: 'Vanathi Pathippagam' },
                { k: lang==='ta'?'ஆண்டு':'Year',           v: '1954' },
              ].map((kv, i) => (
                <div key={i} style={{
                  padding: '14px 18px',
                  borderRight: i % 3 === 2 ? 'none' : '1px solid var(--border-soft)',
                  borderBottom: i < 3 ? '1px solid var(--border-soft)' : 'none',
                }}>
                  <div className="eyebrow eyebrow-sm" style={{ marginBottom: 4 }}>{kv.k}</div>
                  <p style={{ fontFamily: 'var(--display)', fontSize: 15, color: 'var(--ink)' }}>{kv.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Read CTA */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button className="btn btn-primary" style={{ padding: '15px 36px', fontSize: 15 }}>
              <span className="ta">வாசிக்கத் தொடங்கு</span>
              <span style={{ opacity: .6 }}>→</span>
            </button>
            <button className="btn btn-ghost" style={{ padding: '13px 22px', fontSize: 13 }}>
              <span className="ta">மாதிரி பதிவிறக்கம்</span>
            </button>
          </div>
          <p className="ta" style={{ fontSize: 13, color: 'var(--gold)', marginTop: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, background: 'var(--turmeric)', borderRadius: 0, transform: 'rotate(45deg)' }}/>
            இலவசத்திட்டத்தில் முதல் இரண்டு பக்கங்கள் கிடைக்கும். தொடர்ந்து வாசிக்க ₹99/மாதம்.
          </p>
        </div>
      </section>

      <div className="trim" style={{ margin: '0 56px' }} />

      {/* Related */}
      <section style={{ padding: '50px 56px 80px' }}>
        <Divider label="Also by Kalki · கல்கியின் மற்ற நூல்கள்" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28, marginTop: 32 }}>
          {KM_BOOKS.slice(1, 5).map((b, i) => (
            <article key={i}>
              <Cover {...b} />
              <h3 className="ta-display" style={{ fontSize: 16, marginTop: 12, color: 'var(--ink)' }}>{b.ta}</h3>
              <p className="ta" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>{b.author}</p>
            </article>
          ))}
        </div>
      </section>

      <PublicFooter lang={lang} />
    </div>
  );
}

Object.assign(window, { BooksGridScreen, BookDetailScreen, KM_BOOKS });
