import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Polygon, Line, Rect } from "react-native-svg";

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
        <View style={{ alignItems: "center", gap: 4 }}>
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
                <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 8 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                        <BackArrow />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 18 }}>@wavewallet</Text>
                </View>

                {/* Profile Info Section */}
                <View style={{ paddingHorizontal: 20 }}>
                    {/* Avatar + Stats Row */}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 20 }}>
                        {/* Avatar */}
                        <View style={{
                            width: 56, height: 56, borderRadius: 28,
                            backgroundColor: "#d4e157",
                            justifyContent: "center", alignItems: "center",
                        }}>
                            <Text style={{ fontSize: 28 }}>🌊</Text>
                        </View>

                        {/* Stats */}
                        <View style={{ flexDirection: "row", gap: 24 }}>
                            <View>
                                <Text style={{ fontFamily: "SNPro-Regular", color: "#888", fontSize: 12 }}>Trade Volume</Text>
                                <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 16 }}>$0.00</Text>
                            </View>
                            <View>
                                <Text style={{ fontFamily: "SNPro-Regular", color: "#888", fontSize: 12 }}>Followers</Text>
                                <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 16 }}>0</Text>
                            </View>
                            <View>
                                <Text style={{ fontFamily: "SNPro-Regular", color: "#888", fontSize: 12 }}>Following</Text>
                                <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 16 }}>0</Text>
                            </View>
                        </View>
                    </View>

                    {/* Edit / Share Buttons */}
                    <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{
                                flex: 1,
                                backgroundColor: "#c8b2ff",
                                borderRadius: 14,
                                paddingVertical: 14,
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontFamily: "SNPro-SemiBold", color: "#0e0e1a", fontSize: 15 }}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{
                                flex: 1,
                                backgroundColor: "#1e1e30",
                                borderRadius: 14,
                                paddingVertical: 14,
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: "#2a2a3e",
                            }}
                        >
                            <Text style={{ fontFamily: "SNPro-SemiBold", color: "white", fontSize: 15 }}>Share Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Activity */}
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 20, marginBottom: 40 }}>Recent Activity</Text>

                    {/* Empty State */}
                    <View style={{ alignItems: "center", paddingTop: 20, gap: 16 }}>
                        <NoActivityIllustration />
                        <Text style={{ fontFamily: "SNPro-Regular", color: "#888", fontSize: 14 }}>No activity to show yet.</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
