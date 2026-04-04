/**
 * 紫微斗数分析提示词模板
 */

export interface ZiweiAnalysisInput {
  birthDate: string; // 公历生日，格式：YYYY-MM-DD
  birthTime: string; // 出生时间，格式：HH:mm（24小时制）
  gender: 'male' | 'female' | string; // 性别
  location?: string; // 出生地点（可选）
}

/**
 * 构建紫微斗数分析提示词
 */
export function buildZiweiPrompt(input: ZiweiAnalysisInput): string {
  const { birthDate, birthTime, gender, location } = input;

  const locationText = location ? `- 出生地点：${location}` : '';

  return `你是一位资深的紫微斗数命理分析专家，精通中国传统的紫微斗数命理学。请根据以下信息进行专业的紫微斗数排盘和命理分析：

出生信息：
- 公历生日：${birthDate}
- 出生时间：${birthTime}
- 性别：${gender}
${locationText}

请按照以下结构进行详细分析：

## 一、紫微斗数排盘
1. 命宫、身宫：定位和主星分析
2. 十二宫位：命宫、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、交友宫、官禄宫、田宅宫、福德宫、父母宫
3. 十四主星：紫微、天机、太阳、武曲、天同、廉贞、天府、太阴、贪狼、巨门、天相、天梁、七杀、破军的分布和组合
4. 辅星：左辅、右弼、文昌、文曲、天魁、天钺、禄存、羊刃、陀罗、火星、铃星、地空、地劫等的配置

## 二、命盘解析
1. 命宫主星：分析命宫主星的特性和影响
2. 身宫主星：分析身宫主星的特性和影响
3. 三方四正：分析命宫的三方四正格局
4. 四化星：化禄、化权、化科、化忌的分布和影响

## 三、十二宫分析
1. 命宫：性格特质、先天命运
2. 兄弟宫：兄弟姐妹关系、合作运势
3. 夫妻宫：婚姻感情、配偶特质
4. 子女宫：子女运势、生育情况
5. 财帛宫：财运走势、理财能力
6. 疾厄宫：健康状况、易患疾病
7. 迁移宫：外出发展、旅行运势
8. 交友宫：人际关系、朋友助力
9. 官禄宫：事业运势、职业发展
10. 田宅宫：房产运势、家庭环境
11. 福德宫：精神世界、福报积累
12. 父母宫：父母关系、家庭背景

## 四、特殊格局
1. 富贵格局：分析是否存在特殊富贵格局
2. 凶险格局：分析需要注意的凶险格局
3. 整体评价：综合评定命盘层次

## 五、大运流年
1. 十年大运：分析未来十年运势走势
2. 流年运势：分析最近几年的具体运势
3. 重要年份：指出需要特别注意的年份

## 六、人生建议
1. 发展方向：适合的职业和人生道路
2. 注意事项：需要避免的陷阱和风险
3. 改善建议：如何通过后天努力改善运势

请用专业但易懂的语言回答，避免使用过于玄学的术语。分析要全面、客观，既指出优势也提醒需要注意的方面。结果请用中文呈现。`;
}

/**
 * 解析紫微斗数分析结果
 */
export function parseZiweiResult(aiResponse: string): {
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
      '紫微斗数分析仅供参考，人生掌握在自己手中',
      '积极面对生活，行善积德可以改善运势',
    ],
  };
}