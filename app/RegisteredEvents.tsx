import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { firestore, auth } from "@/Config/FirebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/data/Colors";

export default function RegisteredEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);
      const eventIds = userSnap.data()?.registeredEvents || [];

      const eventData = [];
      for (const eventId of eventIds) {
        const eventRef = doc(firestore, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          eventData.push({ id: eventSnap.id, ...eventSnap.data() });
        }
      }

      eventData.sort((a, b) => a.eventDate.toDate() - b.eventDate.toDate());

      setEvents(eventData);
      setLoading(false);
    };

    fetchRegisteredEvents();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.eventLocation}>📍 {item.location}</Text>
      <Text style={styles.eventDate}>
        📅 {item?.eventDate?.toDate().toLocaleDateString()} at{" "}
        {item?.eventDate?.toDate().toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="caret-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Registered Events</Text>
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : events.length === 0 ? (
        <Text style={styles.emptyText}>You haven’t registered for any events yet.</Text>
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100, padding: 16 }}
        />
      )}
    </SafeAreaView>
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
    padding: 16,
    gap: 10,
         marginTop: Platform.OS=='ios' ? 0: 35,
  },
  headerText: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: "700",
  },
  loading: {
    color: Colors.TEXT_SECONDARY,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  emptyText: {
    color: Colors.TEXT_SECONDARY,
    textAlign: "center",
    marginTop: 50,
    fontWeight: "700",
    fontSize: 18,
  },
  card: {
    backgroundColor: Colors.SURFACE,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 12,
  },
  eventName: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  eventLocation: {
    color: Colors.TEXT_SECONDARY,
    marginBottom: 2,
  },
  eventDate: {
    color: Colors.TEXT_SECONDARY,
  },
});
