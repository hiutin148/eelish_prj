import { useEffect, useMemo, useState } from 'react'
import { TodoList } from '../features/todos'
import { flashcards } from '../features/words/flashcards'

type Deck = {
  title: string
  description: string
  count: number
  progress: number
  color: string
}

const decks: Deck[] = [
  { title: 'Daily conversations', description: 'Useful phrases for real life', count: 48, progress: 72, color: 'bg-amber-100' },
  { title: 'Travel essentials', description: 'Get around with confidence', count: 32, progress: 38, color: 'bg-sky-100' },
  { title: 'Work & meetings', description: 'Sound clear and professional', count: 64, progress: 19, color: 'bg-rose-100' },
]

const week = [
  { day: 'M', value: 12 }, { day: 'T', value: 18 }, { day: 'W', value: 8 }, { day: 'T', value: 21 }, { day: 'F', value: 14 }, { day: 'S', value: 6 }, { day: 'S', value: 0 },
]

export function Home() {
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState('Review')
  const [cardIndex, setCardIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isLearned, setIsLearned] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(15 * 60)
  const card = flashcards[cardIndex]
  const filteredDecks = useMemo(() => decks.filter((deck) => deck.title.toLowerCase().includes(search.toLowerCase())), [search])

  useEffect(() => {
    if (!isRunning) return undefined
    const interval = window.setInterval(() => setSeconds((current) => (current > 0 ? current - 1 : 0)), 1000)
    return () => window.clearInterval(interval)
  }, [isRunning])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
    }
  }

  const nextCard = () => {
    setCardIndex((current) => (current + 1) % flashcards.length)
    setIsRevealed(false)
    setIsLearned(false)
  }

  const formatTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  return (
    <div className="!mx-auto !max-w-7xl !space-y-8">
      <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="!mb-3 !font-mono !text-xs !font-semibold !uppercase !tracking-[0.18em] !text-emerald-700">Monday, 12 August 2024</p>
          <h1 className="!mb-3 !text-5xl !font-extrabold !leading-[0.95] !tracking-[-0.07em] !text-slate-900 sm:!text-6xl">Make today<br /><span className="!font-serif !font-normal !italic !text-orange-500">count.</span></h1>
          <p className="!max-w-md !text-sm !leading-6 !text-slate-500">A focused 15 minutes is all it takes to keep your English moving forward.</p>
        </div>
        <div className="flex items-center gap-3 !rounded-2xl !border !border-orange-200 !bg-orange-50 !px-4 !py-3 !shadow-sm">
          <span className="grid size-10 place-items-center !rounded-full !bg-orange-200 !text-xl !text-orange-700">✦</span>
          <div><strong className="block !text-sm !text-slate-900">7 day streak</strong><span className="!text-xs !text-slate-500">Best: 14 days</span></div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.8fr)]">
        <main className="space-y-6">
          <section className="relative overflow-hidden !rounded-[1.5rem] !bg-[#173f39] !p-7 !text-white !shadow-xl !shadow-emerald-950/10 sm:!p-9">
            <div className="absolute -right-20 -top-24 size-72 !rounded-full !border !border-emerald-200/20" /><div className="absolute -right-4 -top-8 size-44 !rounded-full !border !border-orange-200/30" />
            <div className="relative z-10 flex min-h-[360px] flex-col justify-between">
              <div><p className="!mb-8 !font-mono !text-[11px] !uppercase !tracking-[0.18em] !text-emerald-200"><span className="!mr-3 !text-orange-300">01</span>Daily practice</p><h2 className="!mb-3 !text-4xl !font-bold !leading-none !tracking-[-0.06em] !text-white sm:!text-5xl">Build your<br /><span className="!font-serif !font-normal !italic !text-orange-300">vocabulary.</span></h2><p className="!max-w-sm !text-sm !leading-6 !text-emerald-100/75">12 cards are waiting for you in your active review queue.</p></div>
              <div><div className="mb-5 flex gap-1 !rounded-lg !bg-black/10 !p-1" role="group" aria-label="Study mode">{['Review', 'Learn', 'Listen'].map((item) => <button className={`!rounded-md !px-3 !py-2 !text-xs !font-semibold !transition ${mode === item ? '!bg-white !text-emerald-950 !shadow-sm' : '!text-emerald-100/70 hover:!text-white'}`} key={item} onClick={() => setMode(item)}>{item}</button>)}</div><div className="flex flex-wrap items-center gap-4"><button className="!rounded-lg !bg-orange-300 !px-5 !py-3 !text-sm !font-bold !text-emerald-950 !transition hover:!-translate-y-0.5 hover:!bg-orange-200" onClick={() => { setIsRunning(true); setIsRevealed(true) }}>{mode === 'Listen' ? 'Start listening' : 'Start session'} <span className="!ml-2">↗</span></button><span className="!font-mono !text-xs !text-emerald-100/60">{isRevealed ? '2 / 12 cards' : '0 / 12 cards'}</span></div></div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between"><div><p className="!mb-1 !font-mono !text-[11px] !uppercase !tracking-[0.18em] !text-emerald-700">Keep exploring</p><h2 className="!m-0 !text-2xl !font-bold !tracking-[-0.04em] !text-slate-900">Your decks</h2></div><a className="!text-xs !font-bold !text-emerald-700 hover:!text-orange-600" href="#/decks">View all ↗</a></div>
            <div className="grid gap-3 md:grid-cols-3">{filteredDecks.map((deck) => <article className={`group !min-h-52 !rounded-2xl !p-5 !shadow-sm !transition hover:-translate-y-1 hover:!shadow-lg ${deck.color}`} key={deck.title}><div className="flex justify-between"><span className="grid size-9 place-items-center !rounded-full !bg-white/70 !text-xs !font-bold !text-slate-800">Aa</span><span className="!text-lg !text-slate-700 transition group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></div><h3 className="!mb-1 !mt-8 !text-sm !font-bold !text-slate-900">{deck.title}</h3><p className="!mb-5 !text-xs !text-slate-600">{deck.description}</p><div className="!mb-2 !h-1 !rounded-full !bg-white/60"><span className="block !h-full !rounded-full !bg-slate-800" style={{ width: `${deck.progress}%` }} /></div><span className="!text-[11px] !font-medium !text-slate-600">{deck.progress}% complete · {deck.count} words</span></article>)}</div>
          </section>

          <section className="!rounded-2xl !border !border-slate-200 !bg-white !p-5 !shadow-sm"><div className="mb-4 flex items-center justify-between"><div><p className="!mb-1 !font-mono !text-[11px] !uppercase !tracking-[0.18em] !text-emerald-700">Your routine</p><h2 className="!m-0 !text-lg !font-bold !text-slate-900">Small steps, big progress</h2></div><span className="!rounded-full !bg-emerald-50 !px-3 !py-1 !text-xs !font-bold !text-emerald-700">4 / 5 goals</span></div><div className="grid gap-3 sm:grid-cols-3"><div className="!rounded-xl !bg-slate-50 !p-3"><span className="!text-xl">◷</span><strong className="mt-2 block !text-sm !text-slate-800">15 min</strong><span className="!text-xs !text-slate-500">Daily practice</span></div><div className="!rounded-xl !bg-slate-50 !p-3"><span className="!text-xl">◌</span><strong className="mt-2 block !text-sm !text-slate-800">86%</strong><span className="!text-xs !text-slate-500">Quiz accuracy</span></div><div className="!rounded-xl !bg-slate-50 !p-3"><span className="!text-xl">◇</span><strong className="mt-2 block !text-sm !text-slate-800">128</strong><span className="!text-xs !text-slate-500">Cards reviewed</span></div></div></section>
        </main>

        <aside className="space-y-4">
          <label className="flex items-center gap-3 !rounded-xl !border !border-slate-200 !bg-white !px-4 !py-2 !text-slate-400 !shadow-sm"><span className="!text-xl">⌕</span><input className="!min-w-0 !flex-1 !border-0 !bg-transparent !py-2 !text-sm !text-slate-800 !outline-none" aria-label="Search decks" placeholder="Search your decks" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          <section className="!rounded-2xl !border !border-slate-200 !bg-[#fffdf8] !p-6 !shadow-sm"><div className="flex items-center justify-between"><span className="!font-mono !text-[10px] !font-semibold !tracking-[0.16em] !text-orange-600">WORD OF THE DAY</span><button className="!rounded-full !p-2 !text-emerald-700 hover:!bg-emerald-50" aria-label="Pronounce word" onClick={() => speak(card.term)}>◖))</button></div><span className="mt-7 block !font-serif !text-sm !italic !text-slate-400">{card.type}</span><h2 className="!mb-1 !mt-1 !text-4xl !font-bold !tracking-[-0.06em] !text-slate-900">{card.term}</h2><p className="!font-mono !text-xs !text-slate-400">{card.sound}</p>{isRevealed ? <div className="mt-6 border-l-2 !border-orange-300 !pl-3"><p className="!mb-2 !text-sm !leading-6 !text-slate-700">{card.meaning}</p><p className="!font-serif !text-sm !italic !leading-5 !text-slate-500">“{card.example}”</p></div> : <button className="mt-6 w-full !border-t !border-slate-200 !py-4 !text-left !text-xs !font-bold !text-emerald-700" onClick={() => setIsRevealed(true)}>Tap to reveal meaning <span className="float-right !text-orange-500">↓</span></button>}<div className="mt-5 flex gap-2"><button className={`flex-1 !rounded-lg !py-3 !text-xs !font-bold ${isLearned ? '!bg-emerald-100 !text-emerald-800' : '!bg-emerald-700 !text-white hover:!bg-emerald-800'}`} onClick={() => setIsLearned(!isLearned)}>{isLearned ? '✓ Learned today' : 'Mark as learned'}</button><button className="!rounded-lg !border !border-slate-200 !px-4 !text-xs !font-bold !text-slate-600 hover:!bg-slate-50" onClick={nextCard} aria-label="Next word">Next</button></div></section>

          <section className="!rounded-2xl !border !border-slate-200 !bg-white !p-5 !shadow-sm"><div className="mb-4 flex items-start justify-between"><div><p className="!mb-1 !font-mono !text-[10px] !uppercase !tracking-[0.16em] !text-emerald-700">Your progress</p><h2 className="!m-0 !text-lg !font-bold !text-slate-900">This week</h2></div><span className="!text-orange-500">↗</span></div><div className="flex h-32 items-end justify-between gap-2 border-b !border-slate-100 px-1">{week.map((item, index) => <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={`${item.day}-${index}`}><span className={`w-full max-w-3 !rounded-t-full ${index === 3 ? '!bg-orange-400' : '!bg-emerald-200'}`} style={{ height: `${Math.max(item.value * 4, 4)}px` }} /><small className="!font-mono !text-[10px] !text-slate-400">{item.day}</small></div>)}</div><p className="!mb-0 !mt-5 !text-xs !text-slate-500"><strong className="!text-emerald-700">+18%</strong> more cards than last week</p></section>
          <section className="!rounded-2xl !bg-orange-100 !p-5"><div className="flex items-center justify-between"><div><p className="!mb-1 !text-xs !font-bold !text-orange-800">FOCUS TIMER</p><strong className="!font-mono !text-3xl !text-orange-950">{formatTime}</strong></div><button className="!rounded-xl !bg-orange-500 !px-4 !py-3 !text-xs !font-bold !text-white hover:!bg-orange-600" onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Pause' : 'Start'}</button></div><button className="!mt-3 !text-xs !text-orange-800 underline" onClick={() => { setSeconds(15 * 60); setIsRunning(false) }}>Reset timer</button></section>
        </aside>
      </div>
      <div><TodoList /></div>
    </div>
  )
}
