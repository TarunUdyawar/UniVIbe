import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/data/Colors";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "@/components/Button";

import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "@/Context/Auth.Context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const profileOptions = [
  {
  name : 'Add Post',
  icon :<FontAwesome name="edit" size={35} color="white" />,
  route : 'AddPost'
  },
  {
  name : 'My Events',
  icon :<MaterialIcons name="event" size={35} color="white" />,
  route : 'RegisteredEvents'
  },
  {
  name : 'Privacy Policy',
  icon : <MaterialIcons name="privacy-tip" size={35} color="white" />,
  route : 'PrivacyPolicy'
  },
]

export default function Profile() {
  const auth = getAuth();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)/SignIn");
    } catch (error: any) {
      let msg = error.message;
      console.log(msg);
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            marginTop:Platform.OS=='android' ? 40:0
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="caret-back"
              size={24}
              color="white"
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={{
          display:'flex',
          alignItems:'center',
          marginTop: 20
        }}>
          <Image
            source={{ uri: user?.image }}
            style={{
              height: 150,
              width: 150,
              borderRadius: 99,
            }}
          />
          <View style={{
            marginTop: 20,
            
          }}>
          <Text style={{
            color:Colors.TEXT_PRIMARY,
            textAlign:'center',
            fontSize: 25,
            fontWeight: '700'
          }}>{user?.name}</Text>
          <Text style={{
            color:Colors.TEXT_SECONDARY,
            textAlign:'center',
            fontSize: 15,
            fontWeight: '700'
          }}>{user?.email}</Text>
          </View>
        </View>
   <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
  {profileOptions.map((item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => router.push(item.route)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.SURFACE,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginRight: 15 }}>{item.icon}</View>
        <Text style={{ color: Colors.TEXT_PRIMARY, fontSize: 18, fontWeight: '600' }}>
          {item.name}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.TEXT_PRIMARY} />
    </TouchableOpacity>
  ))}
</View>


        <View>

          <Button title="Logout" onPress={handleLogout} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    // alignItems:'center'
  },
  title: {
    color: Colors.TEXT_PRIMARY,
    fontWeight: "700",
    fontSize: 20,
    // margin:'auto'
  },
  backIcon: {
    marginRight: 16,
  },
});
