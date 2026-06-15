import { getCurrentUser } from '@/services/storage';
import { hp, wp } from "@/utils/responsive";
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {

    const user = await getCurrentUser();

    if (user) {
      router.replace('/dashboard');
      return;
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.loadingLogo}
        />

        <Text style={styles.loadingText}>
          CampusPay
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>
        CampusPay
      </Text>

      <Text style={styles.subtitle}>
        Smart Payments for Campus Life
      </Text>

      <Text style={styles.description}>
        Pay all your dues seamlessly from one platform.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.buttonText}>
          Get Started
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#208AEF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(8),
  },

  loadingLogo: {
    width: wp(40),
    height: hp(40),
    resizeMode: 'contain',
  },

  loadingText: {
    marginTop: hp(2),
    fontSize: wp(7),
    fontWeight: "700",
    color: "#FFFFFF",
  },

  logo: {
    width: wp(55),
    height: wp(55),
    borderRadius: wp(27.5),
    resizeMode: "contain",
    marginBottom: hp(2),
  },

  title: {
    fontSize: wp(9),
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: wp(4.8),
    color: "#EAF4FF",
    fontWeight: "600",
    marginTop: hp(1),
    marginBottom: hp(2),
    textAlign: "center",
  },

  description: {
    fontSize: wp(3.8),
    color: "#DCEEFF",
    textAlign: "center",
    lineHeight: hp(3.2),
    paddingHorizontal: wp(4),
    marginBottom: hp(6),
  },

  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(18),
    borderRadius: wp(8),
    elevation: 4,
  },

  buttonText: {
    color: "#208AEF",
    fontSize: wp(4.5),
    fontWeight: "700",
  },
});