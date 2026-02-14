import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Screen4() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f0f1a]">
            <View className="flex-1 justify-center items-center px-8">
                <Text className="text-6xl mb-6">🚀</Text>
                <Text className="text-3xl font-extrabold text-white text-center mb-3">
                    Ready to Go
                </Text>
                <Text className="text-base text-gray-400 text-center leading-6">
                    Create a wallet or import an existing one. Your journey into DeFi starts now.
                </Text>
            </View>

            <View className="px-8 pb-10">
                <View className="flex-row justify-center mb-8 gap-2">
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                    <View className="w-2 h-2 rounded-full bg-[#2a2a3e]" />
                    <View className="w-6 h-2 rounded-full bg-purple-400" />
                </View>

                <TouchableOpacity
                    onPress={() => router.replace("/(main)")}
                    activeOpacity={0.8}
                    className="bg-purple-400 py-5 rounded-2xl items-center"
                >
                    <Text className="text-[#0f0f1a] text-lg font-bold">Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
