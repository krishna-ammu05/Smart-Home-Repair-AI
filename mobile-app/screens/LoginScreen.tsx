import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const { login, signup, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isSignUp && !name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    try {
      if (isSignUp) {
        await signup(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Authentication failed");
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.backgroundDefault,
      color: theme.text,
    },
  ];

  const ScrollComponent = Platform.OS === "web" ? ScrollView : KeyboardAwareScrollView;

  return (
    <ThemedView style={styles.container}>
      <ScrollComponent
        style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <Image
            source={require("../")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="h1" style={styles.title}>
            Smart Home Repair
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            AI-powered fault detection and repair guidance
          </ThemedText>
        </View>

        <View style={styles.formSection}>
          <ThemedText type="h2" style={styles.formTitle}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </ThemedText>

          {isSignUp ? (
            <View style={styles.fieldContainer}>
              <ThemedText
                type="small"
                style={[styles.label, { color: theme.textSecondary }]}
              >
                Full Name
              </ThemedText>
              <TextInput
                style={inputStyle}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={theme.textSecondary}
                autoCapitalize="words"
                returnKeyType="next"
                editable={!isLoading}
              />
            </View>
          ) : null}

          <View style={styles.fieldContainer}>
            <ThemedText
              type="small"
              style={[styles.label, { color: theme.textSecondary }]}
            >
              Email Address
            </ThemedText>
            <TextInput
              style={inputStyle}
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldContainer}>
            <ThemedText
              type="small"
              style={[styles.label, { color: theme.textSecondary }]}
            >
              Password
            </ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[inputStyle, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                editable={!isLoading}
              />
              <Pressable
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <Button onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={theme.buttonText} />
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>

          <Pressable
            style={styles.switchButton}
            onPress={() => setIsSignUp(!isSignUp)}
            disabled={isLoading}
          >
            <ThemedText
              type="body"
              style={{ color: theme.textSecondary, textAlign: "center" }}
            >
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
              <ThemedText type="link">
                {isSignUp ? "Sign In" : "Sign Up"}
              </ThemedText>
            </ThemedText>
          </Pressable>
        </View>

        <ThemedText
          type="small"
          style={[styles.terms, { color: theme.textSecondary }]}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </ThemedText>
      </ScrollComponent>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: Spacing["4xl"],
    paddingBottom: Spacing["3xl"],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  formSection: {
    flex: 1,
    gap: Spacing.lg,
  },
  formTitle: {
    marginBottom: Spacing.sm,
  },
  fieldContainer: {
    width: "100%",
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: "absolute",
    right: Spacing.lg,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  switchButton: {
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  terms: {
    textAlign: "center",
    paddingTop: Spacing["2xl"],
    paddingBottom: Spacing.lg,
  },
});
