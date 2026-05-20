import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();
    let content = "";

    if (name.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse" as any)) as any;
      const parser = pdfParse.default || pdfParse;
      const data = await parser(buffer);
      content = data.text;
    } else if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else if (name.endsWith(".txt") || name.endsWith(".md")) {
      content = buffer.toString("utf-8");
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    content = content.trim();
    if (!content) return NextResponse.json({ error: "Could not extract text" }, { status: 400 });

    // Cap at 50k chars to stay within model context
    if (content.length > 50000) content = content.slice(0, 50000) + "\n[... truncated]";

    return NextResponse.json({ content, length: content.length });
  } catch (e: any) {
    console.error("Extract error:", e);
    return NextResponse.json({ error: e.message || "Extraction failed" }, { status: 500 });
  }
}
