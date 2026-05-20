import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { AuthCard } from "@/components/layout/AuthCard";

export const metadata = {
  title: "மீண்டும் வரவேற்கிறோம் — Welcome back",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <AuthCard
      titleTa="மீண்டும் வரவேற்கிறோம்"
      titleEn="Welcome back"
      footer={
        <>
          <span data-bi lang="ta">புதியவரா? </span>
          <span data-bi lang="en">New to Kalaimagal? </span>
          <Link
            href="/register"
            className="text-burgundy hover:text-kumkum ta"
            style={{ borderBottom: "1px solid currentColor", fontStyle: "normal" }}
          >
            <span data-bi lang="ta">இங்கே பதிவு செய்</span>
            <span data-bi lang="en">Register here</span>
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthCard>
  );
}
