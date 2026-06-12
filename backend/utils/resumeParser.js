import { extractPdfText } from "./pdfExtractor.js";

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

export async function parseResume(
  buffer,
  originalname,
  groqClient
) {
  let text = "";

  try {
    text = await extractPdfText(buffer);
  } catch (err) {
    console.error(
      "PDF parsing failed:",
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

          messages: [
            {
              role: "system",
              content: `
You are an ATS Resume Analyzer.

Return ONLY valid JSON.

{
  "extractedSkills":["React","Node.js"],
  "atsScore":85
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

    resumeText: text,
  };
}