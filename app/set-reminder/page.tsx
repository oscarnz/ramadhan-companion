import { Button } from '@/components/ui/button'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import {
  Dialog,
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
import Image from 'next/image'

export default async function SetReminderPage() {
  function generateTimeList() {
    let times = []
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        let hour = i < 10 ? '0' + i : i
        let minute = j === 0 ? '00' : j
        times.push(`${hour}:${minute}`)
      }
    }
    return times
  }

  const timeList = generateTimeList()

  return (
    <div>
      <div className="p-8 flex justify-end items-end">
        <Dialog>
          <DialogTrigger>
            <Button className="gap-1">
              <PlusCircledIcon /> Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-auto max-w-[400px] rounded-sm">
            <DialogHeader>
              <DialogTitle>Set reminder</DialogTitle>
              <DialogDescription>
                Set reminder to be send to your preferred notification platform
              </DialogDescription>
            </DialogHeader>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Set reminder for" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="donation">Donation</SelectItem>
                <SelectItem value="tadarrus">Tadarrus</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                {timeList.map(time => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="ghost">Cancel</Button>
              <Button>Set reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-center items-center">
        No reminder is set yet, set one?
      </div>
    </div>
  )
}
