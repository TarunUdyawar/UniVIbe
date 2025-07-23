import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "@/Config/FirebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Colors from "@/data/Colors";

export default function RegisteredBtn({ eventId }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const getRegisteredEvents = async () => {
      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);
      const registeredEvents = userSnap.data()?.registeredEvents || [];
      setIsRegistered(registeredEvents.includes(eventId));
    };
    getRegisteredEvents();
  }, [eventId]);

  const toggleRegisterBtn = async () => {
    const userRef = doc(firestore, "users", userId);
    if (isRegistered) {
      await updateDoc(userRef, {
        registeredEvents: arrayRemove(eventId),
      });
      setIsRegistered(false);
    } else {
      await updateDoc(userRef, {
        registeredEvents: arrayUnion(eventId),
      });
      setIsRegistered(true);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.registerBtn,
          { backgroundColor: isRegistered ? Colors.ERROR : Colors.PRIMARY },
        ]}
        onPress={toggleRegisterBtn}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {isRegistered ? "Unregister" : "Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  registerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  registerBtn: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
