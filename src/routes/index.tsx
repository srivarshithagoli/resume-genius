import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, FileText, Wand2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inkwell — The AI resume builder for engineers" },
      {
        name: "description",
        content:
          "Build a sharp, modern tech resume in minutes. Section-aware AI assistance, beautiful templates, zero fluff.",
      },
      { property: "og:title", content: "Inkwell — AI resume builder" },
      {
        property: "og:description",
        content: "Build a sharp, modern tech resume in minutes.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="grain absolute inset-0" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
            <span className="font-display text-lg font-bold text-background">i</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">inkwell</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#features" className="hover:opacity-60">Features</a>
          <a href="#how" className="hover:opacity-60">How it works</a>
          <a href="#pricing" className="hover:opacity-60">Pricing</a>
        </nav>
        <Link
          to="/home"
          className="ink-border rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition hover:opacity-90"
        >
          Sign in
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-24 md:px-10 md:pt-20 md:pb-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <div className="ink-border mb-8 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs font-medium uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              <span>AI-assisted, section by section</span>
            </div>
            <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-light leading-[0.95] tracking-tight">
              Resumes
              <br />
              that actually
              <br />
              <span className="italic" style={{ color: "var(--lime)" }}>
                get read.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground md:text-xl">
              The opinionated resume builder for engineers. Bring your experience,
              we&apos;ll handle the typesetting — and let AI sharpen each section.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/home"
                className="ink-border lime-shadow group inline-flex items-center gap-3 rounded-full px-7 py-4 text-base font-semibold transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                style={{ backgroundColor: "var(--lime)", color: "var(--lime-foreground)" }}
              >
                Get started
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <span className="text-sm text-muted-foreground">
                Free · No signup required
              </span>
            </div>
          </div>

          {/* Resume preview card */}
          <div className="relative md:col-span-5">
            <div className="ink-border absolute -top-4 -left-4 rotate-[-3deg] rounded-lg bg-card p-3 lime-shadow">
              <div className="font-mono text-xs uppercase tracking-widest">v.04 — final_FINAL.pdf</div>
            </div>
            <div className="ink-border relative rotate-[2deg] rounded-lg bg-card p-8 shadow-2xl">
              <div className="border-b border-foreground/20 pb-4">
                <div className="font-display text-2xl font-semibold">Alex Rivera</div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Full-Stack Engineer · SF
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["EXPERIENCE", "Northwind Labs — Sr. Engineer"],
                  ["PROJECTS", "Inkwell — OSS CMS · 2.4k★"],
                  ["EDUCATION", "UC Berkeley, B.S. CS"],
                  ["SKILLS", "TS · Go · React · Postgres"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {label}
                    </div>
                    <div className="text-sm">{val}</div>
                  </div>
                ))}
              </div>
              <div
                className="absolute -right-3 -bottom-3 rotate-[-6deg] rounded-md px-3 py-1 font-mono text-xs font-bold ink-border"
                style={{ backgroundColor: "var(--lime)" }}
              >
                AI ✶ POLISHED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="relative z-10 border-y border-foreground/15 bg-foreground py-4 text-background overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-8 pr-8 font-display text-2xl">
              {["Concise", "Typed", "Tasteful", "Fast", "ATS-friendly", "Open", "Yours"].map((w) => (
                <span key={w} className="flex items-center gap-8">
                  <span className="italic">{w}</span>
                  <span style={{ color: "var(--lime)" }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="mb-16 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            / 01 — features
          </div>
          <h2 className="mt-3 font-display text-5xl font-light leading-tight md:text-6xl">
            Built for the way <span className="italic">engineers</span> actually write resumes.
          </h2>
        </div>
        <div className="grid gap-px bg-foreground/15 ink-border rounded-2xl overflow-hidden md:grid-cols-3">
          {[
            {
              icon: <FileText className="h-6 w-6" />,
              title: "Start clean.",
              body: "From scratch or by importing an existing PDF. The form mirrors how recruiters scan.",
            },
            {
              icon: <Wand2 className="h-6 w-6" />,
              title: "Section-aware AI.",
              body: "AI helps with one section at a time — bullet points, summaries, project blurbs.",
            },
            {
              icon: <Sparkles className="h-6 w-6" />,
              title: "Type that breathes.",
              body: "Editorial typography, generous spacing, ATS-readable export.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-card p-10">
              <div
                className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: "var(--lime)" }}
              >
                {f.icon}
              </div>
              <h3 className="font-display text-2xl font-medium">{f.title}</h3>
              <p className="mt-3 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div
          className="ink-border relative overflow-hidden rounded-3xl bg-foreground p-12 text-background md:p-20"
        >
          <div className="grain absolute inset-0 opacity-10" />
          <div className="relative grid items-end gap-8 md:grid-cols-2">
            <h2 className="font-display text-5xl font-light leading-[0.95] md:text-7xl">
              Your next role
              <br />
              starts on
              <span className="italic" style={{ color: "var(--lime)" }}> one page.</span>
            </h2>
            <div className="md:text-right">
              <Link
                to="/home"
                className="inline-flex items-center gap-3 rounded-full px-8 py-5 text-base font-semibold transition hover:opacity-90"
                style={{ backgroundColor: "var(--lime)", color: "var(--lime-foreground)" }}
              >
                Get started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-foreground/15 px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Inkwell. Crafted with care.</div>
          <div className="font-mono text-xs uppercase tracking-widest">v0.1 — preview</div>
        </div>
      </footer>
    </div>
  );
}
