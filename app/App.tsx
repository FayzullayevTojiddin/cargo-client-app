import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import RequestPhoneNumberScreen from './screens/auth/RequestPhoneNumberScreen';

const isAuth = false;

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />

      {isAuth ? <HomeScreen /> : <RequestPhoneNumberScreen />}
    </SafeAreaView>
  );
}
