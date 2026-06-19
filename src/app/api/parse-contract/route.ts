import { NextRequest, NextResponse } from 'next/server';
import {
  DOUBAO_API_KEY,
  DOUBAO_MODEL,
  LEGAL_SYSTEM_PROMPT,
  callDoubaoContent,
  parseJsonFromContent,
} from '@/lib/doubao';

export async function POST(request: NextRequest) {
  try {
    const { contractText, language = 'auto' } = await request.json();

    if (!contractText) {
      return NextResponse.json(
        { success: false, error: '缺少合同文本' },
        { status: 400 }
      );
    }

    if (!DOUBAO_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    const messages = [
      {
        role: 'system' as const,
        content: `${LEGAL_SYSTEM_PROMPT}\n\n你是一名跨境商事合同审查专家。请以JSON格式返回分析结果。`,
      },
      {
        role: 'user' as const,
        content: `请分析以下合同，提取关键信息并识别风险点。以JSON格式返回：
{
  "parties": [{"name": "", "role": "", "nationality": ""}],
  "subjectMatter": "",
  "keyClauses": [{"title": "", "summary": "", "riskLevel": "low|medium|high"}],
  "riskPoints": [{"clause": "", "risk": "", "suggestion": ""}],
  "overallAssessment": ""
}

合同内容：
${contractText}`,
      },
    ];

    const rawContent = await callDoubaoContent(messages, {
      temperature: 0.3,
      max_tokens: 4096,
    });

    const analysis = parseJsonFromContent(rawContent);

    return NextResponse.json({
      success: true,
      analysis,
      model: DOUBAO_MODEL,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[parse-contract] Error:', message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
