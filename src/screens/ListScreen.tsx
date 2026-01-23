import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type User = {
  id: string;
  nome: string;
  email: string;
  idade: string;
  phone: string;
};

export default function ListScreen() {
  const [users, setUsers] = useState<User[]>([]);

  // READ - carregar do AsyncStorage ao focar na tela
  useFocusEffect(
    useCallback(() => {
      async function fetchUsers() {
        try {
          const storedUsers = await AsyncStorage.getItem('users');
          const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [];
          setUsers(parsedUsers);
          console.log('Usuários carregados:', parsedUsers.length);
        } catch (error) {
          console.error('Erro ao carregar usuários:', error);
          Alert.alert('Erro', 'Não foi possível carregar os usuários.');
        }
      }

      fetchUsers();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userText}>{item.nome}</Text>
            <Text style={styles.userText}>{item.email}</Text>
            <Text style={styles.userText}>Idade: {item.idade}</Text>
            <Text style={styles.userText}>Tel: {item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  userText: {
    fontSize: 16,
  },
});
