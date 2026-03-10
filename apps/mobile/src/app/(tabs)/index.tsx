import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTasks } from "../../hooks/use-tasks";
import type { Task } from "@repo/shared/types/task";

const priorityColors: Record<string, string> = {
  low: "#f3f4f6",
  medium: "#dbeafe",
  high: "#ffedd5",
  urgent: "#fee2e2",
};

function TaskItem({ task }: { task: Task }) {
  return (
    <TouchableOpacity style={styles.taskItem}>
      <View
        style={[
          styles.checkbox,
          task.status === "completed"
            ? styles.checkboxCompleted
            : styles.checkboxIncomplete,
        ]}
      />
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            task.status === "completed" && styles.taskTitleCompleted,
          ]}
        >
          {task.title}
        </Text>
        {task.dueDate ? (
          <Text style={styles.dueDate}>
            Due {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        ) : null}
      </View>
      <View
        style={[
          styles.priorityBadge,
          { backgroundColor: priorityColors[task.priority] ?? "#f3f4f6" },
        ]}
      >
        <Text style={styles.priorityText}>{task.priority}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TasksScreen() {
  const { data: tasks, isLoading } = useTasks();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskItem task={item} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done" size={48} color="#d1d5db" />
              <Text style={styles.emptyText}>No tasks yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    backgroundColor: "#2563eb",
    width: 40,
    height: 40,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#6b7280",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    color: "#9ca3af",
    marginTop: 16,
    fontSize: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 9999,
    borderWidth: 2,
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  checkboxIncomplete: {
    borderColor: "#d1d5db",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: "#111827",
  },
  taskTitleCompleted: {
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },
  dueDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  priorityText: {
    fontSize: 12,
    textTransform: "capitalize",
  },
});
