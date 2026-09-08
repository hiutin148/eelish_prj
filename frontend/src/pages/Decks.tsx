import { useMemo, useState } from 'react'
import { Modal } from '../components/ui/Modal'
import { DeckGrid, DeckWords, useDecks } from '../features/decks'
import type { Deck } from '../features/decks'

export function Decks() {
  const { decks, isLoading, error, hasNextPage, hasPreviousPage, goToPage, importDeckSource } =
    useDecks()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deckPath, setDeckPath] = useState<Deck[]>([])
  const [selectedLeaf, setSelectedLeaf] = useState<Deck | null>(null)

  const currentDeck = deckPath[deckPath.length - 1]
  const items = currentDeck?.childDecks ?? decks
  const visible = useMemo(
    () =>
      items.filter(
        (deck) =>
          deck.name.toLowerCase().includes(search.toLowerCase()) &&
          (filter === 'All' || (deck.id.length % 2 === 0 ? 'A2' : 'B1') === filter)
      ),
    [filter, items, search]
  )

  const showDeck = (deck: Deck) => {
    if (deck.childDecks.length > 0) {
      setDeckPath((path) => [...path, deck])
      setSelectedLeaf(null)
      return
    }

    setSelectedLeaf(deck)
  }

  const goBack = () => {
    if (selectedLeaf) {
      setSelectedLeaf(null)
      return
    }

    setDeckPath((path) => path.slice(0, -1))
  }

  const closeImportModal = () => {
    setSelectedFile(null)
    setIsImportModalOpen(false)
  }

  const importDeck = () => {
    if (selectedFile) {
      importDeckSource(selectedFile)
    }
  }

  return (
    <div className="!mx-auto !max-w-6xl !space-y-7">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="!mb-2 !font-mono !text-xs !uppercase !tracking-[0.18em] !text-emerald-700">
            Vocabulary library
          </p>
          <h1 className="!mb-2 !text-5xl !font-extrabold !tracking-[-0.07em] !text-slate-900">
            Your <span className="!font-serif !font-normal !italic !text-orange-500">decks.</span>
          </h1>
          <p className="!text-sm !text-slate-500">Organize the words you want to make your own.</p>
        </div>
        <button
          className="!rounded-xl !bg-emerald-700 !px-5 !py-3 !text-sm !font-bold !text-white hover:!bg-emerald-800"
          onClick={() => setIsImportModalOpen(true)}
        >
          + Import deck
        </button>
      </div>
      <div className="flex flex-col gap-3 !rounded-2xl !border !border-slate-200 !bg-white !p-4 !shadow-sm sm:flex-row">
        <label className="flex flex-1 items-center gap-3 !rounded-lg !bg-slate-50 !px-3 !text-slate-400">
          <span>⌕</span>
          <input
            className="!min-w-0 !flex-1 !border-0 !bg-transparent !py-3 !text-sm !outline-none"
            placeholder="Search decks"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="flex gap-2">
          {['All', 'A2', 'B1', 'B2'].map((item) => (
            <button
              className={`!rounded-lg !px-4 !py-2 !text-xs !font-bold ${filter === item ? '!bg-emerald-700 !text-white' : '!bg-slate-100 !text-slate-500'}`}
              key={item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {isLoading && <p className="!text-sm !text-slate-500">Loading your decks...</p>}
      {error && (
        <p className="!rounded-xl !bg-amber-50 !p-4 !text-sm !text-amber-800">
          Showing your saved starter decks while the library reconnects.
        </p>
      )}
      {(deckPath.length > 0 || selectedLeaf) && (
        <button
          className="!rounded-lg !border !border-slate-200 !px-4 !py-2 !text-xs !font-bold !text-slate-600"
          onClick={goBack}
        >
          ← All decks
        </button>
      )}
      {selectedLeaf ? (
        <DeckWords deck={selectedLeaf} />
      ) : (
        <DeckGrid decks={visible} onOpen={showDeck} />
      )}
      <div className="flex justify-center gap-3">
        <button
          className="!rounded-lg !border !border-slate-200 !px-4 !py-2 !text-xs !font-bold !text-slate-600 disabled:!opacity-40"
          disabled={!hasPreviousPage}
          onClick={() => goToPage(1)}
        >
          Previous
        </button>
        <button
          className="!rounded-lg !border !border-slate-200 !px-4 !py-2 !text-xs !font-bold !text-slate-600 disabled:!opacity-40"
          disabled={!hasNextPage}
          onClick={() => goToPage(2)}
        >
          Next page
        </button>
      </div>
      {isImportModalOpen && (
        <Modal title="Import deck" onClose={closeImportModal}>
          <div className="!space-y-4">
            <p className="!m-0 !text-sm !text-slate-500">
              Choose a CSV or JSON file from your computer.
            </p>
            <label className="block !cursor-pointer !rounded-xl !border-2 !border-dashed !border-slate-300 !p-6 !text-center hover:!border-emerald-600">
              <span className="!text-sm !font-semibold !text-slate-700">
                {selectedFile ? selectedFile.name : 'Choose a file'}
              </span>
              <input
                className="!sr-only"
                type="file"
                accept=".csv,.json,text/csv,application/json,.apkg"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSelectedFile(file)
                  }
                }}
              />
            </label>
            {selectedFile && (
              <button
                className="!w-full !rounded-xl !bg-emerald-700 !px-4 !py-3 !text-sm !font-bold !text-white hover:!bg-emerald-800"
                onClick={() => {
                  importDeck()
                  closeImportModal()
                }}
              >
                Import {selectedFile.name}
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
