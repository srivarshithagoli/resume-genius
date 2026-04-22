import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Download,
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  Trophy,
} from "lucide-react";
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

type SectionKey = "header" | "experience" | "projects" | "education" | "skills" | "achievements";

const SECTIONS: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "header", label: "Header", icon: <User className="h-4 w-4" /> },
  { key: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  { key: "projects", label: "Projects", icon: <FolderGit2 className="h-4 w-4" /> },
  { key: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { key: "skills", label: "Skills", icon: <Wrench className="h-4 w-4" /> },
  { key: "achievements", label: "Achievements", icon: <Trophy className="h-4 w-4" /> },
];

function Editor() {
  const [data, setData] = useResume();
  const [active, setActive] = useState<SectionKey>("header");

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  return (
    <div className="relative min-h-screen bg-background">
      <div className="grain pointer-events-none absolute inset-0" />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-foreground/15 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-6">
            <Link to="/home" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-60">
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
              className="ink-border inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background hover:opacity-90"
            >
              <Download className="h-4 w-4" /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-8 px-6 py-8 md:grid-cols-[240px_1fr_minmax(0,460px)] md:px-10">
        {/* Side nav */}
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
                  onClick={() => setActive(s.key)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-foreground text-background"
                      : "hover:bg-card"
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

        {/* Form */}
        <main className="min-w-0">
          <div className="ink-border rounded-2xl bg-card p-6 md:p-10">
            <SectionEditor section={active} data={data} update={update} />
          </div>
        </main>

        {/* Live preview */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              live preview
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

/* ---------------- section editor ---------------- */

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
        <AIButton section={section} />
      </div>

      {section === "header" && <HeaderForm data={data} update={update} />}
      {section === "experience" && <ExperienceForm data={data} update={update} />}
      {section === "projects" && <ProjectsForm data={data} update={update} />}
      {section === "education" && <EducationForm data={data} update={update} />}
      {section === "skills" && <SkillsForm data={data} update={update} />}
      {section === "achievements" && <AchievementsForm data={data} update={update} />}
    </div>
  );
}

function AIButton({ section }: { section: SectionKey }) {
  return (
    <button
      title={`AI suggestions for ${section}`}
      className="ink-border inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition hover:lime-shadow"
      style={{ backgroundColor: "var(--lime)" }}
    >
      <Sparkles className="h-3.5 w-3.5" />
      AI ✶ improve {section}
    </button>
  );
}

/* ---------------- form fields ---------------- */

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
      <div className="mb-1.5 flex items-baseline justify-between">
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
        <input className={inputCls} value={h.name} onChange={(e) => set("name", e.target.value)} placeholder="Alex Rivera" />
      </Field>
      <Field label="Title">
        <input className={inputCls} value={h.title} onChange={(e) => set("title", e.target.value)} placeholder="Full-Stack Engineer" />
      </Field>
      <Field label="Email">
        <input className={inputCls} value={h.email} onChange={(e) => set("email", e.target.value)} placeholder="you@domain.dev" />
      </Field>
      <Field label="Phone">
        <input className={inputCls} value={h.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 ..." />
      </Field>
      <Field label="Location">
        <input className={inputCls} value={h.location} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco, CA" />
      </Field>
      <Field label="Website">
        <input className={inputCls} value={h.website} onChange={(e) => set("website", e.target.value)} placeholder="rivera.dev" />
      </Field>
      <div className="md:col-span-2">
        <Field label="Summary" hint={`${h.summary.length}/280`}>
          <textarea
            className={`${inputCls} min-h-[110px] resize-y`}
            value={h.summary}
            onChange={(e) => set("summary", e.target.value)}
            maxLength={280}
            placeholder="Two crisp sentences about who you are and what you build."
          />
        </Field>
      </div>
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

function ExperienceForm({
  data,
  update,
}: {
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  const list = data.experience;
  const set = (id: string, k: string, v: string) =>
    update("experience", list.map((e) => (e.id === id ? { ...e, [k]: v } : e)));
  const add = () =>
    update("experience", [
      ...list,
      { id: uid(), company: "", role: "", start: "", end: "", location: "", bullets: "" },
    ]);
  const remove = (id: string) => update("experience", list.filter((e) => e.id !== id));

  return (
    <div>
      <RepeatableHeader count={list.length} noun="role" onAdd={add} />
      <div className="space-y-4">
        {list.map((e) => (
          <ItemCard key={e.id} onDelete={() => remove(e.id)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Company">
                <input className={inputCls} value={e.company} onChange={(ev) => set(e.id, "company", ev.target.value)} />
              </Field>
              <Field label="Role">
                <input className={inputCls} value={e.role} onChange={(ev) => set(e.id, "role", ev.target.value)} />
              </Field>
              <Field label="Start">
                <input className={inputCls} value={e.start} onChange={(ev) => set(e.id, "start", ev.target.value)} placeholder="2022" />
              </Field>
              <Field label="End">
                <input className={inputCls} value={e.end} onChange={(ev) => set(e.id, "end", ev.target.value)} placeholder="Present" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Location">
                  <input className={inputCls} value={e.location} onChange={(ev) => set(e.id, "location", ev.target.value)} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Bullets" hint="One per line, lead with a verb">
                  <textarea
                    className={`${inputCls} min-h-[120px] font-mono text-xs`}
                    value={e.bullets}
                    onChange={(ev) => set(e.id, "bullets", ev.target.value)}
                    placeholder="• Shipped X that improved Y by Z%"
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
  const set = (id: string, k: string, v: string) =>
    update("projects", list.map((p) => (p.id === id ? { ...p, [k]: v } : p)));
  const add = () =>
    update("projects", [...list, { id: uid(), name: "", stack: "", link: "", description: "" }]);
  const remove = (id: string) => update("projects", list.filter((p) => p.id !== id));

  return (
    <div>
      <RepeatableHeader count={list.length} noun="project" onAdd={add} />
      <div className="space-y-4">
        {list.map((p) => (
          <ItemCard key={p.id} onDelete={() => remove(p.id)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name">
                <input className={inputCls} value={p.name} onChange={(e) => set(p.id, "name", e.target.value)} />
              </Field>
              <Field label="Link">
                <input className={inputCls} value={p.link} onChange={(e) => set(p.id, "link", e.target.value)} placeholder="github.com/..." />
              </Field>
              <div className="md:col-span-2">
                <Field label="Stack">
                  <input className={inputCls} value={p.stack} onChange={(e) => set(p.id, "stack", e.target.value)} placeholder="TypeScript, Postgres, tRPC" />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    className={`${inputCls} min-h-[90px]`}
                    value={p.description}
                    onChange={(e) => set(p.id, "description", e.target.value)}
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

function EducationForm({
  data,
  update,
}: {
  data: ResumeData;
  update: <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => void;
}) {
  const list = data.education;
  const set = (id: string, k: string, v: string) =>
    update("education", list.map((p) => (p.id === id ? { ...p, [k]: v } : p)));
  const add = () =>
    update("education", [...list, { id: uid(), school: "", degree: "", start: "", end: "", details: "" }]);
  const remove = (id: string) => update("education", list.filter((p) => p.id !== id));

  return (
    <div>
      <RepeatableHeader count={list.length} noun="entry" onAdd={add} />
      <div className="space-y-4">
        {list.map((e) => (
          <ItemCard key={e.id} onDelete={() => remove(e.id)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="School">
                <input className={inputCls} value={e.school} onChange={(ev) => set(e.id, "school", ev.target.value)} />
              </Field>
              <Field label="Degree">
                <input className={inputCls} value={e.degree} onChange={(ev) => set(e.id, "degree", ev.target.value)} />
              </Field>
              <Field label="Start">
                <input className={inputCls} value={e.start} onChange={(ev) => set(e.id, "start", ev.target.value)} />
              </Field>
              <Field label="End">
                <input className={inputCls} value={e.end} onChange={(ev) => set(e.id, "end", ev.target.value)} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Details">
                  <textarea
                    className={`${inputCls} min-h-[80px]`}
                    value={e.details}
                    onChange={(ev) => set(e.id, "details", ev.target.value)}
                  />
                </Field>
              </div>
            </div>
          </ItemCard>
        ))}
        {list.length === 0 && <EmptyState noun="education" />}
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
      <Field label="Languages"><input className={inputCls} value={s.languages} onChange={(e) => set("languages", e.target.value)} placeholder="TypeScript, Go, Python" /></Field>
      <Field label="Frameworks"><input className={inputCls} value={s.frameworks} onChange={(e) => set("frameworks", e.target.value)} placeholder="React, TanStack" /></Field>
      <Field label="Tools"><input className={inputCls} value={s.tools} onChange={(e) => set("tools", e.target.value)} placeholder="Postgres, Docker, AWS" /></Field>
      <Field label="Other"><input className={inputCls} value={s.other} onChange={(e) => set("other", e.target.value)} placeholder="GraphQL, WebSockets" /></Field>
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
  const set = (id: string, k: string, v: string) =>
    update("achievements", list.map((p) => (p.id === id ? { ...p, [k]: v } : p)));
  const add = () => update("achievements", [...list, { id: uid(), title: "", description: "", date: "" }]);
  const remove = (id: string) => update("achievements", list.filter((p) => p.id !== id));

  return (
    <div>
      <RepeatableHeader count={list.length} noun="achievement" onAdd={add} />
      <div className="space-y-4">
        {list.map((a) => (
          <ItemCard key={a.id} onDelete={() => remove(a.id)}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input className={inputCls} value={a.title} onChange={(e) => set(a.id, "title", e.target.value)} />
              </Field>
              <Field label="Date">
                <input className={inputCls} value={a.date} onChange={(e) => set(a.id, "date", e.target.value)} placeholder="2024" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea className={`${inputCls} min-h-[80px]`} value={a.description} onChange={(e) => set(a.id, "description", e.target.value)} />
                </Field>
              </div>
            </div>
          </ItemCard>
        ))}
        {list.length === 0 && <EmptyState noun="achievements" />}
      </div>
    </div>
  );
}

function EmptyState({ noun }: { noun: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <p className="text-sm text-muted-foreground">No {noun} yet — add your first above.</p>
    </div>
  );
}

/* ---------------- preview ---------------- */

function ResumePreview({ data }: { data: ResumeData }) {
  const h = data.header;
  return (
    <div
      className="ink-border rounded-lg bg-white p-6 text-[11px] leading-relaxed text-neutral-900 shadow-2xl"
      style={{ aspectRatio: "1/1.414" }}
    >
      <div className="border-b border-neutral-300 pb-3">
        <div className="font-display text-xl font-semibold leading-none">{h.name || "Your Name"}</div>
        <div className="mt-1 text-[10px] uppercase tracking-widest text-neutral-500">
          {h.title || "Your Title"}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 text-[9px] text-neutral-600">
          {[h.email, h.phone, h.location, h.website].filter(Boolean).join(" · ")}
        </div>
      </div>

      {h.summary && <p className="mt-3 text-[10px] text-neutral-700">{h.summary}</p>}

      {data.experience.length > 0 && (
        <PreviewSection title="Experience">
          {data.experience.map((e) => (
            <div key={e.id} className="mb-2">
              <div className="flex justify-between gap-2">
                <span className="font-semibold">{e.role || "Role"}</span>
                <span className="text-[9px] text-neutral-500">{e.start}—{e.end}</span>
              </div>
              <div className="text-[10px] italic text-neutral-600">{e.company} {e.location && `· ${e.location}`}</div>
              {e.bullets && (
                <pre className="mt-0.5 whitespace-pre-wrap font-sans text-[9.5px] text-neutral-700">{e.bullets}</pre>
              )}
            </div>
          ))}
        </PreviewSection>
      )}

      {data.projects.length > 0 && (
        <PreviewSection title="Projects">
          {data.projects.map((p) => (
            <div key={p.id} className="mb-1.5">
              <div className="flex justify-between gap-2">
                <span className="font-semibold">{p.name}</span>
                <span className="text-[9px] text-neutral-500">{p.link}</span>
              </div>
              <div className="text-[9px] italic text-neutral-600">{p.stack}</div>
              <div className="text-[9.5px] text-neutral-700">{p.description}</div>
            </div>
          ))}
        </PreviewSection>
      )}

      {data.education.length > 0 && (
        <PreviewSection title="Education">
          {data.education.map((e) => (
            <div key={e.id} className="mb-1">
              <div className="flex justify-between gap-2">
                <span className="font-semibold">{e.school}</span>
                <span className="text-[9px] text-neutral-500">{e.start}—{e.end}</span>
              </div>
              <div className="text-[10px] italic text-neutral-600">{e.degree}</div>
              {e.details && <div className="text-[9.5px] text-neutral-700">{e.details}</div>}
            </div>
          ))}
        </PreviewSection>
      )}

      {(data.skills.languages || data.skills.frameworks || data.skills.tools || data.skills.other) && (
        <PreviewSection title="Skills">
          <div className="grid gap-0.5 text-[9.5px]">
            {data.skills.languages && <div><span className="font-semibold">Languages: </span>{data.skills.languages}</div>}
            {data.skills.frameworks && <div><span className="font-semibold">Frameworks: </span>{data.skills.frameworks}</div>}
            {data.skills.tools && <div><span className="font-semibold">Tools: </span>{data.skills.tools}</div>}
            {data.skills.other && <div><span className="font-semibold">Other: </span>{data.skills.other}</div>}
          </div>
        </PreviewSection>
      )}

      {data.achievements.length > 0 && (
        <PreviewSection title="Achievements">
          {data.achievements.map((a) => (
            <div key={a.id} className="mb-1 text-[9.5px]">
              <span className="font-semibold">{a.title}</span>
              {a.date && <span className="text-neutral-500"> · {a.date}</span>}
              {a.description && <div className="text-neutral-700">{a.description}</div>}
            </div>
          ))}
        </PreviewSection>
      )}
    </div>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="mb-1 border-b border-neutral-300 pb-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
        {title}
      </div>
      {children}
    </div>
  );
}
