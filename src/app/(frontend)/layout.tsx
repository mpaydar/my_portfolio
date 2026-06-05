import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mohammad Bayat · Systems Engineer",
  description:
    "Personal blog and portfolio — scalable systems, agentic applications, distributed computation and storage. Projects, live demos, resume, and daily technical posts.",
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
