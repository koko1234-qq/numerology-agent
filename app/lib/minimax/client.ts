// Minimax API配置
const MINIMAX_API_BASE_URL = process.env.MINIMAX_API_BASE_URL || 'https://api.minimax.chat/v1';
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;

// 检查是否是测试用的默认API密钥
const IS_MOCK_MODE = !MINIMAX_API_KEY || MINIMAX_API_KEY === 'your_minimax_api_key_here';

if (IS_MOCK_MODE) {
  console.warn('MINIMAX_API_KEY is not set or using default value. Running in mock mode.');
}

export interface MinimaxChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MinimaxChatRequest {
  model?: string;
  messages: MinimaxChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface MinimaxChatResponse {
  id: string;
  choices: Array<{
    message: MinimaxChatMessage;
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Minimax API客户端
 */
export class MinimaxClient {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey?: string, baseURL?: string) {
    this.apiKey = apiKey || MINIMAX_API_KEY || '';
    this.baseURL = baseURL || MINIMAX_API_BASE_URL;
  }

  /**
   * 发送聊天请求
   */
  async chatCompletion(request: MinimaxChatRequest): Promise<MinimaxChatResponse> {
    // Mock模式：返回模拟响应
    if (IS_MOCK_MODE) {
      console.log('Mock mode: simulating chat completion');
      await new Promise(resolve => setTimeout(resolve, 300));

      const mockResponse: MinimaxChatResponse = {
        id: 'mock-' + Date.now(),
        choices: [
          {
            message: {
              role: 'assistant',
              content: '这是模拟的AI响应。在实际部署中，请设置有效的MINIMAX_API_KEY。',
            },
            finish_reason: 'stop',
            index: 0,
          },
        ],
        usage: {
          prompt_tokens: 50,
          completion_tokens: 100,
          total_tokens: 150,
        },
      };

      return mockResponse;
    }

    const { model = 'abab6-chat', messages, temperature = 0.7, max_tokens = 2000, stream = false } = request;

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Minimax API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * 流式聊天请求
   */
  async chatCompletionStream(request: MinimaxChatRequest): Promise<ReadableStream> {
    const { model = 'abab6-chat', messages, temperature = 0.7, max_tokens = 2000 } = request;

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Minimax API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.body as ReadableStream;
  }

  /**
   * 简化聊天调用
   */
  async simpleChat(prompt: string, systemPrompt?: string): Promise<string> {
    // Mock模式：返回模拟响应
    if (IS_MOCK_MODE) {
      console.log('Mock mode: simulating AI response');
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟

      // 根据提示内容返回不同的模拟响应
      if (prompt.includes('八字') || prompt.includes('bazi')) {
        return `八字排盘分析结果（模拟数据）：

        八字排盘：癸卯年 甲寅月 丙午日 己未时
        十神分析：日主丙火，生于寅月，得令而旺。财星透干，官星藏支。
        大运排盘：5岁起运，大运走势：乙卯、丙辰、丁巳、戊午、己未、庚申。
        流年分析：2024甲辰年，岁运并临，事业有突破之机。
        性格特点：热情开朗，富有创造力，但有时急躁冲动。
        事业建议：适合创意、文化、教育等行业。
        感情分析：感情丰富，需注意沟通方式，避免冲动决策。`;
      } else if (prompt.includes('紫微斗数') || prompt.includes('ziwei')) {
        return `紫微斗数分析结果（模拟数据）：

        命宫：紫微星坐守，天府同宫，格局尊贵。
        身宫：武曲天相，主财运丰隆，事业有成。
        三方四正：会照七杀、破军，形成杀破狼格局，主变动中求发展。
        星曜分布：财帛宫有禄存，田宅宫有太阳，房产运佳。
        流年运势：2024年流年命宫为天机，主智慧、变动，宜学习新技能。
        事业建议：适合管理、金融、地产相关行业。
        健康提示：注意肠胃系统保养。`;
      } else if (prompt.includes('星座') || prompt.includes('constellation')) {
        return `星座分析结果（模拟数据）：

        太阳星座：根据出生日期推算为白羊座，性格热情勇敢，富有行动力。
        月亮星座：巨蟹座，情感丰富，注重家庭和安全感。
        上升星座：狮子座，外在表现自信大方，有领导气质。
        生肖配合：生肖与星座结合分析，形成独特的人格特质。
        运势分析：当前木星进入事业宫，事业上有发展机会。
        性格建议：发挥白羊座的冲劲，同时学习巨蟹座的耐心。
        人际关系：适合与天秤座、射手座的人合作。`;
      }

      return `这是模拟的AI响应。您输入的提示是：${prompt.substring(0, 100)}...`;
    }

    const messages: MinimaxChatMessage[] = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const response = await this.chatCompletion({
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  }
}

// 默认导出的客户端实例
export const minimaxClient = new MinimaxClient();