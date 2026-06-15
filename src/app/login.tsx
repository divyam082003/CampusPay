import { router } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  getUsers,
  loginUser
} from '../services/storage';

import { hp, wp } from "@/utils/responsive";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all fields',
      });
      return;
    }

    const users = await getUsers();

    const foundUser = users.find(
      (user: any) =>
        user.email === email &&
        user.password === password
    );
    if (foundUser) {

      console.log("FOUND USER =>", foundUser);

      await loginUser(foundUser);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
      });

      router.replace('/dashboard');

    } else {

      Toast.show({
        type: 'error',
        text1: 'Invalid Credentials',
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#208AEF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <>

              <Image
                source={require('../../assets/svgs/login.png')}
                style={styles.gif}
              />

              <Text style={styles.title}>
                CampusPay Login
              </Text>

              <View style={styles.inputContainer}>
                <Mail
                  size={20}
                  color="#208AEF"
                />

                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#777"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.textInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock
                  size={20}
                  color="#208AEF"
                />

                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#777"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.textInput}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>LogIn</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/register')}
              >
                <Text style={styles.registerTitle}>
                  New User? Register Here
                </Text>
              </TouchableOpacity>

            </>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
  },

  gif: {
    width: wp(45),
    height: wp(45),
    resizeMode: "contain",
    marginBottom: hp(2),
  },

  title: {
    fontSize: wp(7),
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: hp(1.5),
  },

  subtitle: {
    fontSize: 18,
    color: '#D6E8FF',
    marginBottom: 30,
  },

  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
    marginBottom: 15,
    fontSize: 16
  },

  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: wp(3.5),
    paddingHorizontal: wp(4),
    marginBottom: hp(1.8),
  },

  textInput: {
    flex: 1,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(3),
    fontSize: wp(4),
  },

  button: {
    width: "100%",
    backgroundColor: "#1565C0",
    paddingVertical: hp(1.8),
    borderRadius: wp(3.5),
    alignItems: "center",
    marginTop: hp(1),
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: wp(4.5),
    fontWeight: "700",
  },

  registerTitle: {
    marginTop: hp(3),
    color: "#FFFFFF",
    fontSize: wp(4),
  },
});