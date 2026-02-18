import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import { walletManager } from "../../src/lib/wallet";

// ─── Shared Components ──────────────────────────────────────────────
import {
    BackArrowIcon,
    ShieldWarningIcon,
    KeyIcon,
    NoEyeIcon,
    StopIcon,
    CopyIcon,
    CheckboxEmptyIcon,
    CheckboxCheckedIcon,
} from "../../src/components/icons";

// ─── Main Component ─────────────────────────────────────────────────

export default function ShowRecoveryPhrase() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);

    const mnemonic = walletManager.getMnemonic();
    const words = mnemonic ? mnemonic.split(" ") : [];

    if (!mnemonic) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center px-6">
                <Text className="text-white text-[20px] text-center" style={{ fontFamily: "Roboto-Bold" }}>
                    No Recovery Phrase
                </Text>
                <Text className="text-[#888] text-sm text-center mt-2" style={{ fontFamily: "Roboto-Regular" }}>
                    This wallet was imported via private key — no recovery phrase is available.
                </Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-[#3b82f6] rounded-2xl py-4 px-10">
                    <Text className="text-white text-base" style={{ fontFamily: "Roboto-Bold" }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleCopy = async () => {
        await Clipboard.setStringAsync(mnemonic);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── Revealed State: Show the phrase grid ───────────────────────
    if (revealed) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212]">
                {/* Header */}
                <View className="flex-row items-center px-4 pt-2 pb-4 gap-2">
                    <TouchableOpacity onPress={() => router.back()} className="p-1">
                        <BackArrowIcon />
                    </TouchableOpacity>
                    <Text className="text-white text-[20px]" style={{ fontFamily: "Roboto-Bold" }}>Your Recovery Phrase</Text>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Warning Banner */}
                    <View className="mx-5 mb-6 bg-[#ef4444] rounded-2xl px-5 py-4">
                        <Text className="text-white text-[15px] text-center" style={{ fontFamily: "Roboto-Bold" }}>
                            Do <Text style={{ textDecorationLine: "underline" }}>not</Text> share your Recovery Phrase!
                        </Text>
                        <Text className="text-white/90 text-[13px] text-center mt-1" style={{ fontFamily: "Roboto-Regular" }}>
                            If someone has your Recovery Phrase they will have full control of your wallet.
                        </Text>
                    </View>

                    {/* Word Grid */}
                    <View className="px-5">
                        <View className="flex-row flex-wrap gap-2.5">
                            {words.map((word, i) => (
                                <View
                                    key={i}
                                    className="flex-row items-center bg-[#1c1c1e] rounded-xl px-3 py-3 border border-[#2a2a2a]"
                                    style={{ width: "47%" }}
                                >
                                    <Text className="text-[#666] text-sm mr-2 w-5" style={{ fontFamily: "Roboto-Regular" }}>
                                        {i + 1}
                                    </Text>
                                    <Text className="text-white text-[15px]" style={{ fontFamily: "Roboto-Bold" }}>
                                        {word}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Copy to clipboard */}
                    <TouchableOpacity
                        onPress={handleCopy}
                        className="flex-row items-center justify-center gap-2 mt-6 mb-4"
                    >
                        <CopyIcon />
                        <Text className="text-[#3b82f6] text-sm" style={{ fontFamily: "Roboto-Medium" }}>
                            {copied ? "Copied!" : "Copy to clipboard"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Done Button */}
                <View className="px-5 pb-[30px] pt-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="rounded-2xl py-4 items-center bg-[#3b82f6]"
                    >
                        <Text className="text-white text-base" style={{ fontFamily: "Roboto-Bold" }}>Done</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ── Warning Screen ─────────────────────────────────────────────
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-2 pb-4 gap-2">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text className="text-white text-[20px]" style={{ fontFamily: "Roboto-Bold" }}>Show Recovery Phrase</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Shield Icon */}
                <View className="items-center pt-10 pb-6">
                    <View className="w-20 h-20 rounded-full bg-[#ef4444]/20 justify-center items-center">
                        <ShieldWarningIcon size={52} color="#ef4444" />
                    </View>
                </View>

                {/* Title */}
                <Text className="text-white text-[22px] text-center mb-8" style={{ fontFamily: "Roboto-Bold" }}>
                    Keep Your Recovery Phrase Secret
                </Text>

                {/* Warning Points */}
                <View className="gap-6 mb-10">
                    <View className="flex-row gap-3.5">
                        <KeyIcon size={22} color="#ef4444" />
                        <Text className="text-white text-[15px] flex-1 leading-[22px]" style={{ fontFamily: "Roboto-Regular" }}>
                            Your secret recovery phrase is like a{" "}
                            <Text style={{ fontFamily: "Roboto-Bold" }}>master key to your wallet.</Text>
                        </Text>
                    </View>
                    <View className="flex-row gap-3.5">
                        <NoEyeIcon size={22} color="#ef4444" />
                        <Text className="text-white text-[15px] flex-1 leading-[22px]" style={{ fontFamily: "Roboto-Regular" }}>
                            If someone gets it, they can{" "}
                            <Text style={{ fontFamily: "Roboto-Bold" }}>steal your funds. There's no way to recover lost funds.</Text>
                        </Text>
                    </View>
                    <View className="flex-row gap-3.5">
                        <StopIcon size={22} color="#ef4444" />
                        <Text className="text-white text-[15px] flex-1 leading-[22px]" style={{ fontFamily: "Roboto-Regular" }}>
                            Never share it with anyone—no person, website, or app.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom: Checkbox + Continue */}
            <View className="px-5 pb-[30px] pt-3">
                <TouchableOpacity
                    onPress={() => setAgreed(!agreed)}
                    className="flex-row items-start gap-3 mb-5"
                >
                    {agreed ? <CheckboxCheckedIcon /> : <CheckboxEmptyIcon />}
                    <Text className="text-[#ccc] text-sm flex-1 leading-[20px]" style={{ fontFamily: "Roboto-Regular" }}>
                        I understand that sharing my recovery phrase could result in{" "}
                        <Text style={{ fontFamily: "Roboto-Bold" }}>permanent loss of funds.</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => agreed && setRevealed(true)}
                    activeOpacity={agreed ? 0.7 : 1}
                    className="rounded-2xl py-4 items-center"
                    style={{ backgroundColor: agreed ? "#3b82f6" : "#2a2a2a" }}
                >
                    <Text
                        className="text-base"
                        style={{
                            fontFamily: "Roboto-Bold",
                            color: agreed ? "#fff" : "#555",
                        }}
                    >
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
