/**
 * 文章加载器
 * 负责从 Markdown 文件加载内容并渲染到页面
 */

class ArticleLoader {
  constructor() {
    this.parser = new MarkdownParser();
    this.contentElement = document.getElementById('article-content');
    this.titleElement = document.getElementById('article-title');
    this.metaElement = document.getElementById('article-meta');
  }

  /**
   * 从 URL 获取文章 ID
   */
  getArticleId() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    if (idParam) return idParam;

    const match = window.location.pathname.match(/\/article\/([^\/]+)/);
    if (match && match[1] && match[1] !== 'index.html') {
      return match[1];
    }

    return '1';
  }

  /**
   * 加载文章元数据
   */
  async loadMetadata(articleId) {
    try {
      const response = await fetch(`/article/${articleId}/${articleId}.json`);
      if (!response.ok) throw new Error('Metadata not found');
      return await response.json();
    } catch (error) {
      console.warn('No metadata found, using defaults');
      return {
        title: 'Unknown',
        author: 'Unknown',
        date: new Date().toLocaleDateString('zh-CN'),
        category: 'Blog',
        description: ''
      };
    }
  }

  /**
   * 加载 Markdown 内容
   */
  async loadContent(articleId) {
    try {
      const response = await fetch(`/article/${articleId}/${articleId}.md`);
      if (!response.ok) {
        throw new Error(`Failed to load article: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading article:', error);
      return this.getErrorContent();
    }
  }

  /**
   * 错误内容
   */
  getErrorContent() {
    return `# 文章加载失败

抱歉，无法加载请求的文章。可能的原因：

- 文章不存在或已被删除
- 网络连接问题，前往 [服务运行状态](https://status.haitang000.cn/status/uptime) 试试
- 文件路径错误

请 [返回首页](/index.html) 查看其他内容。`;
  }

  /**
   * 更新页面标题
   */
  updatePageTitle(title) {
    document.title = `${title} - haitang000`;
  }

  /**
   * 渲染元数据到页面
   */
  renderMetadata(metadata) {
    if (this.titleElement) {
      this.titleElement.textContent = metadata.title;
    }

    if (this.metaElement) {
      const dateStr = metadata.date || '';
      const categoryStr = metadata.category ? `<span class="category">${metadata.category}</span>` : '';
      const readTime = metadata.readTime || this.estimateReadTime();

      this.metaElement.innerHTML = `
        ${dateStr ? `<time>${dateStr}</time>` : ''}
        ${categoryStr}
        ${readTime ? `<span class="read-time">${readTime} 分钟阅读</span>` : ''}
      `;
    }

    this.updatePageTitle(metadata.title);
  }

  /**
   * 估算阅读时间
   */
  estimateReadTime() {
    const text = this.contentElement ? this.contentElement.textContent : '';
    const wordCount = text.length;
    return Math.ceil(wordCount / 300); // 假设每分钟阅读 300 字
  }

  /**
   * 渲染 Markdown 内容
   */
  renderContent(markdown) {
    if (!this.contentElement) return;

    const html = this.parser.parse(markdown);
    this.contentElement.innerHTML = html;

    // 更新阅读时间
    this.updateReadTime();

    // 初始化代码复制按钮
    this.initCodeCopy();

    // 初始化图片点击放大
    this.initImageZoom();
  }

  /**
   * 更新阅读时间显示
   */
  updateReadTime() {
    const readTimeEl = document.querySelector('.read-time');
    if (readTimeEl) {
      readTimeEl.textContent = `${this.estimateReadTime()} 分钟阅读`;
    }
  }

  /**
   * 初始化代码复制功能
   */
  initCodeCopy() {
    const codeBlocks = this.contentElement.querySelectorAll('.code-block-wrapper');

    codeBlocks.forEach(block => {
      const actions = block.querySelector('.code-block-actions');
      if (!actions) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'action-btn copy-btn';
      copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      copyBtn.title = '复制代码';

      const sparkleBtn = document.createElement('button');
      sparkleBtn.className = 'action-btn sparkle-btn';
      sparkleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>';
      sparkleBtn.title = 'AI 解释';

      copyBtn.addEventListener('click', async () => {
        const code = block.querySelector('code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            copyBtn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Copy failed:', err);
        }
      });

      actions.appendChild(copyBtn);
      actions.appendChild(sparkleBtn);
    });
  }

  /**
   * 初始化图片点击放大
   */
  initImageZoom() {
    const images = this.contentElement.querySelectorAll('img');

    images.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        this.openImageLightbox(img.src, img.alt);
      });
    });
  }

  /**
   * 打开图片灯箱
   */
  openImageLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <img src="${src}" alt="${alt}" class="lightbox-img">
      <button class="lightbox-close"><i class="fas fa-times"></i></button>
    `;

    document.body.appendChild(lightbox);

    // 动画进入
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });

    // 关闭事件
    const close = () => {
      lightbox.classList.remove('active');
      setTimeout(() => lightbox.remove(), 300);
    };

    lightbox.querySelector('.lightbox-overlay').addEventListener('click', close);
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });

    // ESC 关闭
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        close();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  /**
   * 主加载流程
   */
  async load() {
    const articleId = this.getArticleId();

    // 显示加载状态
    if (this.contentElement) {
      this.contentElement.innerHTML = '<div class="article-loading"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';
    }

    try {
      // 并行加载元数据和内容
      const [metadata, markdown] = await Promise.all([
        this.loadMetadata(articleId),
        this.loadContent(articleId)
      ]);

      // 渲染
      this.renderMetadata(metadata);
      this.renderContent(markdown);

      // 触发加载完成事件
      window.dispatchEvent(new CustomEvent('article-loaded', {
        detail: { articleId, metadata }
      }));

    } catch (error) {
      console.error('Failed to load article:', error);
      if (this.contentElement) {
        this.contentElement.innerHTML = `
          <div class="article-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>加载文章时出错，请稍后重试</p>
            <a href="/index.html" class="back-link">返回首页</a>
          </div>
        `;
      }
    }
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ArticleLoader();
  loader.load();
});
