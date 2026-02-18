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
        <SafeAreaView className="flex-1 bg-[#121212]">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header: Avatar + Close */}
                <View className="flex-row justify-between items-start px-5 pt-3 pb-5">
                    <View className="flex-row items-center gap-3.5">
                        {/* Avatar */}
                        <View className="w-12 h-12 rounded-full bg-[#d4e157] justify-center items-center">
                            <Text className="text-[24px]">🌊</Text>
                        </View>
                        {/* Name + Address */}
                        <View>
                            <Text className="text-white text-[20px]" style={{ fontFamily: "Roboto-Bold" }}>
                                {activeAccount?.name ?? "Wave Wallet"}
                            </Text>
                            <Text className="text-[#888] text-[14px] mt-0.5" style={{ fontFamily: "Roboto-Regular" }}>
                                {activeAccount?.shortAddress ?? "No wallet"}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.back()} className="p-1 mt-2">
                        <CloseIcon size={26} />
                    </TouchableOpacity>
                </View>

                {/* Profile / Settings Buttons */}
                <View className="flex-row px-5 gap-3 mb-8">
                    <TouchableOpacity
                        onPress={() => router.push("/(main)/profile")}
                        activeOpacity={0.7}
                        className="flex-1 bg-[#1c1c1e] rounded-2xl py-5 items-center gap-2"
                    >
                        <ProfileIcon size={30} />
                        <Text className="text-white text-[14px]" style={{ fontFamily: "Roboto-Medium" }}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/(main)/settings")}
                        activeOpacity={0.7}
                        className="flex-1 bg-[#1c1c1e] rounded-2xl py-5 items-center gap-2"
                    >
                        <Feather name="settings" size={30} color="#fff" />
                        <Text className="text-white text-[14px]" style={{ fontFamily: "Roboto-Medium" }}>Settings</Text>
                    </TouchableOpacity>
                </View>

                {/* Your Accounts */}
                <View className="px-5">
                    <Text className="text-white text-[22px] mb-4" style={{ fontFamily: "Roboto-Bold" }}>
                        Your Accounts
                    </Text>

                    {accounts.map((acct: Account, idx: number) => {
                        const isActive = idx === activeIndex;
                        return (
                            <TouchableOpacity
                                key={acct.address}
                                activeOpacity={0.7}
                                onPress={() => handleSwitchAccount(idx)}
                                className="flex-row items-center rounded-2xl p-4 mb-3 border"
                                style={{
                                    backgroundColor: isActive ? "#1c1c1e" : "#181818",
                                    borderColor: isActive ? "#3b82f6" : "#2a2a2a",
                                }}
                            >
                                {/* Account Badge */}
                                <View className="w-12 h-12 rounded-full bg-[#2a2a2a] justify-center items-center relative">
                                    <Text className="text-white text-[15px]" style={{ fontFamily: "Roboto-Bold" }}>
                                        A{idx + 1}
                                    </Text>
                                    {isActive && (
                                        <View className="absolute -bottom-0.5 -right-0.5">
                                            <VerifiedBadge size={18} />
                                        </View>
                                    )}
                                </View>

                                {/* Account Info */}
                                <View className="flex-1 ml-3.5">
                                    <Text className="text-white text-[17px]" style={{ fontFamily: "Roboto-Bold" }}>
                                        {acct.name}
                                    </Text>
                                    <Text className="text-[#888] text-[14px] mt-1" style={{ fontFamily: "Roboto-Regular" }}>
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
                                    <PencilIcon size={18} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        );
                    })}

                    {accounts.length === 0 && (
                        <View className="bg-[#1c1c1e] rounded-2xl p-5 items-center">
                            <Text className="text-[#888] text-[16px]" style={{ fontFamily: "Roboto-Regular" }}>
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
                        backgroundColor: hasMnemonic ? "#3b82f6" : "#2a2a2a",
                    }}
                >
                    <PlusIcon size={20} color={hasMnemonic ? "#fff" : "#555"} />
                    <Text
                        className="text-[16px]"
                        style={{
                            fontFamily: "Roboto-Bold",
                            color: hasMnemonic ? "#fff" : "#555",
                        }}
                    >
                        Add Account
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
