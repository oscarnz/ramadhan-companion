'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { capitalize } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { deleteReminder } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReminderListProps {
  id: string
  reminder: string
  time: string
  frequency: string
}

export default function ReminderList({
  id,
  reminder,
  time,
  frequency
}: ReminderListProps) {
  const router = useRouter()
  
  async function submitFormDeleteReminder(formData: FormData) {
    const res = await deleteReminder({
      id: formData.get('id') as string
    })

    if (res.$metadata.httpStatusCode === 200) {
      toast.success('Reminder deleted successfully')
      router.refresh()
    }
  }
  return (
    <Dialog key={id}>
      <DialogTrigger>
        <div
          key={id}
          className="mt-2 bg-white border rounded-xl text-black p-4"
        >
          <div className="text-lg font-semibold">{capitalize(reminder)}</div>
          <div className="text-sm text-gray-500">{time}</div>
          <div className="text-sm text-gray-500">{capitalize(frequency)}</div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto max-w-[400px] rounded-sm">
        <DialogHeader>
          <DialogTitle>Delete?</DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <form action={submitFormDeleteReminder}>
            <input type="hidden" name="id" value={id} />
            <Button className="bg-red-600 text-white w-1/2" type="submit">
              Delete reminder
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
