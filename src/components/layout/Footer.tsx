import Link from 'next/link';
import { Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-[#1e40af] rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#1e40af]">桂律通</span>
          </Link>
          <p className="text-gray-600 text-sm max-w-md">
            桂律通——搭建更便捷的涉外诉讼法律服务平台，为中国—东盟跨境民商纠纷提供专业的法律服务。
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">快速链接</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/consultation" className="text-gray-600 hover:text-[#1e40af] text-sm">
                法律咨询
              </Link>
            </li>
            <li>
              <Link href="/translation" className="text-gray-600 hover:text-[#1e40af] text-sm">
                文书翻译
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">联系我们</h3>
          <p className="text-gray-600 text-sm">
            广西南宁
          </p>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-8 pt-8">
        <p className="text-gray-500 text-sm text-center">
          © 2024 桂律通. 保留所有权利.
        </p>
      </div>
    </div>
  </footer>
);
}
