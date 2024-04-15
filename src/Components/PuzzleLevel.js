import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
//add navigation
import { useNavigation } from '@react-navigation/native';
import CWG from 'cwg';
import data from './data.json'
const NumberSelectionScreen = ({ start, end }) => {
  const navigation = useNavigation();
  const numbers = [];
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }

  // Split numbers into chunks of three
  const chunks = [];
  while (numbers.length) {
    chunks.push(numbers.splice(0, 3));
  }

  function handleNumberSelect(number) {

    const words = data[number%4]; 
    // Extract only words from the list for generating the crossword puzzle
    const wordList = words.map(item => item.word);
    // Generate crossword puzzle
    const result = CWG(wordList);
    console.log(result);
    // Convert the result into the desired format
    const crosswordData = [];
    // Create a single sub-array to hold both words and their hints
    const clues = [];
    result.positionObjArr.forEach((wordObj, index) => {
      const { wordStr, xNum, yNum, isHorizon } = wordObj;
      const orientation = isHorizon ? 'across' : 'down';
      const { word, hint } = words[index]; // Get the word and hint from the original array
      clues.push({
        answer: word.toUpperCase(),
        hint: hint, // Add the hint
        startx: xNum + 1, // Adjust to start from 1-based index
        starty: yNum + 1, // Adjust to start from 1-based index
        orientation: orientation,
        position: index + 1 // Position of the clue
      });
    });
    // Add the combined clues to the crosswordData array
    crosswordData.push(clues);
    // Now crosswordData holds the crossword puzzle data with words and hints
    console.log(crosswordData);
    navigation.navigate('CrosswordGrid', { crosswordData});
  }


  return (
    <View style={styles.container}>
      <View style={styles.container1}>
      {/* <Text style={styles.heading}>Select a number from {start} to {end}</Text> */}
      {chunks.map((chunk, index) => (
        <View key={index} style={styles.row}>
          {chunk.map((number) => (
            <TouchableOpacity  key={number} style={styles.button} onPress={() => handleNumberSelect(number)}>
              <Text style={styles.buttonText}>{number}</Text>
            </TouchableOpacity>
          ))}
       
        </View>
      ))}
         </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 30,
   

    // backgroundColor: '#0097B2',
    },
    container1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // margin: 40,
      padding: 20,
      marginVertical: 70,
      borderRadius: 10,
      backgroundColor: '#0097B2',
      },
  heading: {
    fontSize: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'white',
   
    paddingVertical: 25,
    margin: 5,
    borderRadius: 5,
    flex: 1, // Each button takes equal space in row
    alignItems: 'center',
  },
  buttonText: {
    color: '#0097B2',
    fontSize: 18,
  },
});

export default NumberSelectionScreen;
