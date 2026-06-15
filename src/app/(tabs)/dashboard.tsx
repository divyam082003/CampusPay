import { getCurrentUser, getTransactions } from '@/services/storage';
import { hp, wp } from "@/utils/responsive";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  BookOpen,
  Building2,
  Bus,
  Coffee,
  Home,
  QrCode,
  Search,
  UtensilsCrossed
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get('window').width;

const SERVICES = [
  {
    title: 'Scan QR',
    icon: QrCode,
    category: 'QR',
  },
  {
    title: 'College',
    icon: Building2,
    category: 'College Fee',
  },
  {
    title: 'Hostel',
    icon: Home,
    category: 'Hostel Fee',
  },
  {
    title: 'Mess',
    icon: UtensilsCrossed,
    category: 'Mess Recharge',
  },
  {
    title: 'Transport',
    icon: Bus,
    category: 'Transport Pass',
  },
  {
    title: 'Canteen',
    icon: Coffee,
    category: 'Canteen',
  },
  {
    title: 'Stationary',
    icon: BookOpen,
    category: 'Stationary Shop',
  },
];

const OFFERS = [
  require('../../../assets/offers/offer1.jpg'),
  require('../../../assets/offers/offer2.jpg'),
  require('../../../assets/offers/offer3.jpg'),
];

export default function DashboardScreen() {
  const [user, setUser] = useState<any>(null);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await getCurrentUser();

    setUser(currentUser);

    if (!currentUser?.id) return;

    const transactions = await getTransactions(currentUser.id);

    const total = transactions.reduce(
      (sum: number, transaction: any) =>
        sum + transaction.amount,
      0
    );

    setTotalSpent(total);
  };

  return (

    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: hp(2),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Search
                size={18}
                color="#777"
              />

              <TextInput
                placeholder="Search services..."
                placeholderTextColor="#777"
                style={styles.searchInput}
              />
            </View>

            <TouchableOpacity
              style={styles.avatar}
              onPress={() =>
                router.push('/profile')
              }
            >
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.brand}>
            CampusPay
          </Text>

          <Text style={styles.welcome}>
            Welcome {user?.name || 'Student'} 👋
          </Text>

          <LinearGradient
            colors={['#5DB4FF', '#208AEF', '#1565C0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <Text style={styles.balanceLabel}>
              Total Spent
            </Text>

            <Text style={styles.balanceAmount}>
              ₹{totalSpent}
            </Text>
          </LinearGradient>
        </View>

        <Text style={styles.sectionTitle}>
          Quick Services
        </Text>

        <FlatList
          data={SERVICES}
          keyExtractor={(item) => item.title}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: wp(4),
            marginBottom: hp(1),
          }}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
          renderItem={({ item }) => {
            const Icon = item.icon;

            return (
              <TouchableOpacity
                style={styles.serviceCard}
                onPress={() => {
                  if (item.category === "QR") {
                    router.push("/qr_scanner");
                    return;
                  }

                  router.push({
                    pathname: "/payment",
                    params: { category: item.category },
                  });
                }}
              >
                <Icon size={wp(6)} color="#208AEF" />
                <Text style={styles.serviceText}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.rewardRow}>
          <LinearGradient
            colors={['#FFB347', '#FF9800']}
            style={styles.smallRewardCard}
          >
            <Text style={styles.rewardTitle}>
              🎁 Rewards
            </Text>

            <Text style={styles.rewardText}>
              Earn Cashback
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={['#8E54E9', '#4776E6']}
            style={styles.smallRewardCard}
          >
            <Text style={styles.rewardTitle}>
              🏆 Offers
            </Text>

            <Text style={styles.rewardText}>
              Student Perks
            </Text>
          </LinearGradient>
        </View>

        <Text style={styles.sectionTitle}>
          Offers For You
        </Text>

        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={screenWidth - wp(8)}
            height={hp(22)}
            autoPlay
            autoPlayInterval={3000}
            scrollAnimationDuration={1000}
            data={OFFERS}
            renderItem={({ item }) => (
              <Image
                source={item}
                style={styles.offerImage}
              />
            )}
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FD',
  },

  safeArea: {
    flex: 1,
  backgroundColor: "#208AEF",
  },

  header: {
    backgroundColor: "#208AEF",
    paddingTop: hp(2),
    paddingHorizontal: wp(5),
    paddingBottom: hp(3),
    borderBottomLeftRadius: wp(8),
    borderBottomRightRadius: wp(8),
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchBar: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp(4),
    paddingHorizontal: wp(3),
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
  },

  avatar: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp(3),
  },

  avatarText: {
    color: '#208AEF',
    fontWeight: '700',
    fontSize: 16,
  },

  brand: {
    color: "#FFF",
    fontSize: wp(7),
    fontWeight: "700",
    marginTop: hp(2),
  },

  welcome: {
    color: "#EAF4FF",
    fontSize: wp(4),
    marginTop: hp(0.5),
    marginBottom: hp(2.5),
  },

  balanceCard: {
    borderRadius: wp(6),
    padding: wp(5),
  },

  balanceLabel: {
    color: '#FFFFFF',
    fontSize: 15,
  },

  balanceAmount: {
    color: '#FFFFFF',
    fontSize: wp(8),
    fontWeight: '700',
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: wp(5),
    fontWeight: "700",
    marginHorizontal: wp(4),
    marginTop: hp(3),
    marginBottom: hp(1.5),
    color: "#1F2937",
  },

  serviceCard: {
    width: "32%",
    height: hp(10),
    backgroundColor: "#FFF",
    borderRadius: wp(3.5),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  serviceText: {
    marginTop: hp(0.8),
    fontSize: wp(3),
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },

  rewardRow: {
    flexDirection: "row",
    marginHorizontal: wp(4),
    marginTop: hp(1),
    gap: wp(3),
  },

  smallRewardCard: {
    flex: 1,
    borderRadius: wp(4.5),
    padding: wp(4),
    minHeight: hp(12),
  },

  rewardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  rewardText: {
    color: '#FFFFFF',
    marginTop: 8,
  },

  carouselContainer: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },

  offerImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(4),
    resizeMode: "cover",
  },
});