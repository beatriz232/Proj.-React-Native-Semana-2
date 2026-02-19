import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import TaskItem from "../components/TaskItem";
import { COLORS } from "../styles/colors";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function HomeScreen() {
  const [text, setText] = useState("");
  const [startDate, setStartDate] = useState(todayISO());
  const [deliveryDate, setDeliveryDate] = useState(todayISO());
  const [tasks, setTasks] = useState([]);

  const canAdd = useMemo(() => text.trim().length >= 3, [text]);

  const addTask = () => {
    const trimmed = text.trim();

    if (trimmed.length < 3) {
      Alert.alert("Atenção", "Digite uma tarefa com pelo menos 3 caracteres.");
      return;
    }

    const start = new Date(startDate);
    const delivery = new Date(deliveryDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(delivery.getTime())) {
      Alert.alert("Atenção", "Datas inválidas. Use o formato AAAA-MM-DD.");
      return;
    }

    if (delivery < start) {
      Alert.alert("Atenção", "A entrega não pode ser antes do início.");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: trimmed,
      startDate,
      deliveryDate,
      done: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setText("");
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTask = (id) => {
    Alert.alert("Remover", "Deseja remover esta tarefa?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => setTasks((prev) => prev.filter((t) => t.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <Text style={styles.subtitle}>
        Adicione tarefas com início e data de entrega.
      </Text>

      <View style={styles.form}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Digite a tarefa..."
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Início (DD-MM-AAAA)</Text>
            <TextInput
              value={startDate}
              onChangeText={setStartDate}
              placeholder="16-01-2026"
              placeholderTextColor={COLORS.muted}
              style={styles.inputSmall}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Entrega (DD-MM-AAAA)</Text>
            <TextInput
              value={deliveryDate}
              onChangeText={setDeliveryDate}
              placeholder="20-01-2026"
              placeholderTextColor={COLORS.muted}
              style={styles.inputSmall}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, !canAdd && styles.btnDisabled]}
          onPress={addTask}
          activeOpacity={0.9}
          disabled={!canAdd}
        >
          <Text style={styles.btnText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Minhas tarefas</Text>
        <Text style={styles.listCount}>{tasks.length}</Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nenhuma tarefa ainda</Text>
            <Text style={styles.emptyText}>
              Adicione sua primeira tarefa acima.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TaskItem task={item} onToggleDone={toggleDone} onRemove={removeTask} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.bg,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    color: COLORS.muted,
  },
  form: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  field: { flex: 1 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted,
    marginBottom: 6,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    backgroundColor: "#fff",
  },
  btn: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
  },
  listHeader: {
    marginTop: 6,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  listCount: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  empty: {
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  emptyTitle: {
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  emptyText: {
    color: COLORS.muted,
  },
});
