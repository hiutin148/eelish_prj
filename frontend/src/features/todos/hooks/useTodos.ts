import { useEffect, useState } from 'react'
import { getTodos, type Todo } from '../api/todosApi'
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  useEffect(() => {
    getTodos().then(setTodos)
  }, [])
  const toggleTodo = (id: number) =>
    setTodos((items) =>
      items.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  return { todos, toggleTodo }
}
