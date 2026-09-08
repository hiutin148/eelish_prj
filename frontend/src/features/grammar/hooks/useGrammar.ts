import { useState } from 'react'
import { grammarLessons } from '../data/lessons'

export function useGrammar() {
  const [selectedId, setSelectedId] = useState(grammarLessons[0].id)
  const [completed, setCompleted] = useState<string[]>(['01'])
  const selected = grammarLessons.find((lesson) => lesson.id === selectedId) ?? grammarLessons[0]
  const toggleCompleted = () => setCompleted((current) => current.includes(selected.id) ? current.filter((id) => id !== selected.id) : [...current, selected.id])
  return { lessons: grammarLessons, selected, completed, setSelectedId, toggleCompleted }
}