import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/community/LoginForm";
import { getCurrentMember } from "@/lib/community/session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Log in",
  description: "Log in to your Community account.",
  path: "/community/login",
  noIndex: true,
});

export default async function LoginPage() {
  const member = await getCurrentMember();
  if (member) {
    redirect("/community/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <header className="mb-8 text-center">
        <p className="section-label mb-3">Community</p>
        <h1 className="text-2xl font-bold text-foreground">Log in</h1>
      </header>
      <LoginForm />
    </div>
  );
}
