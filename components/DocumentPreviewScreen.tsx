import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { Image } from 'expo-image';
import { DocumentPreviewProps } from '@/types/types';

const DocumentPreviewScreen: React.FC<DocumentPreviewProps> = ({ route }) => {
  const { document } = route.params;

  const isPdf = document.type === 'application/pdf';

  return (
    <View style={styles.container}>
      {isPdf ? (
        <Pdf
          source={{ uri: document.uri }}
          style={styles.pdf}
        />
      ) : (
        <Image
          source={{ uri: document.uri }}
          style={styles.image}
          contentFit="contain"
          transition={200}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  image: {
    flex: 1,
    width: '100%',
  },
});

export default DocumentPreviewScreen;