import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

const getFileExtension = (originalname = "") =>
  originalname.split(".").pop().toLowerCase();

export async function extractResumeText(buffer, originalname = "") {
  try {
    const fileExt = getFileExtension(originalname);

    if (fileExt === "doc") {
      throw new Error(
        "Legacy .doc files are not supported for automatic parsing. Please upload a PDF or DOCX resume.",
      );
    }

    if (fileExt === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }

    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
    }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      text += pageText + "\n";
    }

    return text;
  } catch (error) {
    console.error("Resume Extraction Error:", error);
    throw error;
  }
}

export async function extractPdfText(buffer) {
  return extractResumeText(buffer, "resume.pdf");
}
