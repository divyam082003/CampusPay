import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUser } from '../services/storage';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const storedUser = await getUser();

    if (!storedUser) {
      Alert.alert(
        'No Account Found',
        'Please register first'
      );
      return;
    }

    if (
      email === storedUser.email &&
      password === storedUser.password
    ) {
      Alert.alert('Success', 'Login Successful');

      router.replace('/dashboard');
    } else {
      Alert.alert(
        'Invalid Credentials',
        'Email or Password is incorrect'
      );
    }
  };

  return (
    <View
      style={styles.container}>
      <>
        <Text style={styles.title}> CampusPay Login </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>LogIn</Text>
        </TouchableOpacity>

        <Text style={styles.registerTitle}> Don't have an account? Register </Text>

      </>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  input: {
    width: '85%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    width: '85%',
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerTitle: {
    fontSize: 16,
    fontWeight: 'thin',
    marginTop: 20,
    marginBottom: 30,
    color: '#137dee'
  },
});