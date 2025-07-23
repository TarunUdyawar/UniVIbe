import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Colors from "@/data/Colors";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PrivacyPolicy() {
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
          <Text style={styles.title}>Privacy Policy</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.text}>
            Welcome to UniVibe. We value your privacy and are committed to protecting your personal information.
            {"\n\n"}
            <Text style={styles.heading}>1. Information We Collect</Text>
            {"\n"}We collect your name, email address, profile image, and any content you upload such as events or posts.
            {"\n\n"}
            <Text style={styles.heading}>2. How We Use Your Information</Text>
            {"\n"}We use your data to improve app functionality, personalize your experience, and notify you about updates.
            {"\n\n"}
            <Text style={styles.heading}>3. Sharing & Disclosure</Text>
            {"\n"}We do not sell or share your personal data with third parties unless required by law.
            {"\n\n"}
            <Text style={styles.heading}>4. Security</Text>
            {"\n"}We implement security measures to protect your data from unauthorized access.
            {"\n\n"}
            <Text style={styles.heading}>5. Changes</Text>
            {"\n"}We may update this policy occasionally. Continued use of the app after changes means you accept the updates.
            {"\n\n"}
            If you have questions, contact us at support@univibe.app.
          </Text>
        </ScrollView>
      </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: 10,
         marginTop: Platform.OS=='ios' ? 0: 35,
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  text: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 16,
    lineHeight: 24,
  },
  heading: {
    color: Colors.TEXT_PRIMARY,
    fontWeight: "700",
    fontSize: 17,
  },
});
