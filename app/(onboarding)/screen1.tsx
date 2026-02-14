import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const { height } = Dimensions.get("window");

export default function Screen1() {
    return (
        <View className="flex-1 bg-[#0a0a14]">
            {/* Background image — top 60% */}
            <View style={{ height: height * 0.6 }}>
                <Image
                    source={require("../../assets/wave.png")}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                {/* Fade overlay at bottom of image */}
                <LinearGradient
                    colors={[
                        "transparent",
                        "rgba(10,10,20,0.05)",
                        "rgba(10,10,20,0.15)",
                        "rgba(10,10,20,0.35)",
                        "rgba(10,10,20,0.6)",
                        "rgba(10,10,20,0.85)",
                        "#0a0a14",
                    ]}
                    locations={[0, 0.15, 0.3, 0.5, 0.65, 0.8, 1]}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "80%",
                    }}
                />
            </View>

            {/* Content area */}
            <View className="flex-1 px-8 justify-between">
                <View className="items-center">
                    <Text className="text-3xl text-gray-300 text-center" style={{ fontFamily: "SNPro-Medium" }}>
                        Welcome To
                    </Text>
                    <Text className="text-6xl text-white text-center mb-4 tracking-widest" style={{ fontFamily: "SNPro-Bold" }}>
                        WAVETEK
                    </Text>
                    <Text className="text-base text-gray-400 text-center leading-6" style={{ fontFamily: "SNPro-Regular" }}>
                        To get started, create a new wallet{"\n"}or import an existing one.
                    </Text>
                </View>

                <SafeAreaView edges={["bottom"]}>
                    {/* Terms text */}
                    <Text className="text-sm text-gray-500 text-center mb-4" style={{ fontFamily: "SNPro-Regular" }}>
                        By continuing, you agree to the{" "}
                        <Text className="text-blue-400">Terms</Text> and{" "}
                        <Text className="text-blue-400">Privacy Policy</Text>
                    </Text>

                    {/* Primary button */}
                    <TouchableOpacity
                        onPress={() => router.push("/(onboarding)/screen2")}
                        activeOpacity={0.8}
                        className="bg-blue-500 py-4 rounded-2xl items-center mb-3"
                    >
                        <Text className="text-white text-xl" style={{ fontFamily: "SNPro-Regular" }}>
                            Create Wallet
                        </Text>
                    </TouchableOpacity>

                    {/* Secondary button */}
                    <TouchableOpacity
                        onPress={() => router.push("/(onboarding)/screen3")}
                        activeOpacity={0.8}
                        className="bg-[#1a1a2e] py-4 rounded-2xl items-center mb-2"
                    >
                        <Text className="text-white text-xl" style={{ fontFamily: "SNPro-Regular" }}>
                            I Already Have a Wallet
                        </Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        </View>
    );
}
