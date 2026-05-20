import { RegisterForm } from "./RegisterForm";

export const metadata = { title: "பதிவு செய்க — Register" };

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 lang="ta" className="font-heading text-3xl tracking-tight">
          ஒரு கணக்கை உருவாக்கு
        </h1>
        <p lang="en" className="mt-1 text-sm italic text-muted-foreground">
          Create your account
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
