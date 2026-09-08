export type ReviewGrade = 'Again' | 'Hard' | 'Good' | 'Easy'

export type StudyCard = {
  id: string
  deckId: string
  term: string
  type: string
  sound: string
  meaning: string
  example: string
}