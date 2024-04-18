import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';
import NumberSelectionScreen from '../Components/PuzzleLevel';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NumberRangeSelector = ({ route }) => {
  const navigation = useNavigation();
  const { difficulty } = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [completionData, setCompletiondata] = useState(null); // Initialize with null
  const [isNextDisabled, setIsNextDisabled] = useState(false); // State to disable next button
  const startNumber = (currentPage - 1) * itemsPerPage + 1;
  const endNumber = currentPage * itemsPerPage;

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Refresh data or perform any necessary actions when the screen comes into focus
  //     if (!completionData || !completionData[difficulty]) {
  //       setIsNextDisabled(false); // Disable next button if data is not available
  //       return;
  //     }
  
  //     let completedCount = 0;
  //     const startNumber = (currentPage - 1) * itemsPerPage + 1;
  //     const endNumber = currentPage * itemsPerPage;
  
  //     completionData[difficulty].forEach((completedNumber) => {
  //       if (completedNumber >= startNumber && completedNumber <= endNumber) {
  //         completedCount++;
  //       }
  //     });
  //     console.log(completedCount)
  //     setIsNextDisabled(completedCount >= 5 ? true : false);
  //   }, [])
  // );
  useFocusEffect(
    React.useCallback(() => {
      const retrieveData = async () => {
        try {
          const jsonData = await AsyncStorage.getItem('completionData');
  
          if (jsonData !== null) {
            const data = JSON.parse(jsonData);
            setCompletiondata(data);
          } else {
            setCompletiondata({ easy: [], medium: [], hard: [], point: [] });
          }
        } catch (error) {
          console.error('Failed to retrieve data:', error);
        }
      };
  
      retrieveData();
        }, [])
  );

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const jsonData = await AsyncStorage.getItem('completionData');

        if (jsonData !== null) {
          const data = JSON.parse(jsonData);
          setCompletiondata(data);
        } else {
          setCompletiondata({ easy: [], medium: [], hard: [], point: [] });
        }
      } catch (error) {
        console.error('Failed to retrieve data:', error);
      }
    };

    retrieveData();
  }, []);

  useEffect(() => {
    if (!completionData || !completionData[difficulty]) {
      setIsNextDisabled(false); // Disable next button if data is not available
      return;
    }

    let completedCount = 0;
    const startNumber = (currentPage - 1) * itemsPerPage + 1;
    const endNumber = currentPage * itemsPerPage;

    completionData[difficulty].forEach((completedNumber) => {
      if (completedNumber >= startNumber && completedNumber <= endNumber) {
        completedCount++;
      }
    });
    console.log(completedCount)
    setIsNextDisabled(completedCount >= 5 ? true : false); // Disable next button if completedCount is greater than or equal to 5
    
  }, [currentPage, completionData, difficulty, itemsPerPage]);
  console.log(isNextDisabled)
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{difficulty.toUpperCase()}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/Back.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <ImageBackground source={require('../../assets/bg.png')} style={styles.background}>
        <View style={{ flex: 1, marginTop: '25%' }}>
          <NumberSelectionScreen start={startNumber} end={endNumber} difficultylevel={difficulty} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
            <TouchableOpacity disabled={currentPage === 1} onPress={() => handlePreviousPage()}>
              <Image source={require('../../assets/left.png')} style={styles.icon2} />
            </TouchableOpacity>
            <TouchableOpacity 
     
          onPress={() => {
          if (isNextDisabled === false) {
            alert('You should complete at least 5.');
          } else {
         handleNextPage();
        }
      }}
        >
       <Image source={require('../../assets/right.png')} style={styles.icon2} />
        </TouchableOpacity>

          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: '#0097B2',
    paddingTop: '10%',
    paddingVertical: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: {
    marginLeft: 20,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 20,
    width: 25,
    height: 20,
  },
  icon2: {
    marginBottom: 55,
    marginHorizontal: 45,
    width: 50,
    height: 30,
  },
});

export default NumberRangeSelector;
