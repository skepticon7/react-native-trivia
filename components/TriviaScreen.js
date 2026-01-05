// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import {TextAlignJustify} from "lucide-react-native";
import {ProgressBar} from 'react-native-paper'

// Main Trivia Screen Component
function TriviaScreen({ navigation }) {
    const [dailyProgress, setDailyProgress] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        { id: "science", name: "Science", emoji: "🔬" },
        { id: "history", name: "History", emoji: "📚" },
        { id: "geography", name: "Geography", emoji: "🌍" },
        { id: "sports", name: "Sports", emoji: "⚽" },
        { id: "movies", name: "Movies", emoji: "🎬" },
        { id: "technology", name: "Technology", emoji: "💻" },
    ];

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        // Here you would navigate to quiz/questions for that category
        console.log(`Selected category: ${category.name}`);
    };

    const handleDailyProgress = () => {
        if (dailyProgress < 10) {
            setDailyProgress(dailyProgress + 1);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Trivia</Text>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <TextAlignJustify style={styles.menuIcon}/>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Daily Progress Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Choose a topic</Text>
                    <Text style={styles.sectionSubtitle}>Pick your category for today</Text>

                    <View style={styles.progressCard}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressText}>Daily progress</Text>
                            <Text style={styles.progressCount}>0/10</Text>
                        </View>

                        <ProgressBar
                            progress={dailyProgress}
                            color="#000"
                            style={styles.progressBar}
                        />
                    </View>

                    {/* Categories Grid */}
                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryCard,
                                    selectedCategory?.id === category.id && styles.categoryCardSelected
                                ]}
                                onPress={() => handleCategorySelect(category)}
                            >
                                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function HistoryScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title}>History</Text>
                <View style={{ width: 40 }} />
            </View>
            <View style={styles.content}>
                <Text style={styles.pageText}>Your trivia history will appear here</Text>
            </View>
        </SafeAreaView>
    );
}

// Profile Screen Component
function ProfileScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Profile</Text>
                <View style={{ width: 40 }} />
            </View>
            <View style={styles.content}>
                <Text style={styles.pageText}>Your profile information will appear here</Text>
            </View>
        </SafeAreaView>
    );
}

// Create Drawer Navigator
const Drawer = createDrawerNavigator();

function App() {
    return (
        <>
            <Drawer.Navigator
                initialRouteName="Trivia"
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        backgroundColor: '#f5f5f5',
                        width: 250,
                    },
                    drawerActiveTintColor: '#007AFF',
                    drawerInactiveTintColor: '#666',
                }}
            >
                <Drawer.Screen
                    name="Trivia"
                    component={TriviaScreen}
                    options={{
                        drawerLabel: 'Trivia Home',
                    }}
                />
                <Drawer.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        drawerLabel: 'History',
                    }}
                />
                <Drawer.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        drawerLabel: 'Profile',
                    }}
                />
            </Drawer.Navigator>
        </>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    menuIcon: {
        fontSize: 24,
        padding: 5,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    section: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 15,
        color: '#666',
        marginBottom: 25,
    },
    progressCard: {
        borderRadius: 12,
        borderColor : "#e3e3e3",
        borderWidth : 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        padding: 16,
        marginBottom: 20,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },
    progressText: {
        fontWeight: "600",
    },
    progressCount: {
        fontSize : 15,
        fontWeight : "semibold",
        color: "#777",
    },
    categoryEmoji : {
        fontSize : 40
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    // progressCard: {
    //     backgroundColor: '#f8f9fa',
    //     borderRadius: 12,
    //     padding: 20,
    //     marginBottom: 30,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //     elevation: 3,
    // },
    // progressTitle: {
    //     fontSize: 18,
    //     fontWeight: '600',
    //     color: '#333',
    //     marginBottom: 15,
    // },
    // progressContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    // },
    // progressText: {
    //     fontSize: 28,
    //     fontWeight: 'bold',
    //     color: '#007AFF',
    // },
    // progressButton: {
    //     backgroundColor: '#007AFF',
    //     borderRadius: 8,
    //     paddingVertical: 10,
    //     paddingHorizontal: 20,
    // },
    // progressButtonText: {
    //     color: '#fff',
    //     fontWeight: '600',
    //     fontSize: 16,
    // },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryCard: {
        flexDirection : 'column',
        width: '48%',
        borderRadius: 12,
        borderColor : "#e3e3e3",
        borderWidth : 1,
        padding: 30,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap : 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    categoryCardSelected: {
        backgroundColor: '#007AFF',
    },
    categoryText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    categoryTextSelected: {
        color: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pageText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
    },
});

export default App;