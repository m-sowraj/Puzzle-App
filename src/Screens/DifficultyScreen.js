import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DifficultyScreen = () => {
  const navigation = useNavigation();

  const handleDifficultySelect = (difficulty) => {
    navigation.navigate('NumberRangeSelector',{ difficulty:difficulty });
    // console.log(`Selected difficulty: ${difficulty}`);
  };

  return (
    <ImageBackground source={require('../../assets/bg.png')} style={styles.background}>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Select Difficulty</Text> */}
        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDifficultySelect('easy')}>
          <Text style={styles.buttonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDifficultySelect('medium')}>
          <Text style={styles.buttonText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleDifficultySelect('hard')}>
          <Text style={styles.buttonText}>Hard</Text>
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

export default DifficultyScreen;
