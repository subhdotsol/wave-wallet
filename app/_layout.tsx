import "../global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
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
