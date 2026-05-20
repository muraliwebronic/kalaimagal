// Kalaimagal — Main canvas

const { useState } = React;

function App() {
  const [lang, setLang] = useState('ta');

  // Each artboard hosts one screen
  // Artboards are 1280 wide, heights vary
  const W = 1280;

  return (
    <DesignCanvas>
      <DCSection id="public" title="Public · பொது தளம்" subtitle="Editorial homepage, library, book detail">
        <DCArtboard id="home"      label="01 · Homepage · /"            width={W} height={3240}>
          <HomeScreen lang={lang} setLang={setLang} />
        </DCArtboard>
        <DCArtboard id="books"     label="02 · Books grid · /books"     width={W} height={2340}>
          <BooksGridScreen lang={lang} setLang={setLang} />
        </DCArtboard>
        <DCArtboard id="book"      label="03 · Book detail · /books/[slug]" width={W} height={2050}>
          <BookDetailScreen lang={lang} setLang={setLang} />
        </DCArtboard>
      </DCSection>

      <DCSection id="reading" title="Reading · வாசிப்பு" subtitle="The PDF reader paywall and the long-form blog reader">
        <DCArtboard id="reader"    label="04 · PDF reader (paywall) · /books/[slug]/read" width={W} height={1080}>
          <ReaderScreen lang={lang} setLang={setLang} paywall={true} />
        </DCArtboard>
        <DCArtboard id="blog"      label="05 · Blog detail · /blogs/[slug]" width={W} height={2480}>
          <BlogDetailScreen lang={lang} setLang={setLang} />
        </DCArtboard>
      </DCSection>

      <DCSection id="auth" title="Auth & Account · பயனர் கணக்கு" subtitle="Sign in, register, manage subscription">
        <DCArtboard id="login"     label="06 · Login · /login"          width={W} height={900}>
          <LoginScreen lang={lang} setLang={setLang} />
        </DCArtboard>
        <DCArtboard id="register"  label="07 · Register · /register"    width={W} height={960}>
          <RegisterScreen lang={lang} setLang={setLang} />
        </DCArtboard>
        <DCArtboard id="account"   label="08 · Account · /account"      width={W} height={900}>
          <AccountScreen lang={lang} setLang={setLang} />
        </DCArtboard>
      </DCSection>

      <DCSection id="system" title="System · 404" subtitle="Editorial error state">
        <DCArtboard id="404"       label="09 · Not Found · /404"         width={W} height={900}>
          <NotFoundScreen lang={lang} setLang={setLang} />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
