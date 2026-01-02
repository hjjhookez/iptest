"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { MapPin, Globe, Wifi, Building2, Clock, Search, MapPinned, Info, Shield, Server } from "lucide-react"

interface IpData {
  ip: string
  city: string
  region: string
  regionName: string
  country: string
  countryCode: string
  continent: string
  continentCode: string
  latitude: number
  longitude: number
  lat: number
  lon: number
  timezone: string
  offset: number
  currency: string
  isp: string
  org: string
  as: string
  asname: string
  reverse?: string
  mobile: boolean
  proxy: boolean
  hosting: boolean
  zip: string
  district?: string
}

export function IpLookup() {
  const [ipAddress, setIpAddress] = useState("")
  const [ipData, setIpData] = useState<IpData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const validateIp = (ip: string) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  const lookupIp = async () => {
    if (!ipAddress.trim()) {
      setError("IP 주소를 입력해주세요")
      return
    }

    if (!validateIp(ipAddress.trim())) {
      setError("올바른 IP 주소 형식이 아닙니다")
      return
    }

    setLoading(true)
    setError("")
    setIpData(null)

    try {
      const response = await fetch(`/api/ip-lookup?ip=${encodeURIComponent(ipAddress.trim())}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "IP 정보를 가져올 수 없습니다")
      }

      const data = await response.json()

      // Map the response to our interface
      setIpData({
        ip: data.query,
        city: data.city || "알 수 없음",
        region: data.region || "",
        regionName: data.regionName || "알 수 없음",
        country: data.country || "알 수 없음",
        countryCode: data.countryCode || "",
        continent: data.continent || "알 수 없음",
        continentCode: data.continentCode || "",
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        lat: data.lat || 0,
        lon: data.lon || 0,
        timezone: data.timezone || "알 수 없음",
        offset: data.offset || 0,
        currency: data.currency || "알 수 없음",
        isp: data.isp || "알 수 없음",
        org: data.org || "알 수 없음",
        as: data.as || "알 수 없음",
        asname: data.asname || "알 수 없음",
        reverse: data.reverse,
        mobile: data.mobile || false,
        proxy: data.proxy || false,
        hosting: data.hosting || false,
        zip: data.zip || "",
        district: data.district,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "IP 조회 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      lookupIp()
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Search Card */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Search className="size-6 text-primary" />
            IP 주소 검색
          </CardTitle>
          <CardDescription className="text-base">조회하고 싶은 IP 주소를 입력하세요 (예: 8.8.8.8)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="IP 주소 입력..."
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-base h-12"
              disabled={loading}
            />
            <Button onClick={lookupIp} disabled={loading} size="lg" className="px-8">
              {loading ? (
                <>
                  <Spinner className="mr-2" />
                  검색 중...
                </>
              ) : (
                <>
                  <Search className="mr-2 size-4" />
                  찾기
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <Info className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {ipData && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Location Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-accent" />
                위치 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <InfoRow icon={<Globe className="size-4" />} label="IP 주소" value={ipData.ip} badge />
                <InfoRow
                  icon={<Globe className="size-4" />}
                  label="대륙"
                  value={`${ipData.continent} (${ipData.continentCode})`}
                />
                <InfoRow
                  icon={<MapPinned className="size-4" />}
                  label="국가"
                  value={`${ipData.country} (${ipData.countryCode})`}
                />
                <InfoRow icon={<Building2 className="size-4" />} label="지역" value={ipData.regionName} />
                <InfoRow icon={<MapPin className="size-4" />} label="도시" value={ipData.city} />
                {ipData.district && (
                  <InfoRow icon={<MapPin className="size-4" />} label="구역" value={ipData.district} />
                )}
                {ipData.zip && <InfoRow icon={<MapPin className="size-4" />} label="우편번호" value={ipData.zip} />}
              </div>
            </CardContent>
          </Card>

          {/* Network Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="size-5 text-accent" />
                네트워크 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <InfoRow icon={<Building2 className="size-4" />} label="ISP" value={ipData.isp} />
                <InfoRow icon={<Server className="size-4" />} label="조직" value={ipData.org} />
                <InfoRow icon={<Server className="size-4" />} label="AS 번호" value={ipData.as} />
                <InfoRow icon={<Server className="size-4" />} label="AS 이름" value={ipData.asname} />
                {ipData.reverse && (
                  <InfoRow icon={<Globe className="size-4" />} label="역방향 DNS" value={ipData.reverse} />
                )}
                <InfoRow icon={<Clock className="size-4" />} label="시간대" value={ipData.timezone} />
                <InfoRow
                  icon={<Clock className="size-4" />}
                  label="UTC 오프셋"
                  value={`${ipData.offset >= 0 ? "+" : ""}${ipData.offset / 3600}시간`}
                />
                <InfoRow icon={<Globe className="size-4" />} label="통화" value={ipData.currency} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5 text-accent" />
                보안 및 연결 유형
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">프록시</span>
                  </div>
                  <Badge variant={ipData.proxy ? "destructive" : "secondary"}>
                    {ipData.proxy ? "감지됨" : "아니오"}
                  </Badge>
                </div>
                <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Wifi className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">모바일</span>
                  </div>
                  <Badge variant={ipData.mobile ? "default" : "secondary"}>{ipData.mobile ? "예" : "아니오"}</Badge>
                </div>
                <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Server className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">호스팅</span>
                  </div>
                  <Badge variant={ipData.hosting ? "default" : "secondary"}>
                    {ipData.hosting ? "데이터센터/호스팅" : "일반 사용자"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordinates Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinned className="size-5 text-accent" />
                지리적 좌표
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">위도 (Latitude)</p>
                  <p className="text-2xl font-bold text-primary">{ipData.latitude.toFixed(6)}°</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">경도 (Longitude)</p>
                  <p className="text-2xl font-bold text-primary">{ipData.longitude.toFixed(6)}°</p>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`https://www.google.com/maps?q=${ipData.latitude},${ipData.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <MapPin className="size-4" />
                  Google Maps에서 정확한 위치 보기
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value: string
  badge?: boolean
}

function InfoRow({ icon, label, value, badge }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      {badge ? (
        <Badge variant="secondary" className="font-mono text-sm">
          {value}
        </Badge>
      ) : (
        <span className="text-sm font-semibold text-right">{value}</span>
      )}
    </div>
  )
}
