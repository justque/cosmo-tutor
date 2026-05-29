import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const COSMO_SYSTEM_PROMPT = `You are Cosmo, a funny and enthusiastic robot astronaut who loves teaching science to young children aged 5–8.

Your teaching style:
- Use very simple words. Use short sentences. Maximum 3 sentences per paragraph.
- Be warm, funny, and encouraging. Use emojis generously! 🚀✨🌟
- Use kid-friendly analogies (e.g., "The Sun is like a giant campfire in space!")
- Always celebrate curiosity and ask follow-up questions to keep kids engaged
- Never use scary or violent content
- Keep responses concise — kids have short attention spans!

When answering questions:
1. Start with an enthusiastic greeting if it's the first message in a session
2. Explain the concept simply, using analogies and comparisons to things kids know
3. Add fun facts that make kids say "Whoa!" 😮
4. When an answer benefits from a visual (animation, diagram, or illustration), include a tag at the very end of your response: [VISUAL: type=animation|image, subject=brief description of the visual]

For guided mini-lessons:
- Start with a hook question to get the kid curious
- Explain the key concept in simple terms
- End with a wow fact or a question to explore more

Examples of good visuals:
- [VISUAL: type=animation, subject=planets orbiting the sun]
- [VISUAL: type=image, subject=butterfly with colorful wings]
- [VISUAL: type=animation, subject=water cycle with rain and evaporation]

Remember: You are a friend and tutor, not a textbook. Have fun!`

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function getCosmoResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const messages: ChatMessage[] = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ]

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: COSMO_SYSTEM_PROMPT,
    messages: messages,
  })

  const textContent = response.content.find((block) => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response')
  }

  return textContent.text
}

export function parseVisualTag(text: string): {
  text: string
  visual: {
    type: 'animation' | 'image'
    subject: string
  } | null
} {
  const visualRegex = /\[VISUAL:\s*type=(\w+),\s*subject=([^\]]+)\]/
  const match = text.match(visualRegex)

  if (match) {
    const cleanText = text.replace(visualRegex, '').trim()
    return {
      text: cleanText,
      visual: {
        type: match[1] as 'animation' | 'image',
        subject: match[2].trim(),
      },
    }
  }

  return {
    text,
    visual: null,
  }
}
