import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import type { Todo } from "../api/graphql";
import { listTodos } from "../graphql/queries";
import {
  createTodo as createTodoMutation,
  deleteTodo as deleteTodoMutation,
} from "../graphql/mutations";

export default function useTodos() {
  const [todos, setTodos] = useState([] as Todo[]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function func() {
      setIsLoading(true);
      const todos = await _getTodos();
      setIsLoading(false);
      setTodos(todos ? sortTodosByTimeCreated(todos.data.listTodos.items) : []);
    }
    func();
  }, []);

  const client = generateClient();

  async function _getTodos() {
    const todos = await client.graphql({
      query: listTodos,
    });
    if (todos.errors) {
      console.error(todos.errors);
      return null;
    }
    return todos;
  }

  function sortTodosByTimeCreated(todos: Todo[]) {
    return todos.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async function createTodo(
    name: string = "defaultName",
    description: string = "defaultDescription"
  ) {
    const result = await client.graphql({
      query: createTodoMutation,
      variables: {
        input: {
          name,
          description,
        },
      },
    });
    if (result.errors) {
      console.error(result.errors);
      return;
    }
    setTodos([...todos, result.data.createTodo]);
  }

  async function deleteTodo(id: string) {
    const result = await client.graphql({
      query: deleteTodoMutation,
      variables: {
        input: {
          id,
        },
      },
    });
    if (result.errors) {
      console.error(result.errors);
      return;
    }
    setTodos(todos.filter((t) => t.id !== id));
  }

  return {
    todos,
    isLoading,
    createTodo,
    deleteTodo,
  };
}
