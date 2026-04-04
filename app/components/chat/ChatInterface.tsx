'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UserInfo {
  birthDate: string;
  birthTime: string;
  gender: string;
  location?: string;
}

interface ChatInterfaceProps {
  userInfo: UserInfo;
}

export default function ChatInterface({ userInfo }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是您的命理分析助手。我可以帮助您解读八字、紫微斗数和星座命理。您有什么问题想要咨询吗？',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(`session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // 检测用户消息中是否包含分析请求
      let analysisType: 'bazi' | 'ziwei' | 'constellation' | undefined;
      if (inputMessage.includes('八字') || inputMessage.includes('排盘')) {
        analysisType = 'bazi';
      } else if (inputMessage.includes('紫微') || inputMessage.includes('斗数')) {
        analysisType = 'ziwei';
      } else if (inputMessage.includes('星座') || inputMessage.includes('生肖')) {
        analysisType = 'constellation';
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `用户信息：出生日期${userInfo.birthDate}，出生时间${userInfo.birthTime}，性别${userInfo.gender}，地点${userInfo.location}。问题：${inputMessage}`,
            },
          ],
          sessionId,
          analysisType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data.message.content,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || '聊天失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回答您的问题。请稍后重试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleClearChat = () => {
    if (window.confirm('确定要清空对话记录吗？')) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: '对话已重置。我可以帮助您解读八字、紫微斗数和星座命理。您有什么问题想要咨询吗？',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const quickQuestions = [
    '帮我分析一下八字命理',
    '我的紫微斗数命盘怎么样？',
    '星座运势如何？',
    '适合从事什么职业？',
    '感情运势怎么样？',
    '健康方面需要注意什么？',
  ];

  return (
    <div className="flex h-[600px] flex-col rounded-xl border border-gray-200 bg-white">
      {/* 聊天头部 */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">命理分析对话</h3>
            <p className="text-sm text-gray-600">
              基于您的出生信息进行个性化分析
            </p>
          </div>
          <button
            onClick={handleClearChat}
            className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            清空对话
          </button>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${message.role === 'user'
                    ? 'rounded-br-none bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'rounded-bl-none bg-gray-100 text-gray-900'
                  }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`mt-2 text-xs ${message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-none bg-gray-100 px-5 py-3">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 快捷问题 */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 text-sm font-medium text-gray-700">快捷提问：</div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="输入您的问题..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white disabled:opacity-50 hover:from-purple-700 hover:to-blue-700"
          >
            发送
          </button>
        </form>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <div>
            会话ID: <span className="font-mono">{sessionId.substring(0, 8)}...</span>
          </div>
          <div>按Enter发送，Shift+Enter换行</div>
        </div>
      </div>
    </div>
  );
}