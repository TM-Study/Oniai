'use client'

import Header from '@/app/(screen)/_components/header';
import "./globals.css";
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hidePageList = ['/404', '/login', '/sign-up','/'];
  const isToBeHide = hidePageList.includes(pathname);
  
  return (
    <html lang="ja">
      <head />
      <body className='bg-gray-100'>
        {/* 各ページのコンテンツ */}
        <main className='bg-white max-w-2xl mx-auto rounded-lg shadow-lg mt-2'>
          {/* ログインページでない場合にヘッダーを表示 */}
        {!isToBeHide && <Header />}
          {children}
        </main>
      </body>
    </html>
  );
}
