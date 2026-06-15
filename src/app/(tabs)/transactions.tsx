import { router } from "expo-router";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Bus,
  Coffee,
  Home,
  QrCode,
  UtensilsCrossed
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getCurrentUser, getTransactions } from "../../services/storage";

import { Transaction } from "@/types/Transaction";
import { hp, wp } from "@/utils/responsive";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const user = await getCurrentUser();

    if (!user?.id) return;

    setUserId(user.id);

    const data = await getTransactions(user.id);
    setTransactions(data.reverse()); // latest first
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "College Fee":
        return Building2;
      case "Hostel Fee":
        return Home;
      case "Mess Recharge":
        return UtensilsCrossed;
      case "Transport Pass":
        return Bus;
      case "Canteen":
        return Coffee;
      case "Stationary Shop":
        return BookOpen;
      case "QR":
        return QrCode;
      default:
        return QrCode;
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const Icon = getIcon(item.category);

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Icon size={wp(5.5)} color="#208AEF" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>

          <Text style={styles.amount}>₹{item.amount}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >

      <View style={styles.header}>


        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft size={wp(5.5)} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Transactions
          </Text>

          <View style={{ width: 40 }} />
        </View>
      </View>


      <View style={styles.content}>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
            paddingTop: hp(2),
            paddingBottom: hp(12),
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                No transactions yet
              </Text>
            </View>
          }
        />

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

  content: {
    flex: 1,
    backgroundColor: "#F4F8FD",
  },

  header: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
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
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  headerTitle: {
    flex: 1,
    paddingLeft: wp(2),
    textAlign: 'left',
    color: "#FFF",
    fontSize: wp(6),
    fontWeight: "700",
  },

  headerSubTitle: {
    color: "#EAF4FF",
    marginTop: hp(1.5),
    fontSize: wp(3.6),
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1F2937",
  },

  card: {
    backgroundColor: "#FFF",

    padding: wp(4),
    borderRadius: wp(4),

    marginBottom: hp(1.2),

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(3),

    backgroundColor: "#EAF4FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: wp(3),
  },
  category: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#111827",
  },

  date: {
    fontSize: wp(3),
    color: "#6B7280",
    marginTop: hp(0.3),
  },

  amount: {
    fontSize: wp(4.2),
    fontWeight: "700",
    color: "#208AEF",
  },

  empty: {
    marginTop: hp(10),
    alignItems: "center",
  },

  emptyText: {
    color: "#9CA3AF",
    fontSize: wp(4),
  },
});