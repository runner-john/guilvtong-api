import { NextRequest, NextResponse } from 'next/server';
import {
  DOUBAO_API_KEY,
  DOUBAO_MODEL,
  OPINION_SYSTEM_PROMPT,
  callDoubaoContent,
  createSSEResponse,
} from '@/lib/doubao';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const stream = formData.stream !== false; // 默认流式

    if (!DOUBAO_API_KEY) {
      return NextResponse.json(
        { opinion: '[API Key 未配置] 请在环境变量中设置 DOUBAO_API_KEY' },
        { status: 500 }
      );
    }

    const userPrompt = `根据以下信息生成法律意见书：

当事人：甲方-${formData.plaintiffName || '未提供'}(${formData.plaintiffCountry || ''}) vs 乙方-${formData.defendantName || '未提供'}(${formData.defendantCountry || ''})
纠纷类型：${formData.disputeType || '未提供'}
争议金额：${formData.disputeAmount || '未提供'}
纠纷描述：${formData.disputeDescription || '未提供'}
证据情况：${formData.evidence || '未提供'}
具体诉求：${formData.demands || '未提供'}`;

    const messages = [
      { role: 'system' as const, content: OPINION_SYSTEM_PROMPT },
      { role: 'user' as const, content: userPrompt },
    ];

    // 流式输出
    if (stream) {
      return createSSEResponse(messages, { temperature: 0.7, max_tokens: 4096 });
    }

    // 非流式输出
    const opinion = await callDoubaoContent(messages, { temperature: 0.7, max_tokens: 4096 });

    return NextResponse.json({
      success: true,
      opinion,
      model: DOUBAO_MODEL,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[generate-opinion] Error:', message);
    return NextResponse.json(
      { success: false, opinion: `[生成失败] ${message}`, error: message },
      { status: 500 }
    );
  }
}
