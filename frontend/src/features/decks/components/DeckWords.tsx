import { useEffect, useState } from 'react'
import { getCards } from '../../words/api/cardsApi'
import type { Card } from '../../words/types/types'
import type { Deck } from '../types/types'

export function DeckWords({ deck }: { deck: Deck }) {
  const [cards, setCards] = useState<Card[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getCards()
      .then((allCards) => {
        if (!cancelled) {
          setCards(allCards.filter((card) => card.deck.id === deck.id))
          setError(null)
          setIsLoading(false)
        }
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError : new Error('Failed to load words'))
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [deck.id])

  return (
    <section className="!rounded-2xl !border !border-slate-200 !bg-white !p-5 !shadow-sm">
      <h2 className="!m-0 !text-2xl !font-bold !text-slate-900">{deck.name}</h2>
      <p className="!mt-1 !text-sm !text-slate-500">Words in this deck</p>
      {isLoading && <p className="!mt-5 !text-sm !text-slate-500">Loading words...</p>}
      {error && (
        <p className="!mt-5 !rounded-xl !bg-amber-50 !p-4 !text-sm !text-amber-800">
          Could not load words for this deck.
        </p>
      )}
      {!isLoading && !error && (
        <div className="!mt-5 !divide-y !divide-slate-100">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div className="!py-3" key={card.id}>
                <p className="!m-0 !font-semibold !text-slate-900">
                  {card.note.fieldValues.Keyword || 'Untitled word'}
                </p>
                <p className="!mb-0 !mt-1 !text-sm !text-slate-500">
                  {card.note.fieldValues.Short_Vietnamese || card.note.fieldValues.Full_Vietnamese}
                </p>
              </div>
            ))
          ) : (
            <p className="!py-3 !text-sm !text-slate-500">This deck has no words yet.</p>
          )}
        </div>
      )}
    </section>
  )
}