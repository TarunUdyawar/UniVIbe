import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeInDown } from "react-native-reanimated";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Config/FirebaseConfig";
import axios from "axios";
import { useAuth } from "@/Context/Auth.Context";

export default function SignUp() {
  const router = useRouter();

  const [image, setImage] = useState<string>();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const uploadToCloudinary = async (image: string) => {
    let form = new FormData();
    form.append("file", {
      uri: image,
      name: "profile.jpg",
      type: "image/jpeg",
    } as any);
    form.append("upload_preset", "UniVibe");

    try {
      let response = await fetch(
        "https://api.cloudinary.com/v1_1/dlykbkq5h/image/upload",
        {
          method: "POST",
          body: form,
        }
      );
      if (response) {
        let data = await response.json();
        console.log(data?.secure_url);
        return data?.secure_url;
      }
    } catch (error: any) {
      let msg = error.message;
      console.log(msg);
    }
  };
  const handleSignUp = async () => {
    try {
      if (!email || !password || !name) {
        Alert.alert("Signup", "Enter all Fields Properly");
        return;
      }
      setLoading(true);
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadToCloudinary(image);
        if (!imageUrl) {
          Alert.alert("Signup", "Image upload failed");
          setLoading(false);
          return;
        }
      }

      let response = await signup(name, email, password, imageUrl);
      console.log(response);

      setLoading(false);
    } catch (error: any) {
      let msg = error.message;
      console.log(msg);
      Alert.alert("Signup", msg);
    }
    setLoading(false);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Ionicons
          name="caret-back-outline"
          size={24}
          color="white"
          onPress={() => router.push('/')}
        />
      </View>

      <Text style={styles.Text}>Start your vibe. Join the campus pulse.</Text>
      <View
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Pressable onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                height: 100,
                width: 100,
                marginTop: 40,
                borderRadius: 50,
              }}
            />
          ) : (
            <Image
              source={require("../../assets/images/profile.png")}
              style={{
                height: 100,
                width: 100,
                marginTop: 40,
                borderRadius: 50,
              }}
            />
          )}
        </Pressable>
        <AntDesign
          name="camera"
          size={24}
          color={Colors.PRIMARY}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        />
      </View>

      <Animated.View entering={FadeInDown.springify()} style={styles.textField}>
        <InputField
          label={"Enter Your Name"}
          onChangeText={(e) => setName(e)}
        />
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
        <Button title="Sign Up" onPress={handleSignUp} loading={loading} />
      </Animated.View>
      <View
        style={{
          position: "relative",
          bottom: 80,
        }}
      >
        <Pressable onPress={() => router.push("/(auth)/SignIn")}>
          <Animated.Text
            entering={FadeInDown.delay(300).damping(12)}
            style={styles.footer}
          >
            Already Have an Account ?{"  "}
            <Text
              style={{
                color: Colors.PRIMARY,
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Sign In
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
  Text: {
    color: Colors.TEXT_PRIMARY,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    margin: 10,
  },
  nav: {
    marginTop: Platform.OS=='ios' ? 80 : 50,
    marginLeft: 20,
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
