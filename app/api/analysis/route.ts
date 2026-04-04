import { NextRequest, NextResponse } from 'next/server';
import { numerologyService, type AnalysisRequest } from '@/app/lib/numerology-service';

/**
 * POST /api/analysis - 执行命理分析
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求数据
    const analysisRequest: AnalysisRequest = {
      type: body.type || 'bazi',
      birthDate: body.birthDate,
      birthTime: body.birthTime,
      gender: body.gender,
      location: body.location,
    };

    // 输入验证
    const validation = numerologyService.validateInput(analysisRequest);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: '输入验证失败',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // 执行分析
    const result = await numerologyService.analyze(analysisRequest);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || '分析失败',
        },
        { status: 500 }
      );
    }

    // 返回成功结果
    return NextResponse.json({
      success: true,
      data: {
        type: result.type,
        analysis: result.result,
        timestamp: result.timestamp,
      },
    });

  } catch (error) {
    console.error('API分析错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: '服务器内部错误',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analysis/types - 获取可用的分析类型
 */
export async function GET(request: NextRequest) {
  try {
    const types = [
      {
        id: 'bazi',
        name: '八字排盘',
        description: '中国传统命理学，通过出生年月日时推算命运走势',
        requiresTime: true,
        requiresGender: true,
      },
      {
        id: 'ziwei',
        name: '紫微斗数',
        description: '中国古代帝王之学，通过星曜分布分析人生格局',
        requiresTime: true,
        requiresGender: true,
      },
      {
        id: 'constellation',
        name: '星座分析',
        description: '西方占星学与生肖结合，分析性格与运势',
        requiresTime: false,
        requiresGender: false,
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        types,
        count: types.length,
      },
    });

  } catch (error) {
    console.error('获取分析类型错误:', error);
    return NextResponse.json(
      {
        success: false,
        error: '服务器内部错误',
      },
      { status: 500 }
    );
  }
}