export type Id = string | number

export type QuestionContentBlock = {
  block_type: 'text' | 'image' | string
  content?: string
  url?: string
  [key: string]: unknown
}

export type QuestionOption = {
  label?: string
  content?: string
  text?: string
  value?: string
  [key: string]: unknown
}

export type ErrorBankQuestion = {
  id: Id
  subject?: string
  question_type?: string
  content_json?: QuestionContentBlock[]
  content_blocks?: QuestionContentBlock[]
  options_json?: QuestionOption[]
  knowledge_tags?: string[]
  review_status?: string
  user_answer?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export type ChatSession = {
  id: Id
  title?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export type ChatMessageRole = 'user' | 'assistant' | 'system'

export type ChatMessage = {
  id?: Id | string
  role: ChatMessageRole
  content: string
  rawContent?: string
  reasoning?: string
  reasoningOpen?: boolean
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export type NotePreview = {
  title?: string
  content?: string
  summary?: string
  subject?: string
  knowledge_tags?: string[]
  [key: string]: unknown
}
