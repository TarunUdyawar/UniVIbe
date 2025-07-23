import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Colors from "@/data/Colors";
import { useAuth } from "@/Context/Auth.Context";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, useFocusEffect } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/Config/FirebaseConfig";
import moment from "moment";

const width = Dimensions.get("screen").width;

const Cards = [
  {
    name: "Vibe Schedule",
    image: <Entypo name="calendar" size={50} color="white" />,
    route: "/(tabs)/Events",
  },
  {
    name: "The Vibe Wall",
    image: (
      <MaterialCommunityIcons name="post-outline" size={50} color="white" />
    ),
    route: "",
  },
  {
    name: "The Vibe Tribes",
    image: <Entypo name="sports-club" size={50} color="white" />,
    route: "(tabs)/Clubs",
  },
  {
    name: "Spark a Vibe",
    image: <FontAwesome name="edit" size={50} color="white" />,
    route: "/AddPost",
  },
];

export default function Home() {
  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const [selected, setSelected] = useState(0);
  const [posts, getPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    let posts = [];
    let response = await getDocs(collection(firestore, "posts"));
    response.forEach((doc) => {
      posts.push({ id: doc?.id, ...doc.data() });
    });
    posts.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    // console.log(posts);
    getPosts(posts);
    setRefreshing(false);
  };

  const { user } = useAuth();
  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={fetchData}
      style={{
        backgroundColor: Colors.BACKGROUND,
      }}
      ListHeaderComponent={
        <View style={styles.container}>
          <SafeAreaView>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                width: "100%",
                margin: "auto",
                justifyContent:'center',
                marginTop: Platform.OS== "android" ? 45 : 0
              }}
            >
              <View>
                <Image
                  source={{ uri: user?.image }}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 99,
                  }}
                />
              </View>
              <View
                style={{
                  // marginTop: 30,
                  margin:'auto',
                  
                }}
              >
                <Text
                // numberOfLines={1}
                  style={{
                    color: Colors.TEXT_PRIMARY,
                    fontSize: 25,
                    textAlign: 'left',
                    fontWeight: "600",
                  maxWidth: width - 100,
                  flexWrap:'wrap'
                  }}
                >
                  Hey, {user?.name} let’s vibe!
                </Text>
                {Platform.OS == 'ios'?    <Text style={{ color: Colors.TEXT_SECONDARY,textAlign: "center" }}>UniVibe</Text> :
                    <Text style={{ color: Colors.TEXT_SECONDARY }}>UniVibe</Text> }
            
              </View>
            </View>
            <View
              style={{
                display: "flex",
                // alignItems: "center",
                // marginTop: 10,
              }}
            >
              <FlatList
                data={Cards}
                numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => router.push(item.route)}
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        width: Platform.OS=='android' ? 163: 180,
                        height: 100,
                        borderWidth: 1,
                        borderCurve: "continuous",
                        borderColor: Colors.PRIMARY,
                        borderRadius: 20,
                        margin: "auto",
                        marginTop: 20,
                        // gap: 20,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: Colors.TEXT_PRIMARY,
                            fontWeight: "800",
                            fontSize: 14,
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <View>
                        <Text> {item.image} </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 20,
                  marginTop: 20,
                  marginLeft: 15,
                  alignItems:'center',
                  justifyContent:'center'
                }}
              >
              
                  <Text
                    style={{
                      color: Colors.TEXT_PRIMARY,
                      fontSize: 18,
                      fontWeight: "600",
                      textAlign:'center',
                  
                    }}
                  >
                    Latest Posts
                  </Text>
                
                {/* <Pressable onPress={() => setSelected(2)}>
                  <Text
                    style={{
                      color: Colors.TEXT_PRIMARY,
                      fontSize: 18,
                      fontWeight: "600",
                      backgroundColor:
                        selected == 2 ? Colors.PRIMARY : Colors.BACKGROUND,
                      padding: selected == 2 ? 5 : 0,
                      borderRadius: selected == 2 ? 10 : 0,
                    }}
                  >
                    Trending
                  </Text>
                </Pressable> */}
              </View>
            </View>
            <View>
              {posts.length == 0 ? (
                <Text
                  style={{
                    color: Colors.ERROR,
                    textAlign: "center",
                    marginTop: 30,
                    fontWeight: "800",
                    fontSize: 20,
                  }}
                >
                  No Posts Found
                </Text>
              ) : (
                <FlatList
                  data={posts}
                  renderItem={({ item }) => {
                    return (
                      <View
                        style={{
                          backgroundColor: "#1A1A1A",
                          height: 400,
                          margin: 25,
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 20,
                            width: "100%",
                            margin: 20,
                          }}
                        >
                          <View>
                            {item?.author?.image ? (
                              <Image
                                source={{ uri: item?.author?.image }}
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: 99,
                                }}
                              />
                            ) : (
                              <Image
                                source={require("../../assets/images/profile.png")}
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: 99,
                                }}
                              />
                            )}
                          </View>
                          <View
                            style={{
                              marginTop: 10,
                            }}
                          >
                            <Text
                              style={{
                                color: Colors.TEXT_PRIMARY,
                                fontSize: 15,

                                fontWeight: "600",
                              }}
                            >
                              {item.author?.name}
                            </Text>
                            <Text style={{ color: Colors.TEXT_SECONDARY }}>
                              {moment(item?.createdAt.toDate()).fromNow()}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text
                            style={{
                              color: Colors.TEXT_PRIMARY,
                              marginLeft: 25,
                              fontSize: 20,
                              fontWeight: "500",
                            }}
                          >
                            {item?.content}
                          </Text>
                        </View>
                        <View>
                          <Image
                            source={{ uri: item?.postImage }}
                            style={{
                              height: 200,
                              resizeMode: "contain",
                              marginTop: 20,
                            }}
                          />
                        </View>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </SafeAreaView>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
});
