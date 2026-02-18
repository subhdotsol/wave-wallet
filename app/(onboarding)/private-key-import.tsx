import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    TextInput,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { walletManager } from "../../src/lib/wallet";

export default function PrivateKeyImportScreen() {
    const [privateKey, setPrivateKey] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const hasInput = privateKey.trim().length > 0;

    const handleImport = async () => {
        setError("");
        const trimmed = privateKey.trim();

        if (!trimmed) {
            setError("Please enter your private key.");
            return;
        }

        setLoading(true);
        try {
            walletManager.importFromPrivateKey(trimmed);
            router.replace("/(main)");
        } catch (e: any) {
            setError(
                e.message ?? "Invalid private key. Please check and try again."
            );
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
                    Import Private Key
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
                        Paste your base58-encoded private key. This is the
                        format Phantom and other Solana wallets export.
                    </Text>

                    {/* Warning */}
                    <View
                        className="bg-[#1e1e30] rounded-2xl p-4 mb-6"
                        style={{ borderWidth: 1, borderColor: "#f59e0b33" }}
                    >
                        <View className="flex-row items-center mb-2">
                            <Ionicons
                                name="warning-outline"
                                size={18}
                                color="#f59e0b"
                            />
                            <Text
                                className="text-yellow-500 text-sm ml-2"
                                style={{ fontFamily: "SNPro-SemiBold" }}
                            >
                                Security Warning
                            </Text>
                        </View>
                        <Text
                            className="text-gray-400 text-xs leading-4"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            Importing via private key means you cannot add
                            additional accounts. For multi-account support, use
                            a seed phrase instead.
                        </Text>
                    </View>

                    {/* Text input */}
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
                                minHeight: 100,
                                textAlignVertical: "top",
                            }}
                            placeholder="Paste your base58 private key here..."
                            placeholderTextColor="#3a3a4e"
                            multiline
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="off"
                            secureTextEntry={false}
                            value={privateKey}
                            onChangeText={(text) => {
                                setPrivateKey(text);
                                setError("");
                            }}
                        />
                    </View>

                    {/* Error message */}
                    {error ? (
                        <Text
                            className="text-red-400 text-xs mt-3 px-1"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            {error}
                        </Text>
                    ) : null}
                </ScrollView>

                {/* Bottom button */}
                <View className="px-6">
                    <SafeAreaView edges={["bottom"]}>
                        <TouchableOpacity
                            onPress={handleImport}
                            activeOpacity={0.8}
                            disabled={loading || !hasInput}
                            style={{
                                backgroundColor: hasInput
                                    ? "#a78bfa"
                                    : "#2a2a3e",
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
                                        color: hasInput ? "#000" : "#555",
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
