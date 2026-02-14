import "./global.css"
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} className="flex-1 items-center justify-center bg-white">
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3b82f6' }} className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
      </View>
    </SafeAreaView>
  );
}