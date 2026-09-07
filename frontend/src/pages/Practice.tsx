import { useState } from 'react'
import { practiceQuestions as questions } from '../features/practice'


export function Practice() {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const question = questions[index]
  const isCorrect = selected === question.answer

  const choose = (answer: string) => setSelected(answer)
  const next = () => { setIndex((current) => (current + 1) % questions.length); setSelected(null) }

  return <div className="!mx-auto !max-w-5xl !space-y-7">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="!mb-2 !font-mono !text-xs !uppercase !tracking-[0.18em] !text-emerald-700">Practice room</p><h1 className="!mb-2 !text-5xl !font-extrabold !tracking-[-0.07em] !text-slate-900">Sharpen your <span className="!font-serif !font-normal !italic !text-orange-500">grammar.</span></h1><p className="!text-sm !text-slate-500">A short adaptive quiz based on your recent mistakes.</p></div><div className="!rounded-xl !bg-emerald-50 !px-4 !py-3 !text-right"><strong className="block !text-lg !text-emerald-800">8 / 10</strong><span className="!text-xs !text-emerald-700">weekly goal</span></div></div>
    <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
      <section className="!rounded-3xl !bg-white !p-6 !shadow-lg !shadow-slate-200/60 sm:!p-9"><div className="mb-8 flex items-center justify-between"><span className="!font-mono !text-xs !text-slate-400">QUESTION {String(index + 1).padStart(2, '0')} / {questions.length}</span><span className="!rounded-full !bg-orange-100 !px-3 !py-1 !text-xs !font-bold !text-orange-700">Grammar</span></div><div className="!mb-8 !rounded-2xl !bg-slate-50 !p-7"><p className="!mb-0 !text-center !text-2xl !font-bold !leading-relaxed !text-slate-800">{question.prompt}</p></div><div className="grid gap-3 sm:grid-cols-2">{question.options.map((option) => <button className={`!rounded-xl !border !p-4 !text-left !text-sm !font-semibold !transition ${selected === option ? option === question.answer ? '!border-emerald-500 !bg-emerald-50 !text-emerald-800' : '!border-rose-400 !bg-rose-50 !text-rose-700' : '!border-slate-200 !text-slate-700 hover:!border-emerald-400 hover:!bg-emerald-50'}`} key={option} onClick={() => choose(option)}>{option}<span className="float-right">{selected === option ? option === question.answer ? '✓' : '×' : ''}</span></button>)}</div>{selected && <div className={`mt-6 !rounded-xl !p-4 !text-sm ${isCorrect ? '!bg-emerald-50 !text-emerald-800' : '!bg-amber-50 !text-amber-800'}`}><strong>{isCorrect ? 'Nice work.' : `The answer is “${question.answer}”.`}</strong><p className="!mb-0 !mt-1">{question.note}</p></div>}<div className="mt-8 flex justify-end"><button className="!rounded-xl !bg-emerald-700 !px-5 !py-3 !text-sm !font-bold !text-white disabled:!cursor-not-allowed disabled:!opacity-40" disabled={!selected} onClick={next}>{index === questions.length - 1 ? 'Try again' : 'Next question'} →</button></div></section>
      <aside className="space-y-4"><div className="!rounded-3xl !bg-[#173f39] !p-6 !text-white"><p className="!mb-5 !font-mono !text-xs !uppercase !tracking-[0.16em] !text-emerald-200">Choose a workout</p>{['Grammar · 10 questions', 'Vocabulary · 15 cards', 'Listening · 5 minutes'].map((item, itemIndex) => <button className={`mb-2 flex w-full items-center justify-between !rounded-xl !p-4 !text-left !text-sm ${itemIndex === 0 ? '!bg-white !font-bold !text-emerald-950' : '!bg-white/10 !text-emerald-100 hover:!bg-white/20'}`} key={item}>{item}<span>↗</span></button>)}</div><div className="!rounded-2xl !border !border-slate-200 !bg-white !p-5"><p className="!mb-2 !font-mono !text-[10px] !uppercase !tracking-[0.16em] !text-slate-400">Recent accuracy</p><strong className="!text-3xl !text-slate-900">86%</strong><p className="!mb-0 !mt-2 !text-xs !text-emerald-700">↑ 12% from last month</p></div></aside>
    </div>
  </div>
}
