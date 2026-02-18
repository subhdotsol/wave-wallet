import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { walletManager } from "../../src/lib/wallet";

// ─── Shared Components ──────────────────────────────────────────────
import { BackArrowIcon, PencilIcon } from "../../src/components/icons";
import { MenuSection, MenuDivider, MenuItem } from "../../src/components/ui";

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
                <Text className="text-white text-lg" style={{ fontFamily: "Roboto-Bold" }}>
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
                    onPress: (newName?: string) => {
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
                    <BackArrowIcon />
                </TouchableOpacity>
                <Text className="text-white text-lg" style={{ fontFamily: "Roboto-Bold" }}>
                    Edit Account
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Account Avatar */}
                <View className="items-center pt-4 pb-8">
                    <View className="relative">
                        <View className="w-20 h-20 rounded-full bg-[#2a2a3e] justify-center items-center">
                            <Text className="text-white text-2xl" style={{ fontFamily: "Roboto-Bold" }}>
                                A{accountIndex + 1}
                            </Text>
                        </View>
                        {/* Pencil overlay */}
                        <View className="absolute -bottom-1 right-0 w-7 h-7 rounded-full bg-[#1e1e30] border border-[#2a2a3e] justify-center items-center">
                            <PencilIcon size={14} />
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
                        <MenuItem
                            label="Show Recovery Phrase"
                            onPress={() => router.push("/(wallet)/show-recovery-phrase")}
                        />
                        <MenuDivider />
                        <MenuItem
                            label="Show Private Key"
                            onPress={() => router.push(`/(wallet)/show-private-key?index=${accountIndex}`)}
                        />
                    </MenuSection>

                    {/* Remove Account */}
                    {accounts.length > 1 && (
                        <MenuSection>
                            <MenuItem
                                label="Remove Account"
                                destructive
                                onPress={handleRemove}
                            />
                        </MenuSection>
                    )}
                </View>

                {/* Bottom spacer */}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
