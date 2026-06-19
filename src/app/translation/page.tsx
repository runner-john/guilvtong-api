'use client';

import { useState } from 'react';
import { Languages, ArrowLeft, Download, Copy, FileText, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

const languages = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'th', label: '泰语' },
  { value: 'vi', label: '越南语' },
];

const languageNames: Record<string, string> = {
  zh: '中文',
  en: '英语',
  th: '泰语',
  vi: '越南语',
};

export default function TranslationPage() {
  const [sourceLang, setSourceLang] = useState('zh');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceText,
          sourceLang,
          targetLang,
        }),
      });

      const data = await response.json();
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
        setShowResult(true);
      }
    } catch (error) {
      console.error('Error translating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText(null);
      setShowResult(false);
    }
  };

  const handleDownload = () => {
    if (!translatedText) return;
    const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `翻译结果_${languageNames[sourceLang]}_${languageNames[targetLang]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    await navigator.clipboard.writeText(translatedText);
    alert('已复制到剪贴板');
  };

  const handleReset = () => {
    setSourceText('');
    setTranslatedText(null);
    setShowResult(false);
  };

  if (showResult && translatedText) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
              <Link href="/translation">
                <ArrowLeft className="mr-2 w-4 h-4" />
                返回翻译
              </Link>
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">翻译完成</h1>
            <p className="text-gray-600">
              {languageNames[sourceLang]} → {languageNames[targetLang]}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white p-6">
              <div className="flex items-center mb-4 pb-3 border-b border-gray-200">
                <FileText className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">原文 ({languageNames[sourceLang]})</h3>
              </div>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {sourceText}
              </div>
            </Card>

            <Card className="bg-white p-6 shadow-lg border-t-4 border-t-[#1e40af]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-[#1e40af] mr-2" />
                  <h3 className="font-semibold text-gray-900">译文 ({languageNames[targetLang]})</h3>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" onClick={handleCopy} className="flex items-center">
                    <Copy className="mr-1 w-4 h-4" />
                    复制
                  </Button>
                  <Button size="sm" onClick={handleDownload} className="bg-[#1e40af] hover:bg-blue-800 flex items-center">
                    <Download className="mr-1 w-4 h-4" />
                    下载
                  </Button>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {translatedText}
              </div>
            </Card>
          </div>

          <div className="text-center">
            <Button onClick={handleReset} className="bg-[#1e40af] hover:bg-blue-800 mr-4">
              新的翻译
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">
                返回首页
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/">
              <ArrowLeft className="mr-2 w-4 h-4" />
              返回首页
            </Link>
          </Button>
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#1e40af] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Languages className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">多语言法律文书翻译</h1>
          <p className="text-gray-600">支持中文、英语、泰语、越南语等多语言法律文书翻译</p>
        </div>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="text" className="flex-1">文本翻译</TabsTrigger>
            <TabsTrigger value="file" className="flex-1">文件上传</TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card className="bg-white p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 源语言 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-900">源语言</Label>
                    <Select value={sourceLang} onValueChange={setSourceLang}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    placeholder="请输入需要翻译的法律文书内容..."
                    className="min-h-[300px] resize-none"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                  />
                  <div className="text-sm text-gray-500">
                    {sourceText.length} 字符
                  </div>
                </div>

                {/* 交换按钮 */}
                <div className="hidden lg:flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleSwapLanguages}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-90" />
                    <ArrowLeft className="w-5 h-5 -rotate-90 ml-[-20px]" />
                  </Button>
                </div>

                {/* 目标语言 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold text-gray-900">目标语言</Label>
                    <Select value={targetLang} onValueChange={setTargetLang}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="min-h-[300px] border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center">
                    <p className="text-gray-400 text-center">
                      翻译结果将显示在这里
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={handleTranslate}
                    disabled={loading || !sourceText.trim() || sourceLang === targetLang}
                    className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold px-8 py-6 text-lg min-w-[200px]"
                  >
                    {loading ? '正在翻译...' : '立即翻译'}
                  </Button>
                  {sourceText && (
                    <Button variant="secondary" onClick={handleReset}>
                      清空内容
                    </Button>
                  )}
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">
                  支持法律合同、判决书、诉状等各类法律文书的专业翻译
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="file">
            <Card className="bg-white p-8 shadow-lg">
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">文件上传翻译</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  支持上传 .txt、.docx、.pdf 等格式的法律文书文件进行翻译
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                    <div className="space-y-3">
                      <Label>源语言</Label>
                      <Select value={sourceLang} onValueChange={setSourceLang}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label>目标语言</Label>
                      <Select value={targetLang} onValueChange={setTargetLang}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
                    disabled
                  >
                    <Upload className="mr-2 w-5 h-5" />
                    选择文件 (开发中)
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 支持的翻译类型 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-3">📄 合同翻译</h3>
            <p className="text-gray-600 text-sm">
              买卖合同、服务合同、投资协议等各类商务合同的专业翻译
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-3">⚖️ 法律文书</h3>
            <p className="text-gray-600 text-sm">
              起诉状、答辩状、判决书、裁定书等诉讼文书翻译
            </p>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-3">📋 其他文件</h3>
            <p className="text-gray-600 text-sm">
              法律意见书、证据材料、政府文件等各类法律相关文件翻译
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
