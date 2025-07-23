import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Colors from "../data/Colors";

import Button from "@/components/Button";
import { useRouter } from "expo-router";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";
import { useAuth } from "@/Context/Auth.Context";

const height = Dimensions.get("screen").height;

export default function Index() {
  const { user } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.replace("/(tabs)/Home");
    } else {
      router.replace("/(auth)/SignUp");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image
          entering={FadeInDown.delay(500).springify().damping(10)}
          source={require(".././assets/images/loading.png")}
          style={{
            height: Platform.OS=='android' ?450 : 550,
            width: 450,
          }}
        />
        <Animated.View entering={FadeInRight.delay(500).stiffness(10)}>
          <Text style={styles.info}>Welcome To UniVibe</Text>
          <Text style={styles.info2}>
            Whether it’s a music night, tech talk, or club meetup — UniVibe
            keeps you in the loop, all in one place.
          </Text>
          <Animated.View entering={FadeIn.delay(1000).springify().damping(12)} style={{
            marginTop : Platform.OS =='android' ? -40 :0
          }}>
            <Button title="Get Started" onPress={handleGetStarted} />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.BACKGROUND,
  },
  logoContainer: {
    height: 150,
    borderColor: "red",
  },
  info: {
    textAlign: "center",
    fontSize: 32,
    marginTop: 34,
    fontWeight: "bold",
    color: Colors.TEXT_PRIMARY,
  },
  info2: {
    color: Colors.TEXT_SECONDARY,
    textAlign: "center",
    fontSize: 16,
    margin: Platform.OS=='ios' ? 40: 70,
    fontWeight: "500",
    marginTop: 12,
  },
});
