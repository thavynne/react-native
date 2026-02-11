import React, { useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { AppStackParamList } from '../navigation/AppStack';

type HomeScreenNavigationProp =
  NativeStackNavigationProp<AppStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const { user, logout } = useContext(AuthContext);
  const [loggingOut, setLoggingOut] = React.useState(false);

  useEffect(() => {
    console.log('HomeScreen montado - Usuário:', user?.email);
    return () => {
      console.log('HomeScreen desmontado');
    };
  }, [user]);

  const handleLogout = async () => {
    Alert.alert('Logout', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
            // O AppNavigator detectará a mudança e redirecionará para Login automaticamente
          } catch {
            Alert.alert('Erro', 'Erro ao fazer logout');
            setLoggingOut(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (loggingOut) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Desconectando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Meu Primeiro App!</Text>
      <Text style={styles.userEmail}>Logado como: {user?.email}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Lista de Usuários"
          onPress={() => navigation.navigate('List')}
          color="#4CAF50"
        />

        <View style={{ marginTop: 10 }} />

        <Button
          title="Detalhes"
          onPress={() => navigation.navigate('Details')}
          color="#2196F3"
        />

        <View style={{ marginTop: 20 }} />

        <Button
          title="Sair (Logout)"
          onPress={handleLogout}
          color="#f44336"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 30,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
