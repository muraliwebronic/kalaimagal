import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "உள்நுழைய — Login",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return <LoginPageInner searchParams={searchParams} />;
}

async function LoginPageInner({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 lang="ta" className="font-heading text-3xl tracking-tight">
          மீண்டும் வரவேற்கிறோம்
        </h1>
        <p lang="en" className="mt-1 text-sm italic text-muted-foreground">
          Welcome back
        </p>
      </div>
      <LoginForm next={params.next} />
    </div>
  );
}
