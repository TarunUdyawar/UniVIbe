import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/data/Colors";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, firestore } from "@/Config/FirebaseConfig";
import { useAuth } from "@/Context/Auth.Context";
import RegisteredBtn from "../RegisteredBtn";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const [selected, setSelected] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const fetchEvents = async () => {
    setRefreshing(true);
    let data = [];
    let response = await getDocs(collection(firestore, "events"));
    response.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    data.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    // console.log(data)
    setEvents(data);
    setRefreshing(false);
  };

  const renderEvent = ({ item }) => (
    <View style={styles.card}>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={{ color: Colors.TEXT_SECONDARY }}>{user?.name}</Text>
        <Text style={styles.eventLocation}>📍 {item.location}</Text>
        <Text style={styles.eventDate}>
          📅 {item?.eventDate?.toDate().toLocaleDateString()} at{" "}
          {item?.eventDate?.toDate().toLocaleTimeString()}
        </Text>
        <View style={styles.iconRow}>
          <RegisteredBtn eventId={item?.id} />

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              Share.share({
                message: `Check out this event: ${item.eventName} at ${
                  item.location
                } on ${item?.eventDate?.toDate().toLocaleString()}`,
              });
            }}
          >
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          marginTop: Platform.OS == "ios" ? 0 : 45,
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
        <Text style={styles.title}>The Vibes</Text>
      </View>

      <View style={styles.createBanner}>
        <Text style={styles.bannerText}>Create New Vibes</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/AddEvent")}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.toggleRow}>
        <Pressable onPress={() => setSelected(1)}>
          <Text
            style={[
              styles.toggleText,
              selected == 1 && styles.selectedToggle,
            ]}
          >
            Upcoming
          </Text>
        </Pressable>
        <Pressable onPress={() => setSelected(2)}>
          <Text
            style={[
              styles.toggleText,
              selected == 2 && styles.selectedToggle,
            ]}
          >
            Registered
          </Text>
        </Pressable>
      </View> */}

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={renderEvent}
        refreshing={refreshing}
        onRefresh={fetchEvents}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No events to show.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  backIcon: {
    marginRight: 16,
  },
  title: {
    color: Colors.TEXT_PRIMARY,
    fontWeight: "700",
    fontSize: 20,
  },
  createBanner: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.BORDER,
    padding: 20,
    margin: 10,
    borderRadius: 20,
    borderStyle: "dashed",
  },
  bannerText: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: "800",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 20,
    marginLeft: 15,
  },
  toggleText: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 18,
    fontWeight: "600",
  },
  selectedToggle: {
    backgroundColor: Colors.PRIMARY,
    padding: 5,
    borderRadius: 10,
  },
  card: {
    backgroundColor: Colors.SURFACE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  eventName: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginTop: 10,
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4E4E4E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  eventLocation: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 4,
  },
  eventDate: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 8,
  },
  eventImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  registerBtn: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  shareBtn: {
    flex: 1,
    backgroundColor: "#4E4E4E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    color: Colors.TEXT_SECONDARY,
    textAlign: "center",
    marginTop: 50,
    fontWeight: "700",
    fontSize: 25,
  },
});
