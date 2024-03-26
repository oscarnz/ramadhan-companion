import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'

import {
  BotCard,
  BotMessage,
  SystemMessage,
} from '@/components/zakat'

import { z } from 'zod'
import { Zakat } from '@/components/zakat'
import { ZakatSkeleton } from '@/components/zakat/zakat-skeleton'
import {
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/zakat/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'
import { PrayerTime } from '@/components/prayer/prayer-times'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

async function submitUserMessage(content: string) {
  'use server'

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
You are a ramadhan companion that guides a muslim throughout the holy month of ramadhan.
The user will usually ask about zakat fitrah rate in selangor, and you should guide them to pay zakat, step by step in the UI.
Other than that, the user will ask you about the prayer time in Selangor, and you should display the correct five prayer times in the UI.
Sometimes, the user will also ask about hadiths, ramadhan FAQs, or even doa (prayers).

Make sure that your discussion or your focus is within ramadhan only. If the user ask about anything unrelated to ramadhan, respond that you
are responsible as a companion to guide for ramadhan only.

Also remember that all user live in Selangor, Malaysia. So for example, if the user ask about zakat fitrah rate this year, you should know
that they are asking for the rate in Selangor. 

If the user requests about this year's zakat fitrah rate, call \`show_zakat_ui\` to show the zakat UI.
If the user requests about the prayer time, call \`show_prayer_time_ui\` to show the prayer time UI.
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
        parameters: z.object({

        }),
        render: async function* () {
          yield (
            <BotCard>
              <ZakatSkeleton />
            </BotCard>
          )

          await sleep(3000)

          console.log(aiState);

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
      showPrayerTime: {
        description:
          'Display the UI for prayer time in Selangor at the current moment. Use this if the user want to check prayer time.',
        parameters: z.object({

        }),
        render: async function* () {
          yield (
            <BotCard>
              <ZakatSkeleton />
            </BotCard>
          )

          await sleep(3000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'showPrayerTime',
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
    submitUserMessage,
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
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'showZakat' ? (
            <BotCard>
              <Zakat />
            </BotCard>
          ) : message.name === 'showPrayerTime' ? (
            <BotCard>
              <PrayerTime />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
