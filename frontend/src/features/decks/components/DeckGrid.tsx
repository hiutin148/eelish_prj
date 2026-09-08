import type { KeyboardEvent } from 'react'
import type { Deck } from '../types/types'

interface DeckGridProps {
  decks: Deck[]
  onOpen: (deck: Deck) => void
}

export function DeckGrid({ decks, onOpen }: DeckGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck, index) => {
        const openWithKeyboard = (event: KeyboardEvent<HTMLElement>) => {
          if (event.key === 'Enter' || event.key === ' ') onOpen(deck)
        }

        return (
          <article
            className="group !min-h-60 !cursor-pointer !rounded-2xl !p-5 !shadow-sm !transition hover:-translate-y-1 hover:!shadow-lg"
            key={deck.id}
            onClick={() => onOpen(deck)}
            onKeyDown={openWithKeyboard}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between">
              <div className="grid size-10 place-items-center !rounded-xl !bg-white/70 !font-bold !text-slate-800">
                Aa
              </div>
              <button
                className="!text-lg !text-slate-600 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-label={`Open ${deck.name}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onOpen(deck)
                }}
              >
                ↗
              </button>
            </div>
            <div className="mt-10 flex items-center gap-2">
              <h2 className="!m-0 !text-base !font-bold !text-slate-900">{deck.name}</h2>
              <span className="!rounded-full !bg-white/60 !px-2 !py-1 !text-[10px] !font-bold !text-slate-600">
                {deck.childDecks.length > 0 ? `${deck.childDecks.length} decks` : 'Deck'}
              </span>
            </div>
            <p className="!mb-5 !mt-1 !text-xs !text-slate-600">
              {deck.childDecks.length > 0 ? 'Open to view child decks' : 'Open to view words'}
            </p>
            <div className="!mb-2 !h-1.5 !rounded-full !bg-white/70">
              <span
                className="block !h-full !rounded-full !bg-slate-800"
                style={{ width: `${20 + (index % 6) * 11}%` }}
              />
            </div>
            <span className="!text-[11px] !font-medium !text-slate-600">Click to open</span>
          </article>
        )
      })}
    </div>
  )
}