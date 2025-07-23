import {
  
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "@/data/Colors";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/Config/FirebaseConfig";
import Button from "@/components/Button";
import FollowUnfollowBtn from "../FollowUnfollowBtn";

export default function Clubs() {
  useEffect(() => {
    fetchClubs();

  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchClubs();
     
    }, [])
  );

  const [clubs, getClubs] = useState([]);

  const fetchClubs = async () => {
    let data = [];

    let response = await getDocs(collection(firestore, "clubs"));
    response.forEach((doc) => {
      data.push({ id: doc?.id, ...doc.data() });
    });
    data.sort((a,b)=> b.createdAt.toDate() - a.createdAt.toDate())
    getClubs(data)
     console.log("Fetched clubs:", data);
    console.log(data)
  };

return (
  <View style={styles.container}>
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={clubs}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 30 }}
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: "row",
                marginTop: Platform.OS=='ios' ? 0: 45,
                alignItems: "center",
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
              <Text style={styles.title}>Explore The Tribes</Text>
            </View>

            <View
              style={{
                marginTop: 30,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                borderWidth: 2,
                borderCurve: "continuous",
                borderColor: Colors.BORDER,
                padding: 20,
                margin: 10,
                borderRadius: 20,
                borderStyle: "dashed",
              }}
            >
              <Text
                style={{
                  color: Colors.TEXT_PRIMARY,
                  fontSize: 20,
                  fontWeight: "800",
                }}
              >
                Create New Teams / Clubs{" "}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/AddClub")}
              >
                <Ionicons name="add" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#1A1A1A",
              marginBottom: 15,
              borderRadius: 12,
              padding: 10,
              flex: 1,
              marginHorizontal: 5,
              alignItems: "center",
              height: 280,
              marginTop: 20,
              justifyContent: "center",
            }}
          >
            <Image
              source={{ uri: item?.imageUrl }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 99,
                marginBottom: 8,
              }}
            />
            <Text   style={{
    color: Colors.TEXT_PRIMARY,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  }}>{item?.clubName}</Text>
            <Text
              numberOfLines={3}
              style={{
                color: Colors.TEXT_SECONDARY,
                textAlign: "center",
                marginTop: 10,
              }}
            >
              {item?.description}
            </Text>
            <FollowUnfollowBtn clubId={item?.id} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
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
  backIcon: {
    marginRight: 16,
  },
  title: {
    color: Colors.TEXT_PRIMARY,
    fontWeight: "700",
    fontSize: 20,
    // margin:'auto'
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
