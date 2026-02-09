import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ListScreen from '../screens/ListScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Register: undefined;
  List: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  
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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Recuperar Senha' }}
      />
    </Stack.Navigator>
  );
}
