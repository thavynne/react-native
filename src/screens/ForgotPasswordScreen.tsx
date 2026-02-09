import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function ForgotPasswordScreen({ navigation }: any) {
  // Estado para armazenar o email e o estado de carregamento
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para lidar com o envio do email de redefinição de senha
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Atenção', 'Digite seu email para redefinir a senha');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Sucesso',
        'Email de redefinição de senha enviado. Verifique sua caixa de entrada.'
      );
      navigation.goBack();
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error);

      let mensagemErro = 'Erro ao enviar email de redefinição';

      switch (error.code) {
        case 'auth/invalid-email':
          mensagemErro = 'Email inválido';
          break;
        case 'auth/user-not-found':
          mensagemErro = 'Usuário não encontrado';
          break;
        default:
          mensagemErro = error.message;
      }

      Alert.alert('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  // Interface da tela
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueci minha senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Enviando...' : 'Enviar email de redefinição'}
        </Text>
      </TouchableOpacity>
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
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
});
