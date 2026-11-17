export type Resource = {
  id: number;
  title: string;
  description: string;
  format: "PDF" | "PPTX" | "DOCX" | "DOC" | "PPT" | "IMAGE";
  size: string;
  date: string;
  year: string;
  subject: string;
  resourceType: string;
  fileName: string;
  downloadUrl: string | null;
};

export const sampleResources: Resource[] = [
  {
    id: 1,
    title: "Introduction to Core Concepts",
    description: "An introductory medical learning resource.",
    format: "PDF",
    size: "2.4 MB",
    date: "Sample entry",
    year: "fourth-year",
    subject: "internal-medicine",
    resourceType: "lecture-notes",
    fileName: "introduction-to-core-concepts.pdf",
downloadUrl: null,
  },
  {
    id: 2,
    title: "Clinical Learning and Practice",
    description: "A demonstration presentation for clinical learning.",
    format: "PPTX",
    size: "4.1 MB",
    date: "Sample entry",
    year: "fifth-year",
    subject: "renal-medicine",
    resourceType: "lecture-notes",
    fileName: "clinical-learning-and-practice.pptx",
downloadUrl: null,
  },
  {
    id: 3,
    title: "Revision and Study Guide",
    description: "A demonstration resource for revision.",
    format: "PDF",
    size: "1.8 MB",
    date: "Sample entry",
    year: "sixth-year",
    subject: "paediatrics",
    resourceType: "clinical-guidelines",
    fileName: "revision-and-study-guide.pdf",
downloadUrl: null,
  },
];