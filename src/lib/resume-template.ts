import templateHtml from "../../resume-template.html?raw";
import type { ResumeData } from "./resume-store";

const templateStyles = templateHtml.match(/<style>([\s\S]*?)<\/style>/i)?.[1]?.trim() ?? "";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const escapeAttr = escapeHtml;

const stripBullet = (line: string) => line.replace(/^\s*[-*•]\s*/, "").trim();

const lines = (value: string) => value.split(/\r?\n/).map(stripBullet).filter(Boolean);

const dateRange = (start: string, end: string) => [start, end].filter(Boolean).join(" &ndash; ");

const hrefFor = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(mailto:|tel:|https?:\/\/)/i.test(trimmed)) return trimmed;
  if (trimmed.includes("@") && !trimmed.includes("/")) return `mailto:${trimmed}`;
  return `https://${trimmed}`;
};

const link = (label: string, href: string) => {
  const normalized = hrefFor(href);
  if (!normalized) return "";
  return `<a href="${escapeAttr(normalized)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
};

const list = (items: string[]) => {
  if (!items.length) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
};

const section = (title: string, body: string) => {
  if (!body.trim()) return "";
  return `
  <div class="section">
    <div class="section-title">${escapeHtml(title)}</div>
    ${body}
  </div>`;
};

const scoreLabel = (score: string) => {
  const trimmed = score.trim();
  if (!trimmed) return "";
  return /(cgpa|gpa|grade|percent|percentage|%)/i.test(trimmed) ? trimmed : `CGPA: ${trimmed}`;
};

const estimateWrappedLines = (value: string, charsPerLine = 105) =>
  lines(value).reduce(
    (total, line) => total + Math.max(1, Math.ceil(line.length / charsPerLine)),
    0,
  );

function resumeDensity(data: ResumeData) {
  const bulletLines =
    data.experience.reduce((total, entry) => total + estimateWrappedLines(entry.bullets), 0) +
    data.projects.reduce((total, entry) => total + estimateWrappedLines(entry.bullets), 0) +
    data.achievements.reduce(
      (total, entry) => total + Math.max(1, Math.ceil(entry.text.length / 105)),
      0,
    );
  const entryCount = data.education.length + data.experience.length + data.projects.length;
  const skillLines = Object.values(data.skills).filter(Boolean).length;
  const score = bulletLines + entryCount * 2.2 + skillLines + 3;

  if (score > 62 || data.projects.length + data.experience.length >= 9) return "ultra-compact";
  if (score > 38 || data.projects.length + data.experience.length >= 6) return "compact";
  return "";
}

function renderHeader(data: ResumeData) {
  const h = data.header;
  const contact = [
    escapeHtml(h.phone),
    link(h.email, h.email),
    link("LinkedIn", h.linkedin),
    link("GitHub", h.github),
    link("Website", h.website),
    link("CodeProfile", h.codeProfile),
    escapeHtml(h.location),
  ].filter(Boolean);

  return `
  <h1>${escapeHtml(h.name || "Your Name")}</h1>
  ${contact.length ? `<div class="contact">${contact.join(" | ")}</div>` : ""}`;
}

function renderEducation(data: ResumeData) {
  return section(
    "Education",
    data.education
      .map((entry) => {
        const degreeParts = [entry.degree, scoreLabel(entry.score)].filter(Boolean).join(" | ");
        return `
    <div class="entry">
      <div class="row">
        <strong>${escapeHtml(entry.institution)}</strong>
        <span>${escapeHtml(entry.location)}</span>
      </div>
      <div class="row italic">
        <span>${escapeHtml(degreeParts)}</span>
        <span>${dateRange(escapeHtml(entry.start), escapeHtml(entry.end))}</span>
      </div>
    </div>`;
      })
      .join(""),
  );
}

function renderExperience(data: ResumeData) {
  return section(
    "Experience",
    data.experience
      .map(
        (entry) => `
    <div class="entry">
      <div class="row">
        <strong>${escapeHtml(entry.role)}</strong>
        <span>${dateRange(escapeHtml(entry.start), escapeHtml(entry.end))}</span>
      </div>
      <div class="italic">${escapeHtml(entry.organization)}${entry.location ? ` &mdash; ${escapeHtml(entry.location)}` : ""}</div>
      ${list(lines(entry.bullets))}
    </div>`,
      )
      .join(""),
  );
}

function renderProjects(data: ResumeData) {
  return section(
    "Projects",
    data.projects
      .map((entry) => {
        const links = [link("GitHub", entry.github), link("Live", entry.live)]
          .filter(Boolean)
          .join(" | ");
        return `
    <div class="entry">
      <div class="row">
        <div><strong>${escapeHtml(entry.name)}</strong>${links ? ` <span class="links">${links}</span>` : ""}</div>
        <span>${dateRange(escapeHtml(entry.start), escapeHtml(entry.end))}</span>
      </div>
      ${list(lines(entry.bullets))}
      ${entry.techStack ? `<div class="tech-stack"><strong>Tech Stack:</strong> ${escapeHtml(entry.techStack)}</div>` : ""}
    </div>`;
      })
      .join(""),
  );
}

function renderAchievements(data: ResumeData) {
  return section(
    "Achievements",
    list(data.achievements.map((entry) => entry.text).filter(Boolean)),
  );
}

function renderSkills(data: ResumeData) {
  const s = data.skills;
  return section(
    "Technical Skills",
    [
      s.languages &&
        `<div class="skills-line"><strong>Languages:</strong> ${escapeHtml(s.languages)}</div>`,
      s.frontend &&
        `<div class="skills-line"><strong>Frontend:</strong> ${escapeHtml(s.frontend)}</div>`,
      s.backend &&
        `<div class="skills-line"><strong>Backend:</strong> ${escapeHtml(s.backend)}</div>`,
      s.databases &&
        `<div class="skills-line"><strong>Databases:</strong> ${escapeHtml(s.databases)}</div>`,
      s.tools && `<div class="skills-line"><strong>Tools:</strong> ${escapeHtml(s.tools)}</div>`,
    ]
      .filter(Boolean)
      .join(""),
  );
}

export function renderResumeHtml(data: ResumeData) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Resume</title>
<style>
${templateStyles}

@page {
  size: A4;
  margin: 0;
}

@media print {
  body {
    background: white;
  }

  .page {
    margin: 0;
  }
}
</style>
</head>
<body>
<div class="page ${resumeDensity(data)}">
${renderHeader(data)}
${renderEducation(data)}
${renderExperience(data)}
${renderProjects(data)}
${renderAchievements(data)}
${renderSkills(data)}
</div>
</body>
</html>`;
}

export function printResume(data: ResumeData) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Your browser blocked the print window. Please allow popups and try again.");
  }

  printWindow.document.open();
  printWindow.document.write(renderResumeHtml(data));
  printWindow.document.close();
  printWindow.focus();

  window.setTimeout(() => {
    printWindow.print();
  }, 250);
}
