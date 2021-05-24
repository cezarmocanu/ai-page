import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {CameraPage} from './CameraPage';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (<CameraPage />);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
