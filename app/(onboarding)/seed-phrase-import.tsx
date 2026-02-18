import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    TextInput,
    Alert,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { walletManager, validateMnemonic } from "../../src/lib/wallet";

export default function SeedPhraseImportScreen() {
    const [phrase, setPhrase] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const wordCount = phrase.trim().split(/\s+/).filter(Boolean).length;
    const isValidLength = wordCount === 12 || wordCount === 24;

    const handleImport = async () => {
        setError("");
        const trimmed = phrase.trim().toLowerCase();

        if (!isValidLength) {
            setError("Please enter 12 or 24 words.");
            return;
        }

        if (!validateMnemonic(trimmed)) {
            setError("Invalid seed phrase. Please check your words and try again.");
            return;
        }

        setLoading(true);
        try {
            await walletManager.importFromMnemonic(trimmed);
            router.replace("/(main)");
        } catch (e: any) {
            setError(e.message ?? "Import failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0a0a14]">
            {/* Header */}
            <View className="flex-row items-center px-5 py-3">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>
                <Text
                    className="text-xl text-white ml-2"
                    style={{ fontFamily: "SNPro-Bold" }}
                >
                    Import Seed Phrase
                </Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Instructions */}
                    <Text
                        className="text-gray-400 text-sm text-center mt-4 mb-6 px-4"
                        style={{ fontFamily: "SNPro-Regular" }}
                    >
                        Enter your 12 or 24-word seed phrase, with each word
                        separated by a space.
                    </Text>

                    {/* Text area */}
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: error ? "#ef4444" : "#2a2a3e",
                            borderRadius: 16,
                            backgroundColor: "#141420",
                        }}
                    >
                        <TextInput
                            className="text-white text-base p-5"
                            style={{
                                fontFamily: "SNPro-Regular",
                                minHeight: 140,
                                textAlignVertical: "top",
                            }}
                            placeholder="hidden club steak task upon road flag parade raw decade farm soup"
                            placeholderTextColor="#3a3a4e"
                            multiline
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="off"
                            value={phrase}
                            onChangeText={(text) => {
                                setPhrase(text);
                                setError("");
                            }}
                        />
                    </View>

                    {/* Word count */}
                    <View className="flex-row items-center justify-between mt-3 px-1">
                        <Text
                            className="text-xs"
                            style={{
                                fontFamily: "SNPro-Regular",
                                color: isValidLength ? "#22c55e" : "#6b7280",
                            }}
                        >
                            {wordCount} / 12 words
                        </Text>
                        {error ? (
                            <Text
                                className="text-red-400 text-xs flex-1 text-right"
                                style={{ fontFamily: "SNPro-Regular" }}
                            >
                                {error}
                            </Text>
                        ) : null}
                    </View>
                </ScrollView>

                {/* Bottom button */}
                <View className="px-6">
                    <SafeAreaView edges={["bottom"]}>
                        <TouchableOpacity
                            onPress={handleImport}
                            activeOpacity={0.8}
                            disabled={loading || !isValidLength}
                            style={{
                                backgroundColor:
                                    isValidLength ? "#a78bfa" : "#2a2a3e",
                            }}
                            className="py-4 rounded-2xl items-center mb-2"
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text
                                    className="text-lg"
                                    style={{
                                        fontFamily: "SNPro-SemiBold",
                                        color: isValidLength
                                            ? "#000"
                                            : "#555",
                                    }}
                                >
                                    Import Wallet
                                </Text>
                            )}
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
