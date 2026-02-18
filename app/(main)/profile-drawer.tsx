import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import Svg, { Path, Circle } from "react-native-svg";
import { walletManager, type Account } from "../../src/lib/wallet";

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

function CheckBadge() {
    return (
        <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
            <Circle cx={9} cy={9} r={8} fill="#7c5fe3" />
            <Path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function PlusIcon() {
    return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M12 5v14M5 12h14" stroke="#0e0e1a" strokeWidth={2.5} strokeLinecap="round" />
        </Svg>
    );
}

// ─── Main Component ─────────────────────────────────────────────────

export default function ProfileDrawer() {
    const router = useRouter();

    // Force re-render when accounts change
    const [, forceUpdate] = useState(0);
    const accounts = walletManager.getAllAccounts();
    const activeIndex = walletManager.getActiveIndex();
    const activeAccount = walletManager.getActiveAccount();
    const hasMnemonic = walletManager.getMnemonic() !== null;

    const handleSwitchAccount = (index: number) => {
        walletManager.setActiveAccount(index);
        forceUpdate((n) => n + 1);
    };

    const handleAddAccount = () => {
        if (!hasMnemonic) {
            Alert.alert(
                "Cannot Add Account",
                "Your wallet was imported via private key. To use multiple accounts, import with a seed phrase instead."
            );
            return;
        }

        try {
            walletManager.addAccount();
            forceUpdate((n) => n + 1);
        } catch (e: any) {
            Alert.alert("Error", e.message);
        }
    };

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
                        {/* Name + Address */}
                        <View>
                            <Text className="text-white text-lg" style={{ fontFamily: "SNPro-Bold" }}>
                                {activeAccount?.name ?? "Wave Wallet"}
                            </Text>
                            <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "SNPro-Regular" }}>
                                {activeAccount?.shortAddress ?? "No wallet"}
                            </Text>
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
                    <Text className="text-white text-xl mb-3.5" style={{ fontFamily: "SNPro-Bold" }}>
                        Your Accounts
                    </Text>

                    {accounts.map((acct: Account, idx: number) => {
                        const isActive = idx === activeIndex;
                        return (
                            <TouchableOpacity
                                key={acct.address}
                                activeOpacity={0.7}
                                onPress={() => handleSwitchAccount(idx)}
                                className="flex-row items-center rounded-[14px] p-4 mb-2.5 border"
                                style={{
                                    backgroundColor: isActive ? "#1e1e30" : "#161622",
                                    borderColor: isActive ? "#7c5fe3" : "#2a2a3e",
                                }}
                            >
                                {/* Account Badge */}
                                <View className="w-11 h-11 rounded-full bg-[#2a2a3e] justify-center items-center relative">
                                    <Text className="text-white text-sm" style={{ fontFamily: "SNPro-Bold" }}>
                                        A{idx + 1}
                                    </Text>
                                    {isActive && (
                                        <View className="absolute -bottom-0.5 -right-0.5">
                                            <CheckBadge />
                                        </View>
                                    )}
                                </View>

                                {/* Account Info */}
                                <View className="flex-1 ml-3">
                                    <Text className="text-white text-base" style={{ fontFamily: "SNPro-SemiBold" }}>
                                        {acct.name}
                                    </Text>
                                    <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "SNPro-Regular" }}>
                                        {acct.shortAddress}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    {accounts.length === 0 && (
                        <View className="bg-[#1e1e30] rounded-[14px] p-5 items-center border border-[#2a2a3e]">
                            <Text className="text-[#888] text-base" style={{ fontFamily: "SNPro-Regular" }}>
                                No accounts yet
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Add Account Button */}
            <View className="px-5 pb-[30px] pt-3">
                <TouchableOpacity
                    onPress={handleAddAccount}
                    activeOpacity={0.7}
                    className="rounded-2xl py-4 flex-row items-center justify-center gap-2"
                    style={{
                        backgroundColor: hasMnemonic ? "#c8b2ff" : "#2a2a3e",
                    }}
                >
                    <PlusIcon />
                    <Text
                        className="text-base"
                        style={{
                            fontFamily: "SNPro-SemiBold",
                            color: hasMnemonic ? "#0e0e1a" : "#555",
                        }}
                    >
                        Add Account
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
