import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ListScreen from '../screens/ListScreen';

export type AppStackParamList = {
  Home: undefined;
  Details: undefined;
  List: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Detalhes',
        }}
      />

      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{
          title: 'Lista de Usuários',
        }}
      />
    </Stack.Navigator>
  );
};
