export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  dueDate?: string; // ISO date string
}

export interface User {
  id: number;
  name: string;
}

export interface FilterProps {
  value: string | number;
  onChange: any;
}
