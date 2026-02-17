import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle } from "react-native-svg";

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
                <View className="flex-row justify-between items-start px-5 pt-2 pb-4">
                    <View className="flex-row items-center gap-3">
                        {/* Avatar */}
                        <View className="w-11 h-11 rounded-full bg-[#d4e157] justify-center items-center">
                            <Text className="text-[22px]">🌊</Text>
                        </View>
                        {/* Name */}
                        <View>
                            <Text className="text-white text-lg" style={{ fontFamily: "SNPro-Bold" }}>@wavewallet</Text>
                            <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "SNPro-Regular" }}>0 followers</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.back()} className="p-1 mt-1">
                        <CloseIcon />
                    </TouchableOpacity>
                </View>

                {/* Profile / Settings Buttons */}
                <View className="flex-row px-5 gap-3 mb-7">
                    <TouchableOpacity
                        onPress={() => router.push("/(main)/profile")}
                        activeOpacity={0.7}
                        className="flex-1 bg-[#1e1e30] rounded-[14px] py-4 items-center gap-1.5 border border-[#2a2a3e]"
                    >
                        <ProfileIcon />
                        <Text className="text-white text-[13px]" style={{ fontFamily: "SNPro-Medium" }}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/(main)/settings")}
                        activeOpacity={0.7}
                        className="flex-1 bg-[#1e1e30] rounded-[14px] py-4 items-center gap-1.5 border border-[#2a2a3e]"
                    >
                        <SettingsIcon />
                        <Text className="text-white text-[13px]" style={{ fontFamily: "SNPro-Medium" }}>Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Your Accounts */}
                <View className="px-5">
                    <Text className="text-white text-xl mb-3.5" style={{ fontFamily: "SNPro-Bold" }}>Your Accounts</Text>

                    {ACCOUNTS.map((acct) => (
                        <TouchableOpacity
                            key={acct.id}
                            activeOpacity={0.7}
                            className="flex-row items-center bg-[#1e1e30] rounded-[14px] p-4 mb-2.5 border border-[#2a2a3e]"
                        >
                            {/* Account Badge */}
                            <View className="w-11 h-11 rounded-full bg-[#2a2a3e] justify-center items-center relative">
                                <Text className="text-white text-base" style={{ fontFamily: "SNPro-Bold" }}>{acct.id}</Text>
                                {acct.active && (
                                    <View className="absolute -bottom-0.5 -right-0.5">
                                        <CheckBadge />
                                    </View>
                                )}
                            </View>

                            {/* Account Info */}
                            <View className="flex-1 ml-3">
                                <Text className="text-white text-base" style={{ fontFamily: "SNPro-SemiBold" }}>{acct.name}</Text>
                                {acct.balance && (
                                    <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "SNPro-Regular" }}>{acct.balance}</Text>
                                )}
                            </View>

                            {/* Edit */}
                            <TouchableOpacity className="p-2">
                                <EditPenIcon />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Add Account Button */}
            <View className="px-5 pb-[30px] pt-3">
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="bg-[#c8b2ff] rounded-2xl py-4 items-center"
                >
                    <Text className="text-[#0e0e1a] text-base" style={{ fontFamily: "SNPro-SemiBold" }}>Add Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
