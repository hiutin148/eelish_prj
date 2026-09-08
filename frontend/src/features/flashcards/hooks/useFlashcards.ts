import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getDecks } from '../../decks/api/deckApi'
import { getCards } from '../../words'
import type { Card } from '../../words'
import type { ReviewGrade, StudyCard } from '../types/types'

const pageSize = 100

function toStudyCard(card: Card): StudyCard {
  const fields = card.note.fieldValues
  return {
    id: card.id,
    deckId: card.deck.id,
    term: fields.Keyword || 'Untitled word',
    type: card.templateName || 'Vocabulary',
    sound: fields.Transcription || fields.Keyword_Sound || '',
    meaning: fields.Short_Vietnamese || fields.Full_Vietnamese || fields.Explanation || 'No meaning available.',
    example: fields.Suggestion || fields.Example_Sound || 'No example available.',
  }
}

export function useFlashcards() {
  const [selectedDeckId, setSelectedDeckId] = useState('')
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [browseMode, setBrowseMode] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const query = useQuery({
    queryKey: ['flashcards', 'decks-and-cards'],
    queryFn: async () => {
      const [deckResponse, cards] = await Promise.all([getDecks(1, pageSize), getCards()])
      return { decks: deckResponse.data.content, cards: cards.map(toStudyCard) }
    },
  })
  const decks = useMemo(() => query.data?.decks ?? [], [query.data?.decks])
  const cards = useMemo(() => query.data?.cards ?? [], [query.data?.cards])
  const availableDecks = useMemo(() => decks.filter((deck) => cards.some((card) => card.deckId === deck.id)), [cards, decks])
  const activeDeckId = availableDecks.some((deck) => deck.id === selectedDeckId) ? selectedDeckId : availableDecks[0]?.id ?? ''
  const studyCards = useMemo(() => cards.filter((card) => card.deckId === activeDeckId), [activeDeckId, cards])
  const card = studyCards[index % Math.max(studyCards.length, 1)]

  const selectDeck = (deckId: string) => {
    setSelectedDeckId(deckId)
    setIndex(0)
    setReviewed(0)
    setRevealed(false)
  }

  const next = (grade?: ReviewGrade) => {
    if (grade) setReviewed((current) => current + 1)
    setIndex((current) => (current + 1) % studyCards.length)
    setRevealed(false)
  }

  return { ...query, decks: availableDecks, selectedDeckId: activeDeckId, setSelectedDeckId: selectDeck, card, index, total: studyCards.length, revealed, browseMode, reviewed, setRevealed, setBrowseMode, next }
}
