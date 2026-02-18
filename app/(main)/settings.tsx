import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

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
        <SafeAreaView className="flex-1 bg-[#0e0e1a]">
            {/* Header */}
            <View className="flex-row justify-between items-center px-5 pt-2 pb-4">
                <Text className="text-white text-[28px]" style={{ fontFamily: "Roboto-Bold" }}>Settings</Text>
                <TouchableOpacity onPress={() => router.back()} className="p-1">
                    <CloseIcon />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View className="flex-row items-center bg-[#1e1e30] rounded-xl px-3.5 py-3 mb-4 gap-2.5">
                    <SearchIcon size={18} color="#666" />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#666"
                        className="flex-1 text-white text-[15px] p-0"
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
                        <View className="w-10 h-10 rounded-full bg-[#d4e157] justify-center items-center mr-3">
                            <Text className="text-lg">🌊</Text>
                        </View>
                        <Text className="text-white text-base flex-1" style={{ fontFamily: "Roboto-Bold" }}>@wavewallet</Text>
                        <ChevronRightIcon />
                    </TouchableOpacity>
                </MenuSection>

                {/* Account Management Group */}
                <MenuSection>
                    <MenuItem icon={<ManageAccountsIcon />} label="Manage Accounts" rightText="2" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<PreferencesIcon />} label="Preferences" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<SecurityIcon />} label="Security & Privacy" />
                </MenuSection>

                {/* Network & Apps Group */}
                <MenuSection>
                    <MenuItem icon={<GlobeIcon />} label="Active Networks" rightText="All" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<AddressBookIcon />} label="Address Book" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<ConnectedAppsIcon />} label="Connected Apps" />
                </MenuSection>

                {/* Developer */}
                <MenuSection>
                    <MenuItem icon={<DevSettingsIcon />} label="Developer Settings" />
                </MenuSection>

                {/* Support & About */}
                <MenuSection>
                    <MenuItem icon={<HelpIcon />} label="Help & Support" />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<HeartIcon />} label="Invite your friends" rightIcon={<ShareIcon />} />
                    <MenuDivider inset={52} />
                    <MenuItem icon={<AboutIcon />} label="About Phantom" />
                </MenuSection>

                {/* Bottom spacer */}
                <View className="h-10" />
            </ScrollView>
        </SafeAreaView>
    );
}
