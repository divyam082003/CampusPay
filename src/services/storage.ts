import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUser = async (user: object) => {
  try {
    await AsyncStorage.setItem(
      'user',
      JSON.stringify(user)
    );
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};