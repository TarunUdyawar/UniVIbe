import { AuthProvider } from "@/Context/Auth.Context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <AuthProvider>
      <Stack screenOptions={{headerShown: false}}/>
      </AuthProvider>
)
  
}
