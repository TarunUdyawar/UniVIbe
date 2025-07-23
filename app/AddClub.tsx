import {
    Alert,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/Context/Auth.Context";
import Colors from "@/data/Colors";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { firestore } from "@/Config/FirebaseConfig";

export default function AddClub() {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [clubName, setClubName] = useState();
  const [description,setDescription] = useState()

  const { user } = useAuth();

  const createClub = async()=>{
    if(!clubName || !description || !image){
        Alert.alert("Create Tribe","Fill All Details")
        return
    }
    try {
        setLoading(true)
         let imageUrl = null;
            if (image) {
              imageUrl = await uploadImageToCloudinary(image);
              if (!imageUrl) {
                Alert.alert("Signup", "Image upload failed");
        
                return;
              }
            }
        let clubs = await addDoc(collection(firestore,'clubs'),{
            clubName,
            description,
            imageUrl,
            createdAt : serverTimestamp(),
            // createdBy : user?.uid
        })
        console.log("Club Created Successfully");
        setClubName('')
        setDescription('')
        router.back()
        console.log(clubs)
        setLoading(false)
    } catch (error:any) {
        let msg = error.message;
        console.log(msg)
        setLoading(false)
    }
  }
   const uploadImageToCloudinary = async(image:string)=>{
    let form = new FormData();
    form.append('file',{
      uri : image,
      name: 'image.jpg',
      type : 'image/jpeg'
    }as any)
    form.append('upload_preset','UniVibe');
    try {
      let response = await fetch( "https://api.cloudinary.com/v1_1/dlykbkq5h/image/upload",{
        method: "POST",
        body: form
      })
      if(response){
        let data = await response.json()
        console.log(data.secure_url)
        return data.secure_url
      }
    }  catch (error: any) {
      let msg = error.message;
      console.log(msg);
    }
 }
  const pickImage = async () => {
   
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
        <Text style={styles.title}>Add a New Tribe</Text>
      </SafeAreaView>

      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={{
              height: 100,
              width: 150,
              margin: "auto",
                  marginTop: 30,
            }}
          />
        ) : (
          <Image
            source={require("../assets/images/image.png")}
            style={{
              height: 100,
              width: 150,
              margin: "auto",
              marginTop: 30,
            }}
          />
        )}
      </TouchableOpacity>

      <View style={styles.inputContainer}>
      <TextInput
          style={styles.textClub}
          placeholder="Enter Tribe Name"
          placeholderTextColor={Colors.TEXT_SECONDARY}
          numberOfLines={1}
        //   multiline
          textAlignVertical="top"
            onChangeText={(e) => setClubName(e)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Tribe Description"
          placeholderTextColor={Colors.TEXT_SECONDARY}
          numberOfLines={10}
          multiline
          textAlignVertical="top"
            onChangeText={(e) => setDescription(e)}
        />
      </View>
      <View
        style={{
          marginTop: 25,
        }}
      ></View>
      <View>
        <Button title="Add Tribe" loading={loading} onPress={createClub}/>
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
    marginTop: 20
  },
  textClub: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.TEXT_PRIMARY,
    height: 50,
    marginTop: 10
  },
});
