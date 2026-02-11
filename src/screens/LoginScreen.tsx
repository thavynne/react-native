// Página de login (Ao realizar autenticação com firebase, será redirecionado automaticamente)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      console.log('Usuário logado:', userCredential.user.email);
      // Não preciso fazer navegação manual - o AppNavigator vai detectar a mudança de estado
      setEmail('');
      setSenha('');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      let mensagemErro = 'Erro ao fazer login';

      switch (error.code) {
        case 'auth/invalid-email':
          mensagemErro = 'Email inválido';
          break;
        case 'auth/user-not-found':
          mensagemErro = 'Usuário não encontrado';
          break;
        case 'auth/wrong-password':
          mensagemErro = 'Senha incorreta';
          break;
        case 'auth/invalid-credential':
          mensagemErro = 'Credenciais inválidas';
          break;
        default:
          mensagemErro = error.message;
      }

      Alert.alert('Erro no Login', mensagemErro);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
          style={styles.input}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>
            Esqueci minha senha
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#1e90ff',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'right',
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#ff6b35',
    fontSize: 14,
    fontWeight: '600',
  }
});
