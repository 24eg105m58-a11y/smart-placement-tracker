import { extractResumeText } from "./pdfExtractor.js";

const POPULAR_SKILLS = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "JavaScript",
  "HTML",
  "CSS",
  "Python",
  "Java",
  "C++",
  "C#",
  "Git",
  "Docker",
  "AWS",
  "TypeScript",
  "Redux",
  "Bootstrap",
  "Tailwind",
  "Machine Learning",
  "Data Structures",
  "Algorithms",
  "Go",
  "Rust",
  "Angular",
  "Vue",
  "Next.js",
  "Firebase",
  "PostgreSQL",
  "Flutter",
];

const SECTIONS = [
  "education",
  "experience",
  "project",
  "skill",
  "achievement",
  "language",
];

const BRANCH_PATTERNS = [
  { pattern: /\b(computer science|cse|c\.s\.e\.|cs)\b/i, value: "CSE" },
  { pattern: /\b(information technology|it)\b/i, value: "IT" },
  { pattern: /\b(electronics and communication|ece)\b/i, value: "ECE" },
  { pattern: /\b(electrical and electronics|eee)\b/i, value: "EEE" },
  { pattern: /\b(mechanical|mech)\b/i, value: "MECH" },
  { pattern: /\b(civil)\b/i, value: "CIVIL" },
  { pattern: /\b(ai & ml|aiml|artificial intelligence|machine learning)\b/i, value: "AIML" },
  { pattern: /\b(data science|ds)\b/i, value: "DS" },
];

const normalizeWhitespace = (value = "") => value.replace(/\s+/g, " ").trim();

const extractProfileFields = (text) => {
  const normalized = normalizeWhitespace(text);
  const lowerText = normalized.toLowerCase();

  const emailMatch = normalized.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  );

  const linkedInMatch = normalized.match(
    /https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i,
  );

  const githubMatch = normalized.match(
    /https?:\/\/(?:www\.)?github\.com\/[^\s)]+/i,
  );

  const cgpaMatch = normalized.match(
    /\b(?:cgpa|gpa)\s*[:=-]?\s*(\d(?:\.\d{1,2})?)/i,
  );

  const graduationYearMatch = normalized.match(
    /\b(20\d{2})\b/g,
  );

  const rollNumberMatch = normalized.match(
    /\b(?:roll\s*number|roll\s*no|registration\s*no|reg\s*no)\s*[:=-]?\s*([a-z0-9/-]+)/i,
  );

  const branchMatch = BRANCH_PATTERNS.find((item) => item.pattern.test(lowerText));

  const graduationYear = graduationYearMatch
    ? graduationYearMatch
        .map((year) => Number(year))
        .find((year) => year >= 2020 && year <= 2035) || null
    : null;

  return {
    email: emailMatch?.[0] || "",
    linkedIn: linkedInMatch?.[0] || "",
    github: githubMatch?.[0] || "",
    cgpa: cgpaMatch?.[1] ? Number(cgpaMatch[1]) : null,
    graduationYear,
    rollNumber: rollNumberMatch?.[1]?.toUpperCase() || "",
    branch: branchMatch?.value || "",
  };
};

export async function parseResume(
  buffer,
  originalname,
  groqClient
) {
  let text = "";

  try {
    text = await extractResumeText(buffer, originalname);
  } catch (err) {
    console.error(
      "Resume parsing failed:",
      err.message
    );

    text = `Resume uploaded: ${originalname}`;
  }

  if (text.trim().length < 50) {
    text += "\nResume content appears limited.";
  }

  // =========================
  // AI ATS ANALYSIS
  // =========================

  if (groqClient) {
    try {
      const response =
        await groqClient.chat.completions.create({
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          max_tokens: 280,

          messages: [
            {
              role: "system",
              content: `
You are an ATS Resume Analyzer.

Return ONLY valid JSON.

{
  "extractedSkills":["React","Node.js"],
  "atsScore":85,
  "profileData":{
    "branch":"CSE",
    "cgpa":8.2,
    "graduationYear":2026,
    "linkedIn":"",
    "github":"",
    "rollNumber":""
  }
}
              `,
            },
            {
              role: "user",
              content: text,
            },
          ],
        });

      const raw =
        response?.choices?.[0]?.message?.content ||
        "{}";

      const cleaned = raw
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (
        Array.isArray(parsed.extractedSkills) &&
        typeof parsed.atsScore === "number"
      ) {
        const aiProfile = parsed.profileData && typeof parsed.profileData === "object"
          ? parsed.profileData
          : {};
        const regexProfile = extractProfileFields(text);

        return {
          extractedSkills:
            parsed.extractedSkills,

          atsScore: Math.min(
            100,
            Math.max(
              0,
              Math.round(parsed.atsScore)
            )
          ),

          profileData: {
            branch: regexProfile.branch || aiProfile.branch || "",
            cgpa: regexProfile.cgpa ?? aiProfile.cgpa ?? null,
            graduationYear:
              regexProfile.graduationYear ??
              aiProfile.graduationYear ??
              null,
            linkedIn: regexProfile.linkedIn || aiProfile.linkedIn || "",
            github: regexProfile.github || aiProfile.github || "",
            rollNumber: regexProfile.rollNumber || aiProfile.rollNumber || "",
            email: regexProfile.email || aiProfile.email || "",
          },

          resumeText: text,
        };
      }
    } catch (err) {
      console.log(
        "Groq analysis failed:",
        err.message
      );
    }
  }

  // =========================
  // FALLBACK PARSER
  // =========================

  const lowerText = text.toLowerCase();

  const matchedSkills = [];

  for (const skill of POPULAR_SKILLS) {
    const regex = new RegExp(
      `\\b${skill.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      )}\\b`,
      "i"
    );

    if (regex.test(lowerText)) {
      matchedSkills.push(skill);
    }
  }

  let sectionCount = 0;

  for (const section of SECTIONS) {
    if (lowerText.includes(section)) {
      sectionCount++;
    }
  }

  const skillPoints = Math.min(
    40,
    matchedSkills.length * 4
  );

  const sectionPoints = Math.min(
    25,
    sectionCount * 5
  );

  const atsScore = Math.min(
    100,
    35 + skillPoints + sectionPoints
  );

  return {
    extractedSkills:
      matchedSkills.length > 0
        ? matchedSkills
        : ["General Software Engineering"],

    atsScore,

    profileData: extractProfileFields(text),

    resumeText: text,
  };
}
