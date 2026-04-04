/**
 * 命理分析服务
 */

import { minimaxClient } from './minimax/client';
import { buildBaziPrompt, parseBaziResult, type BaziAnalysisInput } from './prompts/bazi';
import { buildZiweiPrompt, parseZiweiResult, type ZiweiAnalysisInput } from './prompts/ziwei';
import { buildConstellationPrompt, parseConstellationResult, type ConstellationAnalysisInput } from './prompts/constellation';

export type AnalysisType = 'bazi' | 'ziwei' | 'constellation';

export interface AnalysisRequest {
  type: AnalysisType;
  birthDate: string;
  birthTime?: string;
  gender?: string;
  location?: string;
}

export interface AnalysisResult {
  success: boolean;
  type: AnalysisType;
  input: AnalysisRequest;
  result: {
    summary: string;
    details: Record<string, string>;
    recommendations: string[];
    rawResponse?: string;
  };
  error?: string;
  timestamp: Date;
}

/**
 * 命理分析服务
 */
export class NumerologyService {
  /**
   * 执行命理分析
   */
  async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    const { type, birthDate, birthTime, gender, location } = request;

    try {
      let prompt: string;
      let rawResponse: string;

      switch (type) {
        case 'bazi':
          prompt = buildBaziPrompt({ birthDate, birthTime: birthTime || '12:00', gender: gender || 'unknown', location });
          rawResponse = await minimaxClient.simpleChat(prompt, '你是一位专业的八字命理分析专家。');
          return {
            success: true,
            type,
            input: request,
            result: {
              ...parseBaziResult(rawResponse),
              rawResponse,
            },
            timestamp: new Date(),
          };

        case 'ziwei':
          prompt = buildZiweiPrompt({ birthDate, birthTime: birthTime || '12:00', gender: gender || 'unknown', location });
          rawResponse = await minimaxClient.simpleChat(prompt, '你是一位专业的紫微斗数命理分析专家。');
          return {
            success: true,
            type,
            input: request,
            result: {
              ...parseZiweiResult(rawResponse),
              rawResponse,
            },
            timestamp: new Date(),
          };

        case 'constellation':
          prompt = buildConstellationPrompt({ birthDate, birthTime, gender, location });
          rawResponse = await minimaxClient.simpleChat(prompt, '你是一位专业的星座命理分析专家，精通西方占星学和中国传统文化。');
          return {
            success: true,
            type,
            input: request,
            result: {
              ...parseConstellationResult(rawResponse),
              rawResponse,
            },
            timestamp: new Date(),
          };

        default:
          throw new Error(`不支持的命理分析类型: ${type}`);
      }
    } catch (error) {
      console.error('命理分析失败:', error);
      return {
        success: false,
        type,
        input: request,
        result: {
          summary: '分析失败',
          details: {},
          recommendations: ['请检查输入信息是否正确，或稍后重试'],
        },
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date(),
      };
    }
  }

  /**
   * 批量分析
   */
  async analyzeMultiple(requests: AnalysisRequest[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    for (const request of requests) {
      const result = await this.analyze(request);
      results.push(result);
    }
    return results;
  }

  /**
   * 获取分析类型描述
   */
  getAnalysisTypeDescription(type: AnalysisType): { name: string; description: string } {
    const descriptions = {
      bazi: {
        name: '八字排盘',
        description: '中国传统命理学，通过出生年月日时推算命运走势',
      },
      ziwei: {
        name: '紫微斗数',
        description: '中国古代帝王之学，通过星曜分布分析人生格局',
      },
      constellation: {
        name: '星座分析',
        description: '西方占星学与生肖结合，分析性格与运势',
      },
    };
    return descriptions[type];
  }

  /**
   * 验证输入数据
   */
  validateInput(request: AnalysisRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.birthDate) {
      errors.push('出生日期不能为空');
    } else {
      const birthDate = new Date(request.birthDate);
      if (isNaN(birthDate.getTime())) {
        errors.push('出生日期格式无效');
      }
    }

    if (request.type === 'bazi' || request.type === 'ziwei') {
      if (!request.birthTime) {
        errors.push('出生时间不能为空');
      } else {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(request.birthTime)) {
          errors.push('出生时间格式无效，请使用HH:mm格式');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// 默认导出的服务实例
export const numerologyService = new NumerologyService();