import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@/data/Colors";
import { AuthProvider, useAuth } from "@/Context/Auth.Context";

export default function RootLayout() {

  const {user} = useAuth();
  console.log(user)

  return (
  
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarStyle: {
            backgroundColor: Colors.BACKGROUND,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Feather name="home" size={size} color={color} />;
            },
          }}
        />
        <Tabs.Screen name="Events" options={{
            tabBarIcon: ({ color, size }) => {
              return <Feather name="calendar" size={size} color={color} />;
            },
          }}/>
        <Tabs.Screen name="Clubs" options={{
            tabBarIcon: ({ color, size }) => {
              return <Feather name="users" size={size} color={color} />;
            },
          }}/>
        <Tabs.Screen name="Profile" options={{
            tabBarIcon: ({ size, color }) => {
              return <Feather name="user" size={size} color={color} />
            },
          }}/>
      </Tabs>
    
  );
}

const styles = StyleSheet.create({});
