'use client'

import { Button } from '@/components/ui/button'
import { PlusCircledIcon } from '@radix-ui/react-icons'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { setReminder } from './actions'
import { generateTimeList } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface ReminderFormProps {
  reminderCount: number
}

const FormSchema = z.object({
  reminder: z.string({
    required_error: 'Please select a reminder.'
  }),
  time: z.string({
    required_error: 'Please select a time.'
  }),
  frequency: z.string({
    required_error: 'Please select a frequency.'
  })
})

export function ReminderForm({ reminderCount }: ReminderFormProps) {
  const timeList = generateTimeList()

  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (reminderCount >= 3) {
      toast.error('You can only set a maximum of 3 reminders')
      return
    }

    const res = await setReminder({
      reminder: data.reminder,
      time: data.time,
      frequency: data.frequency
    })

    if (res.$metadata.httpStatusCode === 200) {
      toast.success('Reminder set successfully')
      router.refresh()
      form.reset()
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="gap-2 h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90">
          <PlusCircledIcon /> Reminder
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto max-w-[400px] rounded-sm">
        <DialogHeader>
          <DialogTitle>Set reminder</DialogTitle>
          <DialogDescription>
            Set reminder to be send to your preferred notification platform
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Set reminder for" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="donation">Donation</SelectItem>
                      <SelectItem value="tadarrus">Tadarrus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Set time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      ref={ref => {
                        if (!ref) return
                        ref.ontouchstart = e => {
                          e.preventDefault()
                        }
                      }}
                    >
                      {timeList.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      ref={ref => {
                        if (!ref) return
                        ref.ontouchstart = e => {
                          e.preventDefault()
                        }
                      }}
                    >
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Set reminder</Button>
            </DialogFooter>
          </form>
        </Form>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>
  )
}
