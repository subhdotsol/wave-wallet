import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

// ─── Color defaults ──────────────────────────────────────────────────
const ACCENT = "#3b82f6";
const MUTED = "#666";

// ─── Navigation & Chrome ─────────────────────────────────────────────

export function BackArrowIcon({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
    return <Ionicons name="chevron-back" size={size} color={color} />;
}

export function CloseIcon({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
    return <MaterialIcons name="close" size={size} color={color} />;
}

export function ChevronRightIcon({ size = 18, color = MUTED }: { size?: number; color?: string }) {
    return <MaterialIcons name="chevron-right" size={size} color={color} />;
}

export function ChevronDownIcon({ size = 20, color = "#fff" }: { size?: number; color?: string }) {
    return <MaterialIcons name="keyboard-arrow-down" size={size} color={color} />;
}

// ─── Tab Bar Icons ───────────────────────────────────────────────────

export function HomeTabIcon({ active = false }: { active?: boolean }) {
    return <MaterialIcons name="home" size={26} color={active ? ACCENT : MUTED} />;
}

export function CardTabIcon({ active = false }: { active?: boolean }) {
    return <MaterialCommunityIcons name="credit-card-outline" size={26} color={active ? ACCENT : MUTED} />;
}

export function SwapTabIcon({ active = false }: { active?: boolean }) {
    return <MaterialCommunityIcons name="swap-horizontal" size={26} color={active ? ACCENT : MUTED} />;
}

export function MessageTabIcon({ active = false }: { active?: boolean }) {
    return <MaterialCommunityIcons name="message-outline" size={26} color={active ? ACCENT : MUTED} />;
}

export function SearchTabIcon({ active = false }: { active?: boolean }) {
    return <Feather name="search" size={26} color={active ? ACCENT : MUTED} />;
}

// ─── Action Buttons ──────────────────────────────────────────────────

export function SendIcon({ size = 28, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="send" size={size} color={color} />;
}

export function SwapIcon({ size = 28, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="swap-horizontal" size={size} color={color} />;
}

export function QRIcon({ size = 28, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="qrcode" size={size} color={color} />;
}

export function DollarIcon({ size = 28, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="dollar-sign" size={size} color={color} />;
}

// ─── Header / Utility ────────────────────────────────────────────────

export function ClockIcon({ size = 24, color = "#aaa" }: { size?: number; color?: string }) {
    return <Feather name="clock" size={size} color={color} />;
}

export function SearchIcon({ size = 24, color = "#aaa" }: { size?: number; color?: string }) {
    return <Feather name="search" size={size} color={color} />;
}

export function ProfileIcon({ size = 28, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="user" size={size} color={color} />;
}

export function PencilIcon({ size = 16, color = "#888" }: { size?: number; color?: string }) {
    return <Feather name="edit-2" size={size} color={color} />;
}

export function PlusIcon({ size = 20, color = "#fff" }: { size?: number; color?: string }) {
    return <Feather name="plus" size={size} color={color} />;
}

export function VerifiedBadge({ size = 16, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialIcons name="verified" size={size} color={color} />;
}

export function NotificationsIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialIcons name="notifications-none" size={size} color={color} />;
}

// ─── Settings Menu Icons ─────────────────────────────────────────────

export function ManageAccountsIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialIcons name="manage-accounts" size={size} color={color} />;
}

export function PreferencesIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="sliders" size={size} color={color} />;
}

export function SecurityIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="shield-lock-outline" size={size} color={color} />;
}

export function GlobeIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="globe" size={size} color={color} />;
}

export function AddressBookIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="account-box-outline" size={size} color={color} />;
}

export function ConnectedAppsIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="connection" size={size} color={color} />;
}

export function DevSettingsIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="code" size={size} color={color} />;
}

export function HelpIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="help-circle" size={size} color={color} />;
}

export function HeartIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="heart" size={size} color={color} />;
}

export function ShareIcon({ size = 18, color = MUTED }: { size?: number; color?: string }) {
    return <Feather name="share" size={size} color={color} />;
}

export function AboutIcon({ size = 22, color = ACCENT }: { size?: number; color?: string }) {
    return <Feather name="info" size={size} color={color} />;
}

// ─── Secret / Security Pages ─────────────────────────────────────────

export function ShieldWarningIcon({ size = 48, color = "#f59e0b" }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="shield-alert" size={size} color={color} />;
}

export function KeyIcon({ size = 20, color = "#f59e0b" }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="key" size={size} color={color} />;
}

export function NoEyeIcon({ size = 20, color = "#f59e0b" }: { size?: number; color?: string }) {
    return <Feather name="eye-off" size={size} color={color} />;
}

export function StopIcon({ size = 20, color = "#f59e0b" }: { size?: number; color?: string }) {
    return <Feather name="slash" size={size} color={color} />;
}

export function CopyIcon({ size = 20, color = "#fff" }: { size?: number; color?: string }) {
    return <Feather name="copy" size={size} color={color} />;
}

export function CheckboxEmptyIcon({ size = 24, color = "#555" }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="checkbox-blank-outline" size={size} color={color} />;
}

export function CheckboxCheckedIcon({ size = 24, color = ACCENT }: { size?: number; color?: string }) {
    return <MaterialCommunityIcons name="checkbox-marked" size={size} color={color} />;
}
