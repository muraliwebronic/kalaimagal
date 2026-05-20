import Link from "next/link";
import { RegisterForm } from "./RegisterForm";
import { AuthCard } from "@/components/layout/AuthCard";

export const metadata = { title: "சேருங்கள் — Join Kalaimagal" };

export default function RegisterPage() {
  return (
    <AuthCard
      titleTa="கலைமகளில் சேருங்கள்"
      titleEn="Join Kalaimagal"
      subtitleTa="இலவசத் திட்டத்தில் ஒவ்வொரு புத்தகத்தின் முதல் 2 பக்கங்கள், அனைத்து கட்டுரைகள்."
      subtitleEn="The free tier gives you the first 2 pages of every book + all articles."
      footer={
        <>
          <span data-bi lang="ta">ஏற்கனவே வாசகரா? </span>
          <span data-bi lang="en">Already a reader? </span>
          <Link
            href="/login"
            className="text-burgundy hover:text-kumkum ta"
            style={{ borderBottom: "1px solid currentColor", fontStyle: "normal" }}
          >
            <span data-bi lang="ta">உள்நுழை</span>
            <span data-bi lang="en">Sign in</span>
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
