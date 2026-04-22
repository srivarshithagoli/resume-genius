// Lightweight in-memory resume store (no persistence required for frontend demo)
import { useEffect, useState } from "react";

export type ResumeData = {
  header: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    role: string;
    start: string;
    end: string;
    location: string;
    bullets: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    stack: string;
    link: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    start: string;
    end: string;
    details: string;
  }>;
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    other: string;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
  }>;
};

export const emptyResume: ResumeData = {
  header: { name: "", title: "", email: "", phone: "", location: "", website: "", summary: "" },
  experience: [],
  projects: [],
  education: [],
  skills: { languages: "", frameworks: "", tools: "", other: "" },
  achievements: [],
};

export const sampleResume: ResumeData = {
  header: {
    name: "Alex Rivera",
    title: "Full-Stack Engineer",
    email: "alex@rivera.dev",
    phone: "+1 (415) 555-0188",
    location: "San Francisco, CA",
    website: "rivera.dev",
    summary:
      "Engineer with 5+ years building performant web products. Passionate about DX, type-safe systems, and shipping fast.",
  },
  experience: [
    {
      id: "e1",
      company: "Northwind Labs",
      role: "Senior Software Engineer",
      start: "2022",
      end: "Present",
      location: "Remote",
      bullets:
        "• Led migration to a TanStack Start monorepo, cutting cold start by 48%.\n• Mentored 4 engineers and shipped the new billing surface used by 30k orgs.",
    },
    {
      id: "e2",
      company: "Loop & Co",
      role: "Software Engineer",
      start: "2020",
      end: "2022",
      location: "NYC",
      bullets:
        "• Built realtime dashboards in React + WebSockets serving 12M events/day.\n• Owned the design system migration to Tailwind + tokens.",
    },
  ],
  projects: [
    {
      id: "p1",
      name: "Inkwell",
      stack: "TypeScript, Postgres, tRPC",
      link: "github.com/alex/inkwell",
      description:
        "Open-source CMS for indie writers. 2.4k stars, used by 600+ blogs.",
    },
  ],
  education: [
    {
      id: "ed1",
      school: "UC Berkeley",
      degree: "B.S. Computer Science",
      start: "2016",
      end: "2020",
      details: "Honors. Coursework: Distributed Systems, HCI, Compilers.",
    },
  ],
  skills: {
    languages: "TypeScript, Python, Go, SQL",
    frameworks: "React, TanStack, Next.js, FastAPI",
    tools: "Postgres, Redis, Docker, AWS, Vercel",
    other: "GraphQL, WebSockets, OpenTelemetry",
  },
  achievements: [
    {
      id: "a1",
      title: "Speaker, ReactConf",
      description: "Talk on edge-first React rendering — 40k views.",
      date: "2024",
    },
  ],
};

const KEY = "resume:data";

export function loadResume(): ResumeData {
  if (typeof window === "undefined") return emptyResume;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ResumeData;
  } catch {}
  return emptyResume;
}

export function saveResume(data: ResumeData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
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

export const uid = () => Math.random().toString(36).slice(2, 9);
