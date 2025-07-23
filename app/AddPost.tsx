import {
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/Context/Auth.Context";
import { router } from "expo-router";
import Button from "@/components/Button";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/Config/FirebaseConfig";
import { getAuth } from "firebase/auth";

const width = Dimensions.get("screen").width;

export default function AddPost() {
  const [items, setItems] = useState([
  { label: "Public", value: "Public" },
  { label: "Coding Club", value: "abc123" },
  { label: "Dance Club", value: "xyz456" }
]
);

  const { user } = useAuth();

 useEffect(() => {
  const fetchFollowedClubs = async () => {
    if (!user?.uid) return;

    try {
      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const followedClubs = userDocSnap.data().followedClubs || [];

        const clubItems = await Promise.all(
          followedClubs.map(async (clubId) => {
            const clubDocRef = doc(firestore, "clubs", clubId);
            const clubDocSnap = await getDoc(clubDocRef);

            if (clubDocSnap.exists()) {
              const clubData = clubDocSnap.data();
              return {
                label: clubData.name || "Unnamed Club",
                value: clubId,
              };
            }
            return null;
          })
        );

        const filteredItems = clubItems.filter(Boolean);

        setItems([
          { label: "Public", value: "Public" },
          ...filteredItems,
        ]);
      }
    } catch (error) {
      console.log("Error fetching followed clubs:", error.message);
    }
  };

  fetchFollowedClubs();
}, [user]);


  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Public");
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(false);

  const uploadImageToCloudinary = async (image: string) => {
    let form = new FormData();
    form.append("file", {
      uri: image,
      name: "image.jpg",
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
        console.log(data.secure_url);
        return data.secure_url;
      }
    } catch (error: any) {
      let msg = error.message;
      console.log(msg);
    }
  };

  const uploadPost = async () => {
    if (!post || !value) {
      Alert.alert("Add Post", "Fill All Details ");
      return;
    }
    setLoading(true);
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImageToCloudinary(image);
      if (!imageUrl) {
        Alert.alert("Signup", "Image upload failed");

        return;
      }
    }
    try {
      setLoading(true);
      await addDoc(collection(firestore, "posts"), {
        content: post,
        createdAt: serverTimestamp(),
        postImage: imageUrl,
        visibility: value,
        author: {
          // uid: user?.uid,
          name: user?.name,
          email: user?.email,
          image: user?.image,
        },
      });
      setLoading(false);

      router.back();
    } catch (error: any) {
      let msg = error.message;
      console.log(msg);
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
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="caret-back"
            size={24}
            color="white"
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Drop a Post</Text>
      </SafeAreaView>

      <View style={styles.userInfo}>
        <Image source={{ uri: user?.image }} style={styles.profileImage} />
        <View style={styles.userText}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.timeText}>Now</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Write Your Vibe Here"
          placeholderTextColor={Colors.TEXT_SECONDARY}
          numberOfLines={10}
          multiline
          textAlignVertical="top"
          onChangeText={(e) => setPost(e)}
        />
      </View>
      <View
        style={{
          marginTop: 50,
        }}
      >
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                height: 100,
                width: 150,
                margin: "auto",
              }}
            />
          ) : (
            <Image
              source={require("../assets/images/image.png")}
              style={{
                height: 100,
                width: 150,
                margin: "auto",
              }}
            />
          )}
        </TouchableOpacity>
        <View style={{ zIndex: 1000, marginTop: 30, alignItems: "center" }}>
          {/* <DropDownPicker
            items={items}
            open={open}
            setOpen={setOpen}
            value={value}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select Visibility"
            style={{
              backgroundColor: "#1A1A1A",
              borderColor: Colors.TEXT_SECONDARY,
              width: width * 0.85, // ✅ fixed width for alignment
            }}
            dropDownContainerStyle={{
              backgroundColor: "#1A1A1A",
              borderColor: Colors.TEXT_SECONDARY,
              width: width * 0.85,
            }}
            textStyle={{
              color: Colors.TEXT_PRIMARY,
            }}
            placeholderStyle={{
              color: Colors.TEXT_SECONDARY,
            }}
            arrowIconStyle={{
              tintColor: Colors.TEXT_PRIMARY,
            }}
            tickIconStyle={{
              tintColor: Colors.TEXT_PRIMARY,
            }}
            labelStyle={{
              color: Colors.TEXT_PRIMARY,
            }}
            listItemLabelStyle={{
              color: Colors.TEXT_PRIMARY,
            }}
          /> */}
        </View>
      </View>
      <View>
        <Button title="Add Post" onPress={uploadPost} loading={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
         marginTop: Platform.OS=='ios' ? 15: 35,
  },
  backIcon: {
    marginRight: 16,
  },
  title: {
    color: Colors.TEXT_PRIMARY,
    fontWeight: "700",
    fontSize: 20,
    // margin:'auto'
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 30,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 99,
  },
  userText: {
    marginLeft: 12,
  },
  userName: {
    color: Colors.TEXT_PRIMARY,
    fontWeight: "700",
    fontSize: 18,
  },
  timeText: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 13,
    marginTop: 2,
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  textInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.TEXT_PRIMARY,
    height: 200,
  },
});
