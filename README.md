# 离线网站收藏合集

一个精心策划的独立网页集合，每一个都可以本地运行，无需网络连接。

## 🌐 在线访问

**GitHub Pages：** https://laosuan.github.io/my-offline-sites/

## 📦 收录网站

| # | 网站名称 | 分类 | 说明 |
|---|---------|------|------|
| 01 | [ADHD 高影响力书籍创意生成器](sites/adhd-book-ideas/) | 出版策略 | 针对 ADHD 主题策划的 5 个畅销书籍概念，含交互式图表 |

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/laosuan/my-offline-sites.git
cd my-offline-sites

# 使用任意静态服务器
npx serve .
# 或
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`

## 📁 目录结构

```
my-offline-sites/
├── index.html              # 收藏合集主页
├── README.md
└── sites/
    └── adhd-book-ideas/    # ADHD 书籍创意生成器
        ├── index.html
        └── assets/
```

## 📄 开源协议

MIT License
