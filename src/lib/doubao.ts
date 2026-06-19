// ============================================================
// 桂律通 - 共享豆包 API 客户端
// 所有 API 路由的统一调用层
// ============================================================

// ----------------------------------------------------------
// 配置（从环境变量读取）
// ----------------------------------------------------------
export const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || '';
export const DOUBAO_MODEL = process.env.DOUBAO_MODEL_ID || 'doubao-seed-2-0-pro-260215';
export const DOUBAO_URL =
  process.env.DOUBAO_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// ----------------------------------------------------------
// 类型
// ----------------------------------------------------------
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DoubaoOptions {
  temperature?: number;
  max_tokens?: number;
}

// ----------------------------------------------------------
// 语言名称映射
// ----------------------------------------------------------
export const languageNames: Record<string, string> = {
  zh: '中文',
  en: '英语',
  th: '泰语',
  vi: '越南语',
};

// ----------------------------------------------------------
// 系统提示词
// ----------------------------------------------------------

/** 通用法律助手（用于 chat / parse-contract / lawyer-match） */
export const LEGAL_SYSTEM_PROMPT = `你是桂律通的AI法律助手，专精于中国-东盟（尤其是中越、中泰）跨境民商事法律服务。你的能力包括：

1. **法律文书翻译**：支持中文 ↔ 英语、泰语、越南语的精准法律翻译
2. **合同分析与审查**：解析跨境合同条款，识别风险点
3. **法律意见书生成**：根据案件信息生成格式严谨的法律意见书
4. **律师智能匹配**：根据争议类型推荐合适的专业律师

请始终保持专业、严谨、客观的法律态度。使用规范的法律术语。`;

/** 法律翻译专家 */
export const TRANSLATION_SYSTEM_PROMPT = `你是一位专业的法律翻译专家，擅长中文、英语、泰语、越南语之间的法律文书翻译。

翻译要求:
1. 保持法律术语的准确性和专业性
2. 确保法律文书格式的严谨性
3. 符合目标语言的法律表达习惯
4. 保持原文的完整含义和语气
5. 对于特定法律概念，可在括号中补充原文术语以便对照

请直接输出翻译结果，不要添加任何解释或说明。`;

/** 法律意见书生成专家 */
export const OPINION_SYSTEM_PROMPT = `你是中国-东盟跨境民商事法律服务专家。请生成专业法律意见书，格式如下：

================================================================================
                        法律意见书
================================================================================

一、案件基本信息
   当事人信息 | 纠纷类型 | 争议金额 | 案件摘要

二、纠纷事实陈述
   [详细描述起因、经过和现状]

三、争议焦点分析
   [逐点分析争议焦点]

四、法律适用分析
   - 中国相关法律
   - 东盟国家相关法律
   - 国际条约/公约

五、AI研判与处理建议
   1. 胜诉可能性评估（双方角度）
   2. 给双方的具体建议
   3. 最优解决方案推荐（协商/调解/仲裁/诉讼）

六、证据清单与收集建议

七、风险提示

八、免责声明
   本法律意见书仅供参考，不构成正式法律建议。

================================================================================
                        桂律通 - 跨境法律服务平台
================================================================================`;

// ----------------------------------------------------------
// 核心函数：调用豆包 API（返回原始 Response）
// ----------------------------------------------------------
export async function callDoubao(
  messages: ChatMessage[],
  options: DoubaoOptions & { stream?: boolean } = {}
): Promise<Response> {
  const { temperature = 0.7, max_tokens = 4096, stream = false } = options;

  const body: Record<string, unknown> = {
    model: DOUBAO_MODEL,
    messages,
    temperature,
    max_tokens,
  };

  if (stream) body.stream = true;

  const response = await fetch(DOUBAO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DOUBAO_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Doubao API ${response.status}: ${err}`);
  }

  return response;
}

// ----------------------------------------------------------
// 便捷函数：非流式调用，直接返回文本内容
// ----------------------------------------------------------
export async function callDoubaoContent(
  messages: ChatMessage[],
  options: DoubaoOptions = {}
): Promise<string> {
  const response = await callDoubao(messages, { ...options, stream: false });
  const result = await response.json();
  return result.choices?.[0]?.message?.content || '';
}

// ----------------------------------------------------------
// 流式 SSE 响应构造
// ----------------------------------------------------------
export function createSSEResponse(
  messages: ChatMessage[],
  options: DoubaoOptions = {}
): Response {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const response = await callDoubao(messages, { ...options, stream: true });

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch {
                // 跳过解析失败的行
              }
            }
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

// ----------------------------------------------------------
// JSON 提取工具：从 LLM 输出中解析 JSON
// ----------------------------------------------------------
export function parseJsonFromContent(rawContent: string): unknown {
  try {
    // 尝试提取 markdown 代码块中的 JSON
    const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawContent;
    return JSON.parse(jsonStr);
  } catch {
    // 解析失败则包装为原始分析结果
    return { rawAnalysis: rawContent };
  }
}
