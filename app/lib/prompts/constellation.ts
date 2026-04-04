/**
 * 星座分析提示词模板
 */

export interface ConstellationAnalysisInput {
  birthDate: string; // 公历生日，格式：YYYY-MM-DD
  birthTime?: string; // 出生时间（可选）
  gender?: string; // 性别（可选）
  location?: string; // 出生地点（可选）
}

/**
 * 获取星座信息
 */
export function getConstellationInfo(birthDate: string): {
  sunSign: string; // 太阳星座
  chineseZodiac: string; // 生肖
  element: string; // 元素
  modality: string; // 模式
  rulingPlanet: string; // 守护行星
} {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  // 太阳星座判断
  let sunSign = '';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sunSign = '白羊座';
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sunSign = '金牛座';
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) sunSign = '双子座';
  else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) sunSign = '巨蟹座';
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunSign = '狮子座';
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunSign = '处女座';
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) sunSign = '天秤座';
  else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) sunSign = '天蝎座';
  else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) sunSign = '射手座';
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sunSign = '摩羯座';
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sunSign = '水瓶座';
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sunSign = '双鱼座';

  // 生肖计算（简单版）
  const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const chineseZodiac = zodiacAnimals[(year - 4) % 12];

  // 星座属性
  const signProperties: Record<string, { element: string; modality: string; rulingPlanet: string }> = {
    '白羊座': { element: '火', modality: '创始', rulingPlanet: '火星' },
    '金牛座': { element: '土', modality: '固定', rulingPlanet: '金星' },
    '双子座': { element: '风', modality: '变动', rulingPlanet: '水星' },
    '巨蟹座': { element: '水', modality: '创始', rulingPlanet: '月亮' },
    '狮子座': { element: '火', modality: '固定', rulingPlanet: '太阳' },
    '处女座': { element: '土', modality: '变动', rulingPlanet: '水星' },
    '天秤座': { element: '风', modality: '创始', rulingPlanet: '金星' },
    '天蝎座': { element: '水', modality: '固定', rulingPlanet: '冥王星' },
    '射手座': { element: '火', modality: '变动', rulingPlanet: '木星' },
    '摩羯座': { element: '土', modality: '创始', rulingPlanet: '土星' },
    '水瓶座': { element: '风', modality: '固定', rulingPlanet: '天王星' },
    '双鱼座': { element: '水', modality: '变动', rulingPlanet: '海王星' },
  };

  const properties = signProperties[sunSign] || { element: '', modality: '', rulingPlanet: '' };

  return {
    sunSign,
    chineseZodiac,
    element: properties.element,
    modality: properties.modality,
    rulingPlanet: properties.rulingPlanet,
  };
}

/**
 * 构建星座分析提示词
 */
export function buildConstellationPrompt(input: ConstellationAnalysisInput): string {
  const { birthDate, birthTime, gender, location } = input;

  const constellationInfo = getConstellationInfo(birthDate);
  const { sunSign, chineseZodiac, element, modality, rulingPlanet } = constellationInfo;

  const additionalInfo = [
    birthTime ? `- 出生时间：${birthTime}` : null,
    gender ? `- 性别：${gender}` : null,
    location ? `- 出生地点：${location}` : null,
  ].filter(Boolean).join('\n');

  return `你是一位资深的星座命理分析专家，精通西方占星学和中国传统文化。请根据以下信息进行专业的星座命理分析：

出生信息：
- 公历生日：${birthDate}
${additionalInfo}

星座信息：
- 太阳星座：${sunSign}
- 中国生肖：${chineseZodiac}
- 元素属性：${element}元素
- 模式特质：${modality}星座
- 守护行星：${rulingPlanet}

请按照以下结构进行详细分析：

## 一、太阳星座分析
1. 基本特质：${sunSign}的核心性格特征
2. 优点分析：${sunSign}的主要优势
3. 缺点分析：${sunSign}需要注意的缺点
4. 人生课题：${sunSign}需要学习的人生课题

## 二、星座元素与模式
1. ${element}元素特质：分析${element}元素带来的性格影响
2. ${modality}模式特质：分析${modality}星座的行为模式
3. 守护行星影响：分析${rulingPlanet}对性格和运势的影响

## 三、生肖结合分析
1. ${chineseZodiac}生肖特质：分析生肖性格特征
2. 星座生肖组合：分析${sunSign}与${chineseZodiac}的组合效应
3. 文化融合：中西方命理学的互补分析

## 四、人生领域分析
1. 事业财运：适合的职业方向、财运走势
2. 感情婚姻：感情特质、婚姻建议
3. 人际关系：社交特点、交友建议
4. 健康养生：需要注意的健康问题
5. 学习成长：学习方法和成长建议

## 五、近期运势
1. 年度运势：分析今年的整体运势
2. 月度重点：最近几个月的注意事项
3. 幸运提示：提升运势的具体建议

## 六、个人发展建议
1. 优势发挥：如何最大化发挥星座优势
2. 缺点改善：如何克服星座带来的缺点
3. 人生规划：基于星座特质的人生规划建议

请用专业但易懂的语言回答，结合中西方命理智慧。分析要全面、客观，既指出优势也提醒需要注意的方面。结果请用中文呈现。`;
}

/**
 * 解析星座分析结果
 */
export function parseConstellationResult(aiResponse: string): {
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
      '星座分析仅供参考，每个人都是独特的个体',
      '相信自己，努力创造属于自己的美好人生',
    ],
  };
}