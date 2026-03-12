import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Todo } from '../types';

export function useTodos(userId: string | null) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchTodos = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (!error && data) setTodos(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => { setLoading(true); fetchTodos(); }, [fetchTodos]);

  const addTodo = async (text: string, date: string = today) => {
    if (!userId || !text.trim()) return;
    const { data, error } = await supabase
      .from('todos')
      .insert({ user_id: userId, text: text.trim(), date, done: false })
      .select()
      .single();
    if (!error && data) setTodos((prev) => [...prev, data]);
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const newDone = !todo.done;
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: newDone } : t)));
    const { error } = await supabase.from('todos').update({ done: newDone }).eq('id', id);
    if (error) setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !newDone } : t)));
  };

  const deleteTodo = async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await supabase.from('todos').delete().eq('id', id);
  };

  const openTodosFromPast = todos.filter((t) => !t.done && t.date < today);

  return { todos, loading, today, addTodo, toggleTodo, deleteTodo, openTodosFromPast };
}
