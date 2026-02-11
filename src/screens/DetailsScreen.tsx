import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';

import { RootStackParamList } from '../navigation/AppNavigator';
import { auth } from '../config/firebaseConfig';

type DetailsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'Details'>;

type Props = {
  navigation: DetailsScreenNavigationProp;
};

export default function DetailsScreen({ navigation }: Props) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        Alert.alert(
          'Acesso restrito',
          'Você precisa estar logado para acessar esta tela'
        );
        navigation.replace('Login');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Detalhes</Text>

      <Text style={styles.text}>
        Esta é a tela de detalhes do aplicativo.
      </Text>

      <Button
        title="Voltar para Início"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
