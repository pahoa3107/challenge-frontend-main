import { useQuery } from "react-query";
import axios from "axios";
import type { User } from "../types";

export const useUsers = () =>
  useQuery<User[]>(
    ["users"],
    async () => {
      const res = await axios.get("https://jsonplaceholder.typicode.com/users");
      return res.data;
    },
    {
      staleTime: 1000 * 60 * 5,
    }
  );
