import { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    Alert,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { walletManager } from "../../src/lib/wallet";

export default function RecoveryPhraseScreen() {
    const [words, setWords] = useState<string[]>([]);
    const [address, setAddress] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Generate a real wallet on mount
        (async () => {
            try {
                const { mnemonic, account } = await walletManager.createWallet();
                setWords(mnemonic.split(" "));
                setAddress(account.shortAddress);
            } catch (e) {
                Alert.alert("Error", "Failed to generate wallet. Please try again.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(words.join(" "));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirm = () => {
        Alert.alert(
            "Written the Recovery Phrase down?",
            "Without the recovery phrase you will not be able to access your key or any assets associated with it.",
            [
                { text: "CANCEL", style: "cancel" },
                {
                    text: "YES",
                    onPress: () => router.replace("/(main)"),
                },
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#0a0a14] items-center justify-center">
                <ActivityIndicator size="large" color="#a78bfa" />
                <Text
                    className="text-gray-400 mt-4"
                    style={{ fontFamily: "SNPro-Regular" }}
                >
                    Generating your wallet...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#0a0a14]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-3">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>

                {/* Progress dots */}
                <View className="flex-row items-center gap-1.5">
                    <View
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#3a3a4e",
                        }}
                    />
                    <View
                        style={{
                            width: 20,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "#3b82f6",
                        }}
                    />
                </View>

                <View className="p-2" />
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Text
                    className="text-3xl text-white text-center mt-6 mb-2"
                    style={{ fontFamily: "SNPro-Bold" }}
                >
                    Recovery Phrase
                </Text>
                <Text
                    className="text-sm text-gray-400 text-center mb-2 px-4"
                    style={{ fontFamily: "SNPro-Regular" }}
                >
                    This is the only way you will be able to recover your
                    account. Please store it somewhere safe!
                </Text>

                {/* Wallet address badge */}
                <View className="items-center mb-6">
                    <View className="bg-[#1e1e30] px-4 py-1.5 rounded-full">
                        <Text
                            className="text-blue-400 text-xs"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            🔑 {address}
                        </Text>
                    </View>
                </View>

                {/* Word Grid — 2 columns, 6 rows */}
                <View className="gap-3">
                    {Array.from({ length: 6 }).map((_, rowIndex) => (
                        <View key={rowIndex} className="flex-row gap-3">
                            {/* Left word */}
                            <View
                                className="flex-1 flex-row items-center rounded-full"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#2a2a3e",
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                }}
                            >
                                <Text
                                    className="text-gray-500 mr-3"
                                    style={{
                                        fontFamily: "SNPro-Bold",
                                        width: 20,
                                    }}
                                >
                                    {rowIndex * 2 + 1}
                                </Text>
                                <Text
                                    className="text-white text-base"
                                    style={{ fontFamily: "SNPro-SemiBold" }}
                                >
                                    {words[rowIndex * 2]}
                                </Text>
                            </View>

                            {/* Right word */}
                            <View
                                className="flex-1 flex-row items-center rounded-full"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#2a2a3e",
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                }}
                            >
                                <Text
                                    className="text-gray-500 mr-3"
                                    style={{
                                        fontFamily: "SNPro-Regular",
                                        width: 20,
                                    }}
                                >
                                    {rowIndex * 2 + 2}
                                </Text>
                                <Text
                                    className="text-white text-base"
                                    style={{ fontFamily: "SNPro-SemiBold" }}
                                >
                                    {words[rowIndex * 2 + 1]}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Copy to clipboard */}
                <TouchableOpacity
                    onPress={handleCopy}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-center mt-6 mb-4"
                >
                    <Ionicons
                        name={copied ? "checkmark-circle" : "copy-outline"}
                        size={18}
                        color={copied ? "#22c55e" : "#9ca3af"}
                    />
                    <Text
                        className="ml-2"
                        style={{
                            fontFamily: "SNPro-Regular",
                            color: copied ? "#22c55e" : "#9ca3af",
                        }}
                    >
                        {copied ? "Copied!" : "Copy to clipboard"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom button */}
            <View className="px-6">
                <SafeAreaView edges={["bottom"]}>
                    <TouchableOpacity
                        onPress={handleConfirm}
                        activeOpacity={0.8}
                        style={{ backgroundColor: "#a78bfa" }}
                        className="py-4 rounded-2xl items-center mb-2"
                    >
                        <Text
                            className="text-black text-lg"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            OK, I saved it somewhere
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        </SafeAreaView>
    );
}
