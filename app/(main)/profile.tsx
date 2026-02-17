import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Polygon } from "react-native-svg";

// ─── Icons ──────────────────────────────────────────────────────────

function BackArrow() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

// ─── Decorative Activity Illustration ───────────────────────────────

function NoActivityIllustration() {
    return (
        <View className="items-center gap-1">
            <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
                {/* Star */}
                <Polygon points="40,8 44,24 60,24 47,33 52,48 40,38 28,48 33,33 20,24 36,24" fill="#14b8a6" />
                {/* Lightning bolt */}
                <Path d="M52 14l-4 16h10l-12 24 4-16h-10l12-24z" fill="#eab308" opacity={0.85} />
                {/* X mark */}
                <Path d="M24 52l8 8M32 52l-8 8" stroke="#ef4444" strokeWidth={3} strokeLinecap="round" />
                {/* Diamond */}
                <Path d="M56 50l6 8-6 8-6-8z" fill="#3b82f6" />
                {/* Small circle */}
                <Circle cx={20} cy={36} r={4} fill="#a855f7" />
            </Svg>
        </View>
    );
}

// ─── Main Component ─────────────────────────────────────────────────

export default function Profile() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#0e0e1a]">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center px-4 pt-2 pb-4 gap-2">
                    <TouchableOpacity onPress={() => router.back()} className="p-1">
                        <BackArrow />
                    </TouchableOpacity>
                    <Text className="text-white text-lg" style={{ fontFamily: "SNPro-Bold" }}>@wavewallet</Text>
                </View>

                {/* Profile Info Section */}
                <View className="px-5">
                    {/* Avatar + Stats Row */}
                    <View className="flex-row items-center gap-5 mb-5">
                        {/* Avatar */}
                        <View className="w-14 h-14 rounded-full bg-[#d4e157] justify-center items-center">
                            <Text className="text-[28px]">🌊</Text>
                        </View>

                        {/* Stats */}
                        <View className="flex-row gap-6">
                            <View>
                                <Text className="text-[#888] text-xs" style={{ fontFamily: "SNPro-Regular" }}>Trade Volume</Text>
                                <Text className="text-white text-base" style={{ fontFamily: "SNPro-Bold" }}>$0.00</Text>
                            </View>
                            <View>
                                <Text className="text-[#888] text-xs" style={{ fontFamily: "SNPro-Regular" }}>Followers</Text>
                                <Text className="text-white text-base" style={{ fontFamily: "SNPro-Bold" }}>0</Text>
                            </View>
                            <View>
                                <Text className="text-[#888] text-xs" style={{ fontFamily: "SNPro-Regular" }}>Following</Text>
                                <Text className="text-white text-base" style={{ fontFamily: "SNPro-Bold" }}>0</Text>
                            </View>
                        </View>
                    </View>

                    {/* Edit / Share Buttons */}
                    <View className="flex-row gap-3 mb-8">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex-1 bg-[#c8b2ff] rounded-[14px] py-3.5 items-center"
                        >
                            <Text className="text-[#0e0e1a] text-[15px]" style={{ fontFamily: "SNPro-SemiBold" }}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex-1 bg-[#1e1e30] rounded-[14px] py-3.5 items-center border border-[#2a2a3e]"
                        >
                            <Text className="text-white text-[15px]" style={{ fontFamily: "SNPro-SemiBold" }}>Share Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Activity */}
                <View className="px-5">
                    <Text className="text-white text-xl mb-10" style={{ fontFamily: "SNPro-Bold" }}>Recent Activity</Text>

                    {/* Empty State */}
                    <View className="items-center pt-5 gap-4">
                        <NoActivityIllustration />
                        <Text className="text-[#888] text-sm" style={{ fontFamily: "SNPro-Regular" }}>No activity to show yet.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
