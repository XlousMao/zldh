# 复习资料导航系统

这是一个简单的网页应用，用于整理和浏览你的复习资料（Markdown 笔记和 PDF 文件）。

## 🚀 快速开始

1. **启动程序**
   - 双击文件夹中的 `启动导航.bat` 文件。
   - 浏览器会自动打开并显示导航页面。

2. **添加资料**
   - 所有资料存放在 `public/materials` 文件夹下。
   - 配置文件为 `public/config.json`。

## 📁 如何添加新学科和文件

### 第一步：添加文件
1. 进入 `public/materials` 文件夹。
2. 新建一个文件夹，例如 `physics` (物理)。
3. 将你的 `.md` 或 `.pdf` 文件放入该文件夹。

### 第二步：更新配置
1. 用记事本或代码编辑器打开 `public/config.json`。
2. 按照以下格式添加新的学科信息：

```json
{
  "name": "物理",
  "folder": "physics",
  "files": [
    {
      "title": "力学笔记",
      "filename": "mechanics.md",
      "type": "md"
    }
  ]
}
```

3. 保存文件并刷新网页。

## 🛠️ 技术说明
- 基于 React + Vite 构建。
- 样式使用 Tailwind CSS。
- 需安装 Node.js 环境。
