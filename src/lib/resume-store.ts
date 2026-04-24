// Lightweight browser resume store. The shape mirrors resume-template.html.
import { useEffect, useState } from "react";

export type ResumeData = {
  header: {
    name: string;
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    website: string;
    codeProfile: string;
    location: string;
  };
  education: Array<{
    id: string;
    institution: string;
    location: string;
    degree: string;
    score: string;
    start: string;
    end: string;
  }>;
  experience: Array<{
    id: string;
    role: string;
    organization: string;
    location: string;
    start: string;
    end: string;
    bullets: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    start: string;
    end: string;
    github: string;
    live: string;
    bullets: string;
    techStack: string;
  }>;
  achievements: Array<{
    id: string;
    text: string;
  }>;
  skills: {
    languages: string;
    frontend: string;
    backend: string;
    databases: string;
    tools: string;
  };
};

export const uid = () => Math.random().toString(36).slice(2, 9);

export const emptyResume: ResumeData = {
  header: {
    name: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    website: "",
    codeProfile: "",
    location: "",
  },
  education: [],
  experience: [],
  projects: [],
  achievements: [],
  skills: {
    languages: "",
    frontend: "",
    backend: "",
    databases: "",
    tools: "",
  },
};

export const sampleResume: ResumeData = {
  header: {
    name: "John Placeholder",
    phone: "+00-0000000000",
    email: "email@example.com",
    linkedin: "https://linkedin.com/in/example",
    github: "https://github.com/example",
    website: "https://example.com",
    codeProfile: "https://leetcode.com/example",
    location: "City, Country",
  },
  education: [
    {
      id: "ed1",
      institution: "Example Institute of Technology",
      location: "City, Country",
      degree: "Bachelor of Technology in Sample Field",
      score: "9.0/10.0",
      start: "2022",
      end: "2026",
    },
  ],
  experience: [
    {
      id: "e1",
      role: "Software Intern",
      organization: "Example Organization",
      location: "City",
      start: "Jan 2025",
      end: "Mar 2025",
      bullets:
        "Worked on placeholder frontend and backend features.\nDeveloped sample APIs for demonstration purposes.\nIntegrated mock services into test workflows.\nImproved efficiency of example systems.",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Sample Project One",
      start: "2025",
      end: "Present",
      github: "https://github.com/example/sample-one",
      live: "https://sample-one.example.com",
      bullets:
        "Built a demo application with placeholder functionality.\nImplemented mock workflows and event handling.\nDesigned scalable example architecture.",
      techStack: "ExampleJS, DemoFramework, SampleDB",
    },
    {
      id: "p2",
      name: "Sample Project Two",
      start: "2024",
      end: "2025",
      github: "https://github.com/example/sample-two",
      live: "https://sample-two.example.com",
      bullets:
        "Created placeholder dashboards and UI components.\nBuilt backend logic using mock datasets.\nOptimized sample workflows for performance.",
      techStack: "PlaceholderTech, UIFramework, MockAPI",
    },
  ],
  achievements: [
    { id: "a1", text: "Achieved a high rank in a sample coding contest." },
    { id: "a2", text: "Completed multiple example certifications." },
    { id: "a3", text: "Recognized for problem-solving in mock environments." },
    { id: "a4", text: "Participated in simulated hackathons." },
  ],
  skills: {
    languages: "ExampleLang, DemoScript, Sample++",
    frontend: "HTML, CSS, ExampleJS",
    backend: "DemoFramework, SampleServer",
    databases: "MockDB, ExampleSQL",
    tools: "Git, Docker, PlaceholderTool",
  },
};

const KEY = "resume:data";

const stringValue = (value: unknown) => (typeof value === "string" ? value : "");

const normalizeLines = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((item) => stringValue(item))
        .filter(Boolean)
        .join("\n")
    : stringValue(value);

export function normalizeResumeData(value: unknown): ResumeData {
  if (!value || typeof value !== "object") return emptyResume;

  const raw = value as Record<string, unknown>;
  const header = (raw.header ?? {}) as Record<string, unknown>;
  const skills = (raw.skills ?? {}) as Record<string, unknown>;

  return {
    header: {
      name: stringValue(header.name),
      phone: stringValue(header.phone),
      email: stringValue(header.email),
      linkedin: stringValue(header.linkedin),
      github: stringValue(header.github),
      website: stringValue(header.website),
      codeProfile: stringValue(header.codeProfile),
      location: stringValue(header.location),
    },
    education: Array.isArray(raw.education)
      ? raw.education.map((item) => {
          const entry = (item ?? {}) as Record<string, unknown>;
          return {
            id: stringValue(entry.id) || uid(),
            institution: stringValue(entry.institution ?? entry.school),
            location: stringValue(entry.location),
            degree: stringValue(entry.degree),
            score: stringValue(entry.score),
            start: stringValue(entry.start),
            end: stringValue(entry.end),
          };
        })
      : [],
    experience: Array.isArray(raw.experience)
      ? raw.experience.map((item) => {
          const entry = (item ?? {}) as Record<string, unknown>;
          return {
            id: stringValue(entry.id) || uid(),
            role: stringValue(entry.role),
            organization: stringValue(entry.organization ?? entry.company),
            location: stringValue(entry.location),
            start: stringValue(entry.start),
            end: stringValue(entry.end),
            bullets: normalizeLines(entry.bullets),
          };
        })
      : [],
    projects: Array.isArray(raw.projects)
      ? raw.projects.map((item) => {
          const entry = (item ?? {}) as Record<string, unknown>;
          return {
            id: stringValue(entry.id) || uid(),
            name: stringValue(entry.name),
            start: stringValue(entry.start),
            end: stringValue(entry.end),
            github: stringValue(entry.github),
            live: stringValue(entry.live ?? entry.link),
            bullets: normalizeLines(entry.bullets ?? entry.description),
            techStack: stringValue(entry.techStack ?? entry.stack),
          };
        })
      : [],
    achievements: Array.isArray(raw.achievements)
      ? raw.achievements.map((item) => {
          const entry = (item ?? {}) as Record<string, unknown>;
          return {
            id: stringValue(entry.id) || uid(),
            text: stringValue(entry.text ?? entry.title ?? entry.description),
          };
        })
      : [],
    skills: {
      languages: stringValue(skills.languages),
      frontend: stringValue(skills.frontend ?? skills.frameworks),
      backend: stringValue(skills.backend),
      databases: stringValue(skills.databases),
      tools: stringValue(skills.tools ?? skills.other),
    },
  };
}

export function loadResume(): ResumeData {
  if (typeof window === "undefined") return emptyResume;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalizeResumeData(JSON.parse(raw));
  } catch {
    return emptyResume;
  }
  return emptyResume;
}

export function saveResume(data: ResumeData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(normalizeResumeData(data)));
}

export function useResume() {
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadResume());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveResume(data);
  }, [data, hydrated]);

  return [data, setData] as const;
}
