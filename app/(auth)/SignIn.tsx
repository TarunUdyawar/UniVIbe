import { Alert, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import Colors from "../../data/Colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { useAuth } from "@/Context/Auth.Context";

export default function SignIn() {
  const router = useRouter();
  const { signin } = useAuth();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async() => {
     try {
    if (!email || !password) {
      Alert.alert("SignIn", "Enter all Fields Properly");
      return;
    }
    setLoading(true);
   
      let response = await signin(email, password);
      console.log(response);
      setLoading(false);
    } catch (error: any) {
      let msg = error.message;
      console.log(msg);

      Alert.alert("Signin", msg);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Ionicons
          name="caret-back-outline"
          size={24}
          color="white"
          onPress={()=>router.push('/')}
        />
      </View>
      <Text style={styles.Text}>Welcome back. Let’s catch the vibe.</Text>
      <View
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/images/signup.png")}
          style={{
            height: Platform.OS=='android' ?  200: 240,
            width: Platform.OS=='android' ?  200: 240,
          }}
        />
      </View>
      <Animated.View entering={FadeInDown.springify()} style={styles.textField}>
        <InputField
          label={"Enter Your Email"}
          onChangeText={(e) => setEmail(e)}
        />
        <InputField
          label={"Enter Your Password"}
          onChangeText={(e) => setPassword(e)}
          password
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.springify()}>
        <Button title="Sign Up" onPress={handleSignIn} loading={loading} />
      </Animated.View>
      <View
        style={{
          position: "relative",
          bottom: 80,
        }}
      >
        <Pressable onPress={() => router.push("/(auth)/SignUp")}>
          <Animated.Text
            entering={FadeInDown.delay(300).damping(12)}
            style={styles.footer}
          >
            Don’t Have an Account ?{"  "}
            <Text
              style={{
                color: Colors.PRIMARY,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Sign Up
            </Text>
          </Animated.Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.BACKGROUND,
  },
  nav: {
   marginTop: Platform.OS=='ios' ? 80 : 50,
    marginLeft: 20,
  },
  Text: {
    color: Colors.TEXT_PRIMARY,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    margin: 20,
  },
  textField: {
    // marginTop: 25,
  },
  footer: {
    textAlign: "center",
    color: Colors.TEXT_PRIMARY,
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});
