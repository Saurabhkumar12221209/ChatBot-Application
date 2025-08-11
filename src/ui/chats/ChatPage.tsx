import { useMutation, useQuery, useSubscription } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { GET_MESSAGES, INSERT_MESSAGE, MESSAGES_SUB, SEND_MESSAGE_ACTION } from '../../graphql/operations'
import { useEffect, useRef, useState } from 'react'

export function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>()
  const [content, setContent] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const { data: initial } = useQuery(GET_MESSAGES, { variables: { chat_id: chatId } })
  const { data: live } = useSubscription(MESSAGES_SUB, { variables: { chat_id: chatId } })

  const [insertMessage] = useMutation(INSERT_MESSAGE)
  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE_ACTION)

  const messages = live?.messages ?? initial?.messages ?? []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages?.length])

  async function handleSend() {
    if (!content.trim() || !chatId) return
    const text = content
    setContent('')

    // 1) Optimistically save the user message
    await insertMessage({ variables: { chat_id: chatId, role: 'user', content: text } })

    // 2) Trigger chatbot via Hasura Action (backed by n8n)
    await sendMessage({ variables: { chat_id: chatId, content: text } })
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 16 }}>
        {(messages ?? []).map((m: any) => (
          <div key={m.id} style={{ margin: '8px 0' }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{m.role}</div>
            <div>{m.content}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="Type a message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend()
          }}
          style={{ flex: 1 }}
        />
        <button onClick={handleSend} disabled={sending}>Send</button>
      </div>
    </div>
  )
}


