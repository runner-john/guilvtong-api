import { NextRequest, NextResponse } from 'next/server';
import {
  DOUBAO_API_KEY,
  DOUBAO_MODEL,
  languageNames,
  TRANSLATION_SYSTEM_PROMPT,
  callDoubaoContent,
  createSSEResponse,
} from '@/lib/doubao';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 兼容前端 (sourceText) 和 Express API (text) 两种参数名
    const sourceText = body.sourceText || body.text || '';
    const sourceLang = body.sourceLang || 'auto';
    const targetLang = body.targetLang || 'zh';
    const stream = body.stream === true;

    if (!sourceText) {
      return NextResponse.json(
        { success: false, error: '缺少翻译文本' },
        { status: 400 }
      );
    }

    if (!DOUBAO_API_KEY) {
      return NextResponse.json(
        { success: false, translatedText: '[API Key 未配置] 请在环境变量中设置 DOUBAO_API_KEY' },
        { status: 500 }
      );
    }

    const targetName = languageNames[targetLang] || targetLang;
    const sourceName = sourceLang !== 'auto' ? languageNames[sourceLang] || sourceLang : '';

    const messages = [
      { role: 'system' as const, content: TRANSLATION_SYSTEM_PROMPT },
      {
        role: 'user' as const,
        content: sourceName
          ? `请将以下${sourceName}法律文书翻译成${targetName}，保持法律术语准确、句式严谨：\n\n${sourceText}`
          : `请将以下法律文本翻译为${targetName}，保持法律术语准确、句式严谨：\n\n${sourceText}`,
      },
    ];

    // 流式输出
    if (stream) {
      return createSSEResponse(messages, { temperature: 0.3, max_tokens: 4096 });
    }

    // 非流式输出
    const translatedText = await callDoubaoContent(messages, {
      temperature: 0.3,
      max_tokens: 4096,
    });

    return NextResponse.json({
      success: true,
      translatedText,
      sourceLang,
      targetLang,
      model: DOUBAO_MODEL,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[translate] Error:', message);
    return NextResponse.json(
      { success: false, translatedText: `[翻译服务暂不可用，请稍后重试。]\n\n(错误: ${message})`, error: message },
      { status: 500 }
    );
  }
}
