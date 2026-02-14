import { useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    Alert,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";

const WORD_LIST = [
    "hidden", "club", "steak", "task", "upon", "road",
    "flag", "parade", "raw", "decade", "farm", "soup",
    "ocean", "brave", "pulse", "drift", "echo", "frost",
    "glow", "haze", "iris", "jade", "knot", "lamp",
    "mist", "nest", "opal", "pine", "reef", "silk",
    "tide", "veil", "wave", "zeal", "arch", "bloom",
    "cord", "dawn", "edge", "fern", "grid", "husk",
    "isle", "jump", "kelp", "lure", "mesa", "nova",
];

function getRandomWords(count: number): string[] {
    const shuffled = [...WORD_LIST].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export default function Screen4() {
    const words = useMemo(() => getRandomWords(12), []);
    const [copied, setCopied] = useState(false);

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

                <Pressable className="p-2">
                    <Text
                        className="text-blue-400 text-base"
                        style={{ fontFamily: "SNPro-SemiBold" }}
                    >
                        Next
                    </Text>
                </Pressable>
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
                    className="text-sm text-gray-400 text-center mb-8 px-4"
                    style={{ fontFamily: "SNPro-Regular" }}
                >
                    This is the only way you will be able to recover your
                    account. Please store it somewhere safe!
                </Text>

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
                                        fontFamily: "SNPro-Regular",
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
