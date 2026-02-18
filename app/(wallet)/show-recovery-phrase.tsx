import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { walletManager } from "../../src/lib/wallet";

// ─── Icons ──────────────────────────────────────────────────────────

function BackArrow() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function ShieldWarningIcon() {
    return (
        <Svg width={52} height={52} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2l8 4v6c0 5.5-3.8 10-8 11.5C7.8 22 4 17.5 4 12V6l8-4z" fill="#ef4444" stroke="#ef4444" strokeWidth={1} />
            <Path d="M12 8v4" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
            <Circle cx={12} cy={16} r={1.2} fill="#fff" />
        </Svg>
    );
}

function KeyIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={8} cy={15} r={5} fill="#ef4444" />
            <Path d="M12.5 11.5l7-7M16 4l4 4" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

function NoEyeIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={3} stroke="#ef4444" strokeWidth={2} />
            <Path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12z" stroke="#ef4444" strokeWidth={2} />
            <Path d="M4 20L20 4" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

function StopIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#ef4444" strokeWidth={2} />
            <Path d="M8 12h8" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

function CopyIcon() {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Rect x={9} y={9} width={13} height={13} rx={2} stroke="#c8b2ff" strokeWidth={2} />
            <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#c8b2ff" strokeWidth={2} />
        </Svg>
    );
}

function CheckboxEmpty() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Rect x={3} y={3} width={18} height={18} rx={4} stroke="#666" strokeWidth={2} />
        </Svg>
    );
}

function CheckboxChecked() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Rect x={3} y={3} width={18} height={18} rx={4} fill="#c8b2ff" stroke="#c8b2ff" strokeWidth={2} />
            <Path d="M8 12l3 3 5-5" stroke="#0e0e1a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

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
            <SafeAreaView className="flex-1 bg-[#0e0e1a] justify-center items-center px-6">
                <Text className="text-white text-lg text-center" style={{ fontFamily: "SNPro-Bold" }}>
                    No Recovery Phrase
                </Text>
                <Text className="text-[#888] text-sm text-center mt-2" style={{ fontFamily: "SNPro-Regular" }}>
                    This wallet was imported via private key — no recovery phrase is available.
                </Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-[#c8b2ff] rounded-2xl py-4 px-10">
                    <Text className="text-[#0e0e1a] text-base" style={{ fontFamily: "SNPro-SemiBold" }}>Go Back</Text>
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
            <SafeAreaView className="flex-1 bg-[#0e0e1a]">
                {/* Header */}
                <View className="flex-row items-center px-4 pt-2 pb-4 gap-2">
                    <TouchableOpacity onPress={() => router.back()} className="p-1">
                        <BackArrow />
                    </TouchableOpacity>
                    <Text className="text-white text-lg" style={{ fontFamily: "SNPro-Bold" }}>Your Recovery Phrase</Text>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Warning Banner */}
                    <View className="mx-5 mb-6 bg-[#ef4444] rounded-2xl px-5 py-4">
                        <Text className="text-white text-[15px] text-center" style={{ fontFamily: "SNPro-Bold" }}>
                            Do <Text style={{ textDecorationLine: "underline" }}>not</Text> share your Recovery Phrase!
                        </Text>
                        <Text className="text-white/90 text-[13px] text-center mt-1" style={{ fontFamily: "SNPro-Regular" }}>
                            If someone has your Recovery Phrase they will have full control of your wallet.
                        </Text>
                    </View>

                    {/* Word Grid */}
                    <View className="px-5">
                        <View className="flex-row flex-wrap gap-2.5">
                            {words.map((word, i) => (
                                <View
                                    key={i}
                                    className="flex-row items-center bg-[#1e1e30] rounded-xl px-3 py-3 border border-[#2a2a3e]"
                                    style={{ width: "47%" }}
                                >
                                    <Text className="text-[#666] text-sm mr-2 w-5" style={{ fontFamily: "SNPro-Regular" }}>
                                        {i + 1}
                                    </Text>
                                    <Text className="text-white text-[15px]" style={{ fontFamily: "SNPro-Bold" }}>
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
                        <Text className="text-[#c8b2ff] text-sm" style={{ fontFamily: "SNPro-Medium" }}>
                            {copied ? "Copied!" : "Copy to clipboard"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Done Button */}
                <View className="px-5 pb-[30px] pt-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="rounded-2xl py-4 items-center bg-[#c8b2ff]"
                    >
                        <Text className="text-[#0e0e1a] text-base" style={{ fontFamily: "SNPro-SemiBold" }}>Done</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // ── Warning Screen ─────────────────────────────────────────────
    return (
        <SafeAreaView className="flex-1 bg-[#0e0e1a]">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-2 pb-4 gap-2">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <BackArrow />
                </TouchableOpacity>
                <Text className="text-white text-lg" style={{ fontFamily: "SNPro-Bold" }}>Show Recovery Phrase</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Shield Icon */}
                <View className="items-center pt-10 pb-6">
                    <View className="w-20 h-20 rounded-full bg-[#ef4444]/20 justify-center items-center">
                        <ShieldWarningIcon />
                    </View>
                </View>

                {/* Title */}
                <Text className="text-white text-[22px] text-center mb-8" style={{ fontFamily: "SNPro-Bold" }}>
                    Keep Your Recovery Phrase Secret
                </Text>

                {/* Warning Points */}
                <View className="gap-6 mb-10">
                    <View className="flex-row gap-3.5">
                        <KeyIcon />
                        <Text className="text-white text-[15px] flex-1 leading-[22px]" style={{ fontFamily: "SNPro-Regular" }}>
                            Your secret recovery phrase is like a{" "}
                            <Text style={{ fontFamily: "SNPro-Bold" }}>master key to your wallet.</Text>
                        </Text>
                    </View>
                    <View className="flex-row gap-3.5">
                        <NoEyeIcon />
                        <Text className="text-white text-[15px] flex-1 leading-[22px]" style={{ fontFamily: "SNPro-Regular" }}>
                            If someone gets it, they can{" "}
                            <Text style={{ fontFamily: "SNPro-Bold" }}>steal your funds. There's no way to recover lost funds.</Text>
                        </Text>
                    </View>
                    <View className="flex-row gap-3.5">
                        <StopIcon />
                        <Text className="text-white text-[15px] flex-1 leading-[22px]" style={{ fontFamily: "SNPro-Regular" }}>
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
                    {agreed ? <CheckboxChecked /> : <CheckboxEmpty />}
                    <Text className="text-[#ccc] text-sm flex-1 leading-[20px]" style={{ fontFamily: "SNPro-Regular" }}>
                        I understand that sharing my recovery phrase could result in{" "}
                        <Text style={{ fontFamily: "SNPro-Bold" }}>permanent loss of funds.</Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => agreed && setRevealed(true)}
                    activeOpacity={agreed ? 0.7 : 1}
                    className="rounded-2xl py-4 items-center"
                    style={{ backgroundColor: agreed ? "#c8b2ff" : "#2a2a3e" }}
                >
                    <Text
                        className="text-base"
                        style={{
                            fontFamily: "SNPro-SemiBold",
                            color: agreed ? "#0e0e1a" : "#555",
                        }}
                    >
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
