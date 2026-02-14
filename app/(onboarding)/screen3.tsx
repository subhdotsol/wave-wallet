import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Screen3() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f0f1a]">
            <View className="flex-1 justify-center items-center px-8">
                <Text className="text-6xl mb-6">⚡</Text>
                <Text className="text-3xl font-extrabold text-white text-center mb-3">
                    Lightning Fast
                </Text>
                <Text className="text-base text-gray-400 text-center leading-6">
                    Send, swap, and stake in seconds. Powered by Solana for near-instant transactions.
                </Text>
            </View>

            <View className="px-8 pb-10">
                <View className="flex-row justify-center mb-8 gap-2">
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                    <View className="w-6 h-2 rounded-full bg-purple-500" />
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                </View>

                <TouchableOpacity
                    onPress={() => router.push("/(onboarding)/screen4")}
                    activeOpacity={0.8}
                    className="bg-purple-500 py-5 rounded-2xl items-center"
                >
                    <Text className="text-white text-lg font-bold">Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
