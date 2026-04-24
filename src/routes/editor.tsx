import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Download,
  FolderGit2,
  GraduationCap,
  Plus,
  Sparkles,
  Trash2,
  Trophy,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { printResume, renderResumeHtml } from "@/lib/resume-template";
import { useResume, uid, type ResumeData } from "@/lib/resume-store";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Editor — Inkwell" },
      { name: "description", content: "Edit your resume section by section." },
    ],
  }),
  component: Editor,
});

type SectionKey = "header" | "education" | "experience" | "projects" | "achievements" | "skills";

const SECTIONS: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "header", label: "Header", icon: <User className="h-4 w-4" /> },
  { key: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { key: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  { key: "projects", label: "Projects", icon: <FolderGit2 className="h-4 w-4" /> },
  { key: "achievements", label: "Achievements", icon: <Trophy className="h-4 w-4" /> },
  { key: "skills", label: "Skills", icon: <Wrench className="h-4 w-4" /> },
];

function Editor() {
  const [data, setData] = useResume();
  const [active, setActive] = useState<SectionKey>("header");
  const [printError, setPrintError] = useState<string | null>(null);

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const onPrint = () => {
    setPrintError(null);
    try {
      printResume(data);
    } catch (error) {
      setPrintError(error instanceof Error ? error.message : "Could not open the print dialog.");
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="grain pointer-events-none absolute inset-0" />

      <header className="sticky top-0 z-20 border-b border-foreground/15 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-6">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-60"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
                <span className="font-display text-sm font-bold text-background">i</span>
              </div>
              <span className="font-display text-lg font-semibold">inkwell</span>
              <span className="ml-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                / editor
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground sm:block">
              autosaved
            </span>
            <button
              type="button"
              onClick={onPrint}
              className="ink-border inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Export PDF
            </button>
          </div>
        </div>
      </header>

      {printError && (
        <div className="relative z-10 mx-auto mt-4 flex max-w-[1400px] gap-2 px-6 text-sm text-destructive md:px-10">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{printError}</span>
        </div>
      )}

      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-8 px-6 py-8 md:grid-cols-[240px_1fr_minmax(0,460px)] md:px-10">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            sections
          </div>
          <nav className="mt-4 space-y-1">
            {SECTIONS.map((s) => {
              const isActive = active === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(s.key)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    isActive ? "bg-foreground text-background" : "hover:bg-card"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {s.icon}
                    {s.label}
                  </span>
                  {isActive && <span style={{ color: "var(--lime)" }}>●</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="ink-border rounded-2xl bg-card p-6 md:p-10">
            <SectionEditor section={active} data={data} update={update} />
          </div>
        </main>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              template preview
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              A4
            </span>
          </div>
          <ResumePreview data={data} />
        </aside>
      </div>
    </div>
  );
}

function SectionEditor({
  section,
  data,
  update,
}: {
  section: SectionKey;
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            / editing
          </div>
          <h2 className="mt-1 font-display text-4xl font-light tracking-tight">
            {SECTIONS.find((s) => s.key === section)?.label}
          </h2>
        </div>
        <TemplateAIPill section={section} />
      </div>

      {section === "header" && <HeaderForm data={data} update={update} />}
      {section === "education" && <EducationForm data={data} update={update} />}
      {section === "experience" && <ExperienceForm data={data} update={update} />}
      {section === "projects" && <ProjectsForm data={data} update={update} />}
      {section === "achievements" && <AchievementsForm data={data} update={update} />}
      {section === "skills" && <SkillsForm data={data} update={update} />}
    </div>
  );
}

function TemplateAIPill({ section }: { section: SectionKey }) {
  return (
    <div
      title={`Gemini upload parsing maps directly into ${section}`}
      className="ink-border hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold md:inline-flex"
      style={{ backgroundColor: "var(--lime)" }}
    >
      <Sparkles className="h-3.5 w-3.5" />
      Gemini-ready
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-foreground focus:ring-2 focus:ring-foreground/10";

function HeaderForm({
  data,
  update,
}: {
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  const h = data.header;
  const set = (k: keyof typeof h, v: string) => update("header", { ...h, [k]: v });

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Full name">
        <input
          className={inputCls}
          value={h.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="John Placeholder"
        />
      </Field>
      <Field label="Phone">
        <input
          className={inputCls}
          value={h.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+00-0000000000"
        />
      </Field>
      <Field label="Email">
        <input
          className={inputCls}
          value={h.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="email@example.com"
        />
      </Field>
      <Field label="Location">
        <input
          className={inputCls}
          value={h.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="City, Country"
        />
      </Field>
      <Field label="LinkedIn">
        <input
          className={inputCls}
          value={h.linkedin}
          onChange={(e) => set("linkedin", e.target.value)}
          placeholder="linkedin.com/in/username"
        />
      </Field>
      <Field label="GitHub">
        <input
          className={inputCls}
          value={h.github}
          onChange={(e) => set("github", e.target.value)}
          placeholder="github.com/username"
        />
      </Field>
      <Field label="Website">
        <input
          className={inputCls}
          value={h.website}
          onChange={(e) => set("website", e.target.value)}
          placeholder="yourname.dev"
        />
      </Field>
      <Field label="Code profile">
        <input
          className={inputCls}
          value={h.codeProfile}
          onChange={(e) => set("codeProfile", e.target.value)}
          placeholder="leetcode.com/username"
        />
      </Field>
    </div>
  );
}

function RepeatableHeader({
  count,
  noun,
  onAdd,
}: {
  count: number;
  noun: string;
  onAdd: () => void;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {count} {noun}
        {count === 1 ? "" : "s"}
      </span>
      <button
        type="button"
        onClick={onAdd}
        className="ink-border inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-semibold hover:bg-foreground hover:text-background"
      >
        <Plus className="h-3.5 w-3.5" /> Add {noun}
      </button>
    </div>
  );
}

function ItemCard({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <div className="relative rounded-xl border border-border bg-background/60 p-5">
      <button
        type="button"
        onClick={onDelete}
        className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

function EducationForm({
  data,
  update,
}: {
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  const list = data.education;
  const set = (id: string, k: keyof ResumeData["education"][number], v: string) =>
    update(
      "education",
      list.map((entry) => (entry.id === id ? { ...entry, [k]: v } : entry)),
    );
  const add = () =>
    update("education", [
      ...list,
      { id: uid(), institution: "", location: "", degree: "", score: "", start: "", end: "" },
    ]);
  const remove = (id: string) =>
    update(
      "education",
      list.filter((entry) => entry.id !== id),
    );

  return (
    <div>
      <RepeatableHeader count={list.length} noun="entry" onAdd={add} />
      <div className="space-y-4">
        {list.map((entry) => (
          <ItemCard key={entry.id} onDelete={() => remove(entry.id)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Institution">
                <input
                  className={inputCls}
                  value={entry.institution}
                  onChange={(e) => set(entry.id, "institution", e.target.value)}
                />
              </Field>
              <Field label="City / Country">
                <input
                  className={inputCls}
                  value={entry.location}
                  onChange={(e) => set(entry.id, "location", e.target.value)}
                />
              </Field>
              <Field label="Degree / field">
                <input
                  className={inputCls}
                  value={entry.degree}
                  onChange={(e) => set(entry.id, "degree", e.target.value)}
                  placeholder="B.Tech in Computer Science"
                />
              </Field>
              <Field label="CGPA / score">
                <input
                  className={inputCls}
                  value={entry.score}
                  onChange={(e) => set(entry.id, "score", e.target.value)}
                  placeholder="9.0/10.0"
                />
              </Field>
              <Field label="Start">
                <input
                  className={inputCls}
                  value={entry.start}
                  onChange={(e) => set(entry.id, "start", e.target.value)}
                  placeholder="2022"
                />
              </Field>
              <Field label="End">
                <input
                  className={inputCls}
                  value={entry.end}
                  onChange={(e) => set(entry.id, "end", e.target.value)}
                  placeholder="2026"
                />
              </Field>
            </div>
          </ItemCard>
        ))}
        {list.length === 0 && <EmptyState noun="education" />}
      </div>
    </div>
  );
}

function ExperienceForm({
  data,
  update,
}: {
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  const list = data.experience;
  const set = (id: string, k: keyof ResumeData["experience"][number], v: string) =>
    update(
      "experience",
      list.map((entry) => (entry.id === id ? { ...entry, [k]: v } : entry)),
    );
  const add = () =>
    update("experience", [
      ...list,
      { id: uid(), role: "", organization: "", location: "", start: "", end: "", bullets: "" },
    ]);
  const remove = (id: string) =>
    update(
      "experience",
      list.filter((entry) => entry.id !== id),
    );

  return (
    <div>
      <RepeatableHeader count={list.length} noun="role" onAdd={add} />
      <div className="space-y-4">
        {list.map((entry) => (
          <ItemCard key={entry.id} onDelete={() => remove(entry.id)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Role">
                <input
                  className={inputCls}
                  value={entry.role}
                  onChange={(e) => set(entry.id, "role", e.target.value)}
                  placeholder="Software Intern"
                />
              </Field>
              <Field label="Organization">
                <input
                  className={inputCls}
                  value={entry.organization}
                  onChange={(e) => set(entry.id, "organization", e.target.value)}
                  placeholder="Example Organization"
                />
              </Field>
              <Field label="Start">
                <input
                  className={inputCls}
                  value={entry.start}
                  onChange={(e) => set(entry.id, "start", e.target.value)}
                  placeholder="Jan 2025"
                />
              </Field>
              <Field label="End">
                <input
                  className={inputCls}
                  value={entry.end}
                  onChange={(e) => set(entry.id, "end", e.target.value)}
                  placeholder="Mar 2025"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="City">
                  <input
                    className={inputCls}
                    value={entry.location}
                    onChange={(e) => set(entry.id, "location", e.target.value)}
                    placeholder="City"
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Bullets" hint="One per line">
                  <textarea
                    className={`${inputCls} min-h-[120px] font-mono text-xs`}
                    value={entry.bullets}
                    onChange={(e) => set(entry.id, "bullets", e.target.value)}
                    placeholder="Worked on placeholder frontend and backend features."
                  />
                </Field>
              </div>
            </div>
          </ItemCard>
        ))}
        {list.length === 0 && <EmptyState noun="experience" />}
      </div>
    </div>
  );
}

function ProjectsForm({
  data,
  update,
}: {
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  const list = data.projects;
  const set = (id: string, k: keyof ResumeData["projects"][number], v: string) =>
    update(
      "projects",
      list.map((entry) => (entry.id === id ? { ...entry, [k]: v } : entry)),
    );
  const add = () =>
    update("projects", [
      ...list,
      { id: uid(), name: "", start: "", end: "", github: "", live: "", bullets: "", techStack: "" },
    ]);
  const remove = (id: string) =>
    update(
      "projects",
      list.filter((entry) => entry.id !== id),
    );

  return (
    <div>
      <RepeatableHeader count={list.length} noun="project" onAdd={add} />
      <div className="space-y-4">
        {list.map((entry) => (
          <ItemCard key={entry.id} onDelete={() => remove(entry.id)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Project name">
                <input
                  className={inputCls}
                  value={entry.name}
                  onChange={(e) => set(entry.id, "name", e.target.value)}
                  placeholder="Sample Project One"
                />
              </Field>
              <Field label="Tech stack">
                <input
                  className={inputCls}
                  value={entry.techStack}
                  onChange={(e) => set(entry.id, "techStack", e.target.value)}
                  placeholder="React, Node, PostgreSQL"
                />
              </Field>
              <Field label="Start">
                <input
                  className={inputCls}
                  value={entry.start}
                  onChange={(e) => set(entry.id, "start", e.target.value)}
                  placeholder="2025"
                />
              </Field>
              <Field label="End">
                <input
                  className={inputCls}
                  value={entry.end}
                  onChange={(e) => set(entry.id, "end", e.target.value)}
                  placeholder="Present"
                />
              </Field>
              <Field label="GitHub">
                <input
                  className={inputCls}
                  value={entry.github}
                  onChange={(e) => set(entry.id, "github", e.target.value)}
                  placeholder="github.com/username/project"
                />
              </Field>
              <Field label="Live">
                <input
                  className={inputCls}
                  value={entry.live}
                  onChange={(e) => set(entry.id, "live", e.target.value)}
                  placeholder="project.example.com"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Bullets" hint="One per line">
                  <textarea
                    className={`${inputCls} min-h-[110px] font-mono text-xs`}
                    value={entry.bullets}
                    onChange={(e) => set(entry.id, "bullets", e.target.value)}
                    placeholder="Built a demo application with placeholder functionality."
                  />
                </Field>
              </div>
            </div>
          </ItemCard>
        ))}
        {list.length === 0 && <EmptyState noun="projects" />}
      </div>
    </div>
  );
}

function AchievementsForm({
  data,
  update,
}: {
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  const list = data.achievements;
  const set = (id: string, v: string) =>
    update(
      "achievements",
      list.map((entry) => (entry.id === id ? { ...entry, text: v } : entry)),
    );
  const add = () => update("achievements", [...list, { id: uid(), text: "" }]);
  const remove = (id: string) =>
    update(
      "achievements",
      list.filter((entry) => entry.id !== id),
    );

  return (
    <div>
      <RepeatableHeader count={list.length} noun="achievement" onAdd={add} />
      <div className="space-y-4">
        {list.map((entry) => (
          <ItemCard key={entry.id} onDelete={() => remove(entry.id)}>
            <Field label="Achievement bullet">
              <textarea
                className={`${inputCls} min-h-[80px] pr-10`}
                value={entry.text}
                onChange={(e) => set(entry.id, e.target.value)}
                placeholder="Achieved a high rank in a sample coding contest."
              />
            </Field>
          </ItemCard>
        ))}
        {list.length === 0 && <EmptyState noun="achievements" />}
      </div>
    </div>
  );
}

function SkillsForm({
  data,
  update,
}: {
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  const s = data.skills;
  const set = (k: keyof typeof s, v: string) => update("skills", { ...s, [k]: v });

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Languages">
        <input
          className={inputCls}
          value={s.languages}
          onChange={(e) => set("languages", e.target.value)}
          placeholder="JavaScript, Python, Java"
        />
      </Field>
      <Field label="Frontend">
        <input
          className={inputCls}
          value={s.frontend}
          onChange={(e) => set("frontend", e.target.value)}
          placeholder="HTML, CSS, React"
        />
      </Field>
      <Field label="Backend">
        <input
          className={inputCls}
          value={s.backend}
          onChange={(e) => set("backend", e.target.value)}
          placeholder="Node.js, Express, Spring Boot"
        />
      </Field>
      <Field label="Databases">
        <input
          className={inputCls}
          value={s.databases}
          onChange={(e) => set("databases", e.target.value)}
          placeholder="PostgreSQL, MongoDB"
        />
      </Field>
      <div className="md:col-span-2">
        <Field label="Tools">
          <input
            className={inputCls}
            value={s.tools}
            onChange={(e) => set("tools", e.target.value)}
            placeholder="Git, Docker, AWS"
          />
        </Field>
      </div>
    </div>
  );
}

function EmptyState({ noun }: { noun: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <p className="text-sm text-muted-foreground">No {noun} yet. Add your first entry above.</p>
    </div>
  );
}

const A4_PREVIEW_WIDTH = 794;
const A4_PREVIEW_HEIGHT = 1123;

function ResumePreview({ data }: { data: ResumeData }) {
  const html = useMemo(() => renderResumeHtml(data), [data]);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.58);

  useEffect(() => {
    const updateScale = () => {
      const width = previewRef.current?.clientWidth ?? A4_PREVIEW_WIDTH;
      setScale(Math.min(1, width / A4_PREVIEW_WIDTH));
    };

    updateScale();

    if (!previewRef.current || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateScale);
      return () => window.removeEventListener("resize", updateScale);
    }

    const observer = new ResizeObserver(updateScale);
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={previewRef}
      className="ink-border relative overflow-hidden rounded-lg bg-[#e5e5e5] shadow-2xl"
      style={{ height: A4_PREVIEW_HEIGHT * scale }}
    >
      <iframe
        title="Resume template preview"
        srcDoc={html}
        className="origin-top-left border-0 bg-white"
        style={{
          width: A4_PREVIEW_WIDTH,
          height: A4_PREVIEW_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      />
    </div>
  );
}
