import { View, StyleSheet } from "react-native";
import { Skeleton } from "./skeleton";

export function TaskSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width={20} height={20} borderRadius={10} />
      <View style={styles.middle}>
        <Skeleton width="70%" height={14} />
        <Skeleton width="40%" height={10} style={styles.subtitleSkeleton} />
      </View>
      <Skeleton width={48} height={20} borderRadius={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2d9d0",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  middle: {
    flex: 1,
    marginHorizontal: 12,
  },
  subtitleSkeleton: {
    marginTop: 6,
  },
});
