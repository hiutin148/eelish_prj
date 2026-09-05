import { Card } from '../../../components/ui/Card'
import { useTodos } from '../hooks/useTodos'
export function TodoList() {
  const { todos, toggleTodo } = useTodos()
  return (
    <Card>
      <div className="panel-header">
        <h2>Today&apos;s tasks</h2>
        <span className="muted">{todos.filter((todo) => !todo.completed).length} open</span>
      </div>
      <ul className="task-list">
        {todos.map((todo) => (
          <li className={`task-item ${todo.completed ? 'done' : ''}`} key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              aria-label={`Complete ${todo.title}`}
            />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
