import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import WalletIllustration from "../../assets/wallet.svg";

export default function Screen3() {
    return (
        <SafeAreaView className="flex-1 bg-[#0a0a14]">
            {/* Header with back button */}
            <View className="flex-row items-center px-5 py-3">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>
            </View>

            {/* Illustration */}
            <View className="items-center mt-4 mb-6">
                <WalletIllustration width={220} height={160} />
            </View>

            {/* Title */}
            <View className="items-center px-8 mb-20">
                <Text
                    className="text-3xl text-white text-center mb-2"
                    style={{ fontFamily: "SNPro-Bold" }}
                >
                    Use existing wallet
                </Text>
                <Text
                    className="text-base text-gray-400 text-center"
                    style={{ fontFamily: "SNPro-Regular" }}
                >
                    Import your wallet
                </Text>
            </View>

            {/* Feature points */}
            <View className="px-8 gap-10">
                {/* Point 1 */}
                <View className="flex-row items-center gap-4">
                    <Text className="text-3xl">🌊</Text>
                    <View className="flex-1">
                        <Text
                            className="text-xl text-white mb-1"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            Unlinkable Transactions
                        </Text>
                        <Text
                            className="text-lg text-gray-400 leading-5"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            Break sender–receiver and sender–escrow correlations
                            by design.
                        </Text>
                    </View>
                </View>

                {/* Point 2 */}
                <View className="flex-row items-center gap-4">
                    <Text className="text-3xl">🔐</Text>
                    <View className="flex-1">
                        <Text
                            className="text-xl text-white mb-1"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            Stealth & Post-Quantum Security
                        </Text>
                        <Text
                            className="text-lg text-gray-400 leading-5"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            Stealth addresses powered by advanced cryptography
                            protect identities.
                        </Text>
                    </View>
                </View>

                {/* Point 3 */}
                <View className="flex-row items-center gap-4">
                    <Text className="text-3xl">⚙️</Text>
                    <View className="flex-1">
                        <Text
                            className="text-xl text-white mb-1"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            Confidential Execution
                        </Text>
                        <Text
                            className="text-lg text-gray-400 leading-5"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            TEE-secured rollups process privately before settling
                            on Solana.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Bottom button */}
            <View className="flex-1 justify-end px-8">
                <SafeAreaView edges={["bottom"]}>
                    <TouchableOpacity
                        onPress={() => router.push("/(onboarding)/screen3")}
                        activeOpacity={0.8}
                        className="bg-[#1a1a2e] py-4 rounded-2xl items-center mb-2"
                    >
                        <Text
                            className="text-white text-lg"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            Import Wallet
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        </SafeAreaView>
    );
}
