import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
  import { styled } from "styled-components";
  
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const TodoList: React.FC<{ showCompleted?: boolean }> = ({ showCompleted = false }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'title'>('id');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        setTodos(response.data);
        setTotalPages(Math.ceil(response.data.length / 10));
      } catch (err) {
        setError('Failed to fetch todos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodos();
  }, []); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const userMap: Record<number, User> = {};
        response.data.forEach((user: User) => {
          userMap[user.id] = user;
        });
        setUsers(userMap);
      } catch (err) {
        console.error('Failed to fetch users');
      }
    };
    
    fetchUsers();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (showCompleted && !todo.completed) return false;
    if (filterText && !todo.title.includes(filterText)) return false;
    if (selectedUser && todo.userId !== selectedUser) return false;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return a.id - b.id;
  });

  const paginatedTodos = sortedTodos.slice((page - 1) * 10, page * 10);

  const handleTodoClick = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const { data: stats } = useQuery(['todoStats', todos], () => {
    const completed = todos.filter(t => t.completed).length;
    const userCount = new Set(todos.map(t => t.userId)).size;
    return { completed, userCount, total: todos.length };
  }, {
    staleTime: 0,
  });

  const TodoItem = styled.div<{ completed: boolean }>`
    padding: 10px;
    margin: 5px 0;
    background: ${({ completed }) => completed ? '#d4edda' : '#f8d7da'};
    border: 2px solid ${({ completed }) => completed ? '#c3e6cb' : '#f5c6cb'};
    cursor: pointer;
    
    &:hover {
      background: ${({ completed }) => completed ? '#c3e6cb' : '#f5c6cb'};
    }
  `;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (todos.length === 0) return <div>No todos found</div>;

  return (
    <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filter todos..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title</option>
        </select>
        <select 
          value={selectedUser || ''} 
          onChange={(e) => setSelectedUser(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Users</option>
          {Object.values(users).map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
      </div>

      {stats && (
        <div>
          <p>Completed: {stats.completed}/{stats.total}</p>
          <p>Unique Users: {stats.userCount}</p>
        </div>
      )}

      {paginatedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          completed={todo.completed}
          onClick={() => handleTodoClick(todo.id)}
        >
          <strong>{todo.title}</strong>
          <span> - User: {users[todo.userId]?.name || 'Unknown'}</span>
          <span> - {todo.completed ? '✅' : '❌'}</span>
        </TodoItem>
      ))}

      <div style={{ marginTop: '20px' }}>
        <button 
          disabled={page === 1}
          onClick={() => setPage(prev => prev - 1)}
        >
          Previous
        </button>
        <span> Page {page} of {totalPages} </span>
        <button 
          disabled={page === totalPages}
          onClick={() => setPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Debug: {todos.length} todos loaded</p>
        <p>Filtered: {filteredTodos.length} todos</p>
      </div>
    </div>
  );
};

export default TodoList;