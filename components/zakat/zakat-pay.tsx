'use client'

import { useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { formatNumber } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import type { AI } from '@/lib/chat/actions'
import Link from 'next/link'

interface Zakat {
  riceType: string
  numberOfShares?: number
  price: number
  status: 'requires_action' | 'completed' | 'expired'
}

export function Zakat() {
  const [value, setValue] = useState(1)
  const [riceType, setRiceType] = useState<string | null>(null)
  const [purchasingUI, setPurchasingUI] = useState<null | React.ReactNode>(null)
  const [aiState, setAIState] = useAIState<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()
  const { confirmZakat } = useActions()

  function getPrice() {
    switch (riceType) {
      case 'superspesial':
        return 7
      case 'wangi':
      case 'ponni':
      case 'perang':
      case 'putihimport':
      case 'pulut':
        return 14
      default:
        return 21
    }
  }

  // Unique identifier for this UI component.
  const id = useId()

  // Whenever the slider changes, we need to update the local value state and the history
  // so LLM also knows what's going on.
  function onSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value)
    setValue(newValue)
  }

  return (
    <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
      <div className="float-right inline-block rounded-full bg-white/10 px-2 py-1 text-xs">
        Selangor
      </div>
      <Select onValueChange={e => setRiceType(e)} defaultValue="superspesial">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select rice type" />
        </SelectTrigger>
        <SelectContent>
          {/* 7 */}
          <SelectItem value="superspesial">
            Beras Super Spesial Tempatan
          </SelectItem>
          {/* 14 */}
          <SelectItem value="putihimport">Beras Putih Import</SelectItem>
          <SelectItem value="perang">Beras Perang</SelectItem>
          <SelectItem value="pulut">Beras Pulut</SelectItem>
          <SelectItem value="ponni">Beras Ponni</SelectItem>
          <SelectItem value="wangi">Beras Wangi</SelectItem>
          {/* 21 */}
          <SelectItem value="basmathi">Beras Basmathi</SelectItem>
          <SelectItem value="jepun">Beras Jepun</SelectItem>
          <SelectItem value="merah">Beras Merah</SelectItem>
        </SelectContent>
      </Select>
      {/* <div className="text-3xl font-bold">${price}</div> */}

      <div className="relative mt-6 pb-6">
        <p>Family Members</p>
        <input
          id="labels-range-input"
          type="range"
          value={value}
          onChange={onSliderChange}
          min="1"
          max="20"
          className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-600 accent-green-500 dark:bg-zinc-700"
          step="1"
        />
        <span className="absolute bottom-1 start-0 text-xs text-zinc-400">
          1
        </span>
        <span className="absolute bottom-1 start-1/4 -translate-x-1/2 text-xs text-zinc-400">
          5
        </span>
        <span className="absolute bottom-1 start-2/4 -translate-x-1/2 text-xs text-zinc-400">
          10
        </span>
        <span className="absolute bottom-1 start-3/4 -translate-x-1/2 text-xs text-zinc-400">
          15
        </span>
        <span className="absolute bottom-1 end-0 text-xs text-zinc-400">
          20
        </span>
      </div>

      <div className="mt-6">
        <p>Total zakat</p>
        <div className="flex flex-wrap items-center text-xl font-bold sm:items-end sm:gap-2 sm:text-3xl">
          <div className="flex basis-1/3 flex-col tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
            MYR
            {riceType === 'superspesial'
              ? 7
              : riceType === 'wangi' ||
                  riceType === 'ponni' ||
                  riceType === 'putihimport' ||
                  riceType === 'pulut'
                ? 14
                : 21}
            {/* <span className="mb-1 text-sm font-normal text-zinc-600 sm:mb-0 dark:text-zinc-400">
                  { '(' +  riceType + ')'}
                </span> */}
          </div>
          <div className="basis-1/3 text-center sm:basis-auto">×</div>
          <span className="flex basis-1/3 flex-col tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
            {value}
            <span className="mb-1 ml-1 text-sm font-normal text-zinc-600 sm:mb-0 dark:text-zinc-400">
              person
            </span>
          </span>
          <div className="mt-2 basis-full border-t border-t-zinc-700 pt-2 text-center sm:mt-0 sm:basis-auto sm:border-0 sm:pt-0 sm:text-left">
            = <span>{formatNumber(getPrice() * value)}</span>
          </div>
        </div>
      </div>

      <button
        className="mt-6 w-full rounded-lg bg-green-400 px-4 py-2 font-bold text-zinc-900 hover:bg-green-500"
        // onClick={async () => {
        //   const response = await confirmPurchase(symbol, price, value)
        //   setPurchasingUI(response.purchasingUI)
        //   // https://fpx.zakatselangor.com.my/

        //   // Insert a new system message to the UI.
        //   setMessages((currentMessages: any) => [
        //     ...currentMessages,
        //     response.newMessage
        //   ])
        // }}
        onClick={() => {
          window.open(
            'https://fpx.zakatselangor.com.my/',
            '_blank',
            'noopener,noreferrer'
          )
        }}
      >
        Pay
      </button>
    </div>
  )
}
