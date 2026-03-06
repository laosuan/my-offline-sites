# YouTube 字幕提取器 TODO

- [x] 调研并安装 YouTube 字幕提取 Node.js 库（youtube-transcript / youtubei.js）
- [x] 后端：实现 tRPC 路由 subtitle.getLanguages（获取可用字幕语言列表）
- [x] 后端：实现 tRPC 路由 subtitle.getSubtitles（根据语言获取字幕内容）
- [x] 后端：YouTube 视频 ID 解析工具函数（支持多种 URL 格式）
- [x] 后端：错误处理（无效链接、无字幕、网络错误）
- [x] 前端：孟菲斯风格全局主题（桃色背景、几何图形装饰、粗体无衬线字体）
- [x] 前端：首页 Hero 区域（标题、副标题、装饰几何图形）
- [x] 前端：YouTube 链接输入框组件（支持粘贴、验证）
- [x] 前端：语言选择下拉菜单组件
- [x] 前端：字幕列表展示（带时间戳，每句独立显示）
- [x] 前端：触摸滑动多选字幕（移动端手势交互）
- [x] 前端：一键复制选中字幕到剪贴板
- [x] 前端：加载状态（骨架屏 / 动画）
- [x] 前端：错误提示 UI（无效链接、无字幕等）
- [x] 前端：响应式设计，移动端优先
- [x] 编写 vitest 测试（字幕路由、URL 解析）
- [x] 保存检查点并交付

## Bug 修复

- [x] 调研 youtube-transcript 库无法获取部分视频字幕的原因
- [x] 调研并评估更可靠的 YouTube 字幕提取方案（youtubei.js / yt-dlp / innertube API 等）
- [x] 替换或增强字幕提取实现，解决 https://youtu.be/z_pk4eBDaLA 无字幕问题：确认为 LOGIN_REQUIRED 受限视频，实现 Cookie 辅助模式
- [x] 测试修复效果并更新单元测试（22 个测试全部通过）
