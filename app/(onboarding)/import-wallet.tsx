import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Pressable,
    Modal,
    Animated,
    Dimensions,
    ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import WalletIllustration from "../../assets/wallet.svg";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Screen3() {
    const [showSheet, setShowSheet] = useState(false);
    const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

    const openSheet = () => {
        setShowSheet(true);
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 150,
        }).start();
    };

    const closeSheet = () => {
        Animated.timing(slideAnim, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setShowSheet(false));
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0a0a14]">
            {/* Header with back button */}
            <View className="flex-row items-center px-5 py-3">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>
            </View>

            {/* Illustration */}
            <View className="items-center mt-2 mb-4">
                <WalletIllustration width={180} height={130} />
            </View>

            {/* Title */}
            <View className="items-center px-8 mb-8">
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
            <ScrollView className="px-8" contentContainerStyle={{ gap: 20 }} showsVerticalScrollIndicator={false}>
                {/* Point 1 */}
                <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">🌊</Text>
                    <View className="flex-1">
                        <Text
                            className="text-lg text-white mb-0.5"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            Unlinkable Transactions
                        </Text>
                        <Text
                            className="text-sm text-gray-400 leading-5"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            Break sender–receiver and sender–escrow correlations
                            by design.
                        </Text>
                    </View>
                </View>

                {/* Point 2 */}
                <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">🔐</Text>
                    <View className="flex-1">
                        <Text
                            className="text-lg text-white mb-0.5"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            Stealth & Post-Quantum Security
                        </Text>
                        <Text
                            className="text-sm text-gray-400 leading-5"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            Stealth addresses powered by advanced cryptography
                            protect identities.
                        </Text>
                    </View>
                </View>

                {/* Point 3 */}
                <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">⚙️</Text>
                    <View className="flex-1">
                        <Text
                            className="text-lg text-white mb-0.5"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            Confidential Execution
                        </Text>
                        <Text
                            className="text-sm text-gray-400 leading-5"
                            style={{ fontFamily: "SNPro-Regular" }}
                        >
                            TEE-secured rollups process privately before settling
                            on Solana.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom button */}
            <View className="flex-1 justify-end px-8">
                <SafeAreaView edges={["bottom"]}>
                    <TouchableOpacity
                        onPress={openSheet}
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

            {/* Bottom Sheet Modal */}
            <Modal
                visible={showSheet}
                transparent
                animationType="none"
                statusBarTranslucent
                onRequestClose={closeSheet}
            >
                {/* Backdrop */}
                <Pressable
                    onPress={closeSheet}
                    className="flex-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                />

                {/* Sheet */}
                <Animated.View
                    style={{
                        transform: [{ translateY: slideAnim }],
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#141420",
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        paddingTop: 12,
                        paddingBottom: 40,
                        paddingHorizontal: 20,
                    }}
                >
                    {/* Drag handle */}
                    <View className="items-center mb-5">
                        <View
                            style={{
                                width: 40,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "#3a3a4e",
                            }}
                        />
                    </View>

                    {/* Sheet Title */}
                    <Text
                        className="text-2xl text-white text-center mb-2"
                        style={{ fontFamily: "SNPro-Bold" }}
                    >
                        Import Options
                    </Text>
                    <Text
                        className="text-sm text-gray-400 text-center mb-6 px-4"
                        style={{ fontFamily: "SNPro-Regular" }}
                    >
                        Import an existing wallet with your seed phrase, private
                        key or hardware wallet
                    </Text>

                    {/* Option 1: Import Seed Phrase */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-row items-center bg-[#1e1e30] py-4 px-5 rounded-2xl mb-3"
                        onPress={() => {
                            closeSheet();
                            router.push("/(onboarding)/seed-phrase-import");
                        }}
                    >
                        <Ionicons
                            name="grid-outline"
                            size={20}
                            color="white"
                        />
                        <Text
                            className="text-white text-lg ml-4 flex-1"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            Import Seed Phrase
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#666"
                        />
                    </TouchableOpacity>

                    {/* Option 2: Import Private Key */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-row items-center bg-[#1e1e30] py-4 px-5 rounded-2xl"
                        onPress={() => {
                            closeSheet();
                            router.push("/(onboarding)/private-key-import");
                        }}
                    >
                        <MaterialCommunityIcons
                            name="key-variant"
                            size={20}
                            color="white"
                        />
                        <Text
                            className="text-white text-lg ml-4 flex-1"
                            style={{ fontFamily: "SNPro-SemiBold" }}
                        >
                            Import Private Key
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#666"
                        />
                    </TouchableOpacity>


                </Animated.View>
            </Modal>
        </SafeAreaView>
    );
}
