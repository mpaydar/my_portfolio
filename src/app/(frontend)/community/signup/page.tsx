import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SignupForm from "@/components/community/SignupForm";
import { getCurrentMember } from "@/lib/community/session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign up",
  description: "Create a free Community account.",
  path: "/community/signup",
  noIndex: true,
});

export default async function SignupPage() {
  const member = await getCurrentMember();
  if (member) {
    redirect("/community/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <header className="mb-8 text-center">
        <p className="section-label mb-3">Community</p>
        <h1 className="text-2xl font-bold text-foreground">
          Create your account
        </h1>
      </header>
      <SignupForm />
    </div>
  );
}
