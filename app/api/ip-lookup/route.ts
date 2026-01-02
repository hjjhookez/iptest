import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ip = searchParams.get("ip")

  if (!ip) {
    return NextResponse.json({ error: "IP 주소가 필요합니다" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    })

    const text = await response.text()

    if (!response.ok) {
      return NextResponse.json({ error: "IP 정보를 가져올 수 없습니다" }, { status: 400 })
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      return NextResponse.json({ error: "서버 응답을 처리할 수 없습니다" }, { status: 500 })
    }

    if (data.error) {
      return NextResponse.json({ error: data.reason || "IP 조회에 실패했습니다" }, { status: 400 })
    }

    const result = {
      query: ip,
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region_code,
      regionName: data.region,
      city: data.city,
      zip: data.postal,
      lat: data.latitude,
      lon: data.longitude,
      timezone: data.timezone,
      isp: data.org,
      org: data.org,
      as: data.asn,
      continent: data.continent_code,
      currency: data.currency,
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "IP 조회 중 오류가 발생했습니다" }, { status: 500 })
  }
}
