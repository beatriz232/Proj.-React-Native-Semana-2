import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
} from "react-native";
import { useTasks } from "../hooks/useTasks";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function HomeScreen() {
  const {
    tasks,
    addTask,
    removeTask,
    toggleTask,
    clearCompleted,
    loading,
  } = useTasks();

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredTasks = tasks
    .filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .sort((a, b) => {
      if (a.completed) return 1;
      if (b.completed) return -1;

      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  function handleRemove(id) {
    Alert.alert(
      "Remover tarefa",
      "Tem certeza que deseja remover?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            removeTask(id);
          },
        },
      ]
    );
  }

  function formatDueDate(dueDate, completed) {
    if (!dueDate) return "Sem prazo";

    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    const diff =
      (taskDate - today) / (1000 * 60 * 60 * 24);

    if (!completed && diff < 0) return "🔴 Atrasada";
    if (diff === 0) return "⏳ Vence hoje";
    if (diff === 1) return "⚠ Vence amanhã";

    return `📅 ${taskDate.toLocaleDateString()}`;
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas de Hoje</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa..."
          value={input}
          onChangeText={setInput}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            addTask(input, date);
            setInput("");
            setDate(new Date());
          }}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>
          📅 {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.progress}>
        {tasks.filter(t => t.completed).length} de {tasks.length} concluídas
      </Text>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut
          );
          clearCompleted();
        }}
      >
        <Text style={styles.clearText}>
          🗑 Limpar concluídas
        </Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        {["all", "pending", "completed"].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type)}
          >
            <Text
              style={
                filter === type
                  ? styles.activeFilter
                  : styles.filter
              }
            >
              {type === "all"
                ? "Todas"
                : type === "pending"
                ? "Pendentes"
                : "Concluídas"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.task,
              item.completed && styles.completedTask,
            ]}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              toggleTask(item.id);
            }}
            onLongPress={() => handleRemove(item.id)}
          >
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedText,
              ]}
            >
              {item.text}
            </Text>

            <Text style={styles.taskDate}>
              {formatDueDate(
                item.dueDate,
                item.completed
              )}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  dateButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  dateText: {
    color: "#333",
  },
  progress: {
    marginBottom: 10,
    fontSize: 14,
    color: "#555",
  },
  clearButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  clearText: {
    color: "red",
    fontSize: 13,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filter: {
    color: "#555",
  },
  activeFilter: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  task: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  taskText: {
    fontSize: 16,
  },
  taskDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
  completedTask: {
    backgroundColor: "#d4edda",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#555",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});