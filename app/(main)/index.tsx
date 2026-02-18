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
    { name: "Solana", symbol: "SOL", balance: "0.00498", usdValue: "$0.42", change: "-$0.01", Logo: SolanaLogo, verified: true },
    { name: "Ethereum", symbol: "ETH", balance: "0", usdValue: "$0.00", change: "$0.00", Logo: EthereumLogo, verified: true },
    { name: "Bitcoin", symbol: "BTC", balance: "0", usdValue: "$0.00", change: "$0.00", Logo: BitcoinLogo, verified: true },
    { name: "Monad", symbol: "MON", balance: "0", usdValue: "$0.00", change: "$0.00", Logo: MonadLogo, verified: true },
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
    const [balanceVisible, setBalanceVisible] = useState(true);
    const router = useRouter();
    const activeAccount = walletManager.getActiveAccount();

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-3 pb-2">
                <TouchableOpacity
                    onPress={() => router.push("/(main)/profile-drawer")}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-3"
                >
                    {/* Avatar */}
                    <View className="w-[42px] h-[42px] rounded-full bg-[#d4e157] justify-center items-center">
                        <Text className="text-[20px]">🌊</Text>
                    </View>
                    {/* Name */}
                    <View>
                        <Text className="text-[#999] text-[13px]" style={{ fontFamily: "Roboto-Regular" }}>
                            {activeAccount?.shortAddress ?? "No wallet"}
                        </Text>
                        <Text className="text-white text-[17px]" style={{ fontFamily: "Roboto-Bold" }}>
                            {activeAccount?.name ?? "Create Wallet"}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View className="flex-row items-center gap-5">
                    <TouchableOpacity hitSlop={8}><ClockIcon size={26} /></TouchableOpacity>
                    <TouchableOpacity hitSlop={8}><SearchIcon size={26} /></TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Balance Section */}
                <TouchableOpacity
                    className="px-5 pt-6 pb-2"
                    activeOpacity={0.7}
                    onPress={() => setBalanceVisible(!balanceVisible)}
                >
                    <Text
                        className="text-white"
                        style={{
                            fontFamily: "Roboto-Bold",
                            fontSize: 48,
                            lineHeight: 56,
                        }}
                    >
                        {balanceVisible ? "$0.42" : "••••"}
                    </Text>
                    <View className="flex-row items-center gap-2 mt-1">
                        <Text className="text-[#ef4444] text-[15px]" style={{ fontFamily: "Roboto-Medium" }}>
                            {balanceVisible ? "-$0.01" : ""}
                        </Text>
                        {balanceVisible && (
                            <View className="bg-[#ef4444]/20 rounded-md px-2 py-0.5">
                                <Text className="text-[#ef4444] text-[13px]" style={{ fontFamily: "Roboto-Medium" }}>
                                    -0.18%
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Action Buttons */}
                <View className="flex-row justify-between px-5 mt-6 mb-8">
                    {ACTION_BUTTONS.map((btn) => (
                        <TouchableOpacity
                            key={btn.label}
                            activeOpacity={0.7}
                            className="flex-1 mx-1.5 rounded-2xl bg-[#1c1c1e] justify-center items-center py-4"
                        >
                            <btn.Icon size={26} />
                            <Text className="text-gray-300 text-[13px] mt-2" style={{ fontFamily: "Roboto-Medium" }}>
                                {btn.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tokens Section Header */}
                <TouchableOpacity className="flex-row items-center px-5 mb-5">
                    <Text className="text-white text-[22px] mr-1" style={{ fontFamily: "Roboto-Bold" }}>Tokens</Text>
                    <ChevronRightIcon size={20} color="#fff" />
                </TouchableOpacity>

                {/* Token List */}
                <View className="px-4">
                    {TOKENS.map((token, index) => (
                        <TouchableOpacity
                            key={`${token.symbol}-${index}`}
                            activeOpacity={0.7}
                            className="flex-row items-center bg-[#1c1c1e] rounded-2xl px-4 py-4 mb-2.5"
                        >
                            {/* Token Logo */}
                            <token.Logo />

                            {/* Token Info */}
                            <View className="flex-1 ml-3.5">
                                <View className="flex-row items-center gap-1.5">
                                    <Text className="text-white text-[17px]" style={{ fontFamily: "Roboto-Bold" }}>
                                        {token.name}
                                    </Text>
                                    {token.verified && <VerifiedBadge size={18} />}
                                </View>
                                <Text className="text-[#888] text-[14px] mt-1" style={{ fontFamily: "Roboto-Regular" }}>
                                    {token.balance} {token.symbol}
                                </Text>
                            </View>

                            {/* Token Value */}
                            <View className="items-end">
                                <Text className="text-white text-[17px]" style={{ fontFamily: "Roboto-Bold" }}>
                                    {token.usdValue}
                                </Text>
                                <Text
                                    className="text-[14px] mt-1"
                                    style={{
                                        fontFamily: "Roboto-Regular",
                                        color: token.change.startsWith("-") ? "#ef4444" : "#888",
                                    }}
                                >
                                    {token.change}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom spacer for tab bar */}
                <View className="h-[100px]" />
            </ScrollView>

            {/* Bottom Tab Bar */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#121212] border-t border-[#2a2a2a] pb-[30px] pt-3">
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
