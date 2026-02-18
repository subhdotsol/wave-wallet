import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { walletManager, type Account } from "../../src/lib/wallet";

// ─── Shared Components ──────────────────────────────────────────────
import {
    CloseIcon,
    ProfileIcon,
    PencilIcon,
    PlusIcon,
    VerifiedBadge,
} from "../../src/components/icons";

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
                            <Text className="text-white text-lg" style={{ fontFamily: "Roboto-Bold" }}>
                                {activeAccount?.name ?? "Wave Wallet"}
                            </Text>
                            <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "Roboto-Regular" }}>
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
                        <Text className="text-white text-[13px]" style={{ fontFamily: "Roboto-Medium" }}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/(main)/settings")}
                        activeOpacity={0.7}
                        className="flex-1 bg-[#1e1e30] rounded-[14px] py-4 items-center gap-1.5 border border-[#2a2a3e]"
                    >
                        <Feather name="settings" size={28} color="#fff" />
                        <Text className="text-white text-[13px]" style={{ fontFamily: "Roboto-Medium" }}>Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Your Accounts */}
                <View className="px-5">
                    <Text className="text-white text-xl mb-3.5" style={{ fontFamily: "Roboto-Bold" }}>
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
                                    borderColor: isActive ? "#3b82f6" : "#2a2a3e",
                                }}
                            >
                                {/* Account Badge */}
                                <View className="w-11 h-11 rounded-full bg-[#2a2a3e] justify-center items-center relative">
                                    <Text className="text-white text-sm" style={{ fontFamily: "Roboto-Bold" }}>
                                        A{idx + 1}
                                    </Text>
                                    {isActive && (
                                        <View className="absolute -bottom-0.5 -right-0.5">
                                            <VerifiedBadge size={18} />
                                        </View>
                                    )}
                                </View>

                                {/* Account Info */}
                                <View className="flex-1 ml-3">
                                    <Text className="text-white text-base" style={{ fontFamily: "Roboto-Bold" }}>
                                        {acct.name}
                                    </Text>
                                    <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "Roboto-Regular" }}>
                                        {acct.shortAddress}
                                    </Text>
                                </View>

                                {/* Edit Button */}
                                <TouchableOpacity
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        router.push(`/(wallet)/edit-account?index=${idx}`);
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    className="p-2"
                                >
                                    <PencilIcon />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        );
                    })}

                    {accounts.length === 0 && (
                        <View className="bg-[#1e1e30] rounded-[14px] p-5 items-center border border-[#2a2a3e]">
                            <Text className="text-[#888] text-base" style={{ fontFamily: "Roboto-Regular" }}>
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
                        backgroundColor: hasMnemonic ? "#3b82f6" : "#2a2a3e",
                    }}
                >
                    <PlusIcon size={18} color={hasMnemonic ? "#0e0e1a" : "#555"} />
                    <Text
                        className="text-base"
                        style={{
                            fontFamily: "Roboto-Bold",
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
