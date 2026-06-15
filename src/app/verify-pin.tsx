import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CheckCircle } from "lucide-react-native";
import { useRef, useState } from "react";

import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { hp, wp } from "@/utils/responsive";

import {
  getCurrentUser,
  saveTransaction,
  Transaction,
} from "../services/storage";

export default function VerifyPinScreen() {
  const { amount, category } =
    useLocalSearchParams();

  const [pin, setPin] = useState("");
  const [success, setSuccess] =
    useState(false);

  const scaleAnim = useRef(
    new Animated.Value(0)
  ).current;

  const playSuccessAnimation = () => {
    setSuccess(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      router.replace(
        "/(tabs)/dashboard"
      );
    }, 2000);
  };

  const verifyPin = async (
    enteredPin: string
  ) => {
    try {
      const user =
        await getCurrentUser();

      if (!user) {
        Alert.alert(
          "Error",
          "User not found"
        );
        return;
      }

      if (user.mpin !== enteredPin) {
        Alert.alert(
          "Invalid MPIN",
          "Please try again"
        );

        setPin("");
        return;
      }

      const transaction: Transaction =
        {
          id: Date.now().toString(),
          category: String(category),
          amount: Number(amount),
          status: "Success",
          date:
            new Date().toLocaleDateString(),
        };

      await saveTransaction(
        user.id,
        transaction
      );

      playSuccessAnimation();
    } catch {
      Alert.alert(
        "Error",
        "Payment failed"
      );
    }
  };

  const handleNumberPress = (
    number: string
  ) => {
    if (pin.length >= 4) return;

    setPin(pin + number);
  };

  const handleDelete = () => {
    setPin(
      pin.substring(
        0,
        pin.length - 1
      )
    );
  };

  if (success) {
    return (
      <SafeAreaView
        style={styles.successContainer}
      >
        <Animated.View
          style={{
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          }}
        >
          <CheckCircle
            size={wp(24)}
            color="#22C55E"
          />
        </Animated.View>

        <Text
          style={styles.successTitle}
        >
          Payment Successful
        </Text>

        <Text
          style={
            styles.successSubtitle
          }
        >
          ₹{amount} paid successfully
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <ArrowLeft
            size={wp(6)}
            color="#111827"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.amount}>
          ₹{amount}
        </Text>

        <Text
          style={styles.category}
        >
          {category}
        </Text>

        <Text
          style={styles.bankText}
        >
          CampusPay UPI
        </Text>

        <Text
          style={styles.pinTitle}
        >
          ENTER UPI PIN
        </Text>

        <View style={styles.dotRow}>
          {[0, 1, 2, 3].map(
            (index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  pin.length >
                    index &&
                    styles.dotFilled,
                ]}
              />
            )
          )}
        </View>
      </View>

      <View style={styles.keypad}>
  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (num) => (
      <TouchableOpacity
        key={num}
        style={styles.key}
        onPress={() =>
          handleNumberPress(String(num))
        }
      >
        <Text style={styles.keyText}>
          {num}
        </Text>
      </TouchableOpacity>
    )
  )}

  {/* DELETE */}
  <TouchableOpacity
    style={styles.key}
    onPress={handleDelete}
  >
    <Text style={styles.keyText}>
      ⌫
    </Text>
  </TouchableOpacity>

  {/* ZERO */}
  <TouchableOpacity
    style={styles.key}
    onPress={() =>
      handleNumberPress("0")
    }
  >
    <Text style={styles.keyText}>
      0
    </Text>
  </TouchableOpacity>

  {/* VERIFY */}
  <TouchableOpacity
    style={styles.key}
    disabled={pin.length !== 4}
    onPress={() => verifyPin(pin)}
  >
    <View
      style={[
        styles.tickBtn,
        pin.length !== 4 && {
          opacity: 0.4,
        },
      ]}
    >
      <Text style={styles.tickText}>
        ✓
      </Text>
    </View>
  </TouchableOpacity>
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },

  content: {
    alignItems: "center",
    marginTop: hp(4),
  },

  amount: {
    fontSize: wp(10),
    fontWeight: "700",
    color: "#111827",
  },

  category: {
    marginTop: hp(1),
    fontSize: wp(4.5),
    color: "#374151",
  },

  bankText: {
    marginTop: hp(1),
    color: "#6B7280",
    fontSize: wp(3.8),
  },

  pinTitle: {
    marginTop: hp(6),
    color: "#6B7280",
    fontSize: wp(3.8),
    fontWeight: "600",
  },

  dotRow: {
    flexDirection: "row",
    marginTop: hp(3),
  },

  dot: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    marginHorizontal: wp(2),
  },

  dotFilled: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },

  tickBtn: {
  width: wp(14),
  height: wp(14),

  borderRadius: wp(7),

  backgroundColor: "#208AEF",

  justifyContent: "center",
  alignItems: "center",
},

tickText: {
  color: "#FFF",

  fontSize: wp(7),
  fontWeight: "700",
},

  keypad: {
    marginTop: "auto",

    flexDirection: "row",
    flexWrap: "wrap",

    paddingBottom: hp(4),
    paddingHorizontal: wp(8),
  },

  key: {
    width: "33.33%",

    justifyContent: "center",
    alignItems: "center",

    paddingVertical: hp(2.8),
  },

  keyText: {
    fontSize: wp(8),
    fontWeight: "400",
    color: "#111827",
  },

  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  successTitle: {
    marginTop: hp(2),
    fontSize: wp(6),
    fontWeight: "700",
    color: "#22C55E",
  },

  successSubtitle: {
    marginTop: hp(1),
    color: "#6B7280",
    fontSize: wp(4),
  },
});