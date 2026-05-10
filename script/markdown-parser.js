/**
 * 轻量级 Markdown 解析器
 * 支持基础 Markdown 语法：标题、段落、列表、链接、强调、代码块、引用等
 */

class MarkdownParser {
  constructor() {
    // 代码块高亮配色（暗色主题）
    this.codeColors = {
      keyword: '#c792ea',
      string: '#c3e88d',
      comment: '#676e95',
      function: '#82aaff',
      number: '#f78c6c',
      operator: '#89ddff'
    };
  }

  /**
   * 解析 Markdown 文本为 HTML
   * @param {string} markdown - Markdown 原文
   * @returns {string} HTML 字符串
   */
  parse(markdown) {
    if (!markdown) return '';

    let html = markdown;

    // 转义 HTML 特殊字符（代码块内保留）
    html = this._escapeHtmlInCodeBlocks(html);

    // 解析代码块（需要在其他解析之前，避免内容被转义）
    html = this._parseCodeBlocks(html);

    // 解析引用块
    html = this._parseBlockquotes(html);

    // 解析列表（有序和无序）
    html = this._parseLists(html);

    // 解析标题
    html = this._parseHeadings(html);

    // 解析强调和粗体
    html = this._parseEmphasis(html);

    // 解析链接
    html = this._parseLinks(html);

    // 解析图片
    html = this._parseImages(html);

    // 解析行内代码
    html = this._parseInlineCode(html);

    // 解析分割线
    html = this._parseHorizontalRules(html);

    // 解析段落
    html = this._parseParagraphs(html);

    // 解析代码块（放到最后，避免内部被段落解析器破坏）
    html = this._parseCodeBlocks(html);

    // 清理多余空行
    html = html.replace(/\n{3,}/g, '\n\n');

    return html.trim();
  }

  _escapeHtmlInCodeBlocks(text) {
    const codeBlocks = [];

    // 提取代码块
    text = text.replace(/```([\w]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      codeBlocks.push({ lang, code: this._escapeHtml(code.trimEnd()) });
      return `@@@CODE_BLOCK_${codeBlocks.length - 1}@@@`;
    });

    // 转义其他部分的 HTML
    text = this._escapeHtml(text);

    // 存储代码块供后续处理
    this._codeBlocks = codeBlocks;

    return text;
  }

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  _parseCodeBlocks(text) {
    if (!this._codeBlocks) return text;

    this._codeBlocks.forEach((block, i) => {
      const highlighted = this._highlightCode(block.code, block.lang);
      const fileName = block.lang ? `${block.lang}` : 'text';
      const replacement = `
<div class="code-block-wrapper">
  <div class="code-block-header">
    <span class="code-file-name">${fileName}</span>
    <div class="code-block-actions" data-cursor-ignore></div>
  </div>
  <pre class="code-block"><code>${highlighted}</code></pre>
</div>`.trim();
      text = text.replace(`@@@CODE_BLOCK_${i}@@@`, replacement);
    });

    return text;
  }

  /**
   * 代码语法高亮
   * 支持 JavaScript、HTML、CSS、Python 等语言
   */
  _highlightCode(code, lang) {
    // 首先转义 HTML
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 获取语言特定的高亮规则
    const rules = this._getHighlightRules(lang);

    // 创建一个临时数组来存储已匹配的片段
    const tokens = [];
    let tokenId = 0;

    // 按优先级应用规则（先应用需要在内部的规则）
    const priorityRules = rules.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    for (const rule of priorityRules) {
      highlighted = highlighted.replace(rule.pattern, (match) => {
        const id = `___TOKEN_${tokenId++}___`;
        tokens.push({
          id,
          content: match,
          class: rule.class,
          isComment: rule.class === 'comment',
          isString: rule.class === 'string'
        });
        return id;
      });
    }

    // 恢复并包装所有 token
    tokens.reverse().forEach(token => {
      // 如果是注释或字符串，内部不再处理
      const wrapped = `<span class="token ${token.class}">${token.content}</span>`;
      highlighted = highlighted.replace(token.id, wrapped);
    });

    return highlighted;
  }

  /**
   * 获取不同语言的语法高亮规则
   */
  _getHighlightRules(lang) {
    const langLower = (lang || '').toLowerCase();

    // 通用规则
    const commonRules = [
      { pattern: /\b\d+(?:\.\d+)?\b/g, class: 'number', priority: 1 },
      { pattern: /\/\/.*$/gm, class: 'comment', priority: 0 },
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'comment', priority: 0 }
    ];

    // JavaScript / TypeScript
    const jsRules = [
      ...commonRules,
      { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, class: 'string', priority: 0 },
      { pattern: /\b(?:const|let|var|function|class|interface|extends|implements|import|export|from|default|async|await|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|static|public|private|protected|readonly|typeof|instanceof|in|of|void|delete|yield|debugger)\b/g, class: 'keyword', priority: 2 },
      { pattern: /\b(?:true|false|null|undefined|NaN|Infinity)\b/g, class: 'boolean', priority: 2 },
      { pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, class: 'function', priority: 3 },
      { pattern: /\b(console|window|document|Math|Date|Array|Object|String|Number|Boolean|Promise|JSON|Set|Map|WeakMap|WeakSet|Symbol|BigInt|RegExp|Error|fetch|setTimeout|setInterval|clearTimeout|clearInterval|require|module|exports|process|Buffer|global)\b/g, class: 'builtin', priority: 2 },
      { pattern: /[+\-*/%=<>!&|^~?:]+/g, class: 'operator', priority: 4 }
    ];

    // HTML
    const htmlRules = [
      { pattern: /&lt;!--[\s\S]*?--&gt;/g, class: 'comment', priority: 0 },
      { pattern: /&lt;\/?[a-zA-Z][a-zA-Z0-9\-:]*/g, class: 'tag', priority: 1 },
      { pattern: /\b[a-zA-Z\-:]+(?==)/g, class: 'attr-name', priority: 2 },
      { pattern: /"[^"]*"|'[^']*'/g, class: 'attr-value', priority: 0 }
    ];

    // CSS
    const cssRules = [
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'comment', priority: 0 },
      { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, class: 'string', priority: 0 },
      { pattern: /[.#][a-zA-Z][a-zA-Z0-9\-_]*/g, class: 'selector', priority: 1 },
      { pattern: /\b(?:color|background|border|margin|padding|width|height|display|position|top|left|right|bottom|font|text|align|content|transform|transition|animation|flex|grid|opacity|z-index|overflow|cursor|pointer-events|user-select|box-shadow|text-shadow|border-radius|backdrop-filter|filter|@media|@keyframes|@import|@font-face)\b/g, class: 'property', priority: 2 },
      { pattern: /\b(?:absolute|relative|fixed|static|sticky|block|inline|flex|grid|none|hidden|auto|center|left|right|justify|bold|normal|italic|pointer|all|ease|linear|ease-in|ease-out|ease-in-out)\b/g, class: 'keyword', priority: 2 },
      { pattern: /\b\d+(?:px|em|rem|%|vh|vw|ex|ch|cm|mm|in|pt|pc|deg|rad|turn|s|ms|hz|khz|dpi|dpcm|dppx)\b/g, class: 'number', priority: 1 },
      { pattern: /#[a-fA-F0-9]{3,8}/g, class: 'color', priority: 1 },
      { pattern: /(?<=:)\s*[^;{}]+/g, class: 'value', priority: 3 }
    ];

    // Python
    const pythonRules = [
      { pattern: /#.*$/gm, class: 'comment', priority: 0 },
      { pattern: /"""[\s\S]*?"""|'''[\s\S]*?'''/g, class: 'string', priority: 0 },
      { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, class: 'string', priority: 0 },
      { pattern: /\b(?:def|class|if|elif|else|for|while|try|except|finally|with|as|import|from|return|yield|raise|assert|break|continue|pass|lambda|and|or|not|in|is|None|True|False|global|nonlocal|del|async|await)\b/g, class: 'keyword', priority: 2 },
      { pattern: /\b(?:print|input|len|range|enumerate|zip|map|filter|sorted|reversed|sum|min|max|abs|round|pow|divmod|int|float|str|list|tuple|dict|set|frozenset|bool|bytes|bytearray|memoryview|type|isinstance|hasattr|getattr|setattr|delattr|open|read|write|close|append|extend|insert|remove|pop|clear|sort|reverse|keys|values|items|get|update|popitem|add|discard|union|intersection|difference|symmetric_difference)\b/g, class: 'builtin', priority: 2 },
      { pattern: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, class: 'function', priority: 3 }
    ];

    // Bash/Shell
    const bashRules = [
      { pattern: /#.*/g, class: 'comment', priority: 0 },
      { pattern: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, class: 'string', priority: 0 },
      { pattern: /\b(?:if|then|else|elif|fi|for|while|do|done|case|esac|in|function|return|exit|break|continue|shift|source|export|unset|alias|unalias|trap|wait|bg|fg|jobs|kill|test|echo|printf|read|cd|pwd|ls|cat|grep|sed|awk|chmod|chown|mkdir|rmdir|rm|cp|mv|touch|find|tar|gzip|gunzip|zip|unzip|ssh|scp|curl|wget|git|docker|npm|node|python|pip)\b/g, class: 'keyword', priority: 2 },
      { pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*|\$\{[^}]*\}|\$\d+|\$\*|\$@|\$#|\$\?|\$\$|\$!/g, class: 'variable', priority: 1 },
      { pattern: /\|\|?|&&?|;|<<|>>|<|>/g, class: 'operator', priority: 3 }
    ];

    // JSON
    const jsonRules = [
      { pattern: /"(?:[^"\\]|\\.)*"/g, class: 'string', priority: 0 },
      { pattern: /\b(?:true|false|null)\b/g, class: 'boolean', priority: 1 },
      { pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g, class: 'number', priority: 1 },
      { pattern: /[{}[\],:]/g, class: 'punctuation', priority: 2 }
    ];

    // SQL
    const sqlRules = [
      { pattern: /--.*$/gm, class: 'comment', priority: 0 },
      { pattern: /\/\*[\s\S]*?\*\//g, class: 'comment', priority: 0 },
      { pattern: /'(?:[^']|'')*'/g, class: 'string', priority: 0 },
      { pattern: /\b(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL|AS|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|GROUP|BY|HAVING|ORDER|LIMIT|OFFSET|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX|CREATE|TABLE|ALTER|DROP|INDEX|VIEW|TRIGGER|PROCEDURE|FUNCTION|DATABASE|USE|SHOW|DESCRIBE|EXPLAIN|BEGIN|COMMIT|ROLLBACK|TRANSACTION|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|UNIQUE|CHECK|AUTO_INCREMENT|INT|VARCHAR|TEXT|DATE|DATETIME|TIMESTAMP|BOOLEAN|FLOAT|DOUBLE|DECIMAL|BLOB|JSON)\b/gi, class: 'keyword', priority: 2 },
      { pattern: /\b\d+\b/g, class: 'number', priority: 1 }
    ];

    // 根据语言选择规则
    switch (langLower) {
      case 'html':
      case 'htm':
      case 'xml':
      case 'svg':
        return htmlRules;
      case 'css':
      case 'scss':
      case 'sass':
      case 'less':
      case 'stylus':
        return cssRules;
      case 'python':
      case 'py':
        return pythonRules;
      case 'bash':
      case 'sh':
      case 'shell':
      case 'zsh':
        return bashRules;
      case 'json':
        return jsonRules;
      case 'sql':
      case 'mysql':
      case 'postgresql':
      case 'sqlite':
        return sqlRules;
      case 'javascript':
      case 'js':
      case 'typescript':
      case 'ts':
      case 'jsx':
      case 'tsx':
      default:
        return jsRules;
    }
  }

  /**
   * 解析标题
   */
  _parseHeadings(text) {
    // H1: # 标题
    text = text.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    // H2: ## 标题
    text = text.replace(/^## (.+)$/gm, '<h2>$2</h2>');
    // H3: ### 标题
    text = text.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    // H4: #### 标题
    text = text.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    // H5: ##### 标题
    text = text.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    // H6: ###### 标题
    text = text.replace(/^###### (.+)$/gm, '<h6>$1</h6>');

    return text;
  }

  /**
   * 解析强调和粗体
   */
  _parseEmphasis(text) {
    // 粗体: **text** 或 __text__
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // 斜体: *text* 或 _text_
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');

    // 删除线: ~~text~~
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

    return text;
  }

  /**
   * 解析链接
   */
  _parseLinks(text) {
    // [text](url "title")
    text = text.replace(/\[([^\]]+)\]\(([^\s)]+)(?: "([^"]+)")?\)/g, (match, content, url, title) => {
      const titleAttr = title ? ` title="${title}"` : '';
      const isExternal = url.startsWith('http') || url.startsWith('//');
      const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}"${titleAttr}${targetAttr}>${content}</a>`;
    });

    return text;
  }

  /**
   * 解析图片
   */
  _parseImages(text) {
    // ![alt](url "title")
    text = text.replace(/!\[([^\]]*)\]\(([^\s)]+)(?: "([^"]+)")?\)/g, (match, alt, src, title) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<img src="${src}" alt="${alt}"${titleAttr} loading="lazy">`;
    });

    return text;
  }

  /**
   * 解析行内代码
   */
  _parseInlineCode(text) {
    text = text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    return text;
  }

  /**
   * 解析列表
   */
  _parseLists(text) {
    // 无序列表
    const unorderedListPattern = /^[\s]*[-*+][\s]+(.+)$/gm;
    if (unorderedListPattern.test(text)) {
      text = text.replace(/(^[\s]*[-*+][\s]+.+$\n?)+/gm, (match) => {
        const items = match.trim().split('\n').map(line => {
          const content = line.replace(/^[\s]*[-*+][\s]+/, '');
          return `<li>${content}</li>`;
        }).join('');
        return `<ul>${items}</ul>`;
      });
    }

    // 有序列表
    const orderedListPattern = /^[\s]*\d+\.[\s]+(.+)$/gm;
    if (orderedListPattern.test(text)) {
      text = text.replace(/(^[\s]*\d+\.[\s]+.+$\n?)+/gm, (match) => {
        const items = match.trim().split('\n').map(line => {
          const content = line.replace(/^[\s]*\d+\.[\s]+/, '');
          return `<li>${content}</li>`;
        }).join('');
        return `<ol>${items}</ol>`;
      });
    }

    return text;
  }

  /**
   * 解析引用块
   */
  _parseBlockquotes(text) {
    text = text.replace(/(^>[\s]*.+$\n?)+/gm, (match) => {
      const content = match.replace(/^>[\s]*/gm, '').trim();
      return `<blockquote>${content}</blockquote>`;
    });

    return text;
  }

  /**
   * 解析分割线
   */
  _parseHorizontalRules(text) {
    text = text.replace(/^[\s]*(-{3,}|\*{3,}|_{3,})[\s]*$/gm, '<hr>');
    return text;
  }

  /**
   * 解析段落
   */
  _parseParagraphs(text) {
    // 将连续的文本行包装为段落
    const lines = text.split('\n');
    const result = [];
    let inParagraph = false;
    let paragraphBuffer = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // 检查是否是块级元素
      const isBlockElement = /^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div|img)/.test(trimmed) ||
                             trimmed === '' ||
                             /^<[\w]+/.test(trimmed) ||
                             /^@@@CODE_BLOCK_\d+@@@/.test(trimmed);

      if (isBlockElement) {
        if (inParagraph && paragraphBuffer.length > 0) {
          result.push(`<p>${paragraphBuffer.join('<br>')}</p>`);
          paragraphBuffer = [];
          inParagraph = false;
        }
        if (trimmed !== '') {
          result.push(line);
        }
      } else {
        inParagraph = true;
        paragraphBuffer.push(trimmed);
      }
    }

    // 处理剩余的段落内容
    if (inParagraph && paragraphBuffer.length > 0) {
      result.push(`<p>${paragraphBuffer.join('<br>')}</p>`);
    }

    return result.join('\n');
  }
}

// 导出为全局变量
window.MarkdownParser = MarkdownParser;
