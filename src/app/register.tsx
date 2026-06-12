import { saveUser } from '@/services/storage';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function RegisterScreen() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleRegister = async () => {

        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const user = {
            name,
            email,
            password,
        };

        await saveUser(user);

        Alert.alert(
            'Success',
            'Account created successfully'
        );
    };

    return (
        <View
            style={styles.container}
        >
            <>
                <Text style={styles.title}>Create Account</Text>

                <TextInput
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

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
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
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
});