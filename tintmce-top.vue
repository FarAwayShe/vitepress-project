<template>
    <div class="editor-with-toc">
      <!-- 左侧目录 -->
      <div class="auto-toc-sidebar">
        <h3>文档目录</h3>
        <div v-if="headings.length > 0" class="toc-items">
          <a 
            v-for="heading in headings"
            :key="heading.id"
            :href="`#${heading.id}`"
            :class="['toc-item', `level-${heading.level}`]"
            @click.prevent="scrollToHeading(heading.id)"
          >
            {{ heading.text }}
          </a>
        </div>
        <p v-else class="no-headings">暂无标题</p>
      </div>
      
      <!-- 编辑器 -->
      <div class="editor-main">
        <Editor
          ref="editor"
          :init="editorConfig"
          v-model="content"
          @init="onEditorInit"
        />
      </div>
    </div>
  </template>
  
  <script>
  import Editor from '@tinymce/tinymce-vue'
  
  export default {
    components: {
      Editor
    },
    data() {
      return {
        content: '',
        headings: [],
        editorInstance: null,
        editorConfig: {
          height: 600,
          // 启用必要的插件
          plugins: [
            'advlist', 'anchor', 'autolink', 'lists', 'link', 'image', 'charmap',
            'preview', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ].join(' '),
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'anchor link unlink | removeformat | help',
          
          // 启用标题样式
          style_formats: [
            { title: '标题 1', format: 'h1' },
            { title: '标题 2', format: 'h2' },
            { title: '标题 3', format: 'h3' },
            { title: '标题 4', format: 'h4' },
            { title: '标题 5', format: 'h5' },
            { title: '标题 6', format: 'h6' },
            { title: '正文', format: 'p' }
          ],
          
          // 配置格式选择器
          block_formats: '正文=p;标题 1=h1;标题 2=h2;标题 3=h3;标题 4=h4;标题 5=h5;标题 6=h6',
          
          // 内容样式
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              font-weight: 600;
              line-height: 1.25;
              color: #111;
            }
            h1 {
              font-size: 2em;
              border-bottom: 2px solid #eee;
              padding-bottom: 0.3em;
            }
            h2 {
              font-size: 1.5em;
              border-bottom: 1px solid #eee;
              padding-bottom: 0.2em;
            }
            h3 { font-size: 1.25em; }
            h4 { font-size: 1em; }
            h5 { font-size: 0.875em; }
            h6 { font-size: 0.85em; color: #666; }
            
            /* 为标题添加锚点图标 */
            h1[id]:hover::after, 
            h2[id]:hover::after, 
            h3[id]:hover::after {
              content: "#";
              margin-left: 10px;
              color: #ccc;
              font-weight: normal;
              text-decoration: none;
            }
          `,
          
          // 设置项
          menubar: 'edit format insert view',
          branding: false,
          elementpath: false,
          statusbar: true,
          
          // 初始化事件
          setup: (editor) => {
            this.editorInstance = editor
            
            // 添加自定义命令：插入目录
            editor.addCommand('insertToc', () => {
              const tocHtml = this.generateTocHtml()
              editor.undoManager.transact(() => {
                editor.insertContent(`
                  <div class="toc-inserted">
                    <h2>目录</h2>
                    ${tocHtml}
                  </div>
                  <hr>
                `)
              })
            })
            
            // 添加自定义按钮
            editor.ui.registry.addButton('customtoc', {
              text: '插入目录',
              tooltip: '插入目录到当前光标位置',
              onAction: () => {
                editor.execCommand('insertToc')
              }
            })
            
            // 添加上下文菜单项
            editor.ui.registry.addMenuItem('customtoc', {
              text: '插入目录',
              context: 'insert',
              onAction: () => {
                editor.execCommand('insertToc')
              }
            })
          }
        }
      }
    },
    methods: {
      onEditorInit(editor) {
        // 监听内容变化
        editor.on('change keyup', () => {
          this.updateHeadings()
        })
        
        // 初始更新
        this.updateHeadings()
      },
      
      updateHeadings() {
        if (!this.editorInstance) return
        
        const content = this.editorInstance.getContent()
        const parser = new DOMParser()
        const doc = parser.parseFromString(content, 'text/html')
        
        const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
        const headings = []
        
        headingElements.forEach((heading, index) => {
          // 确保标题有ID
          let id = heading.id
          if (!id) {
            id = this.generateHeadingId(heading.textContent, index)
            this.setHeadingIdInEditor(index, id)
          }
          
          headings.push({
            id,
            text: heading.textContent || `标题 ${index + 1}`,
            level: parseInt(heading.tagName.substring(1))
          })
        })
        
        this.headings = headings
      },
      
      generateHeadingId(text, index) {
        if (!text) return `heading-${Date.now()}-${index}`
        
        return text
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 50) || `heading-${Date.now()}-${index}`
      },
      
      setHeadingIdInEditor(index, id) {
        const editor = this.editorInstance
        const headings = editor.dom.select('h1, h2, h3, h4, h5, h6')
        
        if (headings[index]) {
          editor.dom.setAttrib(headings[index], 'id', id)
        }
      },
      
      scrollToHeading(headingId) {
        const editor = this.editorInstance
        if (!editor) return
        
        const iframe = editor.iframeElement
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
        const heading = iframeDoc.getElementById(headingId)
        
        if (heading) {
          // 滚动到标题
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
          
          // 临时高亮
          const originalBg = heading.style.backgroundColor
          heading.style.backgroundColor = '#e6f7ff'
          
          setTimeout(() => {
            heading.style.backgroundColor = originalBg
          }, 1500)
        }
      },
      
      generateTocHtml() {
        if (this.headings.length === 0) {
          return '<p><em>暂无标题</em></p>'
        }
        
        let html = '<ul class="toc-ul">'
        
        this.headings.forEach(heading => {
          const indent = Math.min((heading.level - 1) * 20, 80)
          html += `
            <li style="margin-left: ${indent}px; padding: 2px 0;">
              <a href="#${heading.id}" class="toc-link">${heading.text}</a>
            </li>
          `
        })
        
        html += '</ul>'
        return html
      }
    }
  }
  </script>
  
  <style scoped>
  .editor-with-toc {
    display: flex;
    gap: 20px;
    height: 700px;
  }
  
  .auto-toc-sidebar {
    width: 250px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 15px;
    overflow-y: auto;
    flex-shrink: 0;
  }
  
  .auto-toc-sidebar h3 {
    margin: 0 0 15px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #dee2e6;
    color: #333;
    font-size: 16px;
  }
  
  .toc-items {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .toc-item {
    display: block;
    padding: 6px 10px;
    color: #555;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.4;
    transition: all 0.2s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .toc-item:hover {
    background: #e9ecef;
    color: #1890ff;
    text-decoration: none;
  }
  
  .toc-item.level-1 {
    font-weight: 600;
    color: #111;
  }
  
  .toc-item.level-2 {
    padding-left: 15px;
  }
  
  .toc-item.level-3 {
    padding-left: 30px;
    color: #666;
    font-size: 13px;
  }
  
  .toc-item.level-4,
  .toc-item.level-5,
  .toc-item.level-6 {
    padding-left: 45px;
    color: #888;
    font-size: 12px;
  }
  
  .no-headings {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 20px 0;
  }
  
  .editor-main {
    flex: 1;
    min-width: 0;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .editor-with-toc {
      flex-direction: column;
      height: auto;
    }
    
    .auto-toc-sidebar {
      width: 100%;
      max-height: 200px;
    }
  }
  </style>