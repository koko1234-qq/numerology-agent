# 网页版命理分析Agent

基于Next.js 15构建的网页版命理分析Agent，支持八字排盘、紫微斗数、星座分析等命理分析功能，通过Minimax API进行智能分析。

## 功能特性

- **对话交互界面**：类似ChatGPT的聊天界面，支持多轮对话
- **命理分析功能**：
  - 八字排盘解读
  - 紫微斗数解读
  - 星座分析
- **用户信息收集**：出生日期、时间、性别、地点等信息表单
- **智能分析**：通过Minimax API进行专业命理分析
- **响应式设计**：适配桌面和移动设备
- **模拟模式**：无API密钥时可使用模拟数据运行

## 技术栈

- **前端**：Next.js 15 + TypeScript + Tailwind CSS
- **AI集成**：Minimax API (支持模拟模式)
- **表单处理**：React Hook Form + Zod验证
- **状态管理**：React Hooks
- **通知系统**：React Hot Toast

## 快速开始

### 本地开发

1. 克隆项目：
```bash
git clone https://github.com/koko1234-qq/numerology-agent.git
cd numerology-agent
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
复制`.env.example`为`.env.local`（可选，不设置API密钥则使用模拟模式）：
```bash
cp .env.example .env.local
```

编辑`.env.local`文件，设置Minimax API密钥（可选）：
```
MINIMAX_API_KEY="your-minimax-api-key"
MINIMAX_API_BASE_URL="https://api.minimax.chat/v1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 部署到Vercel

### 方法1：一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkoko1234-qq%2Fnumerology-agent)

### 方法2：手动部署

1. 登录 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入GitHub仓库：`koko1234-qq/numerology-agent`
4. 配置环境变量（在项目设置中）：
   - `MINIMAX_API_KEY`：Minimax API密钥（可选，不设置则使用模拟模式）
   - `MINIMAX_API_BASE_URL`：`https://api.minimax.chat/v1`
   - `NEXT_PUBLIC_APP_URL`：你的Vercel应用URL

   **重要**：确保**没有**设置`DATABASE_URL`环境变量，本项目不需要数据库。

5. 点击 "Deploy"

### 解决部署错误

如果部署时出现`"Invalid request: env.DATABASE_URL should be string."`错误：

1. 在Vercel项目设置中，检查"Environment Variables"部分
2. 删除名为`DATABASE_URL`的环境变量（如果存在）
3. 重新部署项目

## 使用说明

1. **个人信息收集**：在"个人信息"标签页填写出生日期、时间、性别等信息
2. **命理分析**：在"分析结果"标签页选择分析类型（八字、紫微斗数、星座）
3. **对话交互**：在"聊天对话"标签页与AI助手进行多轮对话

## 项目结构

```
numerology-agent/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── analysis/      # 命理分析API
│   │   └── chat/          # 聊天API
│   ├── components/        # React组件
│   │   ├── chat/          # 聊天界面
│   │   ├── forms/         # 信息表单
│   │   ├── results/       # 分析结果
│   │   └── layout/        # 布局组件
│   ├── lib/               # 工具函数
│   │   ├── minimax/       # Minimax API客户端
│   │   ├── prompts/       # 提示词模板
│   │   └── utils/         # 工具函数
│   ├── page.tsx           # 主页面
│   └── layout.tsx         # 根布局
├── public/                # 静态资源
└── package.json
```

## 环境变量

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `MINIMAX_API_KEY` | Minimax API密钥 | 否 | 无（使用模拟模式） |
| `MINIMAX_API_BASE_URL` | Minimax API基础URL | 否 | `https://api.minimax.chat/v1` |
| `NEXT_PUBLIC_APP_URL` | 应用公开URL | 否 | `http://localhost:3000` |
| `NODE_ENV` | 环境模式 | 否 | `development` |

## 许可证

MIT
