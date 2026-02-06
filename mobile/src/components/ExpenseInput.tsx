import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

interface ExpenseInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ExpenseInput: React.FC<ExpenseInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  isSubmitting,
}) => {
  const isButtonDisabled = !value.trim() || isSubmitting;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="e.g., Spent 500 on groceries"
        placeholderTextColor="#9ca3af" // gray-400
        value={value}
        onChangeText={onChangeText}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        editable={!isSubmitting}
      />
      <TouchableOpacity
        style={[
          styles.button,
          isButtonDisabled ? styles.buttonDisabled : styles.buttonActive,
        ]}
        onPress={onSubmit}
        disabled={isButtonDisabled}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 4,
    zIndex: 10,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#e9d7fe", // blue-200
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#f9f5ff", // blue-50
    color: "#1f2937", // gray-800
  },
  button: {
    width: 64,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonActive: {
    backgroundColor: "#7b47db", // accent
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db", // gray-300
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
