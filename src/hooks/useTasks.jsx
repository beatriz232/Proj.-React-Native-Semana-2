import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { loadTasks, saveTasks } from "../services/storage";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      const stored = await loadTasks();
      setTasks(stored);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addTask(text, dueDate) {
  if (!text.trim()) return;

  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date(),
    dueDate: dueDate || null,
  };

  setTasks(prev => [...prev, newTask]);
  Keyboard.dismiss();
}

  function removeTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id));
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function clearCompleted() {
  setTasks(prev => prev.filter(task => !task.completed));
}

  return {
  tasks,
  addTask,
  removeTask,
  toggleTask,
  clearCompleted,
  loading,
};
}