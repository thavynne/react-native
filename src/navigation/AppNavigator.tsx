import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ListScreen from '../screens/ListScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Register: undefined;
  List: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Detalhes' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title:'Cadastro' }}
      />
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{ title: 'Lista de Usuários' }}
      />
    </Stack.Navigator>
  );
}
