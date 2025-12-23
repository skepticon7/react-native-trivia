import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {StatusBar} from "expo-status-bar";
import {Toast} from 'toastify-react-native';
import {login} from '../services/authService';

const DEMO_ACCOUNT = {
    email: 'demo@trivia.com',
    password: 'demo123',
};

export default function Login() {
    const navigation = useNavigation();
    const [user , setUser] = useState({
        email : '',
        password : ''
    })
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!user.email || !user.password) {
            Alert.alert('Please enter both email and password' , 'bottom');
            return;
        }

        try{
            setIsLoading(true);
            const loggedInUser = await login(user.email , user.password);
            console.log(loggedInUser);
            Toast.success(`${loggedInUser.displayName} successfully logged in` , "bottom");
        }catch (e) {
            console.log(`Error : ${e}`);
            Toast.error("Try Again Later" , 'bottom');
        }finally {
            setIsLoading(false);
        }

    };


    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.content}>
                            {/* Back Button */}
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.backButtonText}>← Back</Text>
                            </TouchableOpacity>

                            <View style={styles.header}>
                                <Text style={styles.title}>Welcome back</Text>
                                <Text style={styles.subtitle}>
                                    Log in to continue your trivia journey
                                </Text>
                            </View>


                            {/* Login Form */}
                            <View style={styles.card}>
                                <View style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Email</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="you@example.com"
                                            placeholderTextColor="#999"
                                            value={user.email}
                                            onChangeText={(text) => setUser({...user , email: text})}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            editable={!isLoading}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Password</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#999"
                                            value={user.password}
                                            onChangeText={(text) => setUser({...user , password: text})}
                                            secureTextEntry
                                            editable={!isLoading}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                                        onPress={handleLogin}
                                        disabled={isLoading}
                                        activeOpacity={0.8}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="#FFFFFF" />
                                        ) : (
                                            <Text style={styles.loginButtonText}>Log In</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Sign Up Link */}
                            <View style={styles.signupContainer}>
                                <Text style={styles.signupText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                    <Text style={styles.signupLink}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    backButton: {
        marginBottom: 24,
        paddingVertical: 8,
        paddingHorizontal: 4,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        fontSize: 16,
        color: '#666666',
        fontWeight: '500',
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 24,
    },
    demoInfo: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    demoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    demoText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 4,
    },
    demoHint: {
        fontSize: 12,
        color: '#999999',
        fontStyle: 'italic',
        marginTop: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 24,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 9,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000000',
        backgroundColor: '#FFFFFF',
    },
    loginButton: {
        backgroundColor: '#000000',
        borderRadius: 8,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    signupText: {
        fontSize: 14,
        color: '#666666',
    },
    signupLink: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});