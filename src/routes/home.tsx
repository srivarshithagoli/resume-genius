import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FilePlus2,
  FileText,
  KeyRound,
  LoaderCircle,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { parseResumeWithGemini } from "@/lib/gemini-resume";
import { emptyResume, saveResume } from "@/lib/resume-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Choose your start — Inkwell" },
      {
        name: "description",
        content: "Start a new resume from scratch or upload an existing one.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadName, setUploadName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setApiKey(localStorage.getItem("resume:gemini-api-key") ?? "");
  }, []);

  const goScratch = () => {
    saveResume(emptyResume);
    navigate({ to: "/editor" });
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    setUploadName(f.name);
    setUploadError(null);
    setIsParsing(true);

    try {
      const parsedResume = await parseResumeWithGemini(f, apiKey);
      localStorage.setItem("resume:gemini-api-key", apiKey.trim());
      saveResume(parsedResume);
      navigate({ to: "/editor" });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not parse this resume.");
    } finally {
      setIsParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onApiKeyChange = (value: string) => {
    setApiKey(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("resume:gemini-api-key", value);
    }
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-60"
        >
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
            You can build a resume from a blank slate, or hand us an existing one and we&apos;ll
            fill the form for you.
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
          <div className="ink-border group relative overflow-hidden rounded-3xl bg-card p-10 text-left transition hover:-translate-y-1 hover:lime-shadow">
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
              Drop a PDF or DOCX. Gemini will read it and prefill every template field for you.
            </p>

            <div className="mt-6 rounded-2xl border border-foreground/15 bg-background/50 p-4">
              <label
                htmlFor="gemini-key"
                className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
              >
                <KeyRound className="h-3.5 w-3.5" />
                Gemini API key
              </label>
              <input
                id="gemini-key"
                type="password"
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="Paste your own API key"
                className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/10"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Stored only in this browser and sent directly to Google Gemini during upload
                parsing.
              </p>
            </div>

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
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    {isParsing && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
                    {isParsing ? "Gemini is reading your resume..." : "Choose another file"}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium">Drop file or click to browse</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    PDF, DOC, DOCX, TXT up to 5MB
                  </div>
                </>
              )}
              <input
                id="resume-upload"
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </label>

            {uploadError && (
              <div className="mt-4 flex gap-2 rounded-2xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
