import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
    return (
        <SafeAreaView className="flex-1 bg-[#0f0f1a]">
            <View className="flex-1 justify-center items-center px-8">
                <Text className="text-5xl mb-4">🌊</Text>
                <Text className="text-3xl font-extrabold text-white text-center mb-2">
                    Wave
                </Text>
                <Text className="text-base text-gray-400 text-center">
                    Home Screen
                </Text>
            </View>
        </SafeAreaView>
    );
}
