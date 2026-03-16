import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const changesMarkdown = fs.readFileSync("20260314-changes.md", "utf8");

// Extract section summaries from markdown
function extractSectionSummaries(markdown) {
  const summaries = {};
  const sectionRegex = /### (\d+)\.\s+([^\n]+)\n\n(?:[^#]|### (?! \d+\.))*/g;
  let match;
  while ((match = sectionRegex.exec(markdown)) !== null) {
    const num = parseInt(match[1]);
    const title = match[2].trim();
    summaries[num] = title;
  }
  return summaries;
}

const sectionSummaries = extractSectionSummaries(changesMarkdown);

// Get all images from root directory
const rootDir = "/home/ubuntu/Agilis-Robotics/agilis-erp-demo";
const imageFiles = fs.readdirSync(rootDir)
  .filter(f => /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(f))
  .sort();

// Extract descriptions for images
function getImageDescription(filename) {
  // Check if it matches 20260314-XX pattern
  const match = filename.match(/^20260314-(\d+)\./);
  if (match) {
    const num = parseInt(match[1]);
    if (sectionSummaries[num]) {
      return sectionSummaries[num];
    }
    return `Change ${num}`;
  }

  // Default descriptions for other images
  const defaultDescs = {
    "ap-reconciliation-payment-link.png": "AP Reconciliation Payment Link",
    "approval-inbox-payment-request.png": "Approval Inbox Payment Request",
    "payment-request-create.png": "Payment Request Create",
    "payment-request-detail.png": "Payment Request Detail",
    "payment-request-list.png": "Payment Request List",
    "po-detail-payment-plan.png": "PO Detail Payment Plan"
  };

  return defaultDescs[filename] || filename.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
}

// Analyze image to get additional details
async function analyzeImage(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      aspectRatio: metadata.width / metadata.height
    };
  } catch (error) {
    console.error(`Error analyzing ${imagePath}:`, error);
    return null;
  }
}

// Create presentation
async function createPresentation() {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Agilis Robotics";
  pres.title = "GLM47 Change Highlights";

  // Title slide
  const titleSlide = pres.addSlide();
  titleSlide.background = { color: "1E3A8A" };
  titleSlide.addText("GLM47 Change Highlights", {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 0.8,
    fontSize: 44,
    fontFace: "Arial",
    color: "FFFFFF",
    bold: true,
    align: "center"
  });
  titleSlide.addText("2026-03-14", {
    x: 0.5,
    y: 3.5,
    w: 9,
    h: 0.5,
    fontSize: 24,
    fontFace: "Arial",
    color: "FFFFFF",
    align: "center"
  });

  // Create slides for each image
  for (const imageFile of imageFiles) {
    const imagePath = path.join(rootDir, imageFile);
    const description = getImageDescription(imageFile);
    const metadata = await analyzeImage(imagePath);

    if (!metadata) continue;

    const slide = pres.addSlide();

    // Add title
    slide.addText(description, {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.6,
      fontSize: 32,
      fontFace: "Arial",
      color: "1E3A8A",
      bold: true
    });

    // Calculate image dimensions to fit in the available space
    const maxWidth = 9;
    const maxHeight = 4.5;
    let imgWidth, imgHeight;

    if (metadata.aspectRatio > maxWidth / maxHeight) {
      imgWidth = maxWidth;
      imgHeight = maxWidth / metadata.aspectRatio;
    } else {
      imgHeight = maxHeight;
      imgWidth = maxHeight * metadata.aspectRatio;
    }

    // Center the image
    const imgX = (10 - imgWidth) / 2;
    const imgY = 1.2;

    slide.addImage({
      path: imagePath,
      x: imgX,
      y: imgY,
      w: imgWidth,
      h: imgHeight
    });
  }

  // Save presentation
  pres.writeFile({ fileName: "glm47.pptx" });
  console.log("Presentation saved as glm47.pptx");
}

createPresentation().catch(console.error);
