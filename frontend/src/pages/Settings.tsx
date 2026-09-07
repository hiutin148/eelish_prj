import { useState } from 'react'
import { dailyGoalOptions, skillLevels } from '../features/settings'

export function Settings() {
  const [dailyGoal, setDailyGoal] = useState('15')
  const [reminders, setReminders] = useState(true)
  const [sound, setSound] = useState(true)

  return (
    <div className="!mx-auto !max-w-4xl !space-y-7">
      <div><p className="!mb-2 !font-mono !text-xs !uppercase !tracking-[0.18em] !text-emerald-700">Preferences</p><h1 className="!mb-2 !text-5xl !font-extrabold !tracking-[-0.07em] !text-slate-900">Make Eelish <span className="!font-serif !font-normal !italic !text-orange-500">yours.</span></h1><p className="!text-sm !text-slate-500">Tune your study rhythm, reminders, and learning experience.</p></div>
      <div className="grid gap-5">
        <section className="!rounded-3xl !border !border-slate-200 !bg-white !p-6 !shadow-sm"><h2 className="!mb-1 !text-lg !font-bold !text-slate-900">Study profile</h2><p className="!mb-6 !text-xs !text-slate-500">These settings help shape your daily practice.</p><div className="grid gap-4 sm:grid-cols-2"><label className="!text-xs !font-bold !text-slate-700">Display name<input className="mt-2 w-full !rounded-xl !border !border-slate-200 !px-4 !py-3 !text-sm !font-normal !outline-none focus:!border-emerald-500" defaultValue="Minh" /></label><label className="!text-xs !font-bold !text-slate-700">Current level<select className="mt-2 w-full !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-3 !text-sm !font-normal !outline-none focus:!border-emerald-500" defaultValue="B1">{skillLevels.map((level) => <option key={level} value={level.slice(0, 2)}>{level}</option>)}</select></label></div></section>
        <section className="!rounded-3xl !border !border-slate-200 !bg-white !p-6 !shadow-sm"><h2 className="!mb-1 !text-lg !font-bold !text-slate-900">Learning preferences</h2><p className="!mb-5 !text-xs !text-slate-500">Make your practice fit your day.</p><div className="flex items-center justify-between !border-b !border-slate-100 !py-4"><div><strong className="block !text-sm !text-slate-800">Daily goal</strong><span className="!text-xs !text-slate-500">Minutes of focused learning</span></div><select value={dailyGoal} onChange={(event) => setDailyGoal(event.target.value)} className="!rounded-lg !border !border-slate-200 !bg-white !px-3 !py-2 !text-xs">{dailyGoalOptions.map((minutes) => <option value={minutes} key={minutes}>{minutes} minutes</option>)}</select></div><Toggle title="Study reminders" description="Get a gentle nudge when it is time to practice." value={reminders} onChange={setReminders} /><Toggle title="Pronunciation sounds" description="Play audio automatically in listening exercises." value={sound} onChange={setSound} /></section>
        <div className="flex justify-end"><button className="!rounded-xl !bg-emerald-700 !px-5 !py-3 !text-sm !font-bold !text-white hover:!bg-emerald-800">Save changes</button></div>
      </div>
    </div>
  )
}

function Toggle({ title, description, value, onChange }: { title: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between !border-b !border-slate-100 !py-4 last:!border-0"><div><strong className="block !text-sm !text-slate-800">{title}</strong><span className="!text-xs !text-slate-500">{description}</span></div><button className={`relative !h-6 !w-11 !rounded-full !transition ${value ? '!bg-emerald-600' : '!bg-slate-200'}`} onClick={() => onChange(!value)} aria-label={`Toggle ${title}`}><span className={`absolute top-1 size-4 !rounded-full !bg-white !shadow-sm !transition ${value ? 'left-6' : 'left-1'}`} /></button></div>
}