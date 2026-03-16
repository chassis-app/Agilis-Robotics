import path from 'node:path'
import { execFileSync } from 'node:child_process'
import pptxgen from 'pptxgenjs'

const ROOT = '/home/ubuntu/Agilis-Robotics/agilis-erp-demo'
const OUTPUT = path.join(ROOT, 'codex.pptx')

const changeSlides = [
  {
    file: '20260314-01.png',
    label: 'Change 01',
    title: 'Navigation and Routing Shell',
    description:
      'The navigation was reorganized around the revised workflow. Order Management replaces Sales, Project Management was removed, and the shell now exposes Goods Return, Complaints, Internal QC, BOM Comparison, plus the updated English names for 領料 and 發料.',
  },
  {
    file: '20260314-02.png',
    label: 'Change 02',
    title: 'Goods Return',
    description:
      'A dedicated supplier-return screen was added for return tracing. The mockup shows return document status, source references, supplier/warehouse context, linked inspection evidence, and finance-facing invoice follow-up.',
  },
  {
    file: '20260314-03.png',
    label: 'Change 03',
    title: 'Goods Receipt Follow-up',
    description:
      'Goods Receipt now acts as the parent transaction for inspection and return follow-up. The page surfaces item check status, invoice collection state, return status, and links back to related quality and finance documents.',
  },
  {
    file: '20260314-04.png',
    label: 'Change 04',
    title: 'AP Reconciliation Invoice Tracking',
    description:
      'The AP reconciliation flow now tracks tax invoice collection directly in finance. The mockup supports invoice status visibility, document linking back to PO and GRN, and handling for blocked or pending supplier invoices.',
  },
  {
    file: '20260314-05.png',
    label: 'Change 05',
    title: 'Item Master Category Expansion',
    description:
      'Item Master keeps the original category and adds three more category fields for downstream quality logic. The additional categorization is exposed in the list and detail view so Internal QC template selection can key off structured part classifications.',
  },
  {
    file: '20260314-06.png',
    label: 'Change 06',
    title: 'Order Management List',
    description:
      'Sales Orders were repositioned as Order Management. The new mockup separates formal, informal, and internal orders, adds market-aware filtering, and makes sequence families visible so commercial and internal demand are clearly distinguished.',
  },
  {
    file: '20260314-07.png',
    label: 'Change 07',
    title: 'Order Detail Rules',
    description:
      'Order detail now carries order type, market, and sequence context in the header. The screen is designed to show BOM eligibility per market and to distinguish whether the selected order can drive final-product or semi-product execution.',
  },
  {
    file: '20260314-08.png',
    label: 'Change 08',
    title: 'Build Order Management',
    description:
      'Work Orders were reframed as Build Orders with explicit production-batch execution. The list emphasizes sequencing, execution priority, batch splitting, and trace links back to order origin, withdrawal request/confirmation, and Internal QC.',
  },
  {
    file: '20260314-09.png',
    label: 'Change 09',
    title: 'Dual Sequence Configuration',
    description:
      'System configuration now includes formal and informal document sequence settings across the production flow. The mockup also keeps the sequence family visible so procurement, manufacturing, inventory, and quality documents can follow the same numbering logic.',
  },
  {
    file: '20260314-10.png',
    label: 'Change 10',
    title: 'Approval Policy Extension',
    description:
      'Approval policies were expanded for the new document families, especially 領料. The screen is intended to support warehouse-based routing, different approval branches by order origin, and future quality/return exceptions.',
  },
  {
    file: '20260314-11.png',
    label: 'Change 11',
    title: 'Material Withdrawal Request',
    description:
      'MIR Batch was repurposed into the request document for 領料. The mockup focuses on reference build order or production batch, reason selection, warehouse-specific requests, approval status, and the one-order-per-warehouse rule.',
  },
  {
    file: '20260314-12.png',
    label: 'Change 12',
    title: 'Material Withdrawal Confirmation',
    description:
      'Material Issue Notice was repositioned as 發料, the confirmation document for inventory withdrawal. The page keeps a traceable link back to the approved request and exposes warehouse, batch, lot allocation, and execution confirmation data.',
  },
  {
    file: '20260314-13.png',
    label: 'Change 13',
    title: 'BOM Detail Enhancements',
    description:
      'BOM detail now supports permanent layer numbering, custom ordering, header tags such as markets, multiple sourcing types, and explicit semi-product versus final-product classification. These changes make the BOM rules visible to order and build flows.',
  },
  {
    file: '20260314-14.png',
    label: 'Change 14',
    title: 'BOM Comparison',
    description:
      'A dedicated BOM comparison page was added to highlight added, removed, replaced, and quantity-changed components across versions. The comparison is designed to preserve layer context so bottom-level differences are easier to review.',
  },
  {
    file: '20260314-15.png',
    label: 'Change 15',
    title: 'ECR Workflow Reasons',
    description:
      'ECR/ECO now reflects the tighter change-control chain requested by the client. The mockup shows spec reasons like CAPA, material change, and parts change, plus linked upstream and downstream records such as complaints, CAPA, and BOM revisions.',
  },
  {
    file: '20260314-16.png',
    label: 'Change 16',
    title: 'Complaints Intake',
    description:
      'A new Complaints page was added to start the quality process at the correct point. The page is intended to capture affected product, lot, market, severity, and the handoff into CAPA.',
  },
  {
    file: '20260314-17.png',
    label: 'Change 17',
    title: 'CAPA-centered Quality Flow',
    description:
      'NC/CAPA was redesigned so CAPA is the main controlled process rather than a flat status list. The mockup emphasizes the chain from complaint to CAPA to ECR to BOM change and changed version output.',
  },
  {
    file: '20260314-18.png',
    label: 'Change 18',
    title: 'Internal QC',
    description:
      'A dedicated Internal QC workflow was added with AQL-driven packet generation, market-aware checklist logic, and print-first execution. This screen pairs with the template editor to support a WYSIWYG form-building approach inside the system.',
  },
  {
    file: '20260314-19.png',
    label: 'Change 19',
    title: 'Inspection Integration',
    description:
      'The inspection area now sits inside a broader quality document flow. The mockup is intended to link incoming inspections, item check reports, goods return evidence, and Internal QC template/checklist sources more clearly.',
  },
  {
    file: '20260314-20.png',
    label: 'Change 20',
    title: 'Workflow-based Traceability',
    description:
      'Traceability was reworked from a tree into a workflow timeline. Users can start from a document number, part, or product and follow the chain through build orders, withdrawal request/confirmation, Internal QC, and related downstream steps.',
  },
  {
    file: '20260314-21.png',
    label: 'Change 21',
    title: 'Project Management Removal',
    description:
      'Project Management was removed from the frontend shell. The capture shows the revised navigation without the old project entry, keeping engineering focused on the required operational workflows.',
  },
]

const extraSlides = [
  {
    file: 'ap-reconciliation-payment-link.png',
    label: 'Additional',
    title: 'AP Reconciliation Payment Linkage',
    description:
      'This screen shows AP Reconciliation with a direct path into payment requests. It highlights how invoice matching and supplier payment execution can be reviewed together from the finance workspace.',
  },
  {
    file: 'approval-inbox-payment-request.png',
    label: 'Additional',
    title: 'Approval Inbox for Payment Workflow',
    description:
      'The approval inbox includes payment requests and PO payment-mode changes alongside standard procurement approvals. This makes the finance approval path visible in the same operational queue as other controlled documents.',
  },
  {
    file: 'payment-request-create.png',
    label: 'Additional',
    title: 'Create Payment Request',
    description:
      'This mockup allows finance to create a single payment request from one or more outstanding POs for the same supplier. It also shows the remaining balance, payment modes, and next payment milestone before submission.',
  },
  {
    file: 'payment-request-detail.png',
    label: 'Additional',
    title: 'Payment Request Detail',
    description:
      'The payment request detail view consolidates linked POs, current approval state, requested amount, and approval-control messaging. It is designed to flag when upstream PO payment conditions change and re-approval is required.',
  },
  {
    file: 'payment-request-list.png',
    label: 'Additional',
    title: 'Payment Request List',
    description:
      'The list view summarizes payment requests by supplier, linked PO count, payment mode mix, amount, and approval status. It gives finance a simple queue for tracking draft, in-approval, and approved requests.',
  },
  {
    file: 'po-detail-payment-plan.png',
    label: 'Additional',
    title: 'PO Detail Payment Plan',
    description:
      'This PO detail mockup highlights mixed payment modes inside one purchase order. It shows milestone-based payment planning, outstanding balance visibility, and shortcuts to generate or review payment requests.',
  },
]

const slides = [...changeSlides, ...extraSlides]

const palette = [
  { bg: 'F7F4EE', panel: '17324D', accent: 'C15B3A', text: '17324D', muted: '5E6B79' },
  { bg: '17324D', panel: 'F4EFE6', accent: 'E7B86C', text: 'F4EFE6', muted: 'C7D3E0' },
  { bg: 'EEF5F3', panel: '193A34', accent: '4D8B79', text: '193A34', muted: '60756E' },
  { bg: 'FCF7F2', panel: '4B2E2B', accent: 'D17A5B', text: '4B2E2B', muted: '796564' },
]

function fitImage(imgPath, maxW, maxH) {
  const fileInfo = execFileSync('file', [imgPath], { encoding: 'utf8' })
  const match = fileInfo.match(/,\s(\d+)\s+x\s+(\d+),/)
  if (!match) {
    return { w: maxW, h: maxH }
  }
  const width = Number(match[1]) || 1
  const height = Number(match[2]) || 1
  const scale = Math.min(maxW / width, maxH / height)
  return {
    w: width * scale,
    h: height * scale,
  }
}

function addTitleSlide(pptx) {
  const slide = pptx.addSlide()
  slide.background = { color: '17324D' }

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.42,
    line: { color: '17324D', transparency: 100 },
    fill: { color: 'C15B3A' },
  })

  slide.addText('Agilis ERP Mockup Changes', {
    x: 0.75,
    y: 0.95,
    w: 8.4,
    h: 0.65,
    fontFace: 'Georgia',
    fontSize: 26,
    bold: true,
    color: 'F4EFE6',
    margin: 0,
  })

  slide.addText('Client-facing highlights compiled from root screenshots and the 2026-03-14 change plan.', {
    x: 0.78,
    y: 1.72,
    w: 6.6,
    h: 0.8,
    fontFace: 'Calibri',
    fontSize: 16,
    color: 'D4E0EA',
    margin: 0,
    valign: 'mid',
  })

  slide.addShape(pptx.ShapeType.line, {
    x: 0.78,
    y: 2.72,
    w: 2.6,
    h: 0,
    line: { color: 'E7B86C', width: 2.5 },
  })

  slide.addText('Slides include 21 planned changes plus 6 additional payment workflow mockups found in the project root.', {
    x: 0.78,
    y: 2.92,
    w: 7,
    h: 0.75,
    fontFace: 'Calibri',
    fontSize: 14,
    color: 'C7D3E0',
    margin: 0,
  })

  slide.addShape(pptx.ShapeType.rect, {
    x: 6.9,
    y: 0.75,
    w: 2.35,
    h: 4.1,
    line: { color: 'E7B86C', transparency: 100 },
    fill: { color: 'F4EFE6', transparency: 7 },
    radius: 0.1,
    shadow: { type: 'outer', color: '000000', blur: 2, angle: 45, offset: 1, opacity: 0.18 },
  })

  slide.addText('27 Screens', {
    x: 7.18,
    y: 1.1,
    w: 1.7,
    h: 0.4,
    fontFace: 'Georgia',
    fontSize: 18,
    bold: true,
    color: '17324D',
    align: 'center',
    margin: 0,
  })

  slide.addText('One by one highlights for review with the client.', {
    x: 7.08,
    y: 1.72,
    w: 1.9,
    h: 1.1,
    fontFace: 'Calibri',
    fontSize: 13,
    color: '4D5C68',
    align: 'center',
    valign: 'mid',
    margin: 0.04,
  })

  slide.addText('Prepared by Codex', {
    x: 7.15,
    y: 3.8,
    w: 1.8,
    h: 0.28,
    fontFace: 'Calibri',
    fontSize: 11,
    italic: true,
    color: '7B6C61',
    align: 'center',
    margin: 0,
  })
}

function addContentSlide(pptx, entry, index) {
  const theme = palette[index % palette.length]
  const reverse = index % 2 === 1
  const slide = pptx.addSlide()
  slide.background = { color: theme.bg }

  slide.addShape(pptx.ShapeType.rect, {
    x: reverse ? 9.58 : 0,
    y: 0,
    w: 0.42,
    h: 5.625,
    line: { color: theme.accent, transparency: 100 },
    fill: { color: theme.accent },
  })

  slide.addText(entry.label.toUpperCase(), {
    x: reverse ? 5.15 : 0.7,
    y: 0.42,
    w: 1.8,
    h: 0.22,
    fontFace: 'Calibri',
    fontSize: 9,
    bold: true,
    color: theme.accent,
    charSpacing: 1.4,
    margin: 0,
  })

  slide.addText(entry.title, {
    x: reverse ? 5.15 : 0.7,
    y: 0.62,
    w: 3.55,
    h: 0.72,
    fontFace: 'Georgia',
    fontSize: 22,
    bold: true,
    color: theme.text,
    margin: 0,
    fit: 'shrink',
  })

  slide.addText(entry.description, {
    x: reverse ? 5.15 : 0.7,
    y: 1.48,
    w: 3.45,
    h: 2.18,
    fontFace: 'Calibri',
    fontSize: 14,
    color: theme.muted,
    margin: 0,
    breakLine: false,
    valign: 'top',
    fit: 'shrink',
  })

  slide.addShape(pptx.ShapeType.line, {
    x: reverse ? 5.15 : 0.7,
    y: 3.9,
    w: 0.95,
    h: 0,
    line: { color: theme.accent, width: 2 },
  })

  slide.addText(path.basename(entry.file), {
    x: reverse ? 5.15 : 0.7,
    y: 4.08,
    w: 3.45,
    h: 0.3,
    fontFace: 'Calibri',
    fontSize: 10.5,
    color: theme.muted,
    italic: true,
    margin: 0,
  })

  slide.addText(String(index + 2).padStart(2, '0'), {
    x: reverse ? 0.6 : 8.95,
    y: 4.72,
    w: 0.45,
    h: 0.28,
    fontFace: 'Georgia',
    fontSize: 11,
    bold: true,
    color: theme.accent,
    align: 'center',
    margin: 0,
  })

  const imgPath = path.join(ROOT, entry.file)
  const boxX = reverse ? 0.6 : 4.45
  const boxY = 0.52
  const boxW = 4.75
  const boxH = 4.55
  const img = fitImage(imgPath, boxW - 0.28, boxH - 0.28)
  const imgX = boxX + (boxW - img.w) / 2
  const imgY = boxY + (boxH - img.h) / 2

  slide.addShape(pptx.ShapeType.rect, {
    x: boxX,
    y: boxY,
    w: boxW,
    h: boxH,
    line: { color: theme.panel, transparency: 82, width: 1 },
    fill: { color: reverse ? 'FBF8F3' : 'FFFFFF' },
    radius: 0.08,
    shadow: { type: 'outer', color: '000000', blur: 3, angle: 45, offset: 1, opacity: 0.12 },
  })

  slide.addImage({
    path: imgPath,
    x: imgX,
    y: imgY,
    w: img.w,
    h: img.h,
  })
}

async function main() {
  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_16x9'
  pptx.author = 'Codex'
  pptx.company = 'OpenAI'
  pptx.subject = 'Agilis ERP client change highlights'
  pptx.title = 'Agilis ERP Mockup Changes'
  pptx.lang = 'en-US'
  pptx.theme = {
    headFontFace: 'Georgia',
    bodyFontFace: 'Calibri',
    lang: 'en-US',
  }

  addTitleSlide(pptx)
  slides.forEach((entry, index) => addContentSlide(pptx, entry, index))

  await pptx.writeFile({ fileName: OUTPUT })
}

await main()
