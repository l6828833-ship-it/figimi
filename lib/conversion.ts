import "server-only";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Document, Packer, Paragraph } from "docx";
import ExcelJS from "exceljs";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import PptxGenJS from "pptxgenjs";

export const conversionNames = ["pdf-to-word", "word-to-pdf", "pdf-to-png", "pdf-to-jpg", "pdf-to-excel", "excel-to-pdf", "ppt-to-pdf", "pdf-to-ppt", "jpg-to-pdf", "png-to-pdf"] as const;
export type ConversionName = typeof conversionNames[number];
export const isConversionName = (value: string): value is ConversionName => conversionNames.includes(value as ConversionName);

const rules: Record<ConversionName, { extensions: string[]; multiple?: boolean }> = {
  "pdf-to-word": { extensions: [".pdf"] }, "word-to-pdf": { extensions: [".doc", ".docx"] },
  "pdf-to-png": { extensions: [".pdf"] }, "pdf-to-jpg": { extensions: [".pdf"] },
  "pdf-to-excel": { extensions: [".pdf"] }, "excel-to-pdf": { extensions: [".xls", ".xlsx"] },
  "ppt-to-pdf": { extensions: [".ppt", ".pptx"] }, "pdf-to-ppt": { extensions: [".pdf"] },
  "jpg-to-pdf": { extensions: [".jpg", ".jpeg"], multiple: true }, "png-to-pdf": { extensions: [".png"], multiple: true },
};
const mimeByExtension: Record<string, string> = { ".pdf": "application/pdf", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".zip": "application/zip" };

function safeBase(name: string) { return path.basename(name, path.extname(name)).replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "converted"; }
function looksValid(buffer: Buffer, extension: string) { if (extension === ".pdf") return buffer.subarray(0, 5).toString() === "%PDF-"; if ([".png"].includes(extension)) return buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a"; if ([".jpg", ".jpeg"].includes(extension)) return buffer[0] === 0xff && buffer[1] === 0xd8; if ([".docx", ".xlsx", ".pptx"].includes(extension)) return buffer[0] === 0x50 && buffer[1] === 0x4b; if ([".doc", ".xls", ".ppt"].includes(extension)) return buffer.subarray(0, 8).toString("hex") === "d0cf11e0a1b11ae1"; return false; }

async function run(command: string, args: string[], timeoutMs = 120_000) { await new Promise<void>((resolve, reject) => { const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"], env: { ...process.env, HOME: tmpdir() }, shell: false }); let stderr = ""; const timer = setTimeout(() => { child.kill("SIGKILL"); reject(new Error("Conversion timed out. Try a smaller or simpler file.")); }, timeoutMs); child.stderr.on("data", (chunk) => { stderr += chunk.toString().slice(0, 2000); }); child.once("error", (error: NodeJS.ErrnoException) => { clearTimeout(timer); reject(error.code === "ENOENT" ? new Error(`Required converter '${command}' is not installed on this server.`) : error); }); child.once("close", (code) => { clearTimeout(timer); if (code === 0) resolve(); else reject(new Error(stderr.trim() || `Converter exited with status ${code}.`)); }); }); }

async function pdfText(input: string, output: string) { await run(process.env.PDFTOTEXT_PATH || "pdftotext", ["-layout", "-nopgbrk", input, output]); return readFile(output, "utf8"); }
async function renderPdf(input: string, directory: string, format: "png" | "jpg") { const prefix = path.join(directory, "page"); const args = format === "png" ? ["-png", "-r", "150", input, prefix] : ["-jpeg", "-r", "150", "-jpegopt", "quality=88", input, prefix]; await run(process.env.PDFTOPPM_PATH || "pdftoppm", args); return (await readdir(directory)).filter((name) => name.startsWith("page-") && name.endsWith(format === "png" ? ".png" : ".jpg")).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map((name) => path.join(directory, name)); }
async function officeToPdf(input: string, directory: string) { await run(process.env.LIBREOFFICE_PATH || "libreoffice", ["--headless", "--nologo", "--nolockcheck", "--nodefault", "--nofirststartwizard", "--convert-to", "pdf", "--outdir", directory, input]); const result = (await readdir(directory)).find((name) => name.toLowerCase().endsWith(".pdf")); if (!result) throw new Error("The office converter did not produce a PDF. The file may be corrupt or password-protected."); return path.join(directory, result); }
async function imagesToPdf(files: string[], output: string, extension: ".jpg" | ".png") { const pdf = await PDFDocument.create(); for (const file of files) { const bytes = await readFile(file), image = extension === ".png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes); const maxWidth = 595, maxHeight = 842, scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1), width = image.width * scale, height = image.height * scale; const page = pdf.addPage([Math.max(width, 72), Math.max(height, 72)]); page.drawImage(image, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height }); } await writeFile(output, await pdf.save()); }

export async function convertFiles(conversion: ConversionName, uploads: File[]) {
  const rule = rules[conversion]; if (!uploads.length) throw new Error("Choose a file to convert."); if (!rule.multiple && uploads.length !== 1) throw new Error("This converter accepts one file at a time."); if (uploads.length > 20) throw new Error("A maximum of 20 images can be combined at once.");
  const total = uploads.reduce((sum, file) => sum + file.size, 0); if (total > 20 * 1024 * 1024) throw new Error("The total upload is larger than the 20 MB limit.");
  const directory = await mkdtemp(path.join(tmpdir(), "figimi-"));
  try {
    const inputs: string[] = [];
    for (const [index, upload] of uploads.entries()) { const extension = path.extname(upload.name).toLowerCase(); if (!rule.extensions.includes(extension)) throw new Error(`Unsupported file type. Choose: ${rule.extensions.join(", ")}.`); const data = Buffer.from(await upload.arrayBuffer()); if (!looksValid(data, extension)) throw new Error(`${upload.name} appears corrupt or does not match its file extension.`); const input = path.join(directory, `input-${index}${extension}`); await writeFile(input, data); inputs.push(input); }
    const base = safeBase(uploads[0].name); let output: string; let downloadName: string;
    if (conversion === "jpg-to-pdf" || conversion === "png-to-pdf") { output = path.join(directory, `${base}.pdf`); await imagesToPdf(inputs, output, conversion === "png-to-pdf" ? ".png" : ".jpg"); downloadName = `${base}.pdf`; }
    else if (["word-to-pdf", "excel-to-pdf", "ppt-to-pdf"].includes(conversion)) { output = await officeToPdf(inputs[0], directory); downloadName = `${base}.pdf`; }
    else if (conversion === "pdf-to-word") { const text = await pdfText(inputs[0], path.join(directory, "source.txt")); if (!text.trim()) throw new Error("No selectable text was found. This PDF may contain scanned images and require OCR."); const document = new Document({ sections: [{ children: text.split(/\r?\n/).map((line) => new Paragraph(line)) }] }); output = path.join(directory, `${base}.docx`); await writeFile(output, await Packer.toBuffer(document)); downloadName = `${base}.docx`; }
    else if (conversion === "pdf-to-excel") { const text = await pdfText(inputs[0], path.join(directory, "source.txt")); if (!text.trim()) throw new Error("No selectable text was found. Scanned PDFs require OCR before table extraction."); const workbook = new ExcelJS.Workbook(), sheet = workbook.addWorksheet("Extracted PDF"); text.split(/\r?\n/).filter(Boolean).forEach((line) => sheet.addRow(line.trim().split(/\s{2,}/))); sheet.columns.forEach((column) => { column.width = Math.min(50, Math.max(12, ...(column.values as unknown[]).map((value) => String(value || "").length + 2))); }); output = path.join(directory, `${base}.xlsx`); await workbook.xlsx.writeFile(output); downloadName = `${base}.xlsx`; }
    else if (conversion === "pdf-to-ppt") { const pages = await renderPdf(inputs[0], directory, "jpg"); if (!pages.length) throw new Error("No PDF pages could be rendered."); const pptx = new PptxGenJS(); pptx.layout = "LAYOUT_WIDE"; pages.forEach((page) => { const slide = pptx.addSlide(); slide.addImage({ path: page, x: 0, y: 0, w: 13.333, h: 7.5 }); }); output = path.join(directory, `${base}.pptx`); await pptx.writeFile({ fileName: output }); downloadName = `${base}.pptx`; }
    else { const format = conversion === "pdf-to-png" ? "png" : "jpg", pages = await renderPdf(inputs[0], directory, format); if (!pages.length) throw new Error("No PDF pages could be rendered."); const zip = new JSZip(); for (const [index, page] of pages.entries()) zip.file(`page-${index + 1}.${format}`, await readFile(page)); output = path.join(directory, `${base}-${format}.zip`); await writeFile(output, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } })); downloadName = `${base}-${format}.zip`; }
    const extension = path.extname(downloadName).toLowerCase(), data = await readFile(output); return { data, downloadName, contentType: mimeByExtension[extension] || "application/octet-stream" };
  } finally { await rm(directory, { recursive: true, force: true }); }
}
