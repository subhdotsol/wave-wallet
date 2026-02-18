import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { walletManager } from "../../src/lib/wallet";

// ─── Icon Components ────────────────────────────────────────────────

function ClockIcon() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={9} stroke="#aaa" strokeWidth={1.8} />
            <Path d="M12 7v5l3 3" stroke="#aaa" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function SearchIcon({ size = 24, color = "#aaa" }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={1.8} />
            <Path d="M16 16l4 4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
    );
}

function SendIcon() {
    return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path d="M5 12l14-7-7 14-2-5-5-2z" stroke="#c8b2ff" strokeWidth={1.6} strokeLinejoin="round" />
        </Svg>
    );
}

function SwapIcon({ size = 28, color = "#c8b2ff" }: { size?: number; color?: string }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M7 16l-3-3 3-3" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4 13h13" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
            <Path d="M17 8l3 3-3 3" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20 11H7" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
    );
}

function QRIcon() {
    return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Rect x={3} y={3} width={7} height={7} rx={1} stroke="#c8b2ff" strokeWidth={1.6} />
            <Rect x={14} y={3} width={7} height={7} rx={1} stroke="#c8b2ff" strokeWidth={1.6} />
            <Rect x={3} y={14} width={7} height={7} rx={1} stroke="#c8b2ff" strokeWidth={1.6} />
            <Rect x={14} y={14} width={3} height={3} stroke="#c8b2ff" strokeWidth={1.6} />
            <Rect x={18} y={18} width={3} height={3} stroke="#c8b2ff" strokeWidth={1.6} />
        </Svg>
    );
}

function DollarIcon() {
    return (
        <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" stroke="#c8b2ff" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function HomeTabIcon({ active = false }: { active?: boolean }) {
    const color = active ? "#c8b2ff" : "#666";
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V10.5z" stroke={color} strokeWidth={1.8} fill={active ? color : "none"} />
        </Svg>
    );
}

function CardTabIcon() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Rect x={2} y={5} width={20} height={14} rx={2} stroke="#666" strokeWidth={1.8} />
            <Path d="M2 10h20" stroke="#666" strokeWidth={1.8} />
        </Svg>
    );
}

function SwapTabIcon() {
    return <SwapIcon size={24} color="#666" />;
}

function MessageTabIcon() {
    return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="#666" strokeWidth={1.8} />
        </Svg>
    );
}

function SearchTabIcon() {
    return <SearchIcon size={24} color="#666" />;
}

function VerifiedBadge() {
    return (
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Circle cx={8} cy={8} r={7} fill="#7c5fe3" />
            <Path d="M5 8l2 2 4-4" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

function ChevronRight() {
    return (
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path d="M9 18l6-6-6-6" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

// ─── Token Logo Components ──────────────────────────────────────────

function SolanaLogo() {
    return (
        <View className="w-11 h-11 rounded-full bg-black justify-center items-center">
            <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <Path d="M4 16.5h13.5l2.5-2.5H6.5L4 16.5z" fill="#9945FF" />
                <Path d="M4 7.5L6.5 10H20l-2.5-2.5H4z" fill="#14F195" />
                <Path d="M4 12l2.5 2.5H20L17.5 12H4z" fill="#00C2FF" />
            </Svg>
        </View>
    );
}

function EthereumLogo() {
    return (
        <View className="w-11 h-11 rounded-full bg-[#3c3c5a] justify-center items-center">
            <Svg width={20} height={28} viewBox="0 0 20 32" fill="none">
                <Path d="M10 0l10 16.5L10 22 0 16.5 10 0z" fill="#8C8CA1" opacity={0.8} />
                <Path d="M10 24l10-7.5L10 32 0 16.5 10 24z" fill="#C0C0D0" />
            </Svg>
        </View>
    );
}

function BitcoinLogo() {
    return (
        <View className="w-11 h-11 rounded-full bg-[#f7931a] justify-center items-center">
            <Text className="text-white text-[22px] font-bold">₿</Text>
        </View>
    );
}

function MonadLogo() {
    return (
        <View className="w-11 h-11 rounded-full bg-[#7c5fe3] justify-center items-center">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={8} stroke="white" strokeWidth={2} />
                <Path d="M8 12a4 4 0 108 0 4 4 0 00-8 0" fill="white" opacity={0.3} />
            </Svg>
        </View>
    );
}

// ─── Data ───────────────────────────────────────────────────────────

const TOKENS = [
    { name: "Solana", symbol: "SOL", balance: "0", usdValue: "$0.00", usdSecondary: "$0.00", Logo: SolanaLogo, verified: true },
    { name: "Ethereum", symbol: "ETH", balance: "0", usdValue: "$0.00", usdSecondary: "$0.00", Logo: EthereumLogo, verified: true },
    { name: "Bitcoin", symbol: "BTC", balance: "0", usdValue: "$0.00", usdSecondary: "$0.00", Logo: BitcoinLogo, verified: true },
    { name: "Monad", symbol: "MON", balance: "0", usdValue: "$0.00", usdSecondary: "$0.00", Logo: MonadLogo, verified: true },
    { name: "Ethereum", symbol: "ETH", balance: "0", usdValue: "$0.00", usdSecondary: "$0.00", Logo: EthereumLogo, verified: true },
];

const ACTION_BUTTONS = [
    { label: "Send", Icon: SendIcon },
    { label: "Swap", Icon: SwapIcon },
    { label: "Receive", Icon: QRIcon },
    { label: "Buy", Icon: DollarIcon },
];

const TAB_ITEMS = [
    { label: "Home", Icon: HomeTabIcon, active: true },
    { label: "Cards", Icon: CardTabIcon, active: false },
    { label: "Swap", Icon: SwapTabIcon, active: false },
    { label: "Messages", Icon: MessageTabIcon, active: false },
    { label: "Search", Icon: SearchTabIcon, active: false },
];

// ─── Main Component ─────────────────────────────────────────────────

export default function Home() {
    const [balanceVisible, setBalanceVisible] = useState(false);
    const router = useRouter();
    const activeAccount = walletManager.getActiveAccount();

    return (
        <SafeAreaView className="flex-1 bg-[#0e0e1a]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
                <View className="flex-row items-center gap-3">
                    {/* Avatar */}
                    <TouchableOpacity
                        onPress={() => router.push("/(main)/profile-drawer")}
                        activeOpacity={0.7}
                        className="w-10 h-10 rounded-full bg-[#d4e157] justify-center items-center"
                    >
                        <Text className="text-xl">🌊</Text>
                    </TouchableOpacity>
                    {/* Name */}
                    <View>
                        <Text className="text-gray-400 text-xs" style={{ fontFamily: "SNPro-Regular" }}>{activeAccount?.shortAddress ?? "No wallet"}</Text>
                        <Text className="text-white text-base" style={{ fontFamily: "SNPro-Bold" }}>{activeAccount?.name ?? "Create Wallet"}</Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity><ClockIcon /></TouchableOpacity>
                    <TouchableOpacity><SearchIcon /></TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Balance Section */}
                <View className="px-5 pt-4 pb-6">
                    <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
                        <Text className="text-white text-4xl" style={{ fontFamily: "SNPro-Bold" }}>
                            {balanceVisible ? "$0.00" : "——"}
                        </Text>
                        <Text className="text-gray-500 text-lg mt-1" style={{ fontFamily: "SNPro-Regular" }}>
                            {balanceVisible ? "$0.00" : "·"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-between px-5 mb-8">
                    {ACTION_BUTTONS.map((btn) => (
                        <TouchableOpacity
                            key={btn.label}
                            activeOpacity={0.7}
                            className="w-[78px] h-[78px] rounded-2xl bg-[#1a1a2e] justify-center items-center border border-[#2a2a3e]"
                        >
                            <btn.Icon />
                            <Text className="text-gray-300 text-xs mt-1.5" style={{ fontFamily: "SNPro-Medium" }}>
                                {btn.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tokens Section Header */}
                <TouchableOpacity className="flex-row items-center px-5 mb-4">
                    <Text className="text-white text-xl mr-1" style={{ fontFamily: "SNPro-Bold" }}>Tokens</Text>
                    <ChevronRight />
                </TouchableOpacity>

                {/* Token List */}
                <View className="px-4">
                    {TOKENS.map((token, index) => (
                        <TouchableOpacity
                            key={`${token.symbol}-${index}`}
                            activeOpacity={0.7}
                            className="flex-row items-center bg-[#161625] rounded-2xl p-3.5 mb-2 border border-[#1e1e30]"
                        >
                            {/* Token Logo */}
                            <token.Logo />

                            {/* Token Info */}
                            <View className="flex-1 ml-3">
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-white text-base" style={{ fontFamily: "SNPro-SemiBold" }}>
                                        {token.name}
                                    </Text>
                                    {token.verified && <VerifiedBadge />}
                                </View>
                                <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "SNPro-Regular" }}>
                                    {token.balance} {token.symbol}
                                </Text>
                            </View>

                            {/* Token Value */}
                            <View className="items-end">
                                <Text className="text-white text-base" style={{ fontFamily: "SNPro-SemiBold" }}>
                                    {token.usdValue}
                                </Text>
                                <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "SNPro-Regular" }}>
                                    {token.usdSecondary}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom spacer for tab bar */}
                <View className="h-[100px]" />
            </ScrollView>

            {/* Bottom Tab Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#0e0e1a] border-t border-[#1e1e30] pb-[30px] pt-3">
                <View className="flex-row justify-around items-center px-4">
                    {TAB_ITEMS.map((tab) => (
                        <TouchableOpacity
                            key={tab.label}
                            className="items-center gap-1"
                            activeOpacity={0.7}
                        >
                            <tab.Icon active={tab.active} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}
