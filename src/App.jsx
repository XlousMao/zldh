import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, Folder, Menu, ChevronRight, ChevronDown, BookOpen, AlertCircle, Home } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [config, setConfig] = useState({ subjects: [] });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // 加载配置
  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        if (data.subjects.length > 0) {
          setExpandedSubjects({ [data.subjects[0].name]: true });
          if (data.subjects[0].files.length > 0) {
            handleFileSelect(data.subjects[0], data.subjects[0].files[0]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load config:', err);
        setLoading(false);
      });
  }, []);

  // 加载 Markdown 内容
  useEffect(() => {
    if (selectedFile && selectedSubject && selectedFile.type === 'md') {
      const filePath = `/materials/${selectedSubject.folder}/${selectedFile.filename}`;
      fetch(filePath)
        .then(res => {
          if (!res.ok) throw new Error('File not found');
          return res.text();
        })
        .then(text => setFileContent(text))
        .catch(err => setFileContent(`# Error\n\nUnable to load file: ${filePath}`));
    }
  }, [selectedFile, selectedSubject]);

  const handleFileSelect = (subject, file) => {
    setSelectedSubject(subject);
    setSelectedFile(file);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSubject = (subjectName) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectName]: !prev[subjectName]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-500 font-medium">正在加载资源库...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <div className={clsx(
        "fixed md:relative z-30 h-full bg-slate-50 border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col shadow-lg md:shadow-none",
        sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden"
      )}>
        {/* 侧边栏头部 */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center gap-3 shrink-0 bg-white">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">资料导航</span>
        </div>

        {/* 侧边栏列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {config.subjects.map((subject) => (
            <div key={subject.name} className="select-none">
              <div 
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-slate-600 font-medium transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm"
                onClick={() => toggleSubject(subject.name)}
              >
                <ChevronRight className={clsx(
                  "w-4 h-4 transition-transform duration-200 text-slate-400 group-hover:text-slate-600",
                  expandedSubjects[subject.name] && "rotate-90"
                )} />
                <Folder className={clsx(
                  "w-5 h-5 transition-colors",
                  expandedSubjects[subject.name] ? "text-blue-500" : "text-amber-400"
                )} />
                <span>{subject.name}</span>
              </div>
              
              <div className={clsx(
                "overflow-hidden transition-all duration-300 ease-in-out",
                expandedSubjects[subject.name] ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <div className="ml-4 pl-4 border-l border-slate-200 my-1 space-y-1">
                  {subject.files.map((file) => {
                    const isSelected = selectedFile === file;
                    return (
                      <div
                        key={file.filename}
                        onClick={() => handleFileSelect(subject, file)}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm transition-all relative overflow-hidden",
                          isSelected 
                            ? "bg-white text-blue-600 font-medium shadow-sm ring-1 ring-slate-200" 
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                        )}
                        <FileText className={clsx(
                          "w-4 h-4",
                          isSelected ? "text-blue-500" : "text-slate-400"
                        )} />
                        <span className="truncate">{file.title}</span>
                      </div>
                    );
                  })}
                  {subject.files.length === 0 && (
                    <div className="text-xs text-slate-400 italic px-3 py-2">暂无文件</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="text-xs text-slate-400 text-center">
            v1.1 · 本地复习资料库
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden relative bg-white">
        {/* 顶部 Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 overflow-hidden">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              title={sidebarOpen ? "收起侧边栏" : "展开侧边栏"}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* 面包屑导航 */}
            <div className="flex items-center gap-2 text-sm text-slate-500 whitespace-nowrap overflow-hidden">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4 text-slate-300" />
              {selectedSubject ? (
                <>
                  <span className="font-medium text-slate-700">{selectedSubject.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <span className="font-medium text-blue-600 truncate max-w-[200px] md:max-w-md">
                    {selectedFile?.title}
                  </span>
                </>
              ) : (
                <span>首页</span>
              )}
            </div>
          </div>

          {selectedFile && (
             <div className="hidden md:flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                  {selectedFile.type}
                </span>
             </div>
          )}
        </div>

        {/* 内容显示区域 */}
        <div className="flex-1 relative w-full h-full bg-slate-50/50">
          {selectedFile ? (
            selectedFile.type === 'pdf' ? (
              // PDF 模式：全屏无边距
              <div className="absolute inset-0 w-full h-full">
                <iframe 
                  src={`${import.meta.env.BASE_URL}materials/${selectedSubject.folder}/${selectedFile.filename}`}
                  className="w-full h-full border-none"
                  title={selectedFile.title}
                />
              </div>
            ) : selectedFile.type === 'md' ? (
              // Markdown 模式：居中阅读体验
              <div className="h-full overflow-y-auto px-4 md:px-8 py-6 md:py-10">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-8 md:p-12 min-h-full">
                  <h1 className="text-3xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                    {selectedFile.title}
                  </h1>
                  <article className="prose prose-slate prose-lg max-w-none 
                    prose-headings:font-bold prose-headings:text-slate-800 
                    prose-p:text-slate-600 prose-li:text-slate-600
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-slate-800 prose-pre:shadow-lg
                    prose-img:rounded-lg prose-img:shadow-md">
                    <Markdown remarkPlugins={[remarkGfm]}>{fileContent}</Markdown>
                  </article>
                </div>
              </div>
            ) : (
              // 不支持的格式
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <AlertCircle className="w-16 h-16 mb-4 text-slate-200" />
                <p>无法预览此文件格式</p>
              </div>
            )
          ) : (
            // 空状态
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                <BookOpen className="w-16 h-16 text-blue-100" />
              </div>
              <p className="text-xl font-medium text-slate-500">选择左侧文件开始学习</p>
              <p className="text-sm mt-2 text-slate-400">支持 Markdown 笔记与 PDF 文档</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
