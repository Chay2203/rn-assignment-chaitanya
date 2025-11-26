import React from 'react';
import { StatusBar } from 'react-native';
import Home from './src/screens/Home';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <Home />
    </>
  );
}
