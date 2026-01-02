import { IpLookup } from "@/components/ip-lookup"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-balance md:text-6xl">IP Location Tracker</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
            실시간으로 IP 주소의 지리적 위치 정보를 확인하세요. 정확한 위치, ISP 정보, 그리고 더 많은 데이터를
            제공합니다.
          </p>
        </div>

        <IpLookup />
      </div>
    </main>
  )
}
