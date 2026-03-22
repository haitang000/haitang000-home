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
    return params.get('id') || 'article1';
  }

  /**
   * 加载文章元数据
   */
  async loadMetadata(articleId) {
    try {
      const response = await fetch(`/article/${articleId}.json`);
      if (!response.ok) throw new Error('Metadata not found');
      return await response.json();
    } catch (error) {
      console.warn('No metadata found, using defaults');
      return {
        title: '未命名文章',
        author: 'haitang000',
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
      const response = await fetch(`/article/${articleId}.md`);
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
- 网络连接问题
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
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
      copyBtn.title = '复制代码';

      copyBtn.addEventListener('click', async () => {
        const code = block.querySelector('code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = '<i class="fas fa-check"></i>';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Copy failed:', err);
        }
      });

      block.appendChild(copyBtn);
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
