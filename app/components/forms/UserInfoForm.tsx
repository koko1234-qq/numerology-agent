'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 安装zod如果尚未安装
// npm install zod

// 表单验证schema
const userInfoSchema = z.object({
  birthDate: z.string().min(1, '出生日期不能为空'),
  birthTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, '请输入有效的HH:mm格式时间'),
  gender: z.enum(['male', 'female'], { message: '请选择性别' }),
  location: z.string().optional(),
});

type UserInfoFormData = z.infer<typeof userInfoSchema>;

interface UserInfoFormProps {
  onSubmit: (data: UserInfoFormData, analysisTypes: string[]) => void;
  initialData?: Partial<UserInfoFormData>;
  isSubmitting: boolean;
}

// 可用的分析类型
const ANALYSIS_TYPES = [
  { id: 'bazi', name: '八字排盘', description: '中国传统八字命理分析' },
  { id: 'ziwei', name: '紫微斗数', description: '紫微斗数命盘分析' },
  { id: 'constellation', name: '星座分析', description: '星座与生肖综合分析' },
];

export default function UserInfoForm({ onSubmit, initialData, isSubmitting }: UserInfoFormProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['bazi']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      birthDate: initialData?.birthDate || '',
      birthTime: initialData?.birthTime || '12:00',
      gender: (initialData?.gender as 'male' | 'female') || 'male',
      location: initialData?.location || '',
    },
  });

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const onSubmitForm = (data: UserInfoFormData) => {
    if (selectedTypes.length === 0) {
      alert('请至少选择一种分析类型');
      return;
    }
    onSubmit(data, selectedTypes);
  };

  const birthDate = watch('birthDate');
  const birthTime = watch('birthTime');

  // 计算年龄
  const calculateAge = () => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge();

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
      {/* 个人信息部分 */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">个人信息</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 出生日期 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              出生日期 *
            </label>
            <input
              type="date"
              {...register('birthDate')}
              className={`w-full rounded-lg border px-4 py-3 ${errors.birthDate
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                }`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
            )}
            {age !== null && (
              <p className="mt-1 text-sm text-gray-500">年龄: {age}岁</p>
            )}
          </div>

          {/* 出生时间 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              出生时间 *
            </label>
            <input
              type="time"
              {...register('birthTime')}
              className={`w-full rounded-lg border px-4 py-3 ${errors.birthTime
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                }`}
            />
            {errors.birthTime && (
              <p className="mt-1 text-sm text-red-600">{errors.birthTime.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">请使用24小时制 (HH:mm)</p>
          </div>

          {/* 性别 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              性别 *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="male"
                  {...register('gender')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">男性</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="female"
                  {...register('gender')}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">女性</span>
              </label>
            </div>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>

          {/* 出生地点 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              出生地点
            </label>
            <input
              type="text"
              placeholder="例如：北京、上海、广州"
              {...register('location')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
            />
            <p className="mt-1 text-sm text-gray-500">可选，用于更精确的时区计算</p>
          </div>
        </div>
      </div>

      {/* 分析类型选择 */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">选择分析类型</h3>
        <p className="text-gray-600">选择您想要进行的命理分析类型（可多选）</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ANALYSIS_TYPES.map(type => (
            <div
              key={type.id}
              onClick={() => handleTypeToggle(type.id)}
              className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${selectedTypes.includes(type.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="flex items-center">
                <div
                  className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full ${selectedTypes.includes(type.id)
                      ? 'bg-purple-500'
                      : 'border border-gray-300 bg-white'
                    }`}
                >
                  {selectedTypes.includes(type.id) && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{type.name}</h4>
                  <p className="mt-1 text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTypes.length === 0 && (
          <p className="text-sm text-red-600">请至少选择一种分析类型</p>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-between pt-6">
        <div className="text-sm text-gray-500">
          <p>提示：八字和紫微斗数需要精确的出生时间</p>
          <p>星座分析只需出生日期</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || selectedTypes.length === 0}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 font-medium text-white disabled:opacity-50 hover:from-purple-700 hover:to-blue-700"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              分析中...
            </span>
          ) : (
            `开始分析 (${selectedTypes.length}种)`
          )}
        </button>
      </div>
    </form>
  );
}