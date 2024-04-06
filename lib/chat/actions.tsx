/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
import 'server-only'

import {
  createAI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'
import { CheckCircledIcon } from '@radix-ui/react-icons'

import { BotCard, BotMessage } from '@/components/zakat'

import { Zakat } from '@/components/zakat'

import { z } from 'zod'
import { ZakatSkeleton } from '@/components/zakat/zakat-skeleton'
import { sleep, nanoid } from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/zakat/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'

import { setReminder } from '@/app/set-reminder/actions'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
  // apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFyaWZmbnpobkBnbWFpbC5jb20iLCJ1dWlkIjoiNjY5ODQwY2UtYjFjOC00NDcwLTg1NDAtOGZiYWFkYjA1ZjUzIn0.qwiwAnX_QF0EeJBeGWZwsoefRlsRRPbzs2xZLmhqCtI",
  // baseURL: "https://llm-router.nous.mesolitica.com",
})

async function callApi(content: string) {
  const query = encodeURIComponent(content)
  const res = await fetch(
    `https://ramadhancompanion.sk8jxserver.com/test/vector?query=${query}`
  )
  const data = await res.json()

  return data
}

const ReminderSuccessCard = () => {
  return (
    <div className="p-4 xl:p-32">
      <div className="rounded-md border border-green-400 group relative">
        <div className="p-4">
          <div>Set Reminder Success!</div>

          <div className="absolute bottom-0 right-0 w-20 rounded overflow-hidden">
            <CheckCircledIcon className="size-20 text-gray-500 group-hover:text-green-400 opacity-[30%] group-hover:opacity-[50%] transition-all group-hover:-rotate-[15deg] relative -bottom-6 -right-2 group-hover:scale-[120%]" />
          </div>
        </div>
      </div>
    </div>
  )
}

async function submitUserMessage(content: string) {
  'use server'

  const result = await callApi(content)

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: `\
You are islamic teacher conversation bot and you can help users answering a general questions on Hadith, step by step.

You are a ramadhan companion that guides a muslim throughout the holy month of ramadhan.
The user will usually ask about zakat fitrah rate in selangor, and you should guide them to pay zakat, step by step in the UI.
Sometimes, the user will also ask about hadiths, ramadhan FAQs, or even doa (prayers).

Make sure that your discussion or your focus is within ramadhan only. If the user ask about anything unrelated to ramadhan, respond that you
are responsible as a companion to guide for ramadhan only.

Also remember that all user live in Selangor, Malaysia. So for example, if the user ask about zakat fitrah rate this year, you should know
that they are asking for the rate in Selangor. 

If the user requests about this year's zakat fitrah rate, call \`show_zakat_ui\` to show the zakat UI.
If the user requests about reminder on tadarus or donation, call \`scheduleReminder\` to show the result

If the user wants to ask anything regarding to islamic hadith, answer according to the context given below, please extract the exact arabic hadith and its meaning with more elaborations.
Hadith Context:
"""
${result}
"""
`
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    functions: {
      showZakat: {
        description:
          'Display the UI for zakat fitrah rate for Selangor this year. Use this if the user want to check zakat fitrah rate.',
        parameters: z.object({}),
        render: async function* () {
          yield (
            <BotCard>
              <ZakatSkeleton />
            </BotCard>
          )

          await sleep(3000)

          console.log(aiState)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'showZakat',
                content: 'test'
              }
            ]
          })

          return (
            <BotCard>
              <Zakat />
            </BotCard>
          )
        }
      },
      scheduleReminder: {
        description: 'schedule a reminder for specific reason',
        parameters: z.object({
          reminder: z
            .string()
            .describe('The type of the reminder. e.g. Donation/Tadarus'),
          time: z
            .number()
            .describe(
              'time in 24hr format with : . eg: 13:15/00:25/04:21/22:34'
            )
        }),
        render: async function* ({ reminder, time }) {
          yield <ReminderSuccessCard />

          await sleep(3000)

          const res = await setReminder({
            reminder: reminder,
            time: time.toString(),
            frequency: 'daily'
          })

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'scheduleReminder',
                content: 'test'
              }
            ]
          })

          return <ReminderSuccessCard />
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: ui
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  unstable_onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  unstable_onSetAIState: async ({ state, done }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  console.log(aiState)
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'scheduleReminder' ? (
            <ReminderSuccessCard />
          ) : message.name === 'showZakat' ? (
            <BotCard>
              <Zakat />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
