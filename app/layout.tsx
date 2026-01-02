import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IP Location Tracker - 실시간 IP 위치 추적",
  description: "IP 주소의 위치 정보를 실시간으로 확인하세요. 국가, 도시, ISP 정보 등을 제공합니다.",
    generator: '0rdq'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
