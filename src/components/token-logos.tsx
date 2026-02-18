import React from "react";
import { View, Text } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";

export function SolanaLogo() {
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

export function EthereumLogo() {
    return (
        <View className="w-11 h-11 rounded-full bg-[#3c3c5a] justify-center items-center">
            <Svg width={20} height={28} viewBox="0 0 20 32" fill="none">
                <Path d="M10 0l10 16.5L10 22 0 16.5 10 0z" fill="#8C8CA1" opacity={0.8} />
                <Path d="M10 24l10-7.5L10 32 0 16.5 10 24z" fill="#C0C0D0" />
            </Svg>
        </View>
    );
}

export function BitcoinLogo() {
    return (
        <View className="w-11 h-11 rounded-full bg-[#f7931a] justify-center items-center">
            <Text className="text-white text-[22px] font-bold">₿</Text>
        </View>
    );
}

export function MonadLogo() {
    return (
        <View className="w-11 h-11 rounded-full bg-[#7c5fe3] justify-center items-center">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={8} stroke="white" strokeWidth={2} />
                <Path d="M8 12a4 4 0 108 0 4 4 0 00-8 0" fill="white" opacity={0.3} />
            </Svg>
        </View>
    );
}
