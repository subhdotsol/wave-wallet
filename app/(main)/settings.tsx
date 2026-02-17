import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect, Line, Polyline } from "react-native-svg";

// ─── Icons ──────────────────────────────────────────────────────────

function CloseIcon() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );
}

function SearchIcon() {
    return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx={11} cy={11} r={7} stroke="#666" strokeWidth={1.8} />
            <Path d="M16 16l4 4" stroke="#666" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
    );
}

function ChevronRightIcon({ color = "#666" }: { color?: string }) {
    return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function ManageAccountsIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={9} cy={7} r={4} stroke="#c8b2ff" strokeWidth={1.6} />
            <Path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" stroke="#c8b2ff" strokeWidth={1.6} />
            <Path d="M19 8v6M22 11h-6" stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
    );
}

function PreferencesIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Line x1={4} y1={6} x2={4} y2={18} stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" />
            <Line x1={12} y1={6} x2={12} y2={18} stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" />
            <Line x1={20} y1={6} x2={20} y2={18} stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" />
            <Circle cx={4} cy={10} r={2} fill="#0e0e1a" stroke="#c8b2ff" strokeWidth={1.6} />
            <Circle cx={12} cy={15} r={2} fill="#0e0e1a" stroke="#c8b2ff" strokeWidth={1.6} />
            <Circle cx={20} cy={9} r={2} fill="#0e0e1a" stroke="#c8b2ff" strokeWidth={1.6} />
        </Svg>
    );
}

function SecurityIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2l8 4v6c0 5.5-3.8 10-8 11.5C7.8 22 4 17.5 4 12V6l8-4z" stroke="#c8b2ff" strokeWidth={1.6} strokeLinejoin="round" />
        </Svg>
    );
}

function GlobeIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#c8b2ff" strokeWidth={1.6} />
            <Path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10A15 15 0 0112 2z" stroke="#c8b2ff" strokeWidth={1.6} />
        </Svg>
    );
}

function AddressBookIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={10} r={3} stroke="#c8b2ff" strokeWidth={1.6} />
            <Path d="M7 20c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" />
            <Rect x={3} y={3} width={18} height={18} rx={3} stroke="#c8b2ff" strokeWidth={1.6} />
        </Svg>
    );
}

function ConnectedAppsIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={3} stroke="#c8b2ff" strokeWidth={1.6} />
            <Path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
    );
}

function DevSettingsIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Polyline points="16,18 22,12 16,6" stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points="8,6 2,12 8,18" stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function HelpIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#c8b2ff" strokeWidth={1.6} />
            <Path d="M9 9a3 3 0 015.12 2.13c0 2-3 2.5-3 2.5" stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" />
            <Circle cx={12} cy={17} r={0.5} fill="#c8b2ff" />
        </Svg>
    );
}

function HeartIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="#c8b2ff" strokeWidth={1.6} />
        </Svg>
    );
}

function ShareIcon() {
    return (
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx={18} cy={5} r={3} stroke="#666" strokeWidth={1.6} />
            <Circle cx={6} cy={12} r={3} stroke="#666" strokeWidth={1.6} />
            <Circle cx={18} cy={19} r={3} stroke="#666" strokeWidth={1.6} />
            <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="#666" strokeWidth={1.6} />
        </Svg>
    );
}

function AboutIcon() {
    return (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} stroke="#c8b2ff" strokeWidth={1.6} />
            <Path d="M12 8v4M12 16h.01" stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
    );
}

// ─── Menu Item Component ────────────────────────────────────────────

function MenuItem({ icon, label, rightText, rightIcon, onPress }: {
    icon: React.ReactNode;
    label: string;
    rightText?: string;
    rightIcon?: React.ReactNode;
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 16,
                paddingHorizontal: 16,
            }}
        >
            <View style={{ marginRight: 14 }}>{icon}</View>
            <Text style={{ fontFamily: "SNPro-Medium", color: "white", fontSize: 15, flex: 1 }}>{label}</Text>
            {rightText && (
                <Text style={{ fontFamily: "SNPro-Regular", color: "#888", fontSize: 14, marginRight: 8 }}>{rightText}</Text>
            )}
            {rightIcon || <ChevronRightIcon />}
        </TouchableOpacity>
    );
}

function MenuSection({ children, style }: { children: React.ReactNode; style?: any }) {
    return (
        <View style={[{
            backgroundColor: "#161625",
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#1e1e30",
            overflow: "hidden",
        }, style]}>
            {children}
        </View>
    );
}

function MenuDivider() {
    return <View style={{ height: 1, backgroundColor: "#1e1e30", marginLeft: 52 }} />;
}

// ─── Main Component ─────────────────────────────────────────────────

export default function Settings() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#0e0e1a]">
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
                <Text style={{ fontFamily: "SNPro-Bold", color: "white", fontSize: 28 }}>Settings</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <CloseIcon />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#1e1e30",
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    marginBottom: 16,
                    gap: 10,
                }}>
                    <SearchIcon />
                    <TextInput
                        placeholder="Search"
                        placeholderTextColor="#666"
                        style={{ flex: 1, color: "white", fontFamily: "SNPro-Regular", fontSize: 15, padding: 0 }}
                    />
                </View>

                {/* Profile Card */}
                <MenuSection>
                    <TouchableOpacity
                        onPress={() => router.push("/(main)/profile")}
                        activeOpacity={0.7}
                        style={{ flexDirection: "row", alignItems: "center", padding: 16 }}
                    >
                        <View style={{
                            width: 40, height: 40, borderRadius: 20,
                            backgroundColor: "#d4e157",
                            justifyContent: "center", alignItems: "center",
                            marginRight: 12,
                        }}>
                            <Text style={{ fontSize: 18 }}>🌊</Text>
                        </View>
                        <Text style={{ fontFamily: "SNPro-SemiBold", color: "white", fontSize: 16, flex: 1 }}>@wavewallet</Text>
                        <ChevronRightIcon />
                    </TouchableOpacity>
                </MenuSection>

                {/* Account Management Group */}
                <MenuSection>
                    <MenuItem icon={<ManageAccountsIcon />} label="Manage Accounts" rightText="2" />
                    <MenuDivider />
                    <MenuItem icon={<PreferencesIcon />} label="Preferences" />
                    <MenuDivider />
                    <MenuItem icon={<SecurityIcon />} label="Security & Privacy" />
                </MenuSection>

                {/* Network & Apps Group */}
                <MenuSection>
                    <MenuItem icon={<GlobeIcon />} label="Active Networks" rightText="All" />
                    <MenuDivider />
                    <MenuItem icon={<AddressBookIcon />} label="Address Book" />
                    <MenuDivider />
                    <MenuItem icon={<ConnectedAppsIcon />} label="Connected Apps" />
                </MenuSection>

                {/* Developer */}
                <MenuSection>
                    <MenuItem icon={<DevSettingsIcon />} label="Developer Settings" />
                </MenuSection>

                {/* Support & About */}
                <MenuSection>
                    <MenuItem icon={<HelpIcon />} label="Help & Support" />
                    <MenuDivider />
                    <MenuItem icon={<HeartIcon />} label="Invite your friends" rightIcon={<ShareIcon />} />
                    <MenuDivider />
                    <MenuItem icon={<AboutIcon />} label="About Phantom" />
                </MenuSection>

                {/* Bottom spacer */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
