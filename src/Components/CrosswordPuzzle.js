//CrosswordGrid.js

import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Button,Image, ImageBackground,ScrollView ,  KeyboardAvoidingView, TouchableOpacity  } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Modal } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


// Function to retrieve the completion IDs for all difficulty levels from AsyncStorage
const getCompletionIds = async () => {
    try {
        const completionIdsJson = await AsyncStorage.getItem('completionIds');
		console.log(completionIdsJson)
        return completionIdsJson ? JSON.parse(completionIdsJson) : {};
    } catch (error) {
        console.error('Error retrieving completion IDs:', error);
        return {};
    }
};

// Function to add a completion ID to the array for a specific difficulty level in AsyncStorage
const addCompletionId = async (difficulty, completionId) => {
    try {
        const completionIds = await getCompletionIds();

        const updatedIds = {
            ...completionIds,
            [difficulty]: [...(completionIds[difficulty] || []), completionId],
        };

        await AsyncStorage.setItem('completionIds', JSON.stringify(updatedIds));
    } catch (error) {
        console.error('Error adding completion ID:', error);
    }
};




let level = 0;

const updateCompletionStatus = async (subArrayId) => {
    try {
        // Read the JSON file
		const documentDirectory = FileSystem.documentDirectory;
        const files = await FileSystem.readDirectoryAsync(documentDirectory);
        console.log('Files in document directory:', files);

        const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'data.json');
		console.log(FileSystem.documentDirectory)
        if (!fileInfo.exists) {
            console.log('JSON file not found.');
            return;
        }
		console.log(fileInfo)
        
        const jsonData = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'data.json');
        let data = JSON.parse(jsonData);
		console.log(data)

        // Find the sub-array with the provided ID
        const subArrayToUpdate = data.find(subArray => subArray[0].id === subArrayId);
        if (subArrayToUpdate) {
            // Update is_completion to true for all words in the sub-array
            subArrayToUpdate.forEach(word => {
                word.is_completion = true;
            });

            // Write the updated data back to the JSON file
            await FileSystem.writeAsStringAsync(
                FileSystem.documentDirectory + 'data.json',
                JSON.stringify(data)
            );
            console.log('Completion status updated successfully.');
        } else {
            console.log(`Sub-array with ID ${subArrayId} not found.`);
        }
    } catch (error) {
        console.error('Error updating completion status:', error);
    }
};





const generateInitialGrid = (crosswordData,difficultylevel,navigation) => {
	try {
	
	const initialGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
	crosswordData[level].forEach(({ answer, startx, starty, orientation }) => {
		let x = startx - 1;
		let y = starty - 1;

		for (let i = 0; i < answer.length; i++) {
			if (orientation === 'across') {
				initialGrid[y][x + i] = '';
			} else if (orientation === 'down') {
				initialGrid[y + i][x] = '';
			}
		}
	});
	return initialGrid;
} catch (error) {

	console.error('Error generating initial grid:', error);
	navigation.navigate('NumberRangeSelector',{ difficulty:difficultylevel });
	// Handle or log the error as needed
}
};

const generateAnswerGrid = (crosswordData,difficultylevel,navigation) => {
	try {
	const answerGrid = Array(7).fill(0).map(() => Array(8).fill('X'));
	crosswordData[level].forEach(({ answer, startx, starty, orientation }) => {
		let x = startx - 1;
		let y = starty - 1;

		for (let i = 0; i < answer.length; i++) {
			if (orientation === 'across') {
				answerGrid[y][x + i] = answer[i];
			} else if (orientation === 'down') {
				answerGrid[y + i][x] = answer[i];
			}
		}
	});
	return answerGrid;
	} catch (error) {
	console.error('Error generating Answer grid:', error);
	navigation.navigate('NumberRangeSelector',{ difficulty:difficultylevel });
	// Handle or log the error as needed
	}
};


const CrosswordGrid = ({ route  }) => {
	const navigation = useNavigation();
    const { crosswordData ,difficultylevel,number} = route.params;
	const [grid, setGrid] = useState(generateInitialGrid(crosswordData,difficultylevel,navigation));
	const [clueModalVisible, setClueModalVisible] = useState(false);
	const [selectedClue, setSelectedClue] = useState('');
	const [completionData, setCompletiondata] = useState({
		easy: [],
		medium: [],
		hard: [],
		point:[0],
	
	  });
	const [pnt, setpnt] = useState(0)
	const [pnttoadd, setpnttoadd] = useState(2)
	
	

	useEffect(() => {
		setGrid(generateInitialGrid(crosswordData,difficultylevel,navigation));
	}, [crosswordData]);

	useEffect(() => {
		const retrieveData = async () => {
		  try {
			// Retrieve data associated with the key 'completionData'
			const jsonData = await AsyncStorage.getItem('completionData');
			
			if (jsonData !== null) {
			  // If data exists, parse it from JSON format
			  const data = JSON.parse(jsonData);
			  setCompletiondata(data); // Update state with the retrieved data
			  setpnt(data.point[0])
			} else {
			  setCompletiondata({easy:[],medium:[],hard:[],point:[0]});
			  setpnt(0)
			  console.log('No data found.');
			}
		  } catch (error) {
			console.error('Failed to retrieve data:', error);
		  }
		};
	
		// Call the retrieveData function when the component mounts
		retrieveData();
	  }, []);

	const handleInputChange = (row, col, text) => {
		const newGrid = [...grid];
		newGrid[row][col] = text.toUpperCase();
		setGrid(newGrid);
	};

	const handleGenerate = () => {
		level = (level + 1);
		setGrid(generateInitialGrid(crosswordData,difficultylevel,navigation));
	};

	const handleVerify = async () => {
		const answerGrid = generateAnswerGrid(crosswordData,difficultylevel,navigation);
		const isCorrect = JSON.stringify(grid) === JSON.stringify(answerGrid);
		if (isCorrect) {
			
			let updatedData = { ...completionData };
			if (difficultylevel === 'easy') {
				updatedData = { ...completionData, easy: [...completionData.easy, number] ,point:[pnt+pnttoadd] };
				updateCompletionStatus(crosswordData.id);
				
				addCompletionId(difficultylevel, crosswordData[0][0].id );
			} else if (difficultylevel === 'medium') {
				updatedData = { ...completionData, medium: [...completionData.medium, number],point:[pnt+pnttoadd] };
				updateCompletionStatus('../datas/mediumdata.json', crosswordData.id);
				addCompletionId(difficultylevel, crosswordData[0][0].id );


			} else if (difficultylevel === 'hard') {
				updatedData = { ...completionData, hard: [...completionData.hard, number],point:[pnt+pnttoadd] };
				updateCompletionStatus('../datas/harddata.json', crosswordData.id);
				addCompletionId(difficultylevel, crosswordData[0][0].id );

			}
	
			try {
				
				await AsyncStorage.setItem('completionData', JSON.stringify(updatedData));
				setCompletiondata(updatedData);

				const jsonUri = `${FileSystem.documentDirectory}completion.json`;
				console.log(updatedData)
				await FileSystem.writeAsStringAsync(jsonUri, JSON.stringify(updatedData));
		

				alert('Congratulations! Your crossword is correct.');
			} catch (error) {
				console.error('Failed to update completion data:', error);
				alert('Failed to update completion data. Please try again.');
			}
		} else {
			alert('Incorrect. Please try again.');
		}
	};
	

	const handleReset = () => {
		setGrid(generateInitialGrid(crosswordData,difficultylevel,navigation));
	};

	const handleSolve = () => {
		const answerGrid = generateAnswerGrid(crosswordData,difficultylevel,navigation);
		setpnttoadd(0)
		setGrid(answerGrid);
	};

	const handleClue = (clue) => {
		setSelectedClue(clue);
		setpnttoadd(1)
		setClueModalVisible(true);
	  };

	  const renderGrid = () => {
		try {
			return (
				<View style={styles.blueBackground}>
					{grid.map((row, rowIndex) => (
						<View key={rowIndex} style={styles.row}>
							{row.map((cell, colIndex) => (
								<View key={colIndex} style={styles.cellContainer}>
									{crosswordData[level].map((entry) => {
										try {
											const { startx, starty, position } = entry;
											if (rowIndex + 1 === starty && colIndex + 1 === startx) {
												return (
													<Text key={`digit-${position}`} 
														style={styles.smallDigit}>
														{position}
													</Text>
												);
											}
										} catch (error) {
											console.error('Error rendering grid entry:', error);
											// Handle or log the error as needed
										}
										return null;
									})}
									<TextInput
										style={[styles.cell, 
										grid[rowIndex][colIndex] ==='X' ? styles.staticCell:null]}
										value={cell}
										editable={grid[rowIndex][colIndex] !== 'X'}
										onChangeText={(text) =>
											handleInputChange(rowIndex,colIndex, text)
										}
										maxLength={1}
									/>
								</View>
							))}
						</View>
					))}
				</View>
			);
		} catch (error) {
			console.error('Error rendering grid:', error);
			// Handle or log the error as needed
			return null;
		}
	};
	

	const renderQuestions = () => {
		const questions = { across: [], down: [] };

		crosswordData[level].forEach(({ clue,hint, orientation, position }) => {
			const questionText = `${position}. ${hint} `;
			questions[orientation].push(
				<>
				
				<Text key={`question-${position}`} style={styles.questionText}>
					{questionText}
				</Text>
          		{/* <Button color={'#8f3321'} title="Clue" onPress={() => handleClue(clue)} style={styles.button} /> */}
				<TouchableOpacity style={styles.image} onPress={() => handleClue(clue)}>
  				<Image
    				source={require('../../assets/idea.png')}
   					 style={styles.imageButton}
  					/>
				</TouchableOpacity>
		  </>


			);
		});

		return (
			<View>
				  
				<View style={styles.headingContainer}>
					<Text style={styles.headingText}>Across</Text>
				</View>
				<View style={styles.questionsContainer}>
					{questions.across.map((question, index) => (
						<View key={`across-question-container-${index}`}>
							{question}
						</View>
					))}
				</View>
				<View style={styles.headingContainer}>
					<Text style={styles.headingText}>Down</Text>
				</View>
				<View style={styles.questionsContainer}>
					{questions.down.map((question, index) => (
						<View key={`down-question-container-${index}`}>
							{question}
						</View>
					))}
				</View>
			
			</View>
		);
	};


	return (
		<View style={{ flex: 1 }}>
			
		<View style={styles.headerContainer}>
			<Text style={styles.headerText}>Level:{number}</Text>

			<View>
          
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={styles.headerText}>Score:</Text>
  <View style={styles.headerScore}>
    <Text style={styles.headerText}>{completionData.point[0]}</Text>
  </View>
</View>


			</View>
			
			


		  </View>
		<ImageBackground source={require('../../assets/bg.png')} style={styles.background}>
  <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
	
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="none"
	  showsVerticalScrollIndicator={false}> 
      <View style={styles.container}>
        {renderGrid()}
		<ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="none"
	  showsVerticalScrollIndicator={false}>
        {renderQuestions()}
		</ScrollView>
        <View style={styles.buttonContainer}>
          <View style={styles.gap} />
          <Button color={'#8f3321'} title="Verify" onPress={handleVerify} style={styles.button} />
          <View style={styles.gap} />
          <Button color={'#8f3321'} title="Reset" onPress={handleReset} style={styles.button} />
          <View style={styles.gap} />
          <Button color={'#8f3321'} title="Solve" onPress={handleSolve} style={styles.button} />
		  <View style={styles.gap} />
        </View>

		

      </View>
    </ScrollView>
	<Modal
            animationType="slide"
            transparent={true}
            visible={clueModalVisible}
            onRequestClose={() => {
              setClueModalVisible(false);
            }}>
            <View style={[styles.centeredView]}>
			
              <View style={[styles.modalView]}>
			  <TouchableOpacity 
                  onPress={() => setClueModalVisible(false)}
				  style={styles.close}
				  >
                  <Text style={styles.closeButton}>X</Text>
                </TouchableOpacity >

                <Text style={styles.modalText}>{selectedClue}</Text>
           
              </View>
            </View>
          </Modal>
  </KeyboardAvoidingView>
</ImageBackground>
</View>

	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom:20,
		paddingHorizontal:5,
		height: '100%',
		width:'100%'
		
		
	},

	headerScore:{
		borderWidth:1,
		marginRight:10,
		alignItems:'center'

	},
	background: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "center",
	
	
	},
	blueBackground: {
		marginTop:30,
		paddingHorizontal:30,
	    paddingVertical:30,
		justifyContent: 'center',
		backgroundColor: '#0097B2',
		flex: 1 
	  },
	  headerContainer: {
		backgroundColor: '#0097B2',
		paddingTop: '10%',
		paddingVertical: '5%',
		flexDirection: 'row',
		justifyContent:'space-between'
	  
	  },
	  headerText: {
		marginLeft:20,
		marginRight:20,
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	  },
	  icon: {
		marginRight:20,
		width: 25,
		height: 20,
	  },
	row: {
		flexDirection: 'row',
	},
	cellContainer: {
		position: 'relative',
	
	},
	image:{
			position:'absolute',
			right:0,

	},
	cell: {
		borderWidth: 1,
		margin: 1,
		borderColor: 'white',
		width: 'auto',
		height: 'auto',
		textAlign: 'center',
		flexShrink: 1, // Allow cell to shrink when necessary
  		flexGrow: 0, // Do not allow cell to grow

		
	},
	close: {
		position: 'absolute',
		top: -10, // Adjust as needed
		right: -10, // Adjust as needed
		backgroundColor: 'brown',
		paddingBottom: 8,
		paddingHorizontal: 15,
		borderRadius: 50,
		zIndex: 1, // Ensure it's above other content
		alignSelf:'center',
		justifyContent:'center',
		alignItems:'center',
	  },

	staticCell: {
		
		borderColor: 'transparent',
		color: '#0097B2',
		
	},
	imageButton: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
	  },
	smallDigit: {
		position: 'absolute',
		top: 2,
		left: 2,
		fontSize: 10,
		fontWeight: 'bold',
	},
	questionsContainer: {
		justifyContent: 'space-between',
		marginBottom: 10,
		padding: 10,
	},
	questionText: {
		fontSize: 16,
		color: 'red',
		marginBottom:10,
		marginRight:30,
	
	},
	headingContainer: {
		marginTop: 10,
		marginBottom: 5,
	},
	headingText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#0097B2',
		
		// textAlign: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 20,
		marginHorizontal: 10,
	},
	button: {
		flex: 1, 
	},
	gap: {
		width: 10, 
	},
	centeredView: {
		
		justifyContent: "center",
		alignItems: "center",
		
	  },
	  modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
		  width: 0,
		  height: 2
		},
	
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	  },
	  modalText: {
		marginBottom: 15,
		textAlign: "center"
	  },
	  closeButton: {
		color: 'black',
		marginTop: 10,
		textAlign: "center",
		
	  }
});

export default CrosswordGrid
