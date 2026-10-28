// Jina AI — jina-embeddings-v3 (768 dims, multilingual)
export async function embed(text: string): Promise<number[]> {
  const res = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.JINA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'jina-embeddings-v3',
      input: [text],
      dimensions: 768,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Jina embed error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const embedding = data?.data?.[0]?.embedding
  if (!Array.isArray(embedding)) {
    throw new Error(`Jina embed: resposta inesperada: ${JSON.stringify(data)}`)
  }
  return embedding as number[]
}

export function chunkText(text: string, maxChars = 500, overlap = 80): string[] {
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
  const chunks: string[] = []

  for (const para of paragraphs) {
    if (para.length <= maxChars) {
      chunks.push(para)
      continue
    }
    // Divide parágrafos longos por sentença
    const sentences = para.split(/(?<=[.!?])\s+/)
    let current = ''
    for (const sentence of sentences) {
      if ((current + ' ' + sentence).trim().length > maxChars) {
        if (current.trim()) chunks.push(current.trim())
        // Overlap: mantém último pedaço
        const words = current.trim().split(' ')
        current = words.slice(-Math.floor(overlap / 5)).join(' ') + ' ' + sentence
      } else {
        current = current ? current + ' ' + sentence : sentence
      }
    }
    if (current.trim()) chunks.push(current.trim())
  }

  return chunks.filter(c => c.length >= 30)
}
