# ADHD 高影响力书籍创意生成器 — 源代码

针对 ADHD 主题策划的 5 个高影响力书籍概念的交互式展示网站。

## 技术栈

- **框架**：React 19 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS 4
- **UI 组件**：shadcn/ui (Radix UI)
- **图表**：Recharts
- **路由**：Wouter

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 目录结构

```
client/
  src/
    pages/Home.tsx          # 主页面（书籍概念展示）
    lib/bookData.ts         # 5 个书籍概念数据
    components/             # 可复用 UI 组件
    index.css               # 全局样式（Playfair Display 编辑风格）
  index.html
```

## 部署到 GitHub Pages 子目录

如需部署到子目录（如 `/my-offline-sites/sites/adhd-book-ideas/`），在构建时设置 `VITE_BASE_PATH`：

```bash
VITE_BASE_PATH=/my-offline-sites/sites/adhd-book-ideas/ pnpm build
```

## 在线预览

[https://laosuan.github.io/my-offline-sites/sites/adhd-book-ideas/](https://laosuan.github.io/my-offline-sites/sites/adhd-book-ideas/)
