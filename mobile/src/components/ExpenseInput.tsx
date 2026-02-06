import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface Props {
  onSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
}

export function ExpenseInput({ onSubmit, isLoading }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = async () => {
    if (input.trim() && !isLoading) {
      await onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="e.g., Spent 500 on groceries"
        placeholderTextColor="#999"
        value={input}
        onChangeText={setInput}
        editable={!isLoading}
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity
        style={[
          styles.button,
          (!input.trim() || isLoading) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!input.trim() || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
