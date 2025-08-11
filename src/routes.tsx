import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './ui/AppLayout'
import { AuthPage } from './ui/auth/AuthPage'
import { ChatsPage } from './ui/chats/ChatsPage'
import { ChatPage } from './ui/chats/ChatPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <ChatsPage /> },
      { path: 'chats/:chatId', element: <ChatPage /> },
      { path: 'auth', element: <AuthPage /> },
    ],
  },
])


