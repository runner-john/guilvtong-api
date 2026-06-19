import { NextRequest, NextResponse } from 'next/server';
import {
  DOUBAO_API_KEY,
  DOUBAO_MODEL,
  LEGAL_SYSTEM_PROMPT,
  callDoubaoContent,
  createSSEResponse,
  type ChatMessage,
} from '@/lib/doubao';

export async function POST(request: NextRequest) {
  try {
    const { messages = [], stream = false } = await request.json();

    if (!messages.length) {
      return NextResponse.json(
        { success: false, error: '缺少对话消息' },
        { status: 400 }
      );
    }

    if (!DOUBAO_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: LEGAL_SYSTEM_PROMPT },
      ...messages,
    ];

    // 流式输出
    if (stream) {
      return createSSEResponse(fullMessages, { temperature: 0.7, max_tokens: 4096 });
    }

    // 非流式输出
    const reply = await callDoubaoContent(fullMessages, {
      temperature: 0.7,
      max_tokens: 4096,
    });

    return NextResponse.json({
      success: true,
      reply,
      model: DOUBAO_MODEL,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[chat] Error:', message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
