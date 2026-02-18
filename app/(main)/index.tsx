import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { walletManager } from "../../src/lib/wallet";

// ─── Shared Components ──────────────────────────────────────────────
import {
    ClockIcon,
    SearchIcon,
    SendIcon,
    SwapIcon,
    QRIcon,
    DollarIcon,
    HomeTabIcon,
    CardTabIcon,
    SwapTabIcon,
    MessageTabIcon,
    SearchTabIcon,
    VerifiedBadge,
    ChevronRightIcon,
} from "../../src/components/icons";

import {
    SolanaLogo,
    EthereumLogo,
    BitcoinLogo,
    MonadLogo,
} from "../../src/components/token-logos";

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
                        <Text className="text-gray-400 text-xs" style={{ fontFamily: "Roboto-Regular" }}>
                            {activeAccount?.shortAddress ?? "No wallet"}
                        </Text>
                        <Text className="text-white text-base" style={{ fontFamily: "Roboto-Bold" }}>
                            {activeAccount?.name ?? "Create Wallet"}
                        </Text>
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
                        <Text className="text-white text-4xl" style={{ fontFamily: "Roboto-Bold" }}>
                            {balanceVisible ? "$0.00" : "——"}
                        </Text>
                        <Text className="text-gray-500 text-lg mt-1" style={{ fontFamily: "Roboto-Regular" }}>
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
                            <Text className="text-gray-300 text-xs mt-1.5" style={{ fontFamily: "Roboto-Medium" }}>
                                {btn.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tokens Section Header */}
                <TouchableOpacity className="flex-row items-center px-5 mb-4">
                    <Text className="text-white text-xl mr-1" style={{ fontFamily: "Roboto-Bold" }}>Tokens</Text>
                    <ChevronRightIcon size={16} color="#fff" />
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
                                    <Text className="text-white text-base" style={{ fontFamily: "Roboto-Bold" }}>
                                        {token.name}
                                    </Text>
                                    {token.verified && <VerifiedBadge />}
                                </View>
                                <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "Roboto-Regular" }}>
                                    {token.balance} {token.symbol}
                                </Text>
                            </View>

                            {/* Token Value */}
                            <View className="items-end">
                                <Text className="text-white text-base" style={{ fontFamily: "Roboto-Bold" }}>
                                    {token.usdValue}
                                </Text>
                                <Text className="text-[#888] text-[13px] mt-0.5" style={{ fontFamily: "Roboto-Regular" }}>
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
