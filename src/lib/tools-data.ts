export type ToolCategory = "pdf" | "image" | "student" | "form";

export interface Tool {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: ToolCategory;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const categories: { id: ToolCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pdf", label: "PDF Tools" },
  { id: "image", label: "Image Tools" },
  { id: "student", label: "Student Tools" },
  { id: "form", label: "Form Tools" },
];

export const tools: Tool[] = [
  {
    id: "compress-image",
    title: "Compress Image to KB",
    description:
      "Reduce image file size to your desired KB without losing quality. Perfect for form uploads and documents.",
    slug: "compress-image-to-20kb",
    category: "image",
    icon: "📸",
    metaTitle: "Compress Image to KB Online Free | Toolrize",
    metaDescription:
      "Compress images to 20KB, 50KB, 100KB or any size online for free. Reduce JPEG, PNG file size for forms, applications and documents.",
    keywords: [
      "compress image",
      "reduce image size",
      "image compressor",
      "compress image to 20kb",
      "compress photo online",
    ],
  },
  {
    id: "compress-pdf",
    title: "Compress PDF to KB",
    description:
      "Compress large PDF files to a specific KB size. Maintain quality while meeting upload requirements.",
    slug: "compress-pdf-to-100kb",
    category: "pdf",
    icon: "📄",
    metaTitle: "Compress PDF to KB Online Free | Toolrize",
    metaDescription:
      "Compress PDF files to 100KB, 200KB, 500KB online for free. Reduce PDF size for email, forms and uploads without quality loss.",
    keywords: [
      "compress pdf",
      "reduce pdf size",
      "pdf compressor",
      "compress pdf to 100kb",
      "pdf size reducer",
    ],
  },
  {
    id: "passport-photo",
    title: "Passport Size Photo Maker",
    description:
      "Create standard passport size photos instantly. Supports Indian passport, visa and ID card photo sizes.",
    slug: "passport-size-photo-maker",
    category: "image",
    icon: "🪪",
    metaTitle: "Passport Size Photo Maker Online Free | Toolrize",
    metaDescription:
      "Create passport size photos online for free. Make Indian passport photos, visa photos and ID card photos with correct dimensions.",
    keywords: [
      "passport photo maker",
      "passport size photo",
      "passport photo online",
      "Indian passport photo",
      "photo maker",
    ],
  },
  {
    id: "signature-bg-remover",
    title: "Signature Background Remover",
    description:
      "Remove background from signature images to make them transparent. Essential for digital document signing.",
    slug: "signature-background-remover",
    category: "image",
    icon: "✍️",
    metaTitle: "Signature Background Remover Online Free | Toolrize",
    metaDescription:
      "Remove background from signature images online for free. Make signature transparent for digital documents, PDFs and forms.",
    keywords: [
      "signature background remover",
      "remove signature background",
      "transparent signature",
      "digital signature maker",
    ],
  },
  {
    id: "image-resizer",
    title: "Image Resizer for Forms",
    description:
      "Resize images to exact dimensions required by government forms, applications and online portals.",
    slug: "image-resizer-for-forms",
    category: "form",
    icon: "🖼️",
    metaTitle: "Image Resizer for Forms Online Free | Toolrize",
    metaDescription:
      "Resize images to exact dimensions for government forms, job applications and online portals. Supports custom width and height.",
    keywords: [
      "image resizer",
      "resize image for forms",
      "photo resizer",
      "resize image online",
      "form photo size",
    ],
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description:
      "Convert single or multiple images to a PDF document. Arrange, merge and download as a clean PDF file.",
    slug: "image-to-pdf",
    category: "pdf",
    icon: "🔄",
    metaTitle: "Image to PDF Converter Online Free | Toolrize",
    metaDescription:
      "Convert images to PDF online for free. Merge multiple JPEG, PNG images into a single PDF document instantly.",
    keywords: [
      "image to pdf",
      "jpg to pdf",
      "png to pdf",
      "convert image to pdf",
      "photo to pdf",
    ],
  },
  {
    id: "pdf-merger",
    title: "PDF Merger",
    description:
      "Combine multiple PDF files into one document. Simple drag-and-drop interface for quick merging.",
    slug: "pdf-merger",
    category: "pdf",
    icon: "📑",
    metaTitle: "Merge PDF Files Online Free | Toolrize",
    metaDescription:
      "Merge multiple PDF files into one document online for free. Combine PDFs quickly with drag and drop interface.",
    keywords: [
      "merge pdf",
      "combine pdf",
      "pdf merger",
      "join pdf files",
      "merge pdf online",
    ],
  },
  {
    id: "pdf-splitter",
    title: "PDF Splitter",
    description:
      "Split a large PDF into smaller files by page range. Extract specific pages from any PDF document.",
    slug: "pdf-splitter",
    category: "pdf",
    icon: "✂️",
    metaTitle: "Split PDF Online Free | Toolrize",
    metaDescription:
      "Split PDF files into multiple documents online for free. Extract specific pages from PDF by page range.",
    keywords: [
      "split pdf",
      "pdf splitter",
      "extract pdf pages",
      "separate pdf pages",
      "split pdf online",
    ],
  },
  {
    id: "attendance-calculator",
    title: "Attendance Calculator",
    description:
      "Calculate your attendance percentage and find out how many classes you can skip or need to attend.",
    slug: "attendance-calculator",
    category: "student",
    icon: "📊",
    metaTitle: "Attendance Calculator Online Free | Toolrize",
    metaDescription:
      "Calculate your attendance percentage online. Find how many classes you can skip or need to attend to reach minimum attendance.",
    keywords: [
      "attendance calculator",
      "calculate attendance",
      "attendance percentage",
      "college attendance calculator",
      "class attendance",
    ],
  },
  {
    id: "cgpa-calculator",
    title: "CGPA Calculator",
    description:
      "Calculate your CGPA from SGPA or individual grades. Supports various Indian university grading systems.",
    slug: "cgpa-calculator",
    category: "student",
    icon: "🎓",
    metaTitle: "CGPA Calculator Online Free | Toolrize",
    metaDescription:
      "Calculate CGPA from SGPA online for free. Supports Indian university grading systems. Convert CGPA to percentage.",
    keywords: [
      "cgpa calculator",
      "calculate cgpa",
      "sgpa to cgpa",
      "cgpa to percentage",
      "gpa calculator",
    ],
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description:
      "Generate QR codes for URLs, text, Wi-Fi, UPI payments and more. Download in high quality PNG format.",
    slug: "qr-code-generator",
    category: "form",
    icon: "📱",
    metaTitle: "QR Code Generator Online Free | Toolrize",
    metaDescription:
      "Generate QR codes for free online. Create QR codes for URLs, text, UPI, Wi-Fi and more. Download in high quality.",
    keywords: [
      "qr code generator",
      "create qr code",
      "qr code maker",
      "generate qr code",
      "free qr code",
    ],
  },
  {
    id: "percentage-calculator",
    title: "Percentage Calculator",
    description:
      "Calculate percentages, percentage increase/decrease, and find percentage of any number quickly.",
    slug: "percentage-calculator",
    category: "student",
    icon: "🔢",
    metaTitle: "Percentage Calculator Online Free | Toolrize",
    metaDescription:
      "Calculate percentage online for free. Find percentage of numbers, percentage increase/decrease and more.",
    keywords: [
      "percentage calculator",
      "calculate percentage",
      "percentage increase",
      "percentage decrease",
      "find percentage",
    ],
  },
];

export function getToolsByCategory(category: ToolCategory | "all"): Tool[] {
  if (category === "all") return tools;
  return tools.filter((tool) => tool.category === category);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getCategoryLabel(category: ToolCategory): string {
  const cat = categories.find((c) => c.id === category);
  return cat?.label ?? category;
}
