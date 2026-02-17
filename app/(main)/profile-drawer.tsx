import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, Line } from "react-native-svg";

// ─── Icons ──────────────────────────────────────────────────────────

function CloseIcon() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

function ProfileIcon() {
    return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={8} r={4} stroke="#c8b2ff" strokeWidth={1.8} />
            <Path d="M5 20c0-3.3 2.7-6 7-6s7 2.7 7 6" stroke="#c8b2ff" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
    );
}

function SettingsIcon() {
    return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={3} stroke="#fff" strokeWidth={1.8} />
            <Path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
    );
}

function EditPenIcon() {
    return (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="#888" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function CheckBadge() {
    return (
        <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <Circle cx={9} cy={9} r={8} fill="#7c5fe3" />
            <Path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

// ─── Data ───────────────────────────────────────────────────────────

const ACCOUNTS = [
    { id: "A1", name: "Account 1", balance: "$0.00", active: true },
    { id: "A2", name: "Account 2", balance: null, active: false },
];

// ─── Main Component ─────────────────────────────────────────────────

export default function ProfileDrawer() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#0e0e1a]">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header: Avatar + Close */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                        {/* Avatar */}
                        <View style={{
                            width: 44, height: 44, borderRadius: 22,
                            backgroundColor: "#d4e157",
                            justifyContent: "center", alignItems: "center",
                        }}>
                            <Text style={{ fontSize: 22 }}>🌊</Text>
                        </View>
                        {/* Name */}
                        <View>
                            <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 18 }}>@wavewallet</Text>
                            <Text style={{ fontFamily: "SNPro-Regular", color: "#888", fontSize: 13, marginTop: 2 }}>0 followers</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ padding: 4, marginTop: 4 }}
                    >
                        <CloseIcon />
                    </TouchableOpacity>
                </View>

                {/* Profile / Settings Buttons */}
                <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 12, marginBottom: 28 }}>
                    <TouchableOpacity
                        onPress={() => router.push("/(main)/profile")}
                        activeOpacity={0.7}
                        style={{
                            flex: 1,
                            backgroundColor: "#1e1e30",
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: "center",
                            gap: 6,
                            borderWidth: 1,
                            borderColor: "#2a2a3e",
                        }}
                    >
                        <ProfileIcon />
                        <Text style={{ fontFamily: "SNPro-Medium", color: "white", fontSize: 13 }}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/(main)/settings")}
                        activeOpacity={0.7}
                        style={{
                            flex: 1,
                            backgroundColor: "#1e1e30",
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: "center",
                            gap: 6,
                            borderWidth: 1,
                            borderColor: "#2a2a3e",
                        }}
                    >
                        <SettingsIcon />
                        <Text style={{ fontFamily: "SNPro-Medium", color: "white", fontSize: 13 }}>Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Your Accounts */}
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 20, marginBottom: 14 }}>Your Accounts</Text>

                    {ACCOUNTS.map((acct) => (
                        <TouchableOpacity
                            key={acct.id}
                            activeOpacity={0.7}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#1e1e30",
                                borderRadius: 14,
                                padding: 16,
                                marginBottom: 10,
                                borderWidth: 1,
                                borderColor: "#2a2a3e",
                            }}
                        >
                            {/* Account Badge */}
                            <View style={{
                                width: 44, height: 44, borderRadius: 22,
                                backgroundColor: "#2a2a3e",
                                justifyContent: "center", alignItems: "center",
                            }}>
                                <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 16 }}>{acct.id}</Text>
                                {acct.active && (
                                    <View style={{ position: "absolute", bottom: -2, right: -2 }}>
                                        <CheckBadge />
                                    </View>
                                )}
                            </View>

                            {/* Account Info */}
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={{ fontFamily: "SNPro-SemiBold", color: "white", fontSize: 16 }}>{acct.name}</Text>
                                {acct.balance && (
                                    <Text style={{ fontFamily: "SNPro-Regular", color: "#888", fontSize: 13, marginTop: 2 }}>{acct.balance}</Text>
                                )}
                            </View>

                            {/* Edit */}
                            <TouchableOpacity style={{ padding: 8 }}>
                                <EditPenIcon />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Add Account Button */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 30, paddingTop: 12 }}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        backgroundColor: "#c8b2ff",
                        borderRadius: 16,
                        paddingVertical: 16,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontFamily: "SNPro-SemiBold", color: "#0e0e1a", fontSize: 16 }}>Add Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
