# haitang000 个人网站开发规范

## 项目概述

这是一个使用原生 HTML/CSS/JavaScript 构建的个人博客网站，支持 Markdown 格式的文章内容。

## 文件结构

```
├── index.html              # 首页
├── article.css             # 文章页面样式
├── index.css               # 首页样式
├── article/                # 文章相关内容
│   ├── index.html          # 文章模板（通用）
│   ├── article1.md         # 文章 Markdown 内容
│   └── article1.json       # 文章元数据
├── script/                 # JavaScript 脚本
│   ├── markdown-parser.js  # Markdown 解析器
│   ├── article-loader.js   # 文章加载器
│   ├── cursor.js           # 自定义光标
│   └── ...                 # 其他脚本
├── assets/                 # 静态资源
│   ├── avatar/             # 头像图片
│   └── ...                 # 其他资源
└── CLAUDE.md               # 本文件
```

## 添加新文章流程

### 1. 创建 Markdown 文件

在 `article/` 目录下创建新的 `.md` 文件，命名格式：`article{n}.md`（如 article2.md）

```markdown
# 文章标题

## 小标题

正文内容...

- 列表项1
- 列表项2

[链接文字](https://example.com)

```javascript
// 代码块
console.log('Hello');
```
```

### 2. 创建元数据文件

创建同名的 `.json` 文件（如 article2.json）：

```json
{
  "title": "文章标题",
  "author": "haitang000",
  "date": "2026-03-22",
  "category": "Blog",
  "tags": ["标签1", "标签2"],
  "description": "文章简介"
}
```

### 3. 更新首页文章列表

在 `index.html` 的 `#blog` 区域添加文章卡片：

```html
<a href="/article/index.html?id=article2" class="editorial-article-row">
  <div class="article-meta">
    <span class="article-date">Mar 2026</span>
    <span class="article-category">分类</span>
  </div>
  <div class="article-content">
    <h4 class="article-title">文章标题</h4>
    <p class="article-desc">文章简介...</p>
  </div>
  <div class="article-arrow">
    <i class="fas fa-arrow-right"></i>
  </div>
</a>
```

## Markdown 支持语法

- 标题：`# H1`, `## H2`, `### H3`
- 粗体：`**text**`
- 斜体：`*text*`
- 删除线：`~~text~~`
- 链接：`[text](url)`
- 图片：`![alt](url)`
- 代码块：```语言\n代码```（支持语法高亮）
- 行内代码：`` `code` ``
- 无序列表：`- item` 或 `* item`

### 代码高亮支持的语言

在代码块中指定语言标识符可获得语法高亮：

- `javascript`, `js`, `typescript`, `ts` - JavaScript/TypeScript
- `html`, `htm`, `xml`, `svg` - HTML/XML
- `css`, `scss`, `sass`, `less` - CSS/预处理器
- `python`, `py` - Python
- `bash`, `sh`, `shell`, `zsh` - Shell 脚本
- `json` - JSON
- `sql`, `mysql`, `postgresql` - SQL

示例：

```javascript
function hello() {
  console.log("Hello, World!");
}
```

- 有序列表：`1. item`
- 引用：`> quote`
- 分割线：`---`

## 设计风格规范

### 色彩系统

- 主背景：`#f4f4f5`（浅色模式）/ `#121212`（深色模式）
- 次背景：`#ffffff`（浅色）/ `#1d1d1f`（深色）
- 主文字：`#1d1d1f`（浅色）/ `#f5f5f7`（深色）
- 次文字：`#6b6b6b`
- 强调色：`#0b57d0`（浅色）/ `#5e9eff`（深色）

### 字体

- 标题：`DM Serif Display`, serif
- 正文：`Google Sans`, system-ui, sans-serif
- 代码：`SF Mono`, Monaco, monospace

### 圆角

- 大卡片：24px
- 小元素：12px
- 完全圆角：999px

### 阴影

- 默认：`0 4px 20px rgba(0, 0, 0, 0.05)`
- 悬停：`0 6px 24px rgba(0, 0, 0, 0.08)`

## 技术要点

1. **文章渲染**：使用 `article-loader.js` 动态加载 Markdown 文件并解析为 HTML
2. **URL 参数**：文章通过 `?id=article1` 参数指定，对应加载 `article1.md`
3. **响应式设计**：适配桌面和移动端
4. **深色模式**：使用 `prefers-color-scheme` 媒体查询自动切换
5. **代码高亮**：代码块支持复制功能，图片支持点击放大

## 注意事项

- 不要直接编辑 `article/index.html` 来修改文章内容
- 所有文章内容都应该放在 `.md` 文件中
- 确保每个 `.md` 文件都有对应的 `.json` 元数据文件
- 首页文章链接必须使用 `/article/index.html?id=xxx` 格式
