import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { walletManager } from "../../src/lib/wallet";

// ─── Shared Components ──────────────────────────────────────────────
import {
    CloseIcon,
    SearchIcon,
    ChevronRightIcon,
    ManageAccountsIcon,
    PreferencesIcon,
    SecurityIcon,
    GlobeIcon,
    AddressBookIcon,
    ConnectedAppsIcon,
    DevSettingsIcon,
    HelpIcon,
    HeartIcon,
    ShareIcon,
    AboutIcon,
} from "../../src/components/icons";

import { MenuSection, MenuDivider, MenuItem } from "../../src/components/ui";

// ─── Main Component ─────────────────────────────────────────────────

export default function Settings() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="flex-row justify-between items-center px-5 pt-3 pb-5">
                <Text className="text-white text-[30px]" style={{ fontFamily: "Roboto-Bold" }}>Settings</Text>
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <CloseIcon size={26} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View className="flex-row items-center bg-[#1c1c1e] rounded-xl px-4 py-3.5 mb-5 gap-3">
                    <SearchIcon size={20} color="#666" />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#666"
                        className="flex-1 text-white text-[16px] p-0"
                        style={{ fontFamily: "Roboto-Regular" }}
                    />
                </View>

                {/* Profile Card */}
                <MenuSection>
                    <TouchableOpacity
                        onPress={() => router.push("/(main)/profile")}
                        activeOpacity={0.7}
                        className="flex-row items-center p-4"
                    >
                        <View className="w-11 h-11 rounded-full bg-[#d4e157] justify-center items-center mr-3.5">
                            <Text className="text-lg">🌊</Text>
                        </View>
                        <Text className="text-white text-[17px] flex-1" style={{ fontFamily: "Roboto-Bold" }}>@wavewallet</Text>
                        <ChevronRightIcon />
                    </TouchableOpacity>
                </MenuSection>

                {/* Account Management Group */}
                <MenuSection>
                    <MenuItem icon={<ManageAccountsIcon size={24} />} label="Manage Accounts" rightText="2" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<PreferencesIcon size={24} />} label="Preferences" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<SecurityIcon size={24} />} label="Security & Privacy" />
                </MenuSection>

                {/* Network & Apps Group */}
                <MenuSection>
                    <MenuItem icon={<GlobeIcon size={24} />} label="Active Networks" rightText="All" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<AddressBookIcon size={24} />} label="Address Book" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<ConnectedAppsIcon size={24} />} label="Connected Apps" />
                </MenuSection>

                {/* Developer */}
                <MenuSection>
                    <MenuItem icon={<DevSettingsIcon size={24} />} label="Developer Settings" />
                </MenuSection>

                {/* Support & About */}
                <MenuSection>
                    <MenuItem icon={<HelpIcon size={24} />} label="Help & Support" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<HeartIcon size={24} />} label="Invite your friends" rightIcon={<ShareIcon size={20} />} />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<AboutIcon size={24} />} label="About Phantom" />
                </MenuSection>

                {/* ⚠️ DEV ONLY — Remove before production */}
                <MenuSection>
                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                "Reset Wallet",
                                "This will wipe ALL wallet data (AsyncStorage + SecureStore). Are you sure?",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Reset",
                                        style: "destructive",
                                        onPress: async () => {
                                            await walletManager.reset();
                                            router.replace("/(onboarding)");
                                        },
                                    },
                                ]
                            );
                        }}
                        activeOpacity={0.7}
                        className="py-4 items-center"
                    >
                        <Text className="text-red-500 text-[16px]" style={{ fontFamily: "Roboto-Bold" }}>
                            🗑️ DEV: Reset Wallet
                        </Text>
                    </TouchableOpacity>
                </MenuSection>

                {/* Bottom spacer */}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
