import AsyncStorage from "@react-native-async-storage/async-storage";

/* ---------------- TYPES ---------------- */

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  mpin?: string;
};

export type Transaction = {
  id: string;
  category: string;
  amount: number;
  status: "Success" | "Failed" | "Pending";
  date: string;
};

/* ---------------- KEYS ---------------- */

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const TRANSACTION_KEY = "user_transactions";
const USER_PINS_KEY = "user_pins";

/* ---------------- USERS ---------------- */

export const saveUser = async (
  user: Omit<User, "id">
) => {
  try {
    const users = await getUsers();

    const newUser: User = {
      ...user,
      id: Date.now().toString(),
    };

    users.push(newUser);

    await AsyncStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );

    return newUser;
  } catch (error) {
    console.log("saveUser error:", error);
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);

    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.log("getUsers error:", error);
    return [];
  }
};

export const loginUser = async (
  user: User
) => {
  try {
    await AsyncStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(user)
    );

    return user;
  } catch (error) {
    console.log("loginUser error:", error);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await AsyncStorage.getItem(CURRENT_USER_KEY);

    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.log("getCurrentUser error:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.log("logoutUser error:", error);
  }
};


/* ---------------- MPIN (PER USER) ---------------- */
export const saveUserPin = async (
  userId: string,
  pin: string
) => {
  const data = await AsyncStorage.getItem(USER_PINS_KEY);

  const pins = data ? JSON.parse(data) : {};

  pins[userId] = pin;

  await AsyncStorage.setItem(
    USER_PINS_KEY,
    JSON.stringify(pins)
  );
};

export const getUserPin = async (
  userId: string
) => {
  const data = await AsyncStorage.getItem(USER_PINS_KEY);

  const pins = data ? JSON.parse(data) : {};

  return pins[userId] || null;
};


/* ---------------- TRANSACTIONS (PER USER) ---------------- */

export const saveTransaction = async (
  userId: string,
  transaction: Transaction
) => {
  try {
    const existing = await AsyncStorage.getItem(TRANSACTION_KEY);

    const allData = existing ? JSON.parse(existing) : {};

    if (!allData[userId]) {
      allData[userId] = [];
    }

    allData[userId].push(transaction);

    await AsyncStorage.setItem(
      TRANSACTION_KEY,
      JSON.stringify(allData)
    );
  } catch (error) {
    console.log("saveTransaction error:", error);
  }
};

export const getTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  try {
    const existing = await AsyncStorage.getItem(TRANSACTION_KEY);

    const allData = existing ? JSON.parse(existing) : {};

    return allData[userId] || [];
  } catch (error) {
    console.log("getTransactions error:", error);
    return [];
  }
};