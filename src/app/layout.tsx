import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '斐波那契回撤工具',
  description: '计算斐波那契回撤水平的工具',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen">
          <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-0 shadow-lg">
            <nav>
              <ul className="list-none p-0 m-0">
                <li className="mb-0.5">
                  <a href="/fibonacci" className="text-gray-300 block py-4 px-6 transition-all duration-300 ease-in-out text-base border-l-3 border-transparent hover:bg-white/5 hover:text-white hover:border-l-3 hover:border-primary hover:translate-x-0.5">
                    斐波那契回撤工具
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex-1 p-8 bg-white">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
