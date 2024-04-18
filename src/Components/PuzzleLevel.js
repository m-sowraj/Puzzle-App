import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
//add navigation
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CWG from 'cwg';
// import completionData from '../datas/completion.json';
import easydata from '../datas/data.json'
import mediumdata from '../datas/mediumdata.json'
import harddata from '../datas/harddata.json'
import AsyncStorage from '@react-native-async-storage/async-storage';


const NumberSelectionScreen = ({ start, end , difficultylevel}) => {
  const navigation = useNavigation();
  const numbers = [];
  const [completionData, setCompletiondata] = useState({
    easy: [],
    medium: [],
    hard: [],
    point:[0],

  });

  useEffect(() => {
		const retrieveData = async () => {
		  try {
			// Retrieve data associated with the key 'completionData'
			const jsonData = await AsyncStorage.getItem('completionData');
			
			if (jsonData !== null) {
			  // If data exists, parse it from JSON format
			  const data = JSON.parse(jsonData);
        console.log(data)
			  await setCompletiondata(data); // Update state with the retrieved data
			} else {
			  setCompletiondata({easy:[],medium:[],hard:[],point:[0]});
			  console.log('No data found.');
			}
		  } catch (error) {
			console.error('Failed to retrieve data:', error);
      
		  }
		};
	
		// Call the retrieveData function when the component mounts
		retrieveData();
	  }, []); 

    useFocusEffect(
      React.useCallback(() => {
        // Refresh data or perform any necessary actions when the screen comes into focus
        const retrieveData = async () => {
          try {
            const jsonData = await AsyncStorage.getItem('completionData');
            if (jsonData !== null) {
              const data = JSON.parse(jsonData);
              setCompletiondata(data);
            } else {
              setCompletiondata({ easy: [], medium: [], hard: [0] });
              console.log('No data found.');
            }
          } catch (error) {
            console.error('Failed to retrieve data:', error);
          }
        };
        retrieveData();
      }, [])
    );


  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }
  if(difficultylevel=='easy'){
    data=easydata
  }
  else if(difficultylevel=='medium'){
    data=mediumdata

  }
  else if(difficultylevel=='hard'){
    data=harddata
  }
  // Split numbers into chunks of three
  const chunks = [];
  while (numbers.length) {
    chunks.push(numbers.splice(0, 3));
  }

  const getRandomIncompleteQuestion = async (difficulty) => {
    try {

        const completionIdsJson = await AsyncStorage.getItem('completionIds');
        if (!completionIdsJson) {
            console.log('No completion IDs found.');
            return null;
        }
        const completionIds = JSON.parse(completionIdsJson)[difficulty] || [];

        // Step 2: Filter out questions based on completion IDs to get incomplete questions
        const incompleteQuestions = data.filter(question =>
            !question.some(word => completionIds.includes(word.id))
        );

        // Step 3: If there are no incomplete questions, return null. Otherwise, return a random incomplete question.
        if (incompleteQuestions.length === 0) {
            return null;
        }
        console.log(incompleteQuestions,"-------------------")
        return incompleteQuestions[Math.floor(Math.random() * incompleteQuestions.length)];
    } catch (error) {
        console.error('Error getting random incomplete question:', error);
        return null;
    }
};
  async function handleNumberSelect(number,difficultylevel) {

    const words = await getRandomIncompleteQuestion(difficultylevel); 
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
      const { word, hint ,clue ,id } = words[index]; // Get the word and hint from the original array
    
      clues.push({
        answer: word.toUpperCase(),
        hint: hint, 
        clue: clue,
        id:id,
        startx: xNum + 1, 
        starty: yNum + 1, // Adjust to start from 1-based index
        orientation: orientation,
        position: index + 1 // Position of the clue
      });
    });
    // Add the combined clues to the crosswordData array
    crosswordData.push(clues);
    // Now crosswordData holds the crossword puzzle data with words and hints
    console.log(crosswordData);
    navigation.navigate('CrosswordGrid', { crosswordData ,difficultylevel,number});
  }
  const isLevelCompleted = (number) => {
    // return false;
    return completionData[difficultylevel].includes(number);
  };
  


  return (
    <View style={styles.container}>
      <View style={styles.container1}>
      {/* <Text style={styles.heading}>Select a number from {start} to {end}</Text> */}
      {chunks.map((chunk, index) => (
        <View key={index} style={styles.row}>
          {chunk.map((number) => (
            // <TouchableOpacity  key={number} style={styles.button} onPress={() => handleNumberSelect(number)}>
            <TouchableOpacity
            key={number}
            style={[
              styles.button,
              isLevelCompleted(number) && styles.completedButton,
            ]}
            onPress={() => handleNumberSelect(number,difficultylevel)}
            disabled={isLevelCompleted( number)}
          >
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
  completedButton: {
    opacity: 0.5, // Make completed levels appear blurred
  }
});

export default NumberSelectionScreen;
