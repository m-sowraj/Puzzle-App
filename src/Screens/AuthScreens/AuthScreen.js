import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
  const navigation = useNavigation();

  const handleDifficultySelect = () => {
    navigation.navigate('SignUpScreen');
    // console.log(`Selected difficulty: ${difficulty}`);
  };

  return (
    <ImageBackground source={require('../../../assets/bg.png')} style={styles.background}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Select Difficulty</Text> */}
        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDifficultySelect()}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDifficultySelect()}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
        
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    minWidth: '70%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0097B2',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#0097B2',
    textAlign: 'center',
  },
});

export default AuthScreen;
