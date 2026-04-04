'use client';

import { useState } from 'react';

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorDisplay({
  error,
  onRetry,
  title = '出错了',
}: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  const errorMessage = typeof error === 'string' ? error : error.message;
  const stackTrace = typeof error === 'string' ? undefined : error.stack;

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <div className="flex items-start">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-red-800">{title}</h3>
          <div className="mt-2">
            <p className="text-red-700">{errorMessage}</p>
            {stackTrace && (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
                >
                  {showDetails ? '隐藏详情' : '显示详情'}
                </button>
                {showDetails && (
                  <pre className="mt-3 overflow-auto rounded-lg bg-red-100 p-4 text-sm text-red-800">
                    {stackTrace}
                  </pre>
                )}
              </>
            )}
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                重试
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}