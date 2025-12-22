import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native'
import {StatusBar} from "expo-status-bar";

export default function HomePage() {

    const navigation = useNavigation();

    return (
        <>
            <StatusBar hidden={true} />
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Trivia</Text>
                            <Text style={styles.subtitle}>
                                Test your knowledge with daily trivia challenges
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <View style={styles.secondaryButtons}>
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.primaryButtonText}>Log In</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('Signup')}
                                >
                                    <Text style={styles.secondaryButtonText}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                10 questions daily · Track your progress · Learn something new
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    content: {
        width: '100%',
        maxWidth: 400,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 32,
        marginBottom: 32,
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
    },
    primaryButton: {
        backgroundColor: '#000000',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    dividerText: {
        color: '#666666',
        fontSize: 12,
        fontWeight: '600',
        marginHorizontal: 16,
        textTransform: 'uppercase',
    },
    secondaryButtons: {
        gap: 16,
    },
    secondaryButton: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
    },
});