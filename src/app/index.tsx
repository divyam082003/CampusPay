import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CampusPay</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => router.push('/login')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={() => router.push('/register')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});