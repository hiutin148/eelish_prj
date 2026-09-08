import { useEffect, useState } from 'react'
import { getDecks, importSource } from '../api/deckApi'
import type { Deck } from '../types/types'

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadDecks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await getDecks(page, pageSize)
        if (!cancelled) {
          setDecks(response.data.content)
          setTotalPages(response.data.totalPages)
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError : new Error('Failed to load decks'))
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadDecks()
    return () => {
      cancelled = true
    }
  }, [page, pageSize])

  const importDeckSource = async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('Importing deck from file:', file.name)
      await importSource(file);
      const response = await getDecks(page, pageSize)
      setDecks(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError : new Error('Failed to import deck'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    decks,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
    goToPage: (nextPage: number) => {
      setPage(Math.max(1, Math.min(nextPage, totalPages || 1)))
    },
    importDeckSource,
  }
}
