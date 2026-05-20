// Kalaimagal — Screens: PDF Reader with Paywall + Blog Detail

function ReaderScreen({ lang = 'ta', setLang, paywall = true }) {
  // Two-page spread reader, paywall blur from page 2 onward.
  const book = KM_BOOKS[0];

  return (
    <div className="km" style={{ width: 1280, background: '#2A1F18' }}>
      {/* Sticky top chrome */}
      <header style={{
        position: 'sticky', top: 0,
        background: 'rgba(27,20,16,0.96)',
        color: '#F1E6D2',
        borderBottom: '1px solid rgba(216,184,124,.15)',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button style={{ color: '#D9B97C', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 14 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M9 2 L4 7 L9 12"/></svg>
            {lang === 'ta' ? 'திரும்பு' : 'Back'}
          </button>
          <div style={{ borderLeft: '1px solid rgba(216,184,124,.2)', height: 22 }}/>
          <div>
            <div className="ta" style={{ fontSize: 15, color: '#F1E6D2' }}>{book.ta}</div>
            <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 11, color: '#8A7A60' }}>{book.author} · Ponniyin Selvan</div>
          </div>
        </div>

        {/* Page counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--display)' }}>
          <span style={{ fontStyle: 'italic', color: '#8A7A60', fontSize: 13 }}>Page</span>
          <span style={{ fontSize: 17, color: '#F1E6D2' }}>2</span>
          <span style={{ color: '#8A7A60' }}>/</span>
          <span style={{ fontSize: 14, color: '#8A7A60' }}>2,412</span>
          {/* Mini progress */}
          <div style={{ width: 80, height: 2, background: 'rgba(216,184,124,.2)', marginLeft: 8 }}>
            <div style={{ width: '0.08%', height: '100%', background: '#D97F2E' }}/>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ReaderIcon glyph="A−"/>
          <ReaderIcon glyph="A+"/>
          <div style={{ borderLeft: '1px solid rgba(216,184,124,.2)', height: 22, margin: '0 4px' }}/>
          <ReaderIcon glyph={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 2v11l4-3 4 3V2z"/></svg>
          }/>
          <ReaderIcon glyph={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="7" cy="7" r="5"/><path d="M7 4v3l2 2"/></svg>
          }/>
        </div>
      </header>

      {/* Spread */}
      <div style={{
        padding: '48px 32px 60px',
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28,
        minHeight: 880,
        position: 'relative',
      }}>
        {/* Prev arrow */}
        <button style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'rgba(241,230,210,.06)',
          color: '#D9B97C',
          border: '1px solid rgba(216,184,124,.18)',
          display: 'grid', placeItems: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M9 2 L4 7 L9 12"/></svg>
        </button>

        {/* Spread pages */}
        <div style={{ display: 'flex', boxShadow: '0 30px 60px -20px rgba(0,0,0,.6)', position: 'relative' }}>
          {/* Left page — readable, page 1 */}
          <PdfPage
            pageNo={1}
            content={
              <>
                <h2 className="ta-display" style={{ fontSize: 26, color: 'var(--burgundy)', marginBottom: 4, textAlign: 'center' }}>
                  பொன்னியின் செல்வன்
                </h2>
                <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', marginBottom: 22, letterSpacing: '0.2em' }}>
                  பாகம் ஒன்று · புது வெள்ளம்
                </p>
                <div className="trim-thin" style={{ marginBottom: 20 }}/>
                <h3 className="ta-display" style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 14 }}>
                  1. ஆடிப் பெருக்கு
                </h3>
                <p className="ta" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.95, textAlign: 'justify', marginBottom: 14, textIndent: '1.4em' }}>
                  பாண்டிய நாட்டிலிருந்து கொள்ளிடக் கரையை நோக்கிக் குதிரை மேல் வந்து கொண்டிருந்த அவ்விளைஞன் சற்றே நின்று காவிரியின் பெருக்கைப் பார்த்தான். ஆடிப் பெருக்கின் வெண் நுரைகள் கரையினை அலசிக் கொண்டிருந்தன.
                </p>
                <p className="ta" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.95, textAlign: 'justify', marginBottom: 14, textIndent: '1.4em' }}>
                  இளைஞனின் முகத்தில் ஒரு ஆனந்த ரேகை தோன்றியது. அவன் சோழ நாட்டுக்குள் நுழைந்துவிட்டான் என்ற நினைப்பு அவனுக்கு பெரு மகிழ்ச்சியை அளித்தது. காவிரியின் கரை வழியே கிழக்கு நோக்கிப் பயணம் தொடர்ந்தது.
                </p>
                <p className="ta" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.95, textAlign: 'justify', marginBottom: 14, textIndent: '1.4em' }}>
                  தஞ்சாவூரின் சிறப்பு, பழைய ஆரூரின் கோயில்கள், கங்கை கொண்ட சோழபுரத்தின் கனவுகள் — இவை அனைத்தும் வந்தியத்தேவன் என்ற அவ்விளைஞனின் மனத்தில் ஒரே சமயத்தில் அலையெழுந்தன.
                </p>
              </>
            }
          />

          {/* Right page — paywalled */}
          <div style={{ position: 'relative' }}>
            <PdfPage
              pageNo={2}
              content={
                <>
                  <p className="ta" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.95, textAlign: 'justify', marginBottom: 14, textIndent: '1.4em' }}>
                    அப்போது வழியில் ஒரு ஆலமரம் தோன்றியது. அதன் கீழே ஒரு பழைய மண்டபம். அந்த மண்டபத்தில் காவிரியின் ஓசையை ரசித்துக் கொண்டு அமர்ந்திருந்த அதிசயமான முதியவரை அவன் பார்த்தான்.
                  </p>
                  <p className="ta" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.95, textAlign: 'justify', marginBottom: 14, textIndent: '1.4em' }}>
                    "சோழ நாட்டுக்கு வருகிற இளைஞனே, உனக்கு வரவேற்பு! என்ன காரணமாக நீ வந்தாய் என்று எனக்குத் தெரியாது. ஆனால், உனது வருகை சாதாரணமானது அல்ல என்பது எனக்குப் புலப்படுகிறது."
                  </p>
                  <p className="ta" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.95, textAlign: 'justify', marginBottom: 14, textIndent: '1.4em' }}>
                    வந்தியத்தேவன் வியப்புடன் முதியவரை பார்த்தான். அவரின் கண்களில் ஞானத்தின் ஒளி பிரகாசித்தது. பழைய பஞ்சாங்கம் ஒன்றை மடியில் வைத்திருந்தார்.
                  </p>
                  <p className="ta" style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.95, textAlign: 'justify', marginBottom: 14, textIndent: '1.4em' }}>
                    "மூன்று மாதங்கள் முன் ஒரு புதிய நட்சத்திரம் தோன்றியது. அது சோழ ராஜ வம்சத்திற்கு ஒரு மாற்றத்தை அறிவிக்கிறது. தஞ்சை மாளிகையில் என்ன நடக்கப் போகிறது என்பது..."
                  </p>
                </>
              }
              blurred={paywall}
            />

            {paywall && (
              <>
                {/* Dim gradient over right page */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'linear-gradient(to bottom, rgba(250,247,242,0) 0%, rgba(250,247,242,0.4) 40%, rgba(250,247,242,0.95) 75%)',
                }}/>

                {/* Slide-up subscribe panel */}
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  background: 'var(--paper)',
                  borderTop: '2px solid var(--burgundy)',
                  boxShadow: '0 -12px 40px rgba(0,0,0,.18)',
                  padding: '28px 32px 30px',
                }}>
                  <div className="trim" style={{ marginBottom: 18, marginInline: -8 }}/>
                  <div className="eyebrow" style={{ color: 'var(--burgundy)', marginBottom: 8 }}>★  இங்கே முதல் 2 பக்கங்கள் முடிந்தன  ★</div>
                  <h3 className="ta-display" style={{ fontSize: 22, color: 'var(--burgundy)', marginBottom: 6, lineHeight: 1.35 }}>
                    தொடர்ந்து வாசிக்க <br/>சந்தாதாரராகுங்கள்.
                  </h3>
                  <p className="display" style={{ fontStyle: 'italic', fontSize: 13, color: 'var(--ink-2)', marginBottom: 18 }}>
                    Subscribe to continue reading "{book.ta}" and 1,200+ titles.
                  </p>
                  <button className="btn btn-primary" style={{ width: '100%', padding: '12px 20px', fontSize: 14 }}>
                    <span className="ta">₹99/மாதம் — சந்தா தொடங்கு</span>
                    <span style={{ opacity: .6 }}>→</span>
                  </button>
                  <p style={{ marginTop: 12, fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', fontFamily: 'var(--display)' }}>
                    Already subscribed? <span style={{ color: 'var(--burgundy)', borderBottom: '1px solid var(--burgundy)' }}>Sign in</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next arrow */}
        <button style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'var(--burgundy)',
          color: '#FFE8B8',
          border: '1px solid var(--burgundy)',
          display: 'grid', placeItems: 'center',
          flexShrink: 0,
          boxShadow: '0 0 0 1px rgba(241,230,210,.15)',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: 'rotate(180deg)' }}><path d="M9 2 L4 7 L9 12"/></svg>
        </button>
      </div>

      {/* Bottom keyboard hints */}
      <div style={{ textAlign: 'center', paddingBottom: 24, color: '#8A7A60', fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12 }}>
        Use ← → keys to turn pages · Esc to exit · அம்புக் குறிகள் கொண்டு பக்கங்களை மாற்றலாம்
      </div>
    </div>
  );
}

function ReaderIcon({ glyph }) {
  return (
    <button style={{
      width: 32, height: 32,
      border: '1px solid rgba(216,184,124,.18)',
      color: '#D9B97C',
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--display)', fontSize: 13,
    }}>{glyph}</button>
  );
}

function PdfPage({ pageNo, content, blurred }) {
  return (
    <div style={{
      width: 380, height: 540,
      background: 'var(--paper)',
      padding: '36px 36px 28px',
      position: 'relative',
      filter: blurred ? 'blur(3.5px)' : null,
      transition: 'filter .35s',
    }}>
      {/* Inner manuscript frame */}
      <div style={{ position: 'absolute', inset: 16, border: '0.5px solid var(--border)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', inset: 18, border: '0.5px solid var(--border-soft)', pointerEvents: 'none' }}/>

      <div style={{ position: 'relative' }}>{content}</div>

      <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 11, color: 'var(--ink-3)' }}>
        — {pageNo} —
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// BLOG DETAIL
// ─────────────────────────────────────────────────────────

function BlogDetailScreen({ lang = 'ta', setLang }) {
  return (
    <div className="km paper-warm" style={{ width: 1280 }}>
      <PublicHeader active="articles" lang={lang} onLang={setLang} />

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '56px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)', marginBottom: 36, justifyContent: 'center' }}>
          <span>Home</span>
          <span style={{ color: 'var(--gold)' }}>›</span>
          <span>Articles</span>
          <span style={{ color: 'var(--gold)' }}>›</span>
          <span style={{ color: 'var(--burgundy)' }}>இலக்கியம்</span>
        </div>

        {/* Title */}
        <header style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>இலக்கியம் · ESSAY</div>
          <h1 className="ta-display" style={{ fontSize: 56, color: 'var(--burgundy)', lineHeight: 1.18, marginBottom: 18, textWrap: 'balance' }}>
            சங்க இலக்கியத்தின் இசை
          </h1>
          <p className="display" style={{ fontStyle: 'italic', fontSize: 22, color: 'var(--ink-2)', textWrap: 'balance' }}>
            On the music hidden inside Sangam poetry — what the akam and puram traditions still teach us about listening.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'center', marginTop: 28, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--sandalwood-2)', color: 'var(--burgundy)', display: 'grid', placeItems: 'center', fontFamily: 'var(--tamil)', fontStyle: 'normal', fontWeight: 500 }}>க</div>
            <span style={{ color: 'var(--ink)' }} className="ta">கவிதா ராமச்சந்திரன்</span>
            <span style={{ color: 'var(--gold)' }}>·</span>
            <span>April 12, 2026</span>
            <span style={{ color: 'var(--gold)' }}>·</span>
            <span>8 min read</span>
          </div>
        </header>

        <div className="trim-thin" style={{ marginBottom: 40 }}/>

        {/* Body */}
        <div className="ta" style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.85 }}>
          <p style={{ fontSize: 22, lineHeight: 1.7, color: 'var(--ink)', marginBottom: 28, fontWeight: 500, textWrap: 'pretty' }}>
            <span style={{
              float: 'left',
              fontFamily: 'var(--tamil)',
              fontSize: 64,
              lineHeight: 0.85,
              color: 'var(--burgundy)',
              marginRight: 12,
              marginTop: 6,
              fontWeight: 500,
            }}>சங்</span>
            க இலக்கியத்தில் நீங்கள் முதலில் காண்பது வரிகள் அல்ல — ஓசை. ஒரு கடற்கரை, ஒரு மலையடிவாரம், ஒரு புலம், ஒரு போர்க்களம் — ஒவ்வொரு திணைக்கும் தனித்தனி ஓசை உண்டு.
          </p>

          <p style={{ marginBottom: 22 }}>
            இரண்டாயிரம் ஆண்டுகளுக்கு முற்பட்ட புலவர்கள் வாசிப்பவர்களை ஒரு குறிப்பிட்ட இடத்திற்குக் கொண்டு செல்லும்போது — அவர்கள் வெறும் வார்த்தைகளை வரிசைப்படுத்தவில்லை. அவர்கள் ஓசையை சேகரித்தார்கள்: காற்று, அலை, மணியோசை, யானையின் முழக்கம், காதலியின் வளையல்கள், போர்க் கொட்டு.
          </p>

          <p style={{ marginBottom: 22 }}>
            அகநானூறு, புறநானூறு, ஐங்குறுநூறு — இவற்றில் நீங்கள் காணும் ஒவ்வொரு பாடலுக்குள்ளும் ஒரு குறிப்பிட்ட நிலத்தின் ஓசை அடித்தளமாக ஓடுகிறது. மருதம் என்றால் காவிரி. பாலை என்றால் வறட்சி. குறிஞ்சி என்றால் மலையின் தனிமை.
          </p>

          {/* Pull quote */}
          <blockquote style={{
            margin: '36px -28px',
            padding: '28px 32px',
            borderLeft: '3px solid var(--burgundy)',
            background: 'var(--sandalwood)',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 8, left: 24, fontFamily: 'var(--display)', fontSize: 48, color: 'var(--gold)', lineHeight: 1 }}>"</div>
            <p className="ta" style={{ fontSize: 20, color: 'var(--burgundy)', lineHeight: 1.55, fontWeight: 500, marginLeft: 24 }}>
              ஒவ்வொரு பாடலும் ஒரு ராகம். ஒவ்வொரு திணையும் ஒரு கீதம்.
            </p>
            <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', color: 'var(--ink-2)', fontSize: 14, marginLeft: 24, marginTop: 8 }}>
              Every song its own raga. Every landscape its own melody.
            </p>
          </blockquote>

          <p style={{ marginBottom: 22 }}>
            இன்றைய காதுகள் இந்த ஓசையை இழந்துவிட்டனவா? அதற்கு பதில் சிக்கலானது. நாம் வாசிக்கும் முறை மாறிவிட்டது. திரைகளில் வேகமாக ஓடும் வரிகள், காதுகளில் ஒலிக்கும் எண்ணற்ற குரல்கள் — இவற்றுக்கிடையில் ஓர் ஐந்து வரிப் பாடலை நிதானமாக ஒலிக்கச் செய்வது ஒரு செய்கையாகிவிட்டது.
          </p>

          <h2 className="ta-display" style={{ fontSize: 28, color: 'var(--burgundy)', marginTop: 36, marginBottom: 16 }}>
            ஓசையின் இலக்கணம்
          </h2>
          <p style={{ marginBottom: 22 }}>
            தொல்காப்பியர் தனது நூலில் இசையைப் பற்றி நேரடியாகப் பேசவில்லை. ஆனால் அவர் வகுத்த அகத்திணை, புறத்திணைப் பகுப்பாய்வில் — மொழியின் ஒலி, மனத்தின் உணர்வோடு எப்படிப் பின்னியிருக்கிறது என்பதை கூர்மையாகக் காட்டுகிறார்.
          </p>

          <p>
            நாம் சங்க இலக்கியத்தை மீண்டும் கற்க வேண்டும். அமைதியாக. வாய்விட்டு. நாக்கின் நுனியில் ஓசை வரும்வரை.
          </p>
        </div>

        {/* End mark */}
        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <div className="divider-diamond" style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--burgundy)' }}/>
        </div>

        {/* Author bio */}
        <div style={{ marginTop: 48, padding: 28, background: 'var(--sandalwood)', display: 'flex', gap: 18, border: '1px solid var(--border)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--burgundy)', color: '#FFE8B8', display: 'grid', placeItems: 'center', fontFamily: 'var(--tamil)', fontSize: 24, flexShrink: 0 }}>க</div>
          <div>
            <div className="eyebrow">About the writer</div>
            <h4 className="ta-display" style={{ fontSize: 18, color: 'var(--ink)', marginTop: 6 }}>கவிதா ராமச்சந்திரன்</h4>
            <p className="ta" style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.7 }}>
              மதுரை காமராசர் பல்கலைக்கழகத்தில் தமிழ் இலக்கியம் கற்பிக்கிறார். சங்க இலக்கியம் குறித்து மூன்று நூல்கள் எழுதியுள்ளார்.
            </p>
          </div>
        </div>
      </article>

      <PublicFooter lang={lang} />
    </div>
  );
}

Object.assign(window, { ReaderScreen, BlogDetailScreen });
