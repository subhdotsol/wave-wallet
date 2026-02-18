import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import Svg, { Path, Circle } from "react-native-svg";
import { walletManager } from "../../src/lib/wallet";

// ─── Icons ──────────────────────────────────────────────────────────

function BackArrow() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function ChevronRight() {
    return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M9 18l6-6-6-6" stroke="#666" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function PencilIconSmall() {
    return (
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="#888" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

// ─── Menu Components ────────────────────────────────────────────────

function MenuSection({ children }: { children: React.ReactNode }) {
    return (
        <View className="bg-[#161625] rounded-2xl mb-3 border border-[#1e1e30] overflow-hidden">
            {children}
        </View>
    );
}

function MenuDivider() {
    return <View className="h-px bg-[#1e1e30] ml-4" />;
}

function MenuItem({
    label,
    rightText,
    onPress,
    destructive,
}: {
    label: string;
    rightText?: string;
    onPress?: () => void;
    destructive?: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center py-4 px-4"
        >
            <Text
                className="flex-1 text-[15px]"
                style={{
                    fontFamily: "SNPro-Medium",
                    color: destructive ? "#ef4444" : "#fff",
                }}
            >
                {label}
            </Text>
            {rightText && (
                <Text className="text-[#888] text-sm mr-2" style={{ fontFamily: "SNPro-Regular" }}>
                    {rightText}
                </Text>
            )}
            {!destructive && <ChevronRight />}
        </TouchableOpacity>
    );
}

// ─── Main Component ─────────────────────────────────────────────────

export default function EditAccount() {
    const router = useRouter();
    const { index: indexParam } = useLocalSearchParams<{ index: string }>();
    const accountIndex = parseInt(indexParam ?? "0", 10);

    const [, forceUpdate] = useState(0);

    const accounts = walletManager.getAllAccounts();
    const account = accounts[accountIndex];
    const hasMnemonic = walletManager.getMnemonic() !== null;

    if (!account) {
        return (
            <SafeAreaView className="flex-1 bg-[#0e0e1a] justify-center items-center">
                <Text className="text-white text-lg" style={{ fontFamily: "SNPro-Bold" }}>
                    Account not found
                </Text>
            </SafeAreaView>
        );
    }

    const handleRename = () => {
        Alert.prompt(
            "Account Name",
            "Enter a new name for this account",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Save",
                    onPress: (newName) => {
                        if (newName && newName.trim()) {
                            walletManager.renameAccount(accountIndex, newName);
                            forceUpdate((n) => n + 1);
                        }
                    },
                },
            ],
            "plain-text",
            account.name
        );
    };

    const handleRemove = () => {
        if (accounts.length <= 1) {
            Alert.alert("Cannot Remove", "You must have at least one account.");
            return;
        }

        Alert.alert(
            "Remove Account",
            `Are you sure you want to remove "${account.name}"? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        try {
                            walletManager.removeAccount(accountIndex);
                            router.back();
                        } catch (e: any) {
                            Alert.alert("Error", e.message);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0e0e1a]">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-2 pb-4 gap-2">
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <BackArrow />
                </TouchableOpacity>
                <Text className="text-white text-lg" style={{ fontFamily: "SNPro-Bold" }}>
                    Edit Account
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Account Avatar */}
                <View className="items-center pt-4 pb-8">
                    <View className="relative">
                        <View className="w-20 h-20 rounded-full bg-[#2a2a3e] justify-center items-center">
                            <Text className="text-white text-2xl" style={{ fontFamily: "SNPro-Bold" }}>
                                A{accountIndex + 1}
                            </Text>
                        </View>
                        {/* Pencil overlay */}
                        <View className="absolute -bottom-1 right-0 w-7 h-7 rounded-full bg-[#1e1e30] border border-[#2a2a3e] justify-center items-center">
                            <PencilIconSmall />
                        </View>
                    </View>
                </View>

                <View className="px-4">
                    {/* Account Name & Addresses */}
                    <MenuSection>
                        <MenuItem label="Account Name" rightText={account.name} onPress={handleRename} />
                        <MenuDivider />
                        <MenuItem label="Account Addresses" />
                    </MenuSection>

                    {/* Notifications */}
                    <MenuSection>
                        <MenuItem label="Notifications" />
                    </MenuSection>

                    {/* Security */}
                    <MenuSection>
                        <MenuItem
                            label="Recovery Phrase"
                            rightText={hasMnemonic ? "Recovery Phrase 1" : "N/A"}
                        />
                        <MenuDivider />
                        <MenuItem label="Show Recovery Phrase" />
                        <MenuDivider />
                        <MenuItem label="Show Private Key" />
                    </MenuSection>

                    {/* Remove Account */}
                    <MenuSection>
                        <MenuItem
                            label="Remove Account"
                            destructive
                            onPress={handleRemove}
                        />
                    </MenuSection>
                </View>

                {/* Bottom spacer */}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
