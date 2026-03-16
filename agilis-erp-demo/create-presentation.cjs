const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// Color palette - Medical/Professional theme (Ocean Gradient inspired)
const colors = {
  primary: "1E3A8A",      // Deep navy (main)
  secondary: "3B82F6",    // Bright blue
  accent: "0891B2",       // Teal
  dark: "0F172A",         // Dark slate
  light: "F8FAFC",        // Off-white
  white: "FFFFFF",
  gray: "64748B",
  success: "22C55E",
  warning: "F59E0B",
  danger: "EF4444"
};

// Change descriptions for numbered images (20260314-01.png through 20260314-21.png)
const changeDescriptions = {
  "01": {
    title: "Navigation & Routing Shell Changes",
    desc: "Rename Sales section to Order Management. Remove Project Management. Add routes for Goods Return, Complaints, Internal QC, and BOM Comparison. Update Chinese labels for 領料 (Material Withdrawal Request) and 發料 (Material Withdrawal Confirmation)."
  },
  "02": {
    title: "New Goods Return Page",
    desc: "New traceable document page for supplier returns. Fields include source GRN/PO, supplier, warehouse, return reason, status, related inspection/item check report, tax invoice collection status. Links back to Goods Receipt, Inspection, and AP Reconciliation."
  },
  "03": {
    title: "Goods Receipt Enhancement",
    desc: "Add action to create/view Goods Return from GRN. New columns for item check report status, tax invoice received/pending, and return status. Document links to incoming inspection, goods return, and AP tax invoice handling."
  },
  "04": {
    title: "AP Reconciliation Tax Invoice Tracking",
    desc: "Add tax invoice collection state to AP list/detail. Finance-side file upload field for invoice attachments. Show invoice status: collected, matched, pending, or blocked by return. Links back to PO, GRN, and Goods Return."
  },
  "05": {
    title: "Item Master Category Fields",
    desc: "Add three additional category fields on item master for downstream QC template logic. Fields surface in table columns, drawer general tab, and search/filter. Available downstream for Internal QC checklist selection."
  },
  "06": {
    title: "Order Management Transformation",
    desc: "Rename Sales Orders to Order Management. Add order type separation: formal sales order, informal sales order, internal order. Add market separation with filters and summary cards. Show formal vs informal sequence numbering."
  },
  "07": {
    title: "Sales Order Detail Enhancement",
    desc: "Add header fields: order type, market, formal/informal sequence type. Market-aware product selection with BOM eligibility validation. Show whether order allows final product only or semi-product creation. Restrict semi-product to informal/internal scenarios."
  },
  "08": {
    title: "Build Order Management",
    desc: "Reposition work orders as Build Orders. Add drag-and-drop priority ordering. Add production-batch split support (one build order → multiple child batches). Add source-order context (sales/internal, formal/informal, market). Clearer tracing to 領料, 發料, and internal QC."
  },
  "09": {
    title: "Dual Document Sequence Configuration",
    desc: "System config page for formal and informal numbering schemes. Applied across whole production process: order, procurement, manufacturing, inventory, and quality documents. Show which sequence family each document belongs to."
  },
  "10": {
    title: "Approval Policy Updates",
    desc: "Add approval policies for 領料. Policy branching for warehouse-specific requests and internal vs formal/informal order origins. Add new document types for goods return, complaints/CAPA, and internal QC exceptions."
  },
  "11": {
    title: "Material Withdrawal Request (領料)",
    desc: "Rework MIR Batch as Material Withdrawal Request document. Fields: reason dropdown, reference build order/production batch, warehouse, approval status. Enforce one order per warehouse rule. Document assigned production batch number before execution."
  },
  "12": {
    title: "Material Withdrawal Confirmation (發料)",
    desc: "Reposition Material Issue Notice as Material Withdrawal Confirmation. Document-level traceability for source 領料，warehouse, production batch, FIFO lot allocations. Whole execution document refers back to approved 領料."
  },
  "13": {
    title: "BOM Detail Enhancements",
    desc: "Add permanent layering numbers (1, 1.1, 1.1.1). Preserve numbering history: new insertions get new numbers, deleted numbers not reused, replacements reuse original. Custom row ordering. BOM header tagging (countries/markets). Multi-select sourcing. BOM classification (semi-product/final product)."
  },
  "14": {
    title: "New BOM Comparison Page",
    desc: "Compare two BOM versions highlighting part variances. Show added parts, removed parts, replaced parts, quantity changes, and header tag/market differences. Preserve layer-number context in the diff view."
  },
  "15": {
    title: "ECR/ECO Change Control Model",
    desc: "Add explicit spec reason options: CAPA, material change, parts change. Show linked upstream/downstream documents: complaint, CAPA, affected BOM, changed BOM version. ECR sits between CAPA and BOM version change in workflow."
  },
  "16": {
    title: "New Complaints Page",
    desc: "Complaint intake list/detail page. Fields: complaint source, affected product/lot/market, severity, linked CAPA. Ability to initiate CAPA from complaint record."
  },
  "17": {
    title: "NC/CAPA Workflow Focus",
    desc: "Rework page so CAPA is primary controlled process. Add workflow stages and document links: complaint → CAPA → ECR → BOM change → changed BOM version. Keep NC handling as linked record type inside CAPA or sub-section of quality flow."
  },
  "18": {
    title: "Internal QC System",
    desc: "New Internal QC planning/execution page for build orders and production batches. AQL engine calculates check percentage/quantity and produces QC packet. Checklist selection based on item category fields and market. Print-first workflow with WYSIWYG template editor."
  },
  "19": {
    title: "Inspections Integration",
    desc: "Keep incoming/in-process/final inspection coverage. Add stronger document links to goods receipt, goods return item check report, and internal QC. Show checklist/template source for category and market-based QC records."
  },
  "20": {
    title: "Traceability Re-implementation",
    desc: "Replace tree with clearer trace document view. Allow trace lookup from any valid step using document number, part number, or product number. Cover batches, build orders, 領料，發料，inspections, internal QC, goods return, and complaint/CAPA/ECR where relevant."
  },
  "21": {
    title: "Project Management Removal",
    desc: "Remove Project Management page from engineering navigation. Remove route and breadcrumb references. Remove any dashboard/navigation shortcuts that surface the removed feature."
  }
};

// Payment/finance image descriptions
const paymentDescriptions = {
  "ap-reconciliation-payment-link": {
    title: "AP Reconciliation Payment Link",
    desc: "AP reconciliation page showing payment linking functionality. Finance users can match supplier invoices to payments and track payment status across procurement documents."
  },
  "approval-inbox-payment-request": {
    title: "Approval Inbox - Payment Request",
    desc: "Approval inbox showing payment requests awaiting review. Approvers can view payment details, supporting documents, and approve or reject payment requests with comments."
  },
  "payment-request-create": {
    title: "Create Payment Request",
    desc: "Payment request creation form with fields for payee, amount, payment method, due date, and linked procurement documents. Supports attachment upload for invoices and supporting documentation."
  },
  "payment-request-detail": {
    title: "Payment Request Detail",
    desc: "Payment request detail view showing full payment information, approval workflow status, audit trail, and linked documents. Approvers can see payment history and take action."
  },
  "payment-request-list": {
    title: "Payment Request List",
    desc: "Payment request list view with filters for status, date range, payee, and amount. Shows payment summary cards and allows bulk actions on multiple requests."
  },
  "po-detail-payment-plan": {
    title: "PO Detail - Payment Plan",
    desc: "Purchase order detail showing payment plan configuration. Users can set up milestone payments, track payment schedule against delivery dates, and monitor payment status."
  }
};

async function imageToBase64(imagePath) {
  const data = fs.readFileSync(imagePath);
  const ext = path.extname(imagePath).toLowerCase().slice(1);
  const mimeTypes = {
    png: "image/png",
    jpg: "jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif"
  };
  const mimeType = mimeTypes[ext] || "image/png";
  return `${mimeType};base64,${data.toString("base64")}`;
}

function createTitleSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: colors.primary };
  
  // Title
  slide.addText("Agilis Robotics ERP", {
    x: 0.5, y: 1.5, w: 9, h: 1,
    fontSize: 44, fontFace: "Arial", bold: true,
    color: colors.white, align: "center"
  });
  
  // Subtitle
  slide.addText("UI Change Presentation", {
    x: 0.5, y: 2.5, w: 9, h: 0.8,
    fontSize: 24, fontFace: "Arial",
    color: colors.secondary, align: "center"
  });
  
  // Date
  slide.addText("March 14, 2026", {
    x: 0.5, y: 4.5, w: 9, h: 0.5,
    fontSize: 14, fontFace: "Arial",
    color: colors.light, align: "center"
  });
  
  // Decorative element
  slide.addShape(pres.shapes.LINE, {
    x: 2, y: 3.5, w: 6, h: 0,
    line: { color: colors.accent, width: 2 }
  });
}

function createContentSlide(pres, title, desc, imageData, slideNum) {
  const slide = pres.addSlide();
  slide.background = { color: colors.light };
  
  // Slide number indicator
  slide.addText(`${slideNum}`, {
    x: 9.2, y: 0.2, w: 0.5, h: 0.3,
    fontSize: 10, fontFace: "Arial",
    color: colors.gray, align: "right"
  });
  
  // Accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 5.625,
    fill: { color: colors.accent }
  });
  
  // Title
  slide.addText(title, {
    x: 0.5, y: 0.4, w: 9, h: 0.6,
    fontSize: 24, fontFace: "Arial", bold: true,
    color: colors.dark, margin: 0
  });
  
  // Image
  if (imageData) {
    const origWidth = 1978, origHeight = 923, maxHeight = 2.8;
    const calcWidth = maxHeight * (origWidth / origHeight);
    const centerX = (10 - calcWidth) / 2;
    
    slide.addImage({
      data: imageData,
      x: centerX, y: 1.2, w: calcWidth, h: maxHeight
    });
  }
  
  // Description box background
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.2, w: 9, h: 1.2,
    fill: { color: colors.white },
    rectRadius: 0.1
  });
  
  // Description text
  slide.addText(desc, {
    x: 0.7, y: 4.3, w: 8.6, h: 1,
    fontSize: 12, fontFace: "Arial",
    color: colors.dark, valign: "top"
  });
}

async function createPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Agilis Robotics";
  pres.title = "UI Change Presentation";
  
  // Create title slide
  createTitleSlide(pres);
  
  let slideNum = 1;
  const imageDir = "/home/ubuntu/Agilis-Robotics/agilis-erp-demo";
  
  // Process numbered images (01-21)
  for (let i = 1; i <= 21; i++) {
    const num = String(i).padStart(2, "0");
    const imagePath = path.join(imageDir, `20260314-${num}.png`);
    const changeData = changeDescriptions[num];
    
    if (fs.existsSync(imagePath) && changeData) {
      const imageData = await imageToBase64(imagePath);
      createContentSlide(pres, changeData.title, changeData.desc, imageData, slideNum++);
      console.log(`Added slide ${slideNum - 1}: ${changeData.title}`);
    }
  }
  
  // Process payment/finance images
  for (const [key, data] of Object.entries(paymentDescriptions)) {
    const imagePath = path.join(imageDir, `${key}.png`);
    
    if (fs.existsSync(imagePath)) {
      const imageData = await imageToBase64(imagePath);
      createContentSlide(pres, data.title, data.desc, imageData, slideNum++);
      console.log(`Added slide ${slideNum - 1}: ${data.title}`);
    }
  }
  
  // Save presentation
  const outputPath = path.join(imageDir, "qwen3.5.pptx");
  await pres.writeFile({ fileName: outputPath });
  console.log(`\nPresentation saved to: ${outputPath}`);
  console.log(`Total slides: ${slideNum}`);
}

createPresentation().catch(console.error);
