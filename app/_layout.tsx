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

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        "Lato-Regular": Lato_400Regular,
        "Lato-Bold": Lato_700Bold,
        "SNPro-Regular": require("../assets/fonts/SNPro-Regular.otf"),
        "SNPro-Medium": require("../assets/fonts/SNPro-Medium.otf"),
        "SNPro-SemiBold": require("../assets/fonts/SNPro-SemiBold.otf"),
        "SNPro-Bold": require("../assets/fonts/SNPro-Bold.otf"),
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
        </Stack>
    );
}
