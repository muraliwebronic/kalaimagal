// Kalaimagal — Screens: Login, Register, Account, 404

function AuthShell({ children, title, subtitle, footer, lang, setLang }) {
  return (
    <div className="km paper-warm" style={{ width: 1280, minHeight: 900, display: 'flex', flexDirection: 'column' }}>
      {/* Mini header */}
      <header style={{ padding: '20px 56px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo size={36} />
          <Wordmark size="sm" />
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <LangToggle lang={lang} onLang={setLang} />
          <a style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-2)' }}>← Back to site</a>
        </div>
      </header>

      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Background gopuram */}
        <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', opacity: 0.5, pointerEvents: 'none' }}>
          <Gopuram width={1100} height={220} opacity={0.08} />
        </div>

        {/* Card */}
        <div style={{ width: 460, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Thoranam width={280} height={22} />
          </div>

          <div className="frame" style={{ padding: '36px 40px', background: 'var(--paper)' }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h1 className="ta-display" style={{ fontSize: 36, color: 'var(--burgundy)', marginBottom: 6, lineHeight: 1.2 }}>{title.ta}</h1>
              <p className="display" style={{ fontStyle: 'italic', fontSize: 15, color: 'var(--ink-3)' }}>{title.en}</p>
              {subtitle && <p className="ta" style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 14, lineHeight: 1.7 }}>{subtitle}</p>}
            </div>
            <Divider />
            <div style={{ marginTop: 24 }}>
              {children}
            </div>
          </div>

          {footer && <div style={{ marginTop: 24, textAlign: 'center', fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-2)' }}>{footer}</div>}
        </div>
      </main>
    </div>
  );
}

function LoginScreen({ lang = 'ta', setLang }) {
  return (
    <AuthShell
      lang={lang} setLang={setLang}
      title={{ ta: 'மீண்டும் வரவேற்கிறோம்', en: 'Welcome back' }}
      footer={<>
        <span>New to Kalaimagal? </span>
        <span style={{ color: 'var(--burgundy)', borderBottom: '1px solid var(--burgundy)', fontStyle: 'normal' }} className="ta">இங்கே பதிவு செய்</span>
      </>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="field">
          <label>{lang==='ta'?'மின்னஞ்சல்':'Email'}</label>
          <input type="email" defaultValue="reader@kalaimagal.in" />
        </div>
        <div className="field">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>{lang==='ta'?'கடவுச்சொல்':'Password'}</label>
            <a style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, color: 'var(--burgundy)' }}>Forgot?</a>
          </div>
          <input type="password" defaultValue="••••••••••" />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-2)', cursor: 'pointer' }}>
          <span style={{ width: 16, height: 16, border: '1px solid var(--border)', background: 'var(--burgundy)', display: 'grid', placeItems: 'center', color: '#FFE8B8' }}>✓</span>
          Keep me signed in
        </label>

        <button className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 14, marginTop: 6 }}>
          <span className="ta">உள்நுழை</span>
          <span style={{ opacity: .6 }}>→</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--ink-3)', fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, margin: '4px 0' }}>
          <hr style={{ flex: 1, border: 0, borderTop: '1px solid var(--border)' }}/>
          OR
          <hr style={{ flex: 1, border: 0, borderTop: '1px solid var(--border)' }}/>
        </div>

        <button className="btn btn-ghost" style={{ width: '100%', padding: '11px', fontSize: 13 }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>
          Continue with Google
        </button>
      </div>
    </AuthShell>
  );
}

function RegisterScreen({ lang = 'ta', setLang }) {
  return (
    <AuthShell
      lang={lang} setLang={setLang}
      title={{ ta: 'கலைமகளில் சேருங்கள்', en: 'Join Kalaimagal' }}
      subtitle="இலவசத் திட்டத்தில் ஒவ்வொரு புத்தகத்தின் முதல் 2 பக்கங்கள், அனைத்து கட்டுரைகள்."
      footer={<>
        <span>Already a reader? </span>
        <span style={{ color: 'var(--burgundy)', borderBottom: '1px solid var(--burgundy)', fontStyle: 'normal' }} className="ta">உள்நுழை</span>
      </>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="field">
          <label>{lang==='ta'?'பெயர்':'Full name'}</label>
          <input defaultValue="அரவிந்த் சுப்பிரமணியன்" className="ta" />
        </div>
        <div className="field">
          <label>{lang==='ta'?'மின்னஞ்சல்':'Email'}</label>
          <input defaultValue="aravind@example.com" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 10 }}>
          <div className="field">
            <label>Phone</label>
            <input defaultValue="+91 98765 43210" />
          </div>
          <div className="field">
            <label>{lang==='ta'?'கடவுச்சொல்':'Password'}</label>
            <input type="password" defaultValue="••••••••••" />
          </div>
        </div>

        <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-2)', cursor: 'pointer', lineHeight: 1.5 }}>
            <span style={{ width: 16, height: 16, minWidth: 16, border: '1px solid var(--border)', background: 'var(--burgundy)', display: 'grid', placeItems: 'center', color: '#FFE8B8', marginTop: 2 }}>✓</span>
            <span>I agree to the <span style={{ borderBottom: '1px solid var(--ink-2)' }}>Terms of Service</span> and <span style={{ borderBottom: '1px solid var(--ink-2)' }}>Privacy Policy</span>.</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-2)', cursor: 'pointer', lineHeight: 1.5 }}>
            <span style={{ width: 16, height: 16, minWidth: 16, border: '1px solid var(--border)', background: 'var(--paper)', marginTop: 2 }}></span>
            <span>Send me a weekly Tamil reading newsletter.</span>
          </label>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 14, marginTop: 4 }}>
          <span className="ta">கணக்கைத் தொடங்கு</span>
          <span style={{ opacity: .6 }}>→</span>
        </button>
      </div>
    </AuthShell>
  );
}

// ─────────────────────────────────────────────────────────
// ACCOUNT
// ─────────────────────────────────────────────────────────

function AccountScreen({ lang = 'ta', setLang }) {
  return (
    <div className="km paper-warm" style={{ width: 1280, minHeight: 900 }}>
      <PublicHeader active="" lang={lang} onLang={setLang} />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(900px - 86px)' }}>
        {/* Sidebar */}
        <aside style={{ borderRight: '1px solid var(--border)', padding: '40px 24px', background: 'rgba(241,230,210,.35)' }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>கணக்கு · Account</div>

          {/* User card mini */}
          <div style={{ padding: '16px 14px', background: 'var(--paper)', border: '1px solid var(--border)', marginBottom: 22 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--burgundy)', color: '#FFE8B8', display: 'grid', placeItems: 'center', fontFamily: 'var(--tamil)', fontSize: 18 }}>அ</div>
              <div style={{ minWidth: 0 }}>
                <div className="ta" style={{ fontSize: 13, color: 'var(--ink)' }}>அரவிந்த் சு.</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>aravind@example.com</div>
              </div>
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed var(--border)' }}>
              <span className="badge badge-premium" style={{ fontSize: 9 }}>★ Premium</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { ta: 'சுயவிவரம்', en: 'Profile', active: true },
              { ta: 'சந்தா', en: 'Subscription' },
              { ta: 'பாதுகாப்பு', en: 'Security' },
              { ta: 'அறிவிப்புகள்', en: 'Notifications' },
              { ta: 'வாசிப்பு வரலாறு', en: 'Reading History' },
            ].map((n, i) => (
              <a key={i} style={{
                padding: '10px 14px',
                background: n.active ? 'var(--paper)' : 'transparent',
                borderLeft: n.active ? '2px solid var(--burgundy)' : '2px solid transparent',
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <span className="ta" style={{ fontSize: 14, color: n.active ? 'var(--burgundy)' : 'var(--ink-2)', fontWeight: n.active ? 500 : 400 }}>{n.ta}</span>
                <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 11, color: 'var(--ink-3)' }}>{n.en}</span>
              </a>
            ))}
          </nav>

          <div style={{ marginTop: 36, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
            <button style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--kumkum)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M5 2H2v9h3M8 4l3 2.5L8 9M11 6.5H5"/></svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <section style={{ padding: '40px 48px' }}>
          <div style={{ marginBottom: 30 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>சுயவிவரம் · Profile</div>
            <h1 className="ta-display" style={{ fontSize: 42, color: 'var(--ink)', marginBottom: 4 }}>வணக்கம், அரவிந்த்.</h1>
            <p className="display" style={{ fontStyle: 'italic', fontSize: 16, color: 'var(--ink-3)' }}>Welcome back, Aravind. You've read 14 books this year.</p>
          </div>

          {/* Cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 30 }}>
            {/* Profile card */}
            <div className="frame" style={{ padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--burgundy)', color: '#FFE8B8', display: 'grid', placeItems: 'center', fontFamily: 'var(--tamil)', fontSize: 30, position: 'relative' }}>
                    அ
                    <span style={{ position: 'absolute', inset: -4, border: '1px solid var(--gold)', borderRadius: 999, opacity: .6 }}/>
                  </div>
                  <div>
                    <h2 className="ta-display" style={{ fontSize: 26, color: 'var(--ink)', marginBottom: 2 }}>அரவிந்த் சுப்பிரமணியன்</h2>
                    <p style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>aravind@example.com</p>
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12 }}>Edit</button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge"><span style={{ width: 5, height: 5, background: 'var(--peacock)', borderRadius: 999, marginRight: 4 }}/>Reader</span>
                <span className="badge badge-gold">★ Verified</span>
                <span className="badge badge-premium">Premium · சந்தா</span>
                <span className="badge badge-chip ta">சென்னை</span>
                <span className="badge badge-chip" style={{ fontFamily: 'var(--display)', fontStyle: 'italic' }}>since Mar 2024</span>
              </div>
            </div>

            {/* Subscription status */}
            <div className="frame frame-burgundy" style={{ padding: 28, background: 'linear-gradient(180deg, var(--paper) 0%, rgba(241,230,210,.4) 100%)' }}>
              <div className="eyebrow" style={{ marginBottom: 12 }}>தற்போதைய திட்டம் · Current Plan</div>
              <h3 className="ta-display" style={{ fontSize: 28, color: 'var(--burgundy)', marginBottom: 6 }}>பிரீமியம்</h3>
              <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-2)', marginBottom: 14 }}>Premium · ₹99 / month</p>
              <hr className="rule" style={{ margin: '12px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--display)', fontSize: 12 }}>
                <span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>Renews</span>
                <span style={{ color: 'var(--ink)' }}>May 18, 2026</span>
              </div>
              <button className="btn btn-ghost" style={{ width: '100%', padding: 8, fontSize: 12, marginTop: 16 }}>Manage subscription</button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="frame" style={{ padding: 0, marginBottom: 30 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {[
                { v: '14', ta: 'வாசித்த நூல்கள்', en: 'BOOKS · 2026' },
                { v: '38', ta: 'வாசித்த கட்டுரைகள்', en: 'ARTICLES READ' },
                { v: '142', ta: 'மணி நேரம்', en: 'HOURS' },
                { v: '7',  ta: 'அலமாரியில்', en: 'IN BOOKSHELF' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '20px 22px', borderRight: i < 3 ? '1px solid var(--border-soft)' : 'none' }}>
                  <div className="display" style={{ fontSize: 34, color: 'var(--burgundy)' }}>{s.v}</div>
                  <div className="ta" style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>{s.ta}</div>
                  <div className="eyebrow eyebrow-sm" style={{ marginTop: 2, color: 'var(--gold)' }}>{s.en}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue reading */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <h2 className="ta-display" style={{ fontSize: 22, color: 'var(--ink)' }}>தொடர்ந்து வாசி</h2>
              <span style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)' }}>Continue reading</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
              {KM_BOOKS.slice(0, 4).map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: 12, border: '1px solid var(--border)', background: 'var(--paper)' }}>
                  <div style={{ width: 56, flexShrink: 0 }}>
                    <Cover {...b} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h4 className="ta-display" style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{b.ta}</h4>
                    <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', marginTop: 6 }}>p. {[412,28,108,234][i]} / {b.pages}</p>
                    <div style={{ height: 2, background: 'var(--border)', marginTop: 8 }}>
                      <div style={{ width: ['18%','6%','38%','54%'][i], height: '100%', background: 'var(--burgundy)' }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 404
// ─────────────────────────────────────────────────────────

function NotFoundScreen({ lang = 'ta', setLang }) {
  return (
    <div className="km paper-warm" style={{ width: 1280, minHeight: 900, display: 'flex', flexDirection: 'column' }}>
      <PublicHeader active="" lang={lang} onLang={setLang} />

      <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
        {/* Gopuram backdrop */}
        <div style={{ position: 'absolute', left: '50%', bottom: 60, transform: 'translateX(-50%)', opacity: .9 }}>
          <Gopuram width={900} height={180} opacity={0.12} />
        </div>

        <div style={{ textAlign: 'center', maxWidth: 640, position: 'relative' }}>
          {/* Big 404 with Tamil */}
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <div className="display" style={{
              fontSize: 200, lineHeight: 1, color: 'var(--burgundy)', letterSpacing: '-0.04em',
              opacity: .9,
            }}>
              404
            </div>
            {/* Small Tamil overlay */}
            <div style={{ position: 'absolute', top: '50%', right: -8, transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'right center', fontFamily: 'var(--tamil)', fontSize: 13, color: 'var(--gold)', letterSpacing: '0.3em' }}>
              நாள்கணக்கு · இல்லை
            </div>
          </div>

          <div className="trim-thin" style={{ marginInline: 'auto', width: 200, marginBottom: 22 }}/>

          <h1 className="ta-display" style={{ fontSize: 44, color: 'var(--ink)', marginBottom: 12, lineHeight: 1.2 }}>
            இந்தப் பக்கம் இல்லை.
          </h1>
          <p className="display" style={{ fontStyle: 'italic', fontSize: 19, color: 'var(--ink-2)', marginBottom: 8 }}>
            This page does not exist.
          </p>
          <p className="ta" style={{ fontSize: 14, color: 'var(--ink-3)', maxWidth: 440, margin: '14px auto 36px', lineHeight: 1.8 }}>
            தேடிய பக்கம் இடம் பெயர்ந்திருக்கலாம், அல்லது இனி இல்லாமல் போயிருக்கலாம். நூலகத்துக்குத் திரும்பி வாசிப்பைத் தொடருங்கள்.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button className="btn btn-primary">
              <span className="ta">முகப்புக்கு</span>
            </button>
            <button className="btn btn-ghost">
              <span className="ta">புத்தகங்களை மேய்</span>
              <span style={{ opacity: .6 }}>→</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { LoginScreen, RegisterScreen, AccountScreen, NotFoundScreen });
