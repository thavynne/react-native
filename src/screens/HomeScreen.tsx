
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MeuPrimeiroApp</Text>

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrap}>
          <Button title="Lista de Usuários" onPress={() => navigation.navigate('List')} />
        </View>

        <View style={styles.buttonWrap}>
          <Button title="Detalhes" onPress={() => navigation.navigate('Details')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  buttonWrap: {
    marginHorizontal: 10,
    minWidth: 140,
  },
});
