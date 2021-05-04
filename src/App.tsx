import { useState } from "react";

import { useStore } from "./observable-store/use-store";
import { useObservable } from "./observable-store/use-observable";

import {
  todos$,
  todosCompleted$,
  addTodo,
  setTodoCompleted,
} from "./store/todo";

export function App() {
  const [newTextTodo, setNewTextTodo] = useState("");

  const todos = useStore(todos$);
  const completedTodos = useObservable(todosCompleted$, []);

  const handleChangeCompleted = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setTodoCompleted({ id, completed: event.target.checked });
  };

  return (
    <div className="app">
      <input
        value={newTextTodo}
        onChange={(e) => setNewTextTodo(e.target.value)}
      />
      <button onClick={() => addTodo(newTextTodo)}>Add todo</button>

      {todos.map((todo) => (
        <div key={todo.id}>
          <div>{todo.text}</div>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={(event) => handleChangeCompleted(event, todo.id)}
          />
        </div>
      ))}

      <br />

      {completedTodos.map((todo) => todo.text)}
    </div>
  );
}
