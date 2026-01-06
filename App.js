import { StatusBar } from 'expo-status-bar';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import ToastProvider from 'toastify-react-native'
import Signup from "./components/Signup";
import AuthProvider, {useAuth} from "./context/AuthContext";
import Home from "./components/Home";
import ProfileScreen from './components/ProfileScreen';
import HistoryScreen from './components/HistoryScreen';
import QuizScreen from './components/QuizScreen';




const Stack = createStackNavigator();

const RootNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="Quiz" component={QuizScreen} />
                </>

            ) : (
                <>
                    <Stack.Screen name="HomePage" component={HomePage} />
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Signup" component={Signup} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default function App() {

  return (
      <AuthProvider>
          <StatusBar hidden={true}/>
          <NavigationContainer>
             <RootNavigator/>
          </NavigationContainer>
          <ToastProvider/>
      </AuthProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
