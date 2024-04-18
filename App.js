import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, Button } from "react-native";
import CrosswordGrid from "./src/Components/CrosswordPuzzle";
import NumberSelectionScreen from "./src/Components/PuzzleLevel";
import NumberRangeSelector from "./src/Screens/NumberSelectionScreen";
import DifficultyScreen from "./src/Screens/DifficultyScreen";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import SignInScreen from "./src/Screens/AuthScreens/SignInScreen";
import SignInWithOAuth from "./src/Screens/AuthScreens/SignInWithOAuth";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from '@react-navigation/native';
import HomeScreen from "./src/Screens/HomeScreen";
import { StatusBar } from "expo-status-bar";
import SignUpScreen from "./src/Screens/AuthScreens/SignUpScreen";
import AuthScreen from "./src/Screens/AuthScreens/AuthScreen";

const Stack = createStackNavigator();

const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button
        title="Sign Out"
        onPress={() => {
          signOut();
        }}
      />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
    <StatusBar backgroundColor="#0097B2" barStyle="light-content" />
      <View style={styles.background}>
      <Stack.Navigator initialRouteName="HomeScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0097B2', 
            },
            headerTintColor: '#fff', 
          }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'HELLO USER :)' }} />

          <Stack.Screen name="DifficultyScreen" component={DifficultyScreen} options={{ title: 'STAGES' }} />
          <Stack.Screen name="NumberRangeSelector" component={NumberRangeSelector} options={{ headerShown: false }} />
          <Stack.Screen name="NumberSelectionScreen" component={NumberSelectionScreen} options={{ title: 'CHOOSE LEVEL' }} />
          <Stack.Screen name="CrosswordGrid" component={CrosswordGrid} options={{ headerShown: false }} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ title: '' }} />

        </Stack.Navigator>

      </View>
    </NavigationContainer>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  container3: {
    flex: 1,
    backgroundColor: "#0097B2",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",

    backgroundImage: (require('./assets/bg.png'))
  }
});

export default App;
