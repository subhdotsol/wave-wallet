import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRightIcon } from "./icons";

// ─── Menu Section ────────────────────────────────────────────────────

export function MenuSection({ children }: { children: React.ReactNode }) {
    return (
        <View className="bg-[#161625] rounded-2xl mb-3 border border-[#1e1e30] overflow-hidden">
            {children}
        </View>
    );
}

// ─── Menu Divider ────────────────────────────────────────────────────

export function MenuDivider({ inset = 16 }: { inset?: number }) {
    return <View className="h-px bg-[#1e1e30]" style={{ marginLeft: inset }} />;
}

// ─── Menu Item ───────────────────────────────────────────────────────

export function MenuItem({
    icon,
    label,
    rightText,
    rightIcon,
    onPress,
    destructive,
}: {
    icon?: React.ReactNode;
    label: string;
    rightText?: string;
    rightIcon?: React.ReactNode;
    onPress?: () => void;
    destructive?: boolean;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center py-4 px-4"
        >
            {icon && <View className="mr-3.5">{icon}</View>}
            <Text
                className="flex-1 text-[15px]"
                style={{
                    fontFamily: "Roboto-Medium",
                    color: destructive ? "#ef4444" : "#fff",
                }}
            >
                {label}
            </Text>
            {rightText && (
                <Text
                    className="text-[#888] text-sm mr-2"
                    style={{ fontFamily: "Roboto-Regular" }}
                >
                    {rightText}
                </Text>
            )}
            {!destructive && (rightIcon || <ChevronRightIcon />)}
        </TouchableOpacity>
    );
}
