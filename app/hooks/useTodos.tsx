import { useQuery } from "react-query";
import axios from "axios";
import type { Todo } from "../types";

export const useTodos = () =>
  useQuery<{
    todos: Todo[];
    totalPages: number;
  }>(
    ["todos"],
    async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
      return {
        todos: res.data,
        totalPages: Math.ceil(res.data.length / 10),
      };
    },
    {
      staleTime: 1000 * 60,
    }
  );
