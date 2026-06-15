import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { hp, wp } from "@/utils/responsive";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getCurrentUser,
  getUsers,
  loginUser,
} from "../services/storage";

export const options = {
  headerShown: false,
};

export default function PaymentScreen() {

  const { category } = useLocalSearchParams();

  const [amount, setAmount] = useState("");

  const [user, setUser] = useState<any>(null);
  const [hasPin, setHasPin] = useState(false);

  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const isEditable =
    category === "Canteen" ||
    category === "Stationary Shop";


useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return;

  setUser(currentUser);
  setHasPin(!!currentUser.mpin);

  switch (category) {
    case "College Fee":
      setAmount("5000");
      break;

    case "Hostel Fee":
      setAmount("2000");
      break;

    case "Mess Recharge":
      setAmount("500");
      break;

    case "Transport Pass":
      setAmount("80");
      break;

    case "Canteen":
    case "Stationary Shop":
      setAmount("");
      break;

    default:
      setAmount("");
  }
};

const handleSetPin = async () => {
  if (newPin.length !== 4) {
    Alert.alert(
      "Invalid MPIN",
      "MPIN must be 4 digits"
    );
    return;
  }

  if (newPin !== confirmPin) {
    Alert.alert(
      "Mismatch",
      "MPINs do not match"
    );
    return;
  }

  try {
    const users = await getUsers();

    const updatedUsers = users.map((u: any) =>
      u.id === user.id
        ? { ...u, mpin: newPin }
        : u
    );

    await AsyncStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    await loginUser({
      ...user,
      mpin: newPin,
    });

    setHasPin(true);

    Alert.alert(
      "Success",
      "MPIN created successfully"
    );
  } catch {
    Alert.alert(
      "Error",
      "Unable to save MPIN"
    );
  }
};

const handleContinue = () => {
  if (!amount || Number(amount) <= 0) {
    Alert.alert(
      "Invalid Amount",
      "Please enter a valid amount"
    );
    return;
  }

  if (!hasPin) {
    Alert.alert(
      "Set MPIN First",
      "Please create your MPIN before proceeding."
    );
    return;
  }

  router.push({
    pathname: "/verify-pin",
    params: {
      amount,
      category: String(category),
    },
  });
};

return (
  <SafeAreaView
    style={styles.safeArea}
    edges={["top"]}
  >
    <View style={styles.container}>

      <View
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft
              size={wp(5.5)}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Secure Payment
          </Text>
        </View>

        <Text style={styles.headerSub}>
          {category}
        </Text>
      </View>

      {/* Payment Card */}

      <View style={styles.card}>
        <Text style={styles.label}>
          Amount
        </Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          editable={isEditable}
          placeholder={
            isEditable
              ? "Enter amount"
              : ""
          }
          placeholderTextColor="#9CA3AF"
          style={[
            styles.input,
            !isEditable && {
              opacity: 0.7,
            },
          ]}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Show only if MPIN not created */}

      {!hasPin && (
        <View style={styles.pinCard}>
          <Text style={styles.pinTitle}>
            Create MPIN
          </Text>

          <Text style={styles.pinSubTitle}>
            Set a 4-digit MPIN for secure payments
          </Text>

          <TextInput
            value={newPin}
            onChangeText={setNewPin}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            placeholder="Enter 4-digit MPIN"
            style={styles.input}
          />

          <TextInput
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            placeholder="Confirm MPIN"
            style={[
              styles.input,
              { marginTop: hp(1.2) },
            ]}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSetPin}
          >
            <Text style={styles.buttonText}>
              Create MPIN
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#208AEF",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F8FD",
  },

  header: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
    backgroundColor: "#208AEF",
    borderBottomLeftRadius: wp(8),
    borderBottomRightRadius: wp(8),
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    width: wp(11),
    height: wp(11),

    borderRadius: wp(3),

    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.15)",
  },

  headerTitle: {
    color: "#FFF",

    fontSize: wp(6),
    fontWeight: "700",

    marginLeft: wp(3),
  },

  headerSub: {
    color: "#EAF4FF",

    marginTop: hp(1.5),

    fontSize: wp(3.8),
  },

  card: {
    marginTop: hp(2),

    marginHorizontal: wp(4),

    backgroundColor: "#FFF",

    borderRadius: wp(5),

    padding: wp(5),

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 3,
  },

  label: {
    color: "#6B7280",

    fontSize: wp(3.6),

    marginBottom: hp(1),
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: wp(3),

    paddingVertical: hp(1.8),
    paddingHorizontal: wp(4),

    fontSize: wp(4),

    backgroundColor: "#FAFAFA",
  },

  button: {
    marginTop: hp(3),

    backgroundColor: "#208AEF",

    paddingVertical: hp(1.8),

    borderRadius: wp(3.5),

    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",

    fontWeight: "700",
    fontSize: wp(4.2),
  },

  infoCard: {
    marginTop: hp(2),

    marginHorizontal: wp(4),

    backgroundColor: "#FFF",

    borderRadius: wp(5),

    padding: wp(4),

    borderLeftWidth: 4,
    borderLeftColor: "#208AEF",
  },

  infoTitle: {
    color: "#111827",

    fontSize: wp(4),
    fontWeight: "700",
  },

  infoText: {
    marginTop: hp(0.8),

    color: "#6B7280",

    fontSize: wp(3.5),

    lineHeight: wp(5),
  },

  pinCard: {
  marginTop: hp(2),
  marginHorizontal: wp(4),

  backgroundColor: "#FFF",

  borderRadius: wp(5),

  padding: wp(5),

  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 8,

  elevation: 3,
},

pinTitle: {
  fontSize: wp(4.5),
  fontWeight: "700",
  color: "#111827",
},

pinSubTitle: {
  marginTop: hp(0.5),
  marginBottom: hp(2),

  color: "#6B7280",
  fontSize: wp(3.4),
},
});