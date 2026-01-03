# 如何添加新文件

欢迎使用你的复习资料导航系统！

## 添加步骤

1. **准备文件**
   - 准备好你的 `.md` (Markdown) 或 `.pdf` 文件。

2. **创建文件夹**
   - 在 `public/materials` 目录下，为你想要添加的学科创建一个文件夹。
   - 例如：`public/materials/computer-science`。
   - 将你的文件放入该文件夹。

3. **修改配置文件**
   - 打开 `public/config.json` 文件。
   - 在 `subjects` 列表中添加新的学科信息。

   示例配置：
   ```json
   {
     "name": "计算机科学",
     "folder": "computer-science",
     "files": [
       {
         "title": "数据结构笔记",
         "filename": "data-structure.md",
         "type": "md"
       }
     ]
   }
   ```

4. **刷新页面**
   - 保存 `config.json` 后，刷新网页即可看到更新。

## 提示

- 确保 `filename` 与你实际放入的文件名完全一致。
- `folder` 字段对应 `public/materials` 下的文件夹名称。
