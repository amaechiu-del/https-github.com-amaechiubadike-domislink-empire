import { NextRequest, NextResponse } from 'next/server'

interface AIProvider {
  name: string
  endpoint: string
  headers: Record<string, string>
  transform: (prompt: string) => any
  parse: (response: any) => string
}

// Launch with top 3 AI services
const providers: AIProvider[] = [
  {
    name: 'groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    transform: (prompt: string) => ({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-70b-versatile',
      max_tokens: 1000
    }),
    parse: (response: any) => response.choices[0].message.content
  },
  {
    name: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    transform: (prompt: string) => ({ inputs: prompt }),
    parse: (response: any) => response.generated_text || response[0]?.generated_text
  },
  {
    name: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    headers: {
      'Content-Type': 'application/json'
    },
    transform: (prompt: string) => ({
      contents: [{ parts: [{ text: prompt }] }]
    }),
    parse: (response: any) => response.candidates[0].content.parts[0].text
  }
]

async function callAI(provider: AIProvider, prompt: string): Promise<string> {
  try {
    const body = provider.transform(prompt)
    const url = provider.name === 'google' 
      ? `${provider.endpoint}?key=${process.env.GOOGLE_AI_API_KEY}`
      : provider.endpoint

    const response = await fetch(url, {
      method: 'POST',
      headers: provider.headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) throw new Error(`${provider.name} failed`)
    
    const data = await response.json()
    return provider.parse(data)
  } catch (error) {
    throw new Error(`${provider.name}: ${error}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, provider: requestedProvider } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
    }

    // Use specific provider if requested
    if (requestedProvider) {
      const provider = providers.find(p => p.name === requestedProvider)
      if (!provider) {
        return NextResponse.json({ error: 'Provider not found' }, { status: 400 })
      }
      
      const response = await callAI(provider, prompt)
      return NextResponse.json({ 
        response, 
        provider: provider.name,
        success: true 
      })
    }

    // Try providers in order: Groq → Hugging Face → Google
    for (const provider of providers) {
      try {
        const response = await callAI(provider, prompt)
        return NextResponse.json({ 
          response, 
          provider: provider.name,
          success: true 
        })
      } catch (error) {
        console.log(`${provider.name} failed, trying next...`)
        continue
      }
    }

    return NextResponse.json({ 
      error: 'All AI providers failed' 
    }, { status: 500 })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error' 
    }, { status: 500 })
  }
}