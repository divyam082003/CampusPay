import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import {
  Modal,
  TextInput,
} from "react-native";

import {
  getCurrentUser,
  getUsers,
  loginUser,
} from "@/services/storage";
import { usePathname } from "expo-router";
import { useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";

import { hp, wp } from "@/utils/responsive";

export default function QRScannerScreen() {

  const pathname = usePathname();

useEffect(() => {
  setScanned(false);
}, [pathname]);
  

  const [permission, requestPermission] =
    useCameraPermissions();

  const [scannerKey, setScannerKey] =
    useState(0);

  const [amount, setAmount] = useState("");

  const [showAmountModal, setShowAmountModal] =
    useState(false);

  const [showPinModal, setShowPinModal] =
    useState(false);

  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] =
    useState("");
  const [payeeName, setPayeeName] =
    useState("QR Merchant");

  const [scanned, setScanned] =
    useState(false);

    const resetPaymentFlow = () => {
  setShowAmountModal(false);
  setShowPinModal(false);

  setAmount("");

  setNewPin("");
  setConfirmPin("");

  setScanned(false);
};

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView
        style={styles.permissionContainer}
      >
        <Text style={styles.permissionTitle}>
          Camera Permission Required
        </Text>

        <Text style={styles.permissionText}>
          Allow camera access to scan QR
          codes and make payments.
        </Text>

        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text
            style={styles.permissionButtonText}
          >
            Grant Permission
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleScan = async ({ data }: any) => {
  if (scanned) return;

  setScanned(true);

  try {
    if (!data?.startsWith("upi://pay")) {
      Alert.alert(
        "Invalid QR Code",
        "This is not a UPI payment QR.",
        [
          {
            text: "OK",
            onPress: () => {
              setScanned(false);
            },
          },
        ]
      );

      return;
    }

    const url = new URL(data);

    const merchantName =
      url.searchParams.get("pn") ||
      "UPI Merchant";

    const upiId =
      url.searchParams.get("pa");

    if (!upiId) {
      Alert.alert(
        "Invalid UPI QR",
        "UPI ID not found.",
        [
          {
            text: "OK",
            onPress: () => {
              setScanned(false);
            },
          },
        ]
      );

      return;
    }

    setPayeeName(merchantName);
    setShowAmountModal(true);

  } catch {
    Alert.alert(
      "Invalid QR Code",
      "Unable to process this QR.",
      [
        {
          text: "OK",
          onPress: () => {
            setScanned(false);
          },
        },
      ]
    );
  }
};

  const handleAmountContinue =
    async () => {
      if (
        !amount ||
        Number(amount) <= 0
      ) {
        Alert.alert(
          "Invalid Amount",
          "Enter valid amount"
        );
        return;
      }

      const user =
        await getCurrentUser();

      if (!user) return;

      setShowAmountModal(false);

      if (user.mpin) {
        router.push({
          pathname: "/verify-pin",
          params: {
            amount,
            category: payeeName,
          },
        });

        resetPaymentFlow();

      } else {
        setShowPinModal(true);
      }
    };

  const handleCreatePin =
    async () => {
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
        const user =
          await getCurrentUser();

        if (!user) return;

        const users =
          await getUsers();

        const updatedUsers =
          users.map((u: any) =>
            u.id === user.id
              ? {
                ...u,
                mpin: newPin,
              }
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

        setShowPinModal(false);
        router.push({
          pathname: "/verify-pin",
          params: {
            amount,
            category: payeeName,
          },
        });
        resetPaymentFlow();
      } catch {
        Alert.alert(
          "Error",
          "Unable to save MPIN"
        );
      }
    };

  return (
    <View style={styles.container}>
      <CameraView
        key={scannerKey}
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={
          scanned ||
            showAmountModal ||
            showPinModal
            ? undefined
            : handleScan
        }
      />

      <SafeAreaView
        style={styles.overlay}
        edges={["top"]}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft
              size={wp(6)}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Scan & Pay
          </Text>

          <View
            style={{ width: wp(10) }}
          />
        </View>

        {/* Scanner Area */}

        <View style={styles.center}>
          <View style={styles.scanFrame}>
            <View
              style={[
                styles.corner,
                styles.topLeft,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.topRight,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.bottomLeft,
              ]}
            />

            <View
              style={[
                styles.corner,
                styles.bottomRight,
              ]}
            />
          </View>

          <Text style={styles.scanText}>
            Align QR code inside frame
          </Text>

          <Text style={styles.scanSubText}>
            Scan any UPI QR to proceed
            with payment
          </Text>
        </View>
      </SafeAreaView>


      <Modal
        visible={showAmountModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowAmountModal(false);
          setScanned(false);
          setScannerKey(prev => prev + 1);
          router.back()
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Enter Amount
            </Text>

            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="₹0"
              style={styles.modalInput}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={
                handleAmountContinue
              }
            >
              <Text
                style={styles.modalButtonText}
              >
                Continue
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowAmountModal(false);
                setScanned(false);
                setScannerKey(prev => prev + 1);
                router.back()
              }}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                zIndex: 999,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPinModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowPinModal(false);
          setScanned(false);
          setScannerKey(prev => prev + 1);
          router.back()
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Create MPIN
            </Text>

            <TextInput
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="numeric"
              maxLength={4}
              placeholder="4 Digit MPIN"
              style={styles.modalInput}
            />

            <TextInput
              value={confirmPin}
              onChangeText={setConfirmPin}
              keyboardType="numeric"
              maxLength={4}
              placeholder="Confirm MPIN"
              style={styles.modalInput}
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCreatePin}
            >
              <Text
                style={styles.modalButtonText}
              >
                Create MPIN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowPinModal(false);
                setScanned(false);
                setScannerKey(prev => prev + 1);
                router.back()
              }}
              style={{
                position: "absolute",
                top: 15,
                right: 15,
                zIndex: 999,
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const FRAME_SIZE = wp(65);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",

    paddingHorizontal: wp(5),
    marginTop: hp(1),
  },

  backButton: {
    width: wp(10),
    height: wp(10),

    borderRadius: wp(3),

    justifyContent: "center",
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.15)",
  },

  headerTitle: {
    color: "#FFF",

    fontSize: wp(5),
    fontWeight: "700",
  },

  center: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
  },

  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,

    position: "relative",
  },

  corner: {
    position: "absolute",

    width: wp(10),
    height: wp(10),

    borderColor: "#FFF",
  },

  topLeft: {
    top: 0,
    left: 0,

    borderTopWidth: 4,
    borderLeftWidth: 4,

    borderTopLeftRadius: 15,
  },

  topRight: {
    top: 0,
    right: 0,

    borderTopWidth: 4,
    borderRightWidth: 4,

    borderTopRightRadius: 15,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,

    borderBottomWidth: 4,
    borderLeftWidth: 4,

    borderBottomLeftRadius: 15,
  },

  bottomRight: {
    bottom: 0,
    right: 0,

    borderBottomWidth: 4,
    borderRightWidth: 4,

    borderBottomRightRadius: 15,
  },

  scanText: {
    color: "#FFF",

    fontSize: wp(4.8),
    fontWeight: "700",

    marginTop: hp(4),
  },

  scanSubText: {
    color: "#E5E7EB",

    fontSize: wp(3.7),

    textAlign: "center",

    marginTop: hp(1),
    paddingHorizontal: wp(12),
  },

  permissionContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: wp(8),
  },

  permissionTitle: {
    fontSize: wp(5.5),

    fontWeight: "700",

    color: "#111827",
  },

  permissionText: {
    marginTop: hp(1),

    textAlign: "center",

    color: "#6B7280",

    fontSize: wp(3.8),
  },

  permissionButton: {
    marginTop: hp(3),

    backgroundColor: "#208AEF",

    paddingHorizontal: wp(8),
    paddingVertical: hp(1.8),

    borderRadius: wp(3),
  },

  permissionButtonText: {
    color: "#FFF",

    fontWeight: "700",

    fontSize: wp(4),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      "rgba(0,0,0,0.5)",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: wp(5),
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  modalButton: {
    backgroundColor: "#208AEF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: wp(4),
  },
});