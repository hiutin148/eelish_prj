export interface Card {
  id: string;
  note: Note;
  deck: Deck;
  templateName: string;
  intervalDays: number;
  easeFactor: number;
  dueAt: string | null;
}

export interface Note {
  id: string;
  fieldValues: FieldValues;
  createdAt: string;
}

export interface FieldValues {
  "№": string;
  Image: string;
  Keyword: string;
  Suggestion: string;
  Explanation: string;
  Example_Sound: string;
  Keyword_Sound: string;
  Meaning_Sound: string;
  Transcription: string;
  Full_Vietnamese: string;
  Short_Vietnamese: string;
}

export interface Deck {
  id: string;
  name: string;
}