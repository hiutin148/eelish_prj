import { useFlashcards } from '../hooks/useFlashcards'
import type { ReviewGrade } from '../types/types'

const grades: { label: ReviewGrade; style: string }[] = [
  { label: 'Again', style: '!bg-rose-50 !text-rose-700 hover:!bg-rose-100' },
  { label: 'Hard', style: '!bg-amber-50 !text-amber-700 hover:!bg-amber-100' },
  { label: 'Good', style: '!bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100' },
  { label: 'Easy', style: '!bg-sky-50 !text-sky-700 hover:!bg-sky-100' },
]

export function FlashcardsView() {
  const study = useFlashcards()
  const { card } = study

  if (study.isLoading) return <StatusMessage message="Loading decks and cards..." />
  if (study.isError) return <StatusMessage message="Could not load decks and cards. Please try again." error />
  if (!card) return <StatusMessage message="Import a deck with vocabulary cards to start learning." />

  return (
    <div className="!mx-auto !max-w-5xl !space-y-7">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="!mb-2 !font-mono !text-xs !uppercase !tracking-[0.18em] !text-emerald-700">Vocabulary review</p>
          <h1 className="!mb-2 !text-5xl !font-extrabold !tracking-[-0.07em] !text-slate-900">Make words <span className="!font-serif !font-normal !italic !text-orange-500">stick.</span></h1>
          <p className="!text-sm !text-slate-500">Review cards from an imported deck with spaced repetition, or browse at your own pace.</p>
        </div>
        <div className="!rounded-xl !bg-orange-50 !px-4 !py-3 !text-right"><strong className="block !text-lg !text-orange-800">{Math.max(study.total - study.reviewed, 0)} due</strong><span className="!text-xs !text-orange-700">in this deck</span></div>
      </header>
      <div className="flex flex-col gap-3 !rounded-xl !border !border-slate-200 !bg-white !p-3 !shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 !text-xs !font-bold !text-slate-500">Study deck<select className="!rounded-lg !border !border-slate-200 !bg-white !px-3 !py-2 !text-xs !font-semibold !text-slate-700" value={study.selectedDeckId} onChange={(event) => study.setSelectedDeckId(event.target.value)}>{study.decks.map((deck) => <option value={deck.id} key={deck.id}>{deck.name}</option>)}</select></label>
        <div className="flex items-center justify-between gap-4"><span className="!font-mono !text-xs !text-slate-500">CARD {String(study.index + 1).padStart(2, '0')} / {study.total}</span><button className={`!rounded-lg !px-4 !py-2 !text-xs !font-bold ${study.browseMode ? '!bg-slate-900 !text-white' : '!bg-slate-100 !text-slate-600'}`} onClick={() => study.setBrowseMode(!study.browseMode)}>{study.browseMode ? 'Browse mode' : 'SRS review'}</button></div>
      </div>
      <section className="!rounded-3xl !bg-[#173f39] !p-6 !shadow-xl sm:!p-10">
        <div className="mx-auto max-w-2xl !rounded-2xl !bg-white !p-7 !text-center sm:!p-12"><span className="!font-mono !text-xs !uppercase !tracking-[0.16em] !text-orange-600">{card.type}</span><h2 className="!mb-2 !mt-7 !text-5xl !font-bold !tracking-[-0.07em] !text-slate-900">{card.term}</h2><p className="!font-mono !text-xs !text-slate-400">{card.sound}</p>{study.revealed ? <div className="mt-8 border-t !border-slate-100 !pt-7"><p className="!text-lg !font-semibold !text-slate-800">{card.meaning}</p><p className="!mb-0 !mt-3 !font-serif !text-sm !italic !text-slate-500">&ldquo;{card.example}&rdquo;</p></div> : <button className="mt-9 w-full !rounded-xl !border !border-dashed !border-slate-300 !py-4 !text-sm !font-bold !text-emerald-700 hover:!border-emerald-500" onClick={() => study.setRevealed(true)}>Show meaning ↓</button>}</div>
        {study.revealed && <div className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">{(study.browseMode ? [{ label: 'Next', style: '!bg-white !text-emerald-900 hover:!bg-emerald-50' }] : grades).map((grade) => <button className={`!rounded-xl !px-3 !py-3 !text-xs !font-bold ${grade.style}`} key={grade.label} onClick={() => study.next(study.browseMode ? undefined : grade.label as ReviewGrade)}>{grade.label}</button>)}</div>}
      </section>
      <div className="grid gap-3 sm:grid-cols-3"><Stat label="REVIEWED" value={String(study.reviewed)} detail="this session" /><Stat label="DECK" value={study.decks.find((deck) => deck.id === study.selectedDeckId)?.name ?? 'Unknown'} detail={`${study.total} cards`} /><Stat label="MODE" value={study.browseMode ? 'Browse' : 'SRS'} detail={study.browseMode ? 'no scheduling' : 'counts toward review'} /></div>
    </div>
  )
}

function StatusMessage({ message, error = false }: { message: string; error?: boolean }) {
  return <div className={`!mx-auto !max-w-5xl !rounded-3xl !p-8 !text-sm ${error ? '!bg-amber-50 !text-amber-800' : '!border !border-dashed !border-slate-300 !bg-white !text-slate-500'}`}>{message}</div>
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="!rounded-2xl !border !border-slate-200 !bg-white !p-5"><span className="!text-xs !font-bold !text-slate-400">{label}</span><strong className="mt-2 block !truncate !text-2xl !text-slate-900">{value}</strong><span className="!text-xs !text-slate-500">{detail}</span></div>
}
