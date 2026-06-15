import { Tabs } from "expo-router";
import {
  Home,
  IndianRupee,
  User
} from "lucide-react-native";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  hp,
  wp,
} from "@/utils/responsive";

export default function TabsLayout() {
  const insets =
    useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor:
          "#208AEF",

        tabBarInactiveTintColor:
          "#9CA3AF",

        tabBarLabelStyle: {
          fontSize: wp(3),
          fontWeight: "600",
        },

        tabBarStyle: {
          backgroundColor: "#FFF",

          height:
            hp(8) +
            insets.bottom,

          paddingBottom:
            Math.max(
              insets.bottom + 10,
              hp(2)
            ),

          paddingTop: hp(1),
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",

          tabBarIcon: ({
            color,
          }) => (
            <Home
              color={color}
              size={wp(5.5)}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title:
            "Payments",

          tabBarIcon: ({
            color,
          }) => (
            <IndianRupee
              color={color}
              size={wp(5.5)}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "You",

          tabBarIcon: ({
            color,
          }) => (
            <User
              color={color}
              size={wp(5.5)}
            />
          ),
        }}
      />
    </Tabs>
  );
}