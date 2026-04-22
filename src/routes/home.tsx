import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, FilePlus2, Upload, FileText } from "lucide-react";
import { useRef, useState } from "react";
import { emptyResume, sampleResume, saveResume } from "@/lib/resume-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Choose your start — Inkwell" },
      { name: "description", content: "Start a new resume from scratch or upload an existing one." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);

  const goScratch = () => {
    saveResume(emptyResume);
    navigate({ to: "/editor" });
  };

  const onFile = (f: File | null) => {
    if (!f) return;
    setUploadName(f.name);
    // Frontend-only: simulate AI parse by autofilling sample data
    saveResume(sampleResume);
    setTimeout(() => navigate({ to: "/editor" }), 700);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="grain absolute inset-0" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
            <span className="font-display text-lg font-bold text-background">i</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">inkwell</span>
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-60">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-24 md:px-10 md:pt-20">
        <div className="mb-16 max-w-3xl">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            / step 01 — pick your starting point
          </div>
          <h1 className="mt-3 font-display text-5xl font-light leading-[1] md:text-7xl">
            How would you like to <span className="italic">begin?</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            You can build a resume from a blank slate, or hand us an existing one and
            we&apos;ll fill the form for you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Scratch */}
          <button
            onClick={goScratch}
            className="ink-border group relative overflow-hidden rounded-3xl bg-card p-10 text-left transition hover:-translate-y-1 hover:lime-shadow"
          >
            <div className="mb-12 flex items-start justify-between">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--lime)" }}
              >
                <FilePlus2 className="h-7 w-7" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                option a
              </span>
            </div>
            <h2 className="font-display text-4xl font-medium leading-tight">
              Start from <span className="italic">scratch</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              A guided form with every section a strong tech resume needs. Fill it your way.
            </p>
            <div className="mt-10 inline-flex items-center gap-2 text-sm font-semibold">
              Begin blank
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </button>

          {/* Upload */}
          <div
            className="ink-border group relative overflow-hidden rounded-3xl bg-card p-10 text-left transition hover:-translate-y-1 hover:lime-shadow"
          >
            <div className="mb-12 flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background">
                <Upload className="h-7 w-7" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                option b
              </span>
            </div>
            <h2 className="font-display text-4xl font-medium leading-tight">
              Upload an <span className="italic">existing resume</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Drop a PDF or DOCX. We&apos;ll parse it and prefill every section for you.
            </p>

            <label
              htmlFor="resume-upload"
              className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foreground/30 bg-background/40 p-8 text-center transition hover:border-foreground"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                onFile(e.dataTransfer.files?.[0] ?? null);
              }}
            >
              <FileText className="mb-3 h-6 w-6" />
              {uploadName ? (
                <>
                  <div className="font-medium">{uploadName}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Parsing… redirecting</div>
                </>
              ) : (
                <>
                  <div className="font-medium">Drop file or click to browse</div>
                  <div className="mt-1 text-xs text-muted-foreground">PDF, DOCX up to 5MB</div>
                </>
              )}
              <input
                id="resume-upload"
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
