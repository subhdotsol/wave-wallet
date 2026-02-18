import "../src/polyfills"; // ← MUST be the very first import (Buffer, crypto, URL polyfills)
import "../global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import {
    Lato_400Regular,
    Lato_700Bold,
} from "@expo-google-fonts/lato";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from "@expo-google-fonts/roboto";

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

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

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
