import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Screen2() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f0f1a]">
            <View className="flex-1 justify-center items-center px-8">
                <Text className="text-6xl mb-6">🔐</Text>
                <Text className="text-3xl font-extrabold text-white text-center mb-3">
                    Secure by Design
                </Text>
                <Text className="text-base text-gray-400 text-center leading-6">
                    Your keys, your crypto. We never store your private keys. Everything stays on your device.
                </Text>
            </View>

            <View className="px-8 pb-10">
                <View className="flex-row justify-center mb-8 gap-2">
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                    <View className="w-6 h-2 rounded-full bg-violet-500" />
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                </View>

                <TouchableOpacity
                    onPress={() => router.push("/(onboarding)/screen3")}
                    activeOpacity={0.8}
                    className="bg-violet-500 py-5 rounded-2xl items-center"
                >
                    <Text className="text-white text-lg font-bold">Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
