import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { AppStackParamList } from '../navigation/AppStack';
import { auth } from '../config/firebaseConfig';

type DetailsScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Details'>;

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
        if (navigation.replace) {
          navigation.replace('Home');
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

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