import { useState } from 'react'

const initialTasks = [
  { id: 1, title: 'Review Everyday conversations', meta: 'Vocabulary · 12 cards', done: false },
  { id: 2, title: 'Complete grammar practice', meta: 'Practice · 10 questions', done: true },
  { id: 3, title: 'Listen to a 5-minute podcast', meta: 'Listening · Intermediate', done: false },
  { id: 4, title: 'Write 3 sentences with today’s word', meta: 'Writing · serendipity', done: false },
]

export function Tasks() {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState('All')
  const visible = tasks.filter((task) => filter === 'All' || (filter === 'Done' ? task.done : !task.done))
  const toggle = (id: number) => setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  return <div className="!mx-auto !max-w-4xl !space-y-7"><div className="flex items-end justify-between gap-4"><div><p className="!mb-2 !font-mono !text-xs !uppercase !tracking-[0.18em] !text-emerald-700">Your plan</p><h1 className="!mb-2 !text-5xl !font-extrabold !tracking-[-0.07em] !text-slate-900">Today’s <span className="!font-serif !font-normal !italic !text-orange-500">tasks.</span></h1><p className="!text-sm !text-slate-500">Turn a little practice into a habit that sticks.</p></div><span className="hidden !rounded-full !bg-emerald-100 !px-4 !py-2 !text-xs !font-bold !text-emerald-800 sm:block">{tasks.filter((task) => task.done).length} completed</span></div><div className="!rounded-3xl !bg-white !p-5 !shadow-lg !shadow-slate-200/60 sm:!p-7"><div className="mb-5 flex flex-wrap gap-2">{['All', 'Open', 'Done'].map((item) => <button className={`!rounded-lg !px-4 !py-2 !text-xs !font-bold ${filter === item ? '!bg-emerald-700 !text-white' : '!bg-slate-100 !text-slate-500'}`} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><ul className="!m-0 !list-none !p-0">{visible.map((task) => <li className="flex items-center gap-4 !border-t !border-slate-100 !py-5" key={task.id}><button className={`grid size-6 shrink-0 place-items-center !rounded-full !border-2 ${task.done ? '!border-emerald-600 !bg-emerald-600 !text-white' : '!border-slate-300'}`} onClick={() => toggle(task.id)} aria-label={`Toggle ${task.title}`}>{task.done ? '✓' : ''}</button><div className="min-w-0 flex-1"><p className={`!mb-1 !text-sm !font-bold ${task.done ? '!text-slate-400 !line-through' : '!text-slate-800'}`}>{task.title}</p><span className="!text-xs !text-slate-400">{task.meta}</span></div><span className="!text-slate-300">→</span></li>)}</ul><button className="mt-4 w-full !rounded-xl !border !border-dashed !border-slate-300 !py-4 !text-sm !font-bold !text-slate-500 hover:!border-emerald-500 hover:!text-emerald-700">+ Add a custom task</button></div></div>
}
