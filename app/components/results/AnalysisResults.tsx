'use client';

import { useState } from 'react';
import { AnalysisResult as AnalysisResultType } from '@/app/lib/numerology-service';

interface AnalysisResultsProps {
  results: AnalysisResultType[];
  userInfo: {
    birthDate: string;
    birthTime: string;
    gender: string;
    location?: string;
  };
  onNewAnalysis: () => void;
  onStartChat: () => void;
}

// 分析类型图标和颜色
const ANALYSIS_TYPE_CONFIG = {
  bazi: {
    name: '八字排盘',
    icon: '㈧',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  ziwei: {
    name: '紫微斗数',
    icon: '紫',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  constellation: {
    name: '星座分析',
    icon: '♈',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
};

export default function AnalysisResults({
  results,
  userInfo,
  onNewAnalysis,
  onStartChat,
}: AnalysisResultsProps) {
  const [expandedResult, setExpandedResult] = useState<string | null>(
    results.length > 0 ? results[0].type : null
  );

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleExpand = (type: string) => {
    setExpandedResult(expandedResult === type ? null : type);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => alert('已复制到剪贴板'),
      err => console.error('复制失败:', err)
    );
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (results.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">暂无分析结果</h3>
        <p className="mb-6 text-gray-600">
          您还没有进行过命理分析，请先填写个人信息并选择分析类型。
        </p>
        <button
          onClick={onNewAnalysis}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white hover:from-purple-700 hover:to-blue-700"
        >
          开始新的分析
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 用户信息摘要 */}
      <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">分析信息摘要</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-4">
            <div className="text-sm text-gray-500">出生日期</div>
            <div className="text-lg font-medium text-gray-900">{userInfo.birthDate}</div>
          </div>
          <div className="rounded-lg bg-white p-4">
            <div className="text-sm text-gray-500">出生时间</div>
            <div className="text-lg font-medium text-gray-900">{userInfo.birthTime}</div>
          </div>
          <div className="rounded-lg bg-white p-4">
            <div className="text-sm text-gray-500">性别</div>
            <div className="text-lg font-medium text-gray-900">
              {userInfo.gender === 'male' ? '男性' : '女性'}
            </div>
          </div>
          <div className="rounded-lg bg-white p-4">
            <div className="text-sm text-gray-500">分析数量</div>
            <div className="text-lg font-medium text-gray-900">{results.length}种</div>
          </div>
        </div>
      </div>

      {/* 分析结果列表 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">分析结果</h3>
          <div className="flex space-x-3">
            <button
              onClick={onStartChat}
              className="rounded-lg border border-purple-600 px-4 py-2 text-purple-600 hover:bg-purple-50"
            >
              开始对话
            </button>
            <button
              onClick={onNewAnalysis}
              className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black"
            >
              新的分析
            </button>
          </div>
        </div>

        {results.map((result, index) => {
          const config = ANALYSIS_TYPE_CONFIG[result.type as keyof typeof ANALYSIS_TYPE_CONFIG] ||
            ANALYSIS_TYPE_CONFIG.bazi;

          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              {/* 结果头部 */}
              <div
                className={`flex cursor-pointer items-center justify-between p-6 ${config.bgColor}`}
                onClick={() => toggleExpand(result.type)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${config.color} text-white`}
                  >
                    <span className="text-xl">{config.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {config.name}
                    </h4>
                    <p className={`text-sm ${config.textColor}`}>
                      {formatDate(result.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(result.result.details.fullAnalysis || result.result.summary);
                    }}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    复制
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadAsText(
                        result.result.details.fullAnalysis || result.result.summary,
                        `${config.name}_分析报告_${new Date().toISOString().slice(0, 10)}.txt`
                      );
                    }}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    下载
                  </button>
                  <svg
                    className={`h-5 w-5 transform transition-transform ${expandedResult === result.type ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* 可展开的内容 */}
              {expandedResult === result.type && (
                <div className="border-t border-gray-200 bg-white p-6">
                  {/* 摘要 */}
                  <div className="mb-6">
                    <h5 className="mb-3 font-medium text-gray-900">分析摘要</h5>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="whitespace-pre-wrap text-gray-700">
                        {result.result.summary}
                      </p>
                    </div>
                  </div>

                  {/* 详细分析 */}
                  {result.result.details.fullAnalysis && (
                    <div className="mb-6">
                      <div className="mb-3 flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">详细分析</h5>
                        <div className="text-sm text-gray-500">
                          字数: {result.result.details.fullAnalysis.length}
                        </div>
                      </div>
                      <div className="rounded-lg border border-gray-200 p-4">
                        <div className="prose max-w-none whitespace-pre-wrap text-gray-700">
                          {result.result.details.fullAnalysis}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 建议 */}
                  {result.result.recommendations &&
                    result.result.recommendations.length > 0 && (
                      <div>
                        <h5 className="mb-3 font-medium text-gray-900">建议</h5>
                        <div className="space-y-3">
                          {result.result.recommendations.map((rec, idx) => (
                            <div
                              key={idx}
                              className="flex items-start rounded-lg bg-blue-50 p-4"
                            >
                              <svg
                                className="mr-3 mt-1 h-5 w-5 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p className="text-gray-700">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 操作指南 */}
      <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">下一步建议</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              💬
            </div>
            <h5 className="mb-2 font-medium text-gray-900">深入对话</h5>
            <p className="text-sm text-gray-600">
              与AI助手深入讨论分析结果，获取个性化建议
            </p>
            <button
              onClick={onStartChat}
              className="mt-3 text-sm font-medium text-green-600 hover:text-green-700"
            >
              开始对话 →
            </button>
          </div>
          <div className="rounded-lg bg-white p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              📊
            </div>
            <h5 className="mb-2 font-medium text-gray-900">新的分析</h5>
            <p className="text-sm text-gray-600">
              尝试其他命理分析方法，获取多角度的人生解读
            </p>
            <button
              onClick={onNewAnalysis}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              重新分析 →
            </button>
          </div>
          <div className="rounded-lg bg-white p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              📝
            </div>
            <h5 className="mb-2 font-medium text-gray-900">保存报告</h5>
            <p className="text-sm text-gray-600">
              下载或复制分析结果，方便日后查看和分享
            </p>
            <div className="mt-3 space-x-2">
              <button
                onClick={() =>
                  copyToClipboard(
                    results.map(r => r.result.details.fullAnalysis || r.result.summary).join('\n\n')
                  )
                }
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                复制全部
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}