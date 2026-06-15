import { router } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { hp, wp } from "@/utils/responsive";
import { Lock, Mail, User } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import {
    getUsers,
    saveUser,
} from '@/services/storage';
import { SafeAreaView } from "react-native-safe-area-context";


export default function RegisterScreen() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {

        if (!name || !email || !password) {

            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill all fields',
            });

            return;
        }

        const users = await getUsers();

        const existingUser = users.find(
            (user: any) => user.email === email
        );

        if (existingUser) {

            Toast.show({
                type: 'error',
                text1: 'Email Already Registered',
            });

            return;
        }

        const user = {
            name,
            email,
            password,
        };

        await saveUser(user);

        setName('');
        setEmail('');
        setPassword('');

        Toast.show({
            type: 'success',
            text1: 'Account Created',
            text2: 'Please login to continue',
        });

        setTimeout(() => {
            router.replace('/login');
        }, 1200);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <Image source={require('../../assets/svgs/register.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>
                        Create Account
                    </Text>

                    <View style={styles.inputContainer}>
                        <User
                            size={20}
                            color="#208AEF"
                        />

                        <TextInput
                            placeholder="Full Name"
                            placeholderTextColor="#777"
                            value={name}
                            onChangeText={setName}
                            style={styles.textInput}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Mail
                            size={20}
                            color="#208AEF"
                        />

                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#777"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.textInput}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Lock
                            size={20}
                            color="#208AEF"
                        />

                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#777"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.textInput}
                            secureTextEntry
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>
                            Register
                        </Text>

                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#208AEF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(6),
        paddingVertical: hp(4),
    },

    logo: {
        width: wp(40),
        height: wp(40),
        maxWidth: 180,
        maxHeight: 180,
        resizeMode: 'contain',
        marginBottom: hp(2),
    },

    title: {
        fontSize: wp(8),
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: hp(3),
    },
    inputContainer: {
        width: '100%',
        maxWidth: 450,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp(3.5),
        paddingHorizontal: wp(4),
        marginBottom: hp(1.8),
    },

    textInput: {
        flex: 1,
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(3),
        fontSize: wp(4),
    },

    button: {
        width: '100%',
        maxWidth: 450,
        backgroundColor: '#1565C0',
        paddingVertical: hp(2),
        borderRadius: wp(3.5),
        alignItems: 'center',
        marginTop: hp(1),
    },

    buttonText: {
        color: '#FFFFFF',
        fontSize: wp(4.5),
        fontWeight: '700',
    },

    loginText: {
        marginTop: 25,
        color: '#FFFFFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});