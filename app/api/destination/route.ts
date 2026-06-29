// app/api/destination/route.ts v3.5.0
import { GoogleGenAI, Type } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

// server-hoist-static-io: Hoist static I/O to module level for reuse across requests
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10
const RATE_LIMIT_WINDOW = 60 * 1000

// server-cache-react: Cache the AI client instance at module level
let aiClient: GoogleGenAI | null = null

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey })
  }
  return aiClient
}

function getRateLimitKey(ip: string): string {
  return ip
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = getRateLimitKey(ip)
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { location, language } = body

    if (!location || typeof location !== "string") {
      return NextResponse.json(
        { error: "无效的地点参数" },
        { status: 400 }
      )
    }

    const sanitizedLocation = location.slice(0, 100).replace(/[<>\"\'`;]/g, "")

    const ai = getAIClient()
    if (!ai) {
      return NextResponse.json(
        { error: "服务器配置错误" },
        { status: 500 }
      )
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a brief introduction (max 100 characters) and a Wikipedia link for the location: ${sanitizedLocation}. Return in JSON format with keys: intro, link. Language: ${language === "zh-CN" ? "Chinese" : "English"}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intro: { type: Type.STRING },
            link: { type: Type.STRING },
          },
          required: ["intro", "link"],
        },
      },
    })

    if (!response.text) {
      return NextResponse.json(
        { error: "获取目的地详情失败" },
        { status: 500 }
      )
    }

    // Validate and sanitize response
    const data = JSON.parse(response.text)

    // Ensure link is a valid URL
    try {
      const url = new URL(data.link)
      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol")
      }
      data.link = url.toString()
    } catch {
      data.link = `https://en.wikipedia.org/wiki/${encodeURIComponent(sanitizedLocation)}`
    }

    return NextResponse.json(data)
  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV === "development") {
      console.error("API route error:", error)
    }

    return NextResponse.json(
      { error: "获取目的地详情失败" },
      { status: 500 }
    )
  }
}
