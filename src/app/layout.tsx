import type { Metadata } from 'next';
import './globals.css';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: '学習継続支援アプリ',
  description: '学習や運動の継続をサポートするアプリ',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // cookies()を呼ぶことで動的レンダリングを強制
  await cookies();

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
