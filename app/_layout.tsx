import "../src/polyfills"; // ← MUST be the very first import (Buffer, crypto, URL polyfills)
import "../global.css";
import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import {
    Lato_400Regular,
    Lato_700Bold,
} from "@expo-google-fonts/lato";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

SplashScreen.preventAutoHideAsync();
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { useWalletStore } from "../src/store/wallet-store";

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "Lato-Regular": Lato_400Regular,
        "Lato-Bold": Lato_700Bold,
        "SNPro-Regular": require("../assets/fonts/SNPro-Regular.otf"),
        "SNPro-Medium": require("../assets/fonts/SNPro-Medium.otf"),
        "SNPro-SemiBold": require("../assets/fonts/SNPro-SemiBold.otf"),
        "SNPro-Bold": require("../assets/fonts/SNPro-Bold.otf"),
        "Roboto-Regular": Roboto_400Regular,
        "Roboto-Medium": Roboto_500Medium,
        "Roboto-Bold": Roboto_700Bold,
    });

    // ── Wallet hydration ─────────────────────────────────────────────
    const isHydrated = useWalletStore((s) => s.isHydrated);
    const accounts = useWalletStore((s) => s.accounts);
    const hydrate = useWalletStore((s) => s.hydrate);

    useEffect(() => {
        hydrate();
    }, []);

    // ── Hide splash once everything is ready ─────────────────────────
    const isReady = fontsLoaded && isHydrated;

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);

    // ── Route guard: only on initial hydration ───────────────────────
    const router = useRouter();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (!isReady || hasRedirected.current) return;
        hasRedirected.current = true;

        const hasWallet = accounts.length > 0;

        if (hasWallet) {
            router.replace("/(main)");
        }
        // If no wallet, we're already on (onboarding) via initialRouteName
    }, [isReady]);

    if (!isReady) return null;

    return (
        <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(onboarding)"
        >
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(main)" />
            <Stack.Screen name="(wallet)" />
        </Stack>
    );
}
