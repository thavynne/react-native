import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ListScreen from '../screens/ListScreen';
import ProfileScreen from '../screens/profileScreen';

export type AppStackParamList = {
  Home: undefined;
  Details: undefined;
  List: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const ProfileHeaderIcon = () => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={() => navigation.navigate('Profile')}
      accessibilityLabel="Perfil"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="person-circle-outline" size={28} color="#222" />
    </TouchableOpacity>
  );
};

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
          headerRight: () => <ProfileHeaderIcon />,
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

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
        }}
      />
    </Stack.Navigator>
  );
};