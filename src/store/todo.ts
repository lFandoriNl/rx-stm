import { from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { createEffect } from "../observable-store/create-effect";
import { createEvent } from "../observable-store/create-event";
import { createStore } from "../observable-store/create-store";

function fetchAddTodo(text: Todo["text"]) {
  return from(
    new Promise<Todo>((resolve) => {
      setTimeout(
        () =>
          resolve({
            id: Date.now(),
            text,
            completed: false,
          }),
        2000
      );
    })
  );
}

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export const addTodo = createEvent<string>();
export const setTodoCompleted = createEvent<{
  id: number;
  completed: boolean;
}>();

const savedTodo$ = createEffect(addTodo, (stream$) =>
  stream$.pipe(switchMap((text) => fetchAddTodo(text)))
);

export const todos$ = createStore<Todo[]>([])
  .on(savedTodo$, (todos, newTodo) => [...todos, newTodo])
  .on(setTodoCompleted, (todos, { id, completed }) =>
    todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          completed,
        };
      }

      return todo;
    })
  );

export const todosCompleted$ = todos$.select((todos) =>
  todos.filter((todo) => todo.completed)
);

todos$.subscribe((todos) => console.log("todos", todos));
