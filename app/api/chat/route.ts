import { NextRequest, NextResponse } from "next/server";
import { getAIClient, AI_MODEL } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { content, messages } = await req.json();
    if (!content) return NextResponse.json({ error: "No document content" }, { status: 400 });
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const client = getAIClient();
    const docContext = content.length > 30000 ? content.slice(0, 30000) + "\n[... truncated]" : content;

    const response = await client.chat.completions.create({
      model: AI_MODEL,
      stream: false,
      messages: [
        {
          role: "system",
          content: `You are Scanify, an AI document assistant. Answer questions about the document below. Be concise and direct. If the answer is not in the document, say so.

DOCUMENT:
"""
${docContext}
"""`,
        },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.5,
    });

    const reply = response.choices[0]?.message?.content || "Sorry, no response.";
    return NextResponse.json({ reply });
  } catch (e: any) {
    console.error("Chat error:", e);
    return NextResponse.json({ error: e.message || "Chat failed" }, { status: 500 });
  }
}
