import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Colors from "@/data/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/Button";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { firestore } from "@/Config/FirebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Events() {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (_: any, selectedTime?: Date) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setDate(currentTime);
  };

  const createVibe = async () => {
    if (!eventName || !location  || !image) {
      Alert.alert("Post a Vibe", "Fill All Details");
      return;
    }
    try {
      setLoading(true);
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
        if (!imageUrl) {
          Alert.alert("Signup", "Image upload failed");

          return;
        }
      }
      let events = addDoc(collection(firestore, "events"), {
        eventName,
        location,
        description,
        createdAt: serverTimestamp(),
        image: imageUrl,
        eventDate: date,
      });
      console.log(events);
      setLoading(false);
      router.back();
    } catch (error: any) {
      console.log(error.message);
      setLoading(false);
    }
  };

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
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="caret-back"
              size={24}
              color={Colors.TEXT_PRIMARY}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Post A Vibe</Text>
        </View>
        <View
          style={{
            marginTop: 30,
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
                  marginTop: 10,
                  marginBottom: 20,
                }}
              />
            ) : (
              <Image
                source={require("../assets/images/image.png")}
                style={{
                  height: 100,
                  width: 150,
                  margin: "auto",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              />
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Enter event name"
            placeholderTextColor={Colors.TEXT_SECONDARY}
            onChangeText={(e) => setEventName(e)}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor={Colors.TEXT_SECONDARY}
            onChangeText={(e) => setLocation(e)}
          />

       

          <Text style={styles.label}>Date & Time</Text>
          <View style={styles.datetimeRow}>
            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={Colors.TEXT_PRIMARY}
              />
              <Text style={styles.datetimeText}>{date.toDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color={Colors.TEXT_PRIMARY}
              />
              <Text style={styles.datetimeText}>
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              textColor={Colors.TEXT_PRIMARY}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          <Button title="Add Event" loading={loading} onPress={createVibe}>
            <Text style={styles.buttonText}>Add Event</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "flex-start",
  },
  label: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 20,
  },
  input: {
    backgroundColor: Colors.SURFACE,
    borderRadius: 10,
    padding: 12,
    color: Colors.TEXT_PRIMARY,
    marginBottom: 20,
  },

  dateText: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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
  datetimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },

  datetimeButton: {
    flex: 1,
    backgroundColor: Colors.SURFACE,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  datetimeText: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 15,
  },
});
