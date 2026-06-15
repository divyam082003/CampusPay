import { getCurrentUser, logoutUser } from '@/services/storage';
import { hp, wp } from "@/utils/responsive";
import { router } from 'expo-router';
import { LogOut, Mail, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser =
      await getCurrentUser();

    setUser(currentUser);
  };

  const handleLogout = async () => {
    await logoutUser();

    Toast.show({
      type: "success",
      text1: "Logged Out",
    });

    router.replace("/login");
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <View style={styles.container}>
        <View style={styles.avatar}>
          <User
            size={wp(12)}
            color="#208AEF"
          />
        </View>

        <Text style={styles.name}>
          {user?.name || "Student"}
        </Text>

        <Text style={styles.subtitle}>
          CampusPay User
        </Text>

        <View style={styles.infoCard}>
          <Mail
            size={wp(5)}
            color="#208AEF"
          />

          <Text
            style={styles.infoText}
          >
            {user?.email ||
              "No Email"}
          </Text>
        </View>

        <TouchableOpacity
          style={
            styles.logoutButton
          }
          onPress={handleLogout}
        >
          <LogOut
            size={wp(5)}
            color="#FFF"
          />

          <Text
            style={
              styles.logoutText
            }
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: hp(1),
    backgroundColor: "#208AEF",
  },

  container: {
    flex: 1,
    alignItems: "center",

    paddingHorizontal: wp(5),
    paddingTop: hp(4),

    backgroundColor: "#F4F8FD",
  },

  avatar: {
    width: wp(30),
    height: wp(30),

    borderRadius: wp(15),

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  name: {
    marginTop: hp(2),

    fontSize: wp(6.5),
    fontWeight: "700",

    color: "#111827",
  },

  subtitle: {
    marginTop: hp(0.5),

    color: "#6B7280",

    fontSize: wp(3.8),
  },

  infoCard: {
    width: "100%",

    marginTop: hp(4),

    backgroundColor: "#FFF",

    flexDirection: "row",
    alignItems: "center",

    paddingVertical: hp(2),
    paddingHorizontal: wp(4),

    borderRadius: wp(4),

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,

    elevation: 2,
  },

  infoText: {
    marginLeft: wp(3),

    fontSize: wp(4),

    color: "#111827",

    flex: 1,
  },

  logoutButton: {
    width: "100%",

    marginTop: hp(4),

    backgroundColor: "#ca4343",

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    paddingVertical: hp(2),

    borderRadius: wp(4),
  },

  logoutText: {
    color: "#FFF",

    marginLeft: wp(2),

    fontSize: wp(4.2),
    fontWeight: "700",
  },
});