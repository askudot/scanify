import { NextRequest, NextResponse } from "next/server";
import { getAIClient, AI_MODEL } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: "No content" }, { status: 400 });

    const client = getAIClient();
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    const response = await client.chat.completions.create({
      model: AI_MODEL,
      stream: false,
      messages: [
        {
          role: "system",
          content: `You are an expert document analyzer. Analyze the document and respond with ONLY a valid JSON object (no markdown, no code fences, no explanation) with this exact shape:
{
  "summary": "concise 2-3 sentence summary",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "documentType": "e.g. Contract, Research Paper, Invoice, Article, Report, Resume, etc.",
  "language": "e.g. English, Indonesian, Chinese, etc."
}`,
        },
        {
          role: "user",
          content: `Analyze this document:\n\n${content.slice(0, 30000)}`,
        },
      ],
      temperature: 0.3,
    });

    let raw = response.choices[0]?.message?.content || "{}";
    // Strip markdown code fences if model still adds them
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Fallback: try to extract JSON block
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("Model did not return valid JSON");
    }

    return NextResponse.json({
      summary: parsed.summary || "Could not generate summary",
      keyPoints: parsed.keyPoints || [],
      documentType: parsed.documentType || "Unknown",
      language: parsed.language || "Unknown",
      wordCount,
    });
  } catch (e: any) {
    console.error("Analyze error:", e);
    return NextResponse.json({ error: e.message || "Analysis failed" }, { status: 500 });
  }
}
