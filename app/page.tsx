'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import UserInfoForm from './components/forms/UserInfoForm';
import ChatInterface from './components/chat/ChatInterface';
import AnalysisResults from './components/results/AnalysisResults';
import { AnalysisResult } from './lib/numerology-service';
import LoadingSpinner from './components/layout/LoadingSpinner';

type TabType = 'form' | 'chat' | 'results';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [userInfo, setUserInfo] = useState<{
    birthDate: string;
    birthTime: string;
    gender: 'male' | 'female';
    location?: string;
  }>({
    birthDate: '',
    birthTime: '',
    gender: 'male',
    location: '',
  });
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getAnalysisTypeName = (type: string) => {
    switch (type) {
      case 'bazi':
        return '八字';
      case 'ziwei':
        return '紫微斗数';
      case 'constellation':
        return '星座';
      default:
        return '命理';
    }
  };

  const handleUserInfoSubmit = async (
    info: { birthDate: string; birthTime: string; gender: 'male' | 'female'; location?: string },
    analysisTypes: string[]
  ) => {
    setUserInfo(info);
    setIsAnalyzing(true);

    const toastId = toast.loading('正在分析中，请稍候...');

    try {
      const results: AnalysisResult[] = [];

      for (const type of analysisTypes) {
        const response = await fetch('/api/analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            ...info,
          }),
        });

        const data = await response.json();
        if (data.success) {
          results.push(data.data);
          toast.success(`${getAnalysisTypeName(type)}分析完成`, { id: toastId });
        } else {
          toast.error(`${getAnalysisTypeName(type)}分析失败`, { id: toastId });
        }
      }

      setAnalysisResults(results);
      setActiveTab('results');
      toast.success('所有分析已完成！', { duration: 4000 });
    } catch (error) {
      console.error('分析失败:', error);
      toast.error('分析失败，请稍后重试', { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartChat = () => {
    setActiveTab('chat');
  };

  const handleNewAnalysis = () => {
    setActiveTab('form');
    setAnalysisResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">命理分析助手</h1>
                <p className="text-sm text-gray-600">AI驱动的八字、紫微斗数、星座分析</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('form')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${activeTab === 'form'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                信息录入
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${activeTab === 'chat'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                智能对话
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${activeTab === 'results'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                分析结果
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {activeTab === 'form' && '请输入您的出生信息'}
            {activeTab === 'chat' && '智能命理对话助手'}
            {activeTab === 'results' && '命理分析结果'}
          </h2>
          <p className="text-gray-600">
            {activeTab === 'form' && '我们将根据您的出生信息进行专业的命理分析'}
            {activeTab === 'chat' && '与AI命理专家进行对话，解答您的疑惑'}
            {activeTab === 'results' && '查看详细的命理分析报告和建议'}
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* 信息录入表单 */}
          {activeTab === 'form' && (
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <UserInfoForm
                onSubmit={handleUserInfoSubmit}
                initialData={userInfo}
                isSubmitting={isAnalyzing}
              />
              {analysisResults.length > 0 && (
                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-blue-800">您已有分析结果，可以查看或开始对话</p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setActiveTab('results')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        查看结果
                      </button>
                      <button
                        onClick={handleStartChat}
                        className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
                      >
                        开始对话
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 聊天界面 */}
          {activeTab === 'chat' && (
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <ChatInterface userInfo={userInfo} />
            </div>
          )}

          {/* 分析结果 */}
          {activeTab === 'results' && (
            <div className="rounded-2xl bg-white p-8 shadow-xl">
              <AnalysisResults
                results={analysisResults}
                userInfo={userInfo}
                onNewAnalysis={handleNewAnalysis}
                onStartChat={handleStartChat}
              />
            </div>
          )}
        </div>

        {/* 免责声明 */}
        <div className="mx-auto mt-12 max-w-4xl rounded-lg bg-gray-50 p-6 text-center">
          <h3 className="mb-2 font-medium text-gray-900">重要声明</h3>
          <p className="text-sm text-gray-600">
            本工具提供的命理分析结果仅供参考娱乐，不构成任何人生决策建议。
            命运掌握在自己手中，积极面对生活才是最重要的。请勿过度依赖命理分析。
          </p>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} 命理分析助手 • 基于AI技术 •
            仅供学习研究使用
          </p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              隐私政策
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              使用条款
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              联系我们
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
