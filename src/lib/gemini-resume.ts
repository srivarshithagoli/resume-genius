import { normalizeResumeData, type ResumeData } from "./resume-store";

const GEMINI_MODEL = "gemini-3-flash-preview";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const resumeJsonSchema = {
  type: "object",
  properties: {
    header: {
      type: "object",
      properties: {
        name: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        linkedin: { type: "string" },
        github: { type: "string" },
        website: { type: "string" },
        codeProfile: { type: "string" },
        location: { type: "string" },
      },
      required: [
        "name",
        "phone",
        "email",
        "linkedin",
        "github",
        "website",
        "codeProfile",
        "location",
      ],
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          institution: { type: "string" },
          location: { type: "string" },
          degree: { type: "string" },
          score: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
        },
        required: ["institution", "location", "degree", "score", "start", "end"],
      },
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          organization: { type: "string" },
          location: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          bullets: { type: "string" },
        },
        required: ["role", "organization", "location", "start", "end", "bullets"],
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          github: { type: "string" },
          live: { type: "string" },
          bullets: { type: "string" },
          techStack: { type: "string" },
        },
        required: ["name", "start", "end", "github", "live", "bullets", "techStack"],
      },
    },
    achievements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
        },
        required: ["text"],
      },
    },
    skills: {
      type: "object",
      properties: {
        languages: { type: "string" },
        frontend: { type: "string" },
        backend: { type: "string" },
        databases: { type: "string" },
        tools: { type: "string" },
      },
      required: ["languages", "frontend", "backend", "databases", "tools"],
    },
  },
  required: ["header", "education", "experience", "projects", "achievements", "skills"],
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

const prompt = `SYSTEM PROMPT: You are an expert ATS resume editor for software engineering resumes.
Your job is to read the uploaded resume, rewrite it section-by-section, and output only clean JSON that fits the provided schema.

PRIMARY GOAL
- Produce a polished one-page technical resume that is ATS-friendly, readable, keyword-rich, and honest.
- Rewrite weak lines into concise impact bullets. Do not merely copy bad wording.
- Never invent employers, dates, degrees, links, metrics, tools, or achievements that are not supported by the resume.
- If a fact is missing, use an empty string or omit the item through an empty array according to the schema.

SECTION RULES
- Header: extract name, phone, email, LinkedIn, GitHub, website, coding profile, and location.
- Education: keep institution, location, degree, score, and date range concise.
- Experience: rewrite bullets into crisp impact lines.
- Projects: rewrite bullets into crisp impact lines and keep techStack as a comma-separated list of strong technical keywords only.
- Achievements: keep short, concrete, and outcome-oriented.
- Skills: include only strong technical keywords grouped into languages, frontend, backend, databases, and tools.

BULLET RULES FOR EXPERIENCE AND PROJECTS
- Every bullet must be one line. Use newline-separated strings without bullet symbols.
- Each bullet must be concise: ideally 12-20 words, maximum 24 words.
- Each bullet must follow this structure semantically:
  "Built/Developed/Implemented/Optimized [what] using [technical keywords], resulting in [impact]."
- Prefer "Built X using Y, improving Z" or "Implemented X using Y, reducing Z".
- Each bullet should contain exactly 3 strong, job-searchable technical keywords when the source supports them.
- Keywords should be natural inside the sentence, not stuffed randomly.
- Every bullet must include an impact. Use real metrics when present. If no metric exists, use a concrete qualitative impact such as latency, reliability, visibility, automation, throughput, accuracy, usability, or deployment speed.
- Do not write vague bullets like "worked on features", "helped with development", or "used various technologies".

KEYWORD QUALITY RULES
- Prefer common job-description keywords: Java, Python, JavaScript, TypeScript, C++, SQL, HTML, CSS, React, Node.js, Express, Spring Boot, REST APIs, GraphQL, PostgreSQL, MySQL, MongoDB, Redis, Kafka, Docker, Kubernetes, AWS, Azure, GCP, Firebase, Firestore, Linux, Git, CI/CD.
- Normalize platform wrappers to searchable underlying keywords when truthful:
  Supabase -> PostgreSQL
  Supabase Auth -> Authentication
  Supabase Storage -> Object Storage
  Railway/Render/Vercel/Netlify -> omit from skills and techStack unless deployment is the main achievement
  Axios/fetch clients -> REST APIs
  Prisma/ORM wrappers -> SQL or PostgreSQL/MySQL when the database is known
- If useful, include the wrapper only in parentheses after the keyword, for example "PostgreSQL (Supabase)", never as the primary keyword.
- Avoid niche or low-value words unless they are central to the target role. Omit noise such as VS Code, Visual Studio Code, JetBrains, IntelliJ, PyCharm, WebStorm, Render, Railway, Vercel, Netlify, Axios, npm, yarn, pnpm, Bun, Postman, shadcn, UI libraries, package managers, and generic hosting tools.
- Do not include "tools" that are merely editors, IDEs, HTTP clients, component libraries, package managers, or deployment websites.
- For skills.tools, include only serious engineering tools/platforms such as Git, Docker, Kubernetes, Linux, CI/CD, AWS, Azure, GCP, Terraform, Jenkins, GitHub Actions.

TECH STACK RULES
- Project techStack must be a short comma-separated keyword list only.
- Include 3-7 strong keywords per project.
- Use common searchable names, not marketing wrappers or random libraries.
- Do not include markdown, labels, explanations, or filler in techStack. The template will render the "Tech Stack:" label.

STYLE RULES
- Use strong action verbs: Built, Developed, Implemented, Optimized, Automated, Integrated, Designed.
- Keep grammar clean and professional.
- Keep every line dense with meaning, but not keyword-stuffed.
- Prefer measurable outcomes, but never fabricate numbers.
- Do not use first person.
- Do not output markdown. Do not output commentary.

OUTPUT RULES
- Return only JSON matching the provided schema exactly.
- Use empty strings for missing scalar fields and empty arrays for missing sections.
- Split date ranges into start and end when possible.
- Put LeetCode, Codeforces, HackerRank, CodeChef, or similar coding links in header.codeProfile.
- Map skills into languages, frontend, backend, databases, and tools.
- Use newline-separated strings for experience and project bullets.`;

function mimeFor(file: File) {
  if (file.type) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (name.endsWith(".doc")) return "application/msword";
  if (name.endsWith(".txt")) return "text/plain";
  if (name.endsWith(".md")) return "text/markdown";
  return "application/octet-stream";
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return trimmed;
}

export async function parseResumeWithGemini(file: File, apiKey: string): Promise<ResumeData> {
  const trimmedKey = apiKey.trim();
  if (!trimmedKey) {
    throw new Error("Add your Gemini API key before uploading a resume.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Please upload a resume under 5MB.");
  }

  const encodedFile = await fileToBase64(file);
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": trimmedKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeFor(file),
                data: encodedFile,
              },
            },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseJsonSchema: resumeJsonSchema,
        temperature: 0.2,
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as GeminiResponse;
  if (!response.ok) {
    throw new Error(payload.error?.message || "Gemini could not read this resume.");
  }

  const text = payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .find((part) => part.text)?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response for this resume.");
  }

  try {
    return normalizeResumeData(JSON.parse(extractJson(text)));
  } catch {
    throw new Error("Gemini returned a response that could not be converted into the resume form.");
  }
}
