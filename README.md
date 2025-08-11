## Chatbot Application (Nhost + Hasura + n8n)

Frontend built with React + Vite + TypeScript. Uses Nhost Auth and GraphQL (Apollo) with subscriptions. All API calls are GraphQL-only. Bot replies are triggered via Hasura Action → n8n → OpenRouter.

### Env
Create `web/.env` with either subdomain+region or backend URL:

```
VITE_NHOST_SUBDOMAIN=izeacxcrsywmyxhlccid
VITE_NHOST_REGION=eu-central-1
# Or
# VITE_NHOST_BACKEND_URL=https://xxxxx.nhost.run
```

### Run locally

```
npm install
npm run dev
```

### Deploy (Netlify)
https://chatbotapplication0.netlify.app/
### GraphQL Schema (Hasura)
- Table `chats`: id uuid PK, user_id uuid, title text, updated_at timestamptz
- Table `messages`: id uuid PK, chat_id uuid FK, user_id uuid, role text ('user'/'assistant'), content text, created_at timestamptz

RLS: only `user` role can `select/insert/update/delete` rows where `user_id = X-Hasura-User-Id`. Expose only `user` role to the app.

### Hasura Action
- Action name: `sendMessage(chat_id: uuid!, content: String!): { reply: String! }`
- Handler: n8n webhook URL
- Permissions: only `user` role, authenticated only

### n8n Workflow (outline)
1) Webhook (POST). Read `session_variables['x-hasura-user-id']` and `input.body.chat_id`.
2) Validate `chat_id` belongs to user via Hasura GraphQL.
3) Insert user message if not yet present (optional, we insert in frontend already).
4) Call OpenRouter API using credentials.
5) Insert assistant message into Hasura.
6) Return `{ reply }` back to Action.
