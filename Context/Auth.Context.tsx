import { auth, firestore } from "@/Config/FirebaseConfig";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (users) => {
      if (users) {
        console.log(users?.email);
        await updateUser(users?.uid)
        router.replace('/(tabs)/Home')
      }
      else{
        setUser(null)
      }
    });
    return ()=> unsubscribe();
  }, []);

  const router = useRouter();

  const signup = async (
    name: string,
    email: string,
    password: string,
    imageUrl: string
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setDoc(doc(firestore,'users',response?.user?.uid),{
        name,
        email,
        imageUrl
      })
      if (response) {
        router.replace("/(tabs)/Home");
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("Firebase: Error (auth/email-already-in-use)."))
        msg = "Email Already Registered";
      if (
        msg.includes(
          "Firebase: Password should be at least 6 characters (auth/weak-password)."
        )
      )
        msg = "Password should be at least 6 characters.";
      if (msg.includes("Firebase: Error (auth/invalid-email)."))
        msg = "Invalid Email";
      console.log(msg);
      Alert.alert("Sign Up", msg);
    }
  };
  const signin = async (email: string, password: string) => {
    try {
      let response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        console.log("Signin Success", response?.user?.email);
        router.replace("/(tabs)/Home");
      }
    } catch (error: any) {
      let msg = error.message;
      if (msg.includes("Firebase: Error (auth/invalid-credential)."))
        msg = "Invalid Credentials";
      if (msg.includes("Firebase: Error (auth/invalid-email)."))
        msg = "Invalid Email";
      Alert.alert("Sign In", msg);
      console.log(msg);
    }
  };

  const updateUser = async (uid: string) => {
    let docRef = doc(firestore, "users", uid);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(data)
      const userData = {
        uid: data?.uid,
        name: data?.name || null,
        email: data?.email || null,
        image: data?.imageUrl || null,
      };
      setUser(userData);
    }
  };



  const values = {
    signup,
    signin,
    user,
    setUser,
    updateUser,

  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    Alert.alert("useAuth must be Wrapped inside a AuthContext Provider");
  }
  return context;
};
