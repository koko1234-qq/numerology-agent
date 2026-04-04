import { NextRequest, NextResponse } from 'next/server';
import { minimaxClient } from '@/app/lib/minimax/client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  sessionId?: string;
  analysisType?: 'bazi' | 'ziwei' | 'constellation';
}

/**
 * POST /api/chat - 处理聊天消息
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, sessionId, analysisType }: ChatRequest = body;

    // 验证消息
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '消息不能为空',
        },
        { status: 400 }
      );
    }

    // 构建系统提示词（根据分析类型）
    let systemPrompt = '你是一位专业的命理分析助手，可以帮助用户进行八字排盘、紫微斗数和星座分析。请用专业但易懂的语言回答用户的问题。';

    if (analysisType === 'bazi') {
      systemPrompt = '你是一位专业的八字命理分析专家，精通中国传统的八字命理学。请根据用户提供的信息进行专业的八字排盘和命理分析。';
    } else if (analysisType === 'ziwei') {
      systemPrompt = '你是一位专业的紫微斗数命理分析专家，精通中国传统的紫微斗数命理学。请根据用户提供的信息进行专业的紫微斗数排盘和命理分析。';
    } else if (analysisType === 'constellation') {
      systemPrompt = '你是一位专业的星座命理分析专家，精通西方占星学和中国传统文化。请根据用户提供的信息进行专业的星座命理分析。';
    }

    // 准备发送给Minimax的消息
    const minimaxMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
    ];

    // 调用Minimax API
    const response = await minimaxClient.chatCompletion({
      messages: minimaxMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    });

    const assistantMessage = response.choices[0]?.message?.content || '抱歉，我无法生成回答。';

    // 返回响应
    return NextResponse.json({
      success: true,
      data: {
        message: {
          role: 'assistant',
          content: assistantMessage,
        },
        sessionId: sessionId || generateSessionId(),
        usage: response.usage,
        created: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('聊天API错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: '聊天处理失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * 生成会话ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}