import { capitalize } from '@/lib/utils'
import { deleteReminder, getReminder } from './actions'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { ReminderForm } from './reminder-form'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default async function SetReminderPage() {
  const reminder = await getReminder()

  async function submitFormDeleteReminder(formData: FormData) {
    'use server'

    const res = await deleteReminder({
      id: formData.get('id') as string
    })

    if (res.$metadata.httpStatusCode === 200) {
      alert('Reminder deleted successfully')
    }
  }
  return (
    <div>
      <div className="p-8 flex justify-end items-end">
        <ReminderForm reminderCount={reminder?.length || 0} />
      </div>
      {reminder?.length > 0 ? (
        <div className="p-8">
          <h2 className="text-xl font-semibold">Your Reminder</h2>
          <div className="mt-4 w-full flex flex-col">
            {reminder?.map((r, idx) => (
              <Dialog key={idx}>
                <DialogTrigger>
                  <div
                    key={idx}
                    className="mt-2 bg-white border rounded-xl text-black p-4"
                  >
                    <div className="text-lg font-semibold">
                      {capitalize(r.reminder)}
                    </div>
                    <div className="text-sm text-gray-500">{r.time}</div>
                    <div className="text-sm text-gray-500">
                      {capitalize(r.frequency)}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-h-screen overflow-auto max-w-[400px] rounded-sm">
                  <DialogHeader>
                    <DialogTitle>Delete?</DialogTitle>
                  </DialogHeader>
                  <div className="text-center">
                    <form action={submitFormDeleteReminder}>
                      <input type="hidden" name="id" value={r.id} />
                      <Button
                        className="bg-red-600 text-white w-1/2"
                        type="submit"
                      >
                        Delete reminder
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          No reminder is set yet, set one?
        </div>
      )}
    </div>
  )
}
