import { useMutation, useQuery } from '@apollo/client'
import { CREATE_CHAT, GET_CHATS } from '../../graphql/operations'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export function ChatsPage() {
  const { data, loading } = useQuery(GET_CHATS)
  const [title, setTitle] = useState('New Chat')
  const [createChat, { loading: creating }] = useMutation(CREATE_CHAT, {
    refetchQueries: [GET_CHATS],
  })

  async function handleCreate() {
    await createChat({ variables: { title } })
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={handleCreate} disabled={creating}>Create chat</button>
      </div>
      <div>
        <h3>Your chats</h3>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <ul>
            {data?.chats?.map((c: any) => (
              <li key={c.id}>
                <Link to={`/chats/${c.id}`}>{c.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


