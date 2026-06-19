import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: '桂律通 - 中国—东盟跨境法律服务平台',
    template: '%s | 桂律通',
  },
  description:
    '桂律通——搭建更便捷的涉外诉讼法律服务平台，为中国—东盟跨境民商纠纷提供专业的AI法律意见书和多语言翻译服务。',
  keywords: [
    '桂律通',
    '涉外法律',
    '东盟法律',
    '跨境纠纷',
    '法律意见书',
    '多语言翻译',
    '中国东盟',
  ],
  authors: [{ name: '桂律通团队', url: 'https://code.coze.cn' }],
  generator: 'Coze Code',
  openGraph: {
    title: '桂律通 - 中国—东盟跨境法律服务平台',
    description:
      '桂律通——搭建更便捷的涉外诉讼法律服务平台，为中国—东盟跨境民商纠纷提供专业的AI法律意见书和多语言翻译服务。',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen flex flex-col">
        {isDev && <Inspector />}
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
