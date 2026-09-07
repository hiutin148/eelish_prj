export interface Deck {
    id: string;
    name: string;
    parentDeck: DeckSummary | null;
    childDecks: Deck[];
}

export interface DeckSummary {
    id: string;
    name: string;
}