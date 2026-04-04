/**
 * 八字排盘分析提示词模板
 */

export interface BaziAnalysisInput {
  birthDate: string; // 公历生日，格式：YYYY-MM-DD
  birthTime: string; // 出生时间，格式：HH:mm（24小时制）
  gender: 'male' | 'female' | string; // 性别
  location?: string; // 出生地点（可选）
}

/**
 * 构建八字分析提示词
 */
export function buildBaziPrompt(input: BaziAnalysisInput): string {
  const { birthDate, birthTime, gender, location } = input;

  const locationText = location ? `- 出生地点：${location}` : '';

  return `你是一位资深的八字命理分析专家，精通中国传统的八字命理学。请根据以下信息进行专业的八字排盘和命理分析：

出生信息：
- 公历生日：${birthDate}
- 出生时间：${birthTime}
- 性别：${gender}
${locationText}

请按照以下结构进行详细分析：

## 一、八字排盘
1. 四柱八字：年柱、月柱、日柱、时柱
2. 十神配置：比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印
3. 日主强弱：分析日干在八字中的强弱状态

## 二、大运排盘
1. 起运时间：精确到年月
2. 大运走势：排定十年一大运的干支
3. 当前大运：分析当前所处的大运阶段

## 三、命局分析
1. 性格特点：基于八字的人格特征分析
2. 事业运势：适合的职业方向和发展建议
3. 财运分析：财运走势和理财建议
4. 感情婚姻：感情运势和婚姻建议
5. 健康状况：需要注意的健康问题

## 四、近期运势
1. 流年分析：分析最近1-3年的运势变化
2. 重要节点：指出需要特别注意的时间点

## 五、综合建议
1. 发展方向：给出具体的职业和生活建议
2. 注意事项：需要避免的事项和化解建议

请用专业但易懂的语言回答，避免使用过于玄学的术语。分析要全面、客观，既指出优势也提醒需要注意的方面。结果请用中文呈现。`;
}

/**
 * 解析八字分析结果
 */
export function parseBaziResult(aiResponse: string): {
  summary: string;
  details: Record<string, string>;
  recommendations: string[];
} {
  // 这里可以添加更复杂的解析逻辑
  // 目前简单返回结构化数据
  return {
    summary: aiResponse.substring(0, 200) + (aiResponse.length > 200 ? '...' : ''),
    details: {
      fullAnalysis: aiResponse,
    },
    recommendations: [
      '以上分析仅供参考，具体人生还需自己把握',
      '保持积极心态，努力奋斗才是改变命运的关键',
    ],
  };
}