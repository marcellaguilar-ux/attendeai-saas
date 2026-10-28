'use client'
import { useEffect, useState } from 'react'
import { BookOpen, Trash2, Upload, Loader2 } from 'lucide-react'

type Doc = { doc_name: string; chunks: number; created_at: string }

export default function ConhecimentoClient() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [docName, setDocName] = useState('')
  const [content, setContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null)

  async function fetchDocs() {
    const res = await fetch('/api/knowledge')
    const json = await res.json()
    setDocs(json.docs ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchDocs() }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!docName.trim() || !content.trim()) return
    setUploading(true)
    setUploadMsg(null)
    const res = await fetch('/api/knowledge/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_name: docName.trim(), content: content.trim() }),
    })
    const json = await res.json()
    if (res.ok) {
      setUploadMsg({ ok: true, text: `Documento salvo em ${json.chunks} chunk(s).` })
      setDocName('')
      setContent('')
      fetchDocs()
    } else {
      setUploadMsg({ ok: false, text: json.error ?? 'Erro ao salvar.' })
    }
    setUploading(false)
  }

  async function handleDelete(name: string) {
    if (!confirm(`Remover documento "${name}"?`)) return
    setDeletingDoc(name)
    await fetch('/api/knowledge', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doc_name: name }),
    })
    setDeletingDoc(null)
    fetchDocs()
  }

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <BookOpen style={{ width: 20, height: 20, color: 'var(--dash-accent)', flexShrink: 0 }} />
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--dash-text)', letterSpacing: '-0.03em', margin: 0 }}>
            Base de Conhecimento
          </h1>
          <p style={{ fontSize: 13, color: 'var(--dash-text-muted)', margin: '3px 0 0', letterSpacing: '-0.01em' }}>
            Adicione informações que o agente usará para responder seus clientes.
          </p>
        </div>
      </div>

      {/* Upload form */}
      <form onSubmit={handleUpload} style={{
        background: 'var(--dash-bg-card)', border: '1px solid var(--dash-border)', borderRadius: 14,
        padding: 24, marginBottom: 28,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)', letterSpacing: '-0.02em', marginBottom: 16 }}>
          Adicionar documento
        </h2>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', fontWeight: 500, marginBottom: 6, letterSpacing: '.02em', textTransform: 'uppercase' }}>
            Nome do documento
          </label>
          <input
            value={docName}
            onChange={e => setDocName(e.target.value)}
            placeholder="Ex: Serviços e preços"
            required
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--dash-bg-sidebar)', border: '1px solid var(--dash-border)', borderRadius: 8,
              padding: '10px 12px', color: 'var(--dash-text)', fontSize: 13.5,
              fontFamily: 'inherit', outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--dash-text-muted)', fontWeight: 500, marginBottom: 6, letterSpacing: '.02em', textTransform: 'uppercase' }}>
            Conteúdo
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={'Escreva ou cole o conteúdo aqui.\n\nExemplo:\nCorte masculino — R$ 35\nBarba — R$ 20\nCorte + barba — R$ 50\n\nHorário: seg–sáb, 9h–19h.'}
            required
            rows={8}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--dash-bg-sidebar)', border: '1px solid var(--dash-border)', borderRadius: 8,
              padding: '10px 12px', color: 'var(--dash-text)', fontSize: 13.5,
              fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.6,
            }}
          />
        </div>

        {uploadMsg && (
          <p style={{
            fontSize: 13, marginBottom: 14, padding: '8px 12px', borderRadius: 8,
            background: uploadMsg.ok ? 'rgba(0,229,160,.08)' : 'rgba(255,80,80,.08)',
            color: uploadMsg.ok ? 'var(--dash-accent)' : '#ff6060',
            border: `1px solid ${uploadMsg.ok ? 'rgba(0,229,160,.2)' : 'rgba(255,80,80,.2)'}`,
          }}>
            {uploadMsg.text}
          </p>
        )}

        <button type="submit" disabled={uploading} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '9px 18px', borderRadius: 8, border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
          background: uploading ? 'var(--dash-border)' : 'var(--dash-accent)', color: '#000',
          fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', letterSpacing: '-0.01em',
        }}>
          {uploading
            ? <><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> Salvando...</>
            : <><Upload style={{ width: 15, height: 15 }} /> Salvar documento</>
          }
        </button>
      </form>

      {/* Doc list */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--dash-text)', letterSpacing: '-0.02em', marginBottom: 12 }}>
          Documentos salvos
        </h2>
        {loading ? (
          <p style={{ color: 'var(--dash-text-muted)', fontSize: 13 }}>Carregando...</p>
        ) : docs.length === 0 ? (
          <div style={{
            background: 'var(--dash-bg-card)', border: '1px solid var(--dash-border)', borderRadius: 12,
            padding: '32px 24px', textAlign: 'center',
          }}>
            <BookOpen style={{ width: 28, height: 28, color: 'var(--dash-text-dim)', margin: '0 auto 10px' }} />
            <p style={{ color: 'var(--dash-text-muted)', fontSize: 13 }}>Nenhum documento ainda. Adicione um acima.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {docs.map(doc => (
              <div key={doc.doc_name} style={{
                background: 'var(--dash-bg-card)', border: '1px solid var(--dash-border)', borderRadius: 10,
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <BookOpen style={{ width: 16, height: 16, color: 'var(--dash-accent)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--dash-text)', fontSize: 13.5, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>
                    {doc.doc_name}
                  </p>
                  <p style={{ color: 'var(--dash-text-muted)', fontSize: 12, margin: '2px 0 0' }}>
                    {doc.chunks} chunk{doc.chunks !== 1 ? 's' : ''} · {fmtDate(doc.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(doc.doc_name)}
                  disabled={deletingDoc === doc.doc_name}
                  title="Remover documento"
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: 6,
                    borderRadius: 6, color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {deletingDoc === doc.doc_name
                    ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                    : <Trash2 style={{ width: 15, height: 15 }} />
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
