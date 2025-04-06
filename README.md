# VitePress 文档项目

这是一个使用VitePress构建的文档项目，支持设计文档和开发文档两种类型的文档切换。

## 特点

- 基于VitePress构建的现代化文档系统
- 支持设计文档和开发文档两种类型的切换
- 通过顶部Tab栏和左侧导航栏联动实现文档的精确定位
- 响应式设计，支持移动端浏览

## 开始使用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建静态站点
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
├── docs/                 # 文档目录
│   ├── .vitepress/       # VitePress配置
│   │   ├── components/   # 自定义组件
│   │   ├── theme/        # 自定义主题
│   │   └── config.ts     # 站点配置
│   ├── design/           # 设计文档
│   ├── development/      # 开发文档
│   └── index.md          # 首页
├── node_modules/         # 依赖包
├── package.json          # 项目配置
└── README.md             # 项目说明
```

## 功能说明

该项目实现了一个特殊的文档导航功能：在文档内容渲染区的顶部有一个Tab栏，包含两个Tab按钮（设计文档和开发文档）。用户可以通过点击Tab按钮快速切换文档类型，同时保持在相同的文档主题上。

例如，如果用户正在查看"设计文档"类型下的"系统架构"页面，切换到"开发文档"Tab后，会自动导航到"开发文档"中对应的页面（如果存在）。

## 自定义开发

可以通过编辑以下文件进行功能扩展：

- `docs/.vitepress/components/DocumentTabs.vue`: 修改Tab组件的行为和样式
- `docs/.vitepress/theme/index.ts`: 更改主题配置和布局
- `docs/.vitepress/config.ts`: 调整导航和侧边栏配置 