import {  getReminder } from './actions'

import { ReminderForm } from './reminder-form'
import ReminderList from './reminder-list'

export default async function SetReminderPage() {
  const reminder = await getReminder()

  return (
    <div>
      <div className="p-8 flex justify-end items-end">
        <ReminderForm reminderCount={reminder?.length || 0} />
      </div>
      {reminder?.length ?? 0 > 0 ? (
        <div className="p-8">
          <h2 className="text-xl font-semibold">Your Reminder</h2>
          <div className="mt-4 w-full flex flex-col">
            {reminder?.map((r, idx) => (
              <ReminderList
                key={idx}
                id={r.id}
                reminder={r.reminder}
                time={r.time}
                frequency={r.frequency}
              />
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
