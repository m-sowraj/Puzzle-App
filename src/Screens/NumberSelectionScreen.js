import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper'; // Assuming you're using react-native-paper
import NumberSelectionScreen from '../Components/PuzzleLevel';

const NumberRangeSelector = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const startNumber = (currentPage - 1) * itemsPerPage + 1;
  const endNumber = currentPage * itemsPerPage;

  return (
    <ImageBackground source={require('../../assets/bg.png')} style={styles.background}>
      <View style={{ flex: 1 }}>
        <NumberSelectionScreen start={startNumber} end={endNumber} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
          <IconButton
            icon="arrow-collapse-left"
            onPress={handlePreviousPage}
            disabled={currentPage === 1}
            color="#0097B2"
    
          />
          <IconButton
            icon="arrow-collapse-right"
            onPress={handleNextPage}
            color="#0097B2"
    
          />
        </View>
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
});

export default NumberRangeSelector;
