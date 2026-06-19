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
    const { caseDescription, disputeType, region, language } = await request.json();

    if (!caseDescription && !disputeType) {
      return NextResponse.json(
        { success: false, error: '缺少案件描述' },
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
        content: `${LEGAL_SYSTEM_PROMPT}\n\n你是一名跨境法律人才匹配专家。请以JSON格式返回推荐结果。`,
      },
      {
        role: 'user' as const,
        content: `根据以下案件信息，推荐最合适的律师/调解员类型。以JSON格式返回：
{
  "recommendedLawyers": [
    {
      "name": "推荐律师姓名",
      "specialty": "专业领域",
      "languages": ["可工作语言"],
      "experience": "相关经验年限",
      "matchReason": "匹配原因",
      "contactInfo": "联系方式（模拟）"
    }
  ],
  "matchAnalysis": "整体匹配分析"
}

案件信息：
- 争议类型：${disputeType || '未指定'}
- 涉及地区：${region || '中国-东盟'}
- 语言需求：${language || '中越双语'}
- 案件描述：${caseDescription || '无'}`,
      },
    ];

    const rawContent = await callDoubaoContent(messages, {
      temperature: 0.5,
      max_tokens: 2048,
    });

    const parsed = parseJsonFromContent(rawContent);

    return NextResponse.json({
      success: true,
      ...(parsed as Record<string, unknown>),
      model: DOUBAO_MODEL,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[lawyer-match] Error:', message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
