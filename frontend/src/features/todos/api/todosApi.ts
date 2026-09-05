export type Todo = { id: number; title: string; completed: boolean }
export async function getTodos(): Promise<Todo[]> {
  return [
    { id: 1, title: 'Review irregular verbs', completed: false },
    { id: 2, title: 'Finish lesson 04 notes', completed: true },
    { id: 3, title: 'Practice pronunciation', completed: false },
  ]
}
