import { NextRequest, NextResponse } from "next/server"
import { Groq } from "groq-sdk"

export async function POST(req: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY environment variable not configured" },
        { status: 503 }
      )
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      )
    }

    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      language: "en",
      response_format: "json",
      temperature: 0.0,
    })

    return NextResponse.json({ text: transcription.text })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    )
  }
}
