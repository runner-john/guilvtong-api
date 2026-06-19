'use client';

import { useState } from 'react';
import { FileText, ArrowLeft, Download, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const disputeTypes = [
  { value: 'trade', label: '跨境贸易纠纷' },
  { value: 'investment', label: '投资合作争议' },
  { value: 'maritime', label: '海事海商纠纷' },
  { value: 'labor', label: '跨国劳务纠纷' },
  { value: 'property', label: '涉外婚姻财产' },
  { value: 'other', label: '其他民商纠纷' },
];

const countries = [
  { value: 'china', label: '中国' },
  { value: 'vietnam', label: '越南' },
  { value: 'thailand', label: '泰国' },
  { value: 'malaysia', label: '马来西亚' },
  { value: 'indonesia', label: '印度尼西亚' },
  { value: 'singapore', label: '新加坡' },
  { value: 'philippines', label: '菲律宾' },
  { value: 'myanmar', label: '缅甸' },
  { value: 'cambodia', label: '柬埔寨' },
  { value: 'laos', label: '老挝' },
  { value: 'brunei', label: '文莱' },
];

export default function ConsultationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [legalOpinion, setLegalOpinion] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    plaintiffName: '',
    plaintiffCountry: '',
    defendantName: '',
    defendantCountry: '',
    disputeType: '',
    disputeAmount: '',
    disputeDescription: '',
    evidence: '',
    demands: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLegalOpinion('');
    setStep(2); // 立即切换到结果页，显示流式输出
    try {
      const response = await fetch('/api/generate-opinion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, stream: true }),
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') break;
            try {
              const j = JSON.parse(raw);
              if (j.content) {
                fullText += j.content;
                setLegalOpinion(fullText);
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error('Error generating opinion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!legalOpinion) return;
    const blob = new Blob([legalOpinion], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '法律意见书.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!legalOpinion) return;
    await navigator.clipboard.writeText(legalOpinion);
    alert('已复制到剪贴板');
  };

  if (step === 2 && legalOpinion) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
              <Link href="/consultation">
                <ArrowLeft className="mr-2 w-4 h-4" />
                返回咨询
              </Link>
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">法律意见书已生成</h1>
            <p className="text-gray-600">请查阅以下专业法律意见</p>
          </div>

          <Card className="bg-white p-8 shadow-lg">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="mr-2 w-6 h-6 text-[#1e40af]" />
                法律意见书
              </h2>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={handleCopy} className="flex items-center">
                  <Copy className="mr-2 w-4 h-4" />
                  复制
                </Button>
                <Button onClick={handleDownload} className="bg-[#1e40af] hover:bg-blue-800 flex items-center">
                  <Download className="mr-2 w-4 h-4" />
                  下载
                </Button>
              </div>
            </div>
            <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {legalOpinion}
            </div>
          </Card>

          <div className="mt-8 text-center">
            <Button asChild className="bg-[#1e40af] hover:bg-blue-800 mr-4">
              <Link href="/consultation">
                新的咨询
              </Link>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/">
              <ArrowLeft className="mr-2 w-4 h-4" />
              返回首页
            </Link>
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">涉外法律咨询</h1>
          <p className="text-gray-600">请填写以下信息,我们将为您生成专业的法律意见书</p>
        </div>

        <Card className="bg-white p-8 shadow-lg">
          <div className="space-y-6">
            {/* 当事人信息 */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#1e40af] text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                当事人信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="plaintiffName">甲方/原告姓名/名称</Label>
                  <Input
                    id="plaintiffName"
                    placeholder="请输入姓名或公司名称"
                    value={formData.plaintiffName}
                    onChange={(e) => handleInputChange('plaintiffName', e.target.value)}
                  />
                  <Label htmlFor="plaintiffCountry">所属国家/地区</Label>
                  <Select
                    value={formData.plaintiffCountry}
                    onValueChange={(value) => handleInputChange('plaintiffCountry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择国家" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="defendantName">乙方/被告姓名/名称</Label>
                  <Input
                    id="defendantName"
                    placeholder="请输入姓名或公司名称"
                    value={formData.defendantName}
                    onChange={(e) => handleInputChange('defendantName', e.target.value)}
                  />
                  <Label htmlFor="defendantCountry">所属国家/地区</Label>
                  <Select
                    value={formData.defendantCountry}
                    onValueChange={(value) => handleInputChange('defendantCountry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择国家" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 纠纷信息 */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#1e40af] text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                纠纷信息
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <Label htmlFor="disputeType">纠纷类型</Label>
                  <Select
                    value={formData.disputeType}
                    onValueChange={(value) => handleInputChange('disputeType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择纠纷类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {disputeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="disputeAmount">争议金额(如适用)</Label>
                  <Input
                    id="disputeAmount"
                    placeholder="请输入金额"
                    value={formData.disputeAmount}
                    onChange={(e) => handleInputChange('disputeAmount', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="disputeDescription">纠纷详细描述</Label>
                <Textarea
                  id="disputeDescription"
                  placeholder="请详细描述纠纷的起因、经过和现状,包括合同签订情况、履行情况、争议焦点等"
                  rows={6}
                  value={formData.disputeDescription}
                  onChange={(e) => handleInputChange('disputeDescription', e.target.value)}
                />
              </div>
            </div>

            {/* 证据与诉求 */}
            <div className="pb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-[#1e40af] text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                证据与诉求
              </h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="evidence">现有证据情况</Label>
                  <Textarea
                    id="evidence"
                    placeholder="请说明您目前掌握的证据,如合同、发票、邮件、聊天记录等"
                    rows={4}
                    value={formData.evidence}
                    onChange={(e) => handleInputChange('evidence', e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="demands">具体诉求</Label>
                  <Textarea
                    id="demands"
                    placeholder="请说明您的具体诉求,如要求赔偿、解除合同、继续履行等"
                    rows={4}
                    value={formData.demands}
                    onChange={(e) => handleInputChange('demands', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.plaintiffName || !formData.defendantName || !formData.disputeType || !formData.disputeDescription}
                className="w-full bg-[#1e40af] hover:bg-blue-800 text-white py-6 text-lg font-semibold"
              >
                {loading ? '正在生成法律意见书...' : '生成法律意见书'}
              </Button>
              <p className="text-center text-gray-500 text-sm mt-4">
                本法律意见书仅供参考,不构成正式法律建议。如有需要,请咨询专业律师。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
