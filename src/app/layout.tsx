import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '学習継続支援アプリ',
  description: '学習や運動の継続をサポートするアプリ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
