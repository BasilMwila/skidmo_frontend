import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigation from '../BottomNavigation';

interface TabLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

const TabLayout: React.FC<TabLayoutProps> = ({ children, showBottomNav = true }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      {showBottomNav && (
        <View style={styles.bottomNavContainer}>
          <BottomNavigation />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TabLayout;