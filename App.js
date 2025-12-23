import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import Signup from "./components/Signup";


const Stack = createStackNavigator();


export default function App() {
  return (
      <>
          <StatusBar hidden={true}/>
          <NavigationContainer>
              <Stack.Navigator
                  initialRouteName={'HomePage'}
              >
                  <Stack.Screen name={'HomePage'} component={HomePage}/>
                  <Stack.Screen name={'Login'} component={Login}/>
                  <Stack.Screen name={'Signup'} component={Signup}/>
              </Stack.Navigator>

          </NavigationContainer>
      </>

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
