'use client';

import { Scale, FileText, Languages, ArrowRight, Shield, Users, Globe, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const features = [
  {
    icon: FileText,
    title: 'AI 法律意见书',
    description: '根据纠纷具体情况,自动生成严谨的法律意见书,给出细致的AI研判和处理建议',
  },
  {
    icon: Languages,
    title: '多语言翻译',
    description: '支持合同和法律文书的多语言翻译,涵盖英语、泰语、越南语等东盟国家语言',
  },
  {
    icon: Shield,
    title: '专业法律分析',
    description: '基于中国和东盟国家法律法规,提供专业的法律分析和风险评估',
  },
];

const steps = [
  {
    number: '01',
    title: '描述纠纷情况',
    description: '填写案件基本信息,包括当事人情况、纠纷类型、具体诉求等',
  },
  {
    number: '02',
    title: 'AI 智能研判',
    description: '系统基于法律数据库和AI模型,进行专业的法律分析和风险评估',
  },
  {
    number: '03',
    title: '获取法律意见书',
    description: '获得严谨格式的法律意见书,包含争议焦点、法律适用、处理建议等',
  },
];

const useCases = [
  {
    title: '跨境贸易纠纷',
    description: '处理中国与东盟国家间的货物贸易、服务贸易等跨境商事纠纷',
  },
  {
    title: '投资合作争议',
    description: '解决跨境投资、合资合作等领域的法律争议和合同纠纷',
  },
  {
    title: '海事海商纠纷',
    description: '处理海上运输、船舶碰撞、共同海损等海事海商法律事务',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1e40af] via-blue-800 to-[#1e40af] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">中国—东盟 跨境法律服务</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                桂律通
                <br />
                <span className="text-[#d4af37]">跨境法律服务平台</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                为中国—东盟跨境民商纠纷提供专业的AI法律意见书和多语言翻译服务,
                让涉外法律服务更便捷、更专业
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-[#d4af37] hover:bg-[#c49f30] text-gray-900 font-semibold px-8 py-6 text-lg">
                  <Link href="/consultation">
                    立即咨询
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-6 text-lg">
                  <Link href="/translation">
                    文书翻译
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">专业法律分析</h3>
                      <p className="text-blue-100 text-sm">基于中国和东盟法律法规</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">多语言支持</h3>
                      <p className="text-blue-100 text-sm">中文、英语、泰语、越南语</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#d4af37] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">快速响应</h3>
                      <p className="text-blue-100 text-sm">AI即时生成法律意见书</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">核心功能</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              为您提供专业、高效的跨境法律服务解决方案
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-[#1e40af]">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-[#1e40af]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">使用流程</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              三步即可获得专业的法律意见书
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 h-full">
                  <div className="text-4xl font-bold text-[#1e40af] mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-[#d4af37]" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold px-8 py-6 text-lg">
              <Link href="/consultation">
                开始使用
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">适用场景</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              适用于多种跨境民商事纠纷场景
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow duration-300 bg-white">
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1e40af]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            开始您的跨境法律服务之旅
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            无论您遇到何种跨境民商纠纷,桂律通都能为您提供专业的法律意见和支持
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-[#d4af37] hover:bg-[#c49f30] text-gray-900 font-semibold px-8 py-6 text-lg">
              <Link href="/consultation">
                免费咨询
              </Link>
            </Button>
            <Button asChild variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-6 text-lg">
              <Link href="/translation">
                翻译服务
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
