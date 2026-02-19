import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../styles/colors";

const formatDateBR = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
};

const isOverdue = (deliveryISO, done) => {
  if (!deliveryISO || done) return false;
  const delivery = new Date(deliveryISO);
  if (Number.isNaN(delivery.getTime())) return false;
  const now = new Date();
  // considera atrasada se passou do dia (meia-noite)
  delivery.setHours(23, 59, 59, 999);
  return now > delivery;
};

export default function TaskItem({ task, onToggleDone, onRemove }) {
  const overdue = useMemo(
    () => isOverdue(task.deliveryDate, task.done),
    [task.deliveryDate, task.done]
  );

  return (
    <View style={[styles.card, overdue && styles.cardOverdue]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onToggleDone(task.id)}
          style={[styles.badge, task.done ? styles.badgeDone : styles.badgeTodo]}
          activeOpacity={0.8}
        >
          <Text style={styles.badgeText}>{task.done ? "FEITA" : "PEND"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onRemove(task.id)}
          style={styles.removeBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.removeText}>Remover</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, task.done && styles.titleDone]}>
        {task.text}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          Início: <Text style={styles.metaValue}>{formatDateBR(task.startDate)}</Text>
        </Text>
        <Text style={styles.meta}>
          Entrega:{" "}
          <Text style={[styles.metaValue, overdue && styles.overdueText]}>
            {formatDateBR(task.deliveryDate)}
          </Text>
        </Text>
      </View>

      {overdue && <Text style={styles.overdueHint}>⚠ Tarefa atrasada</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  cardOverdue: {
    borderColor: "#fecaca",
    backgroundColor: "#fff1f2",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeTodo: { backgroundColor: "#e0f2fe" },
  badgeDone: { backgroundColor: "#dcfce7" },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
  },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#fee2e2",
  },
  removeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.danger,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: COLORS.muted,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    flexWrap: "wrap",
  },
  meta: {
    fontSize: 12,
    color: COLORS.muted,
  },
  metaValue: {
    color: COLORS.text,
    fontWeight: "600",
  },
  overdueText: {
    color: COLORS.danger,
  },
  overdueHint: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.danger,
  },
});
