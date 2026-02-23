import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthStack';

type RegisterNavProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterNavProp>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [salvando, setSalvando] = useState(false);

  const [nomeError, setNomeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [telefoneError, setTelefoneError] = useState(false);
  const [senhaError, setSenhaError] = useState(false);

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarTelefone = (telefone: string) =>
    telefone.replace(/\D/g, '').length === 11;

  const validarFormulario = () => {
    let erro = false;

    setNomeError(!nome || nome.trim().length < 3);
    setEmailError(!validarEmail(email));
    setTelefoneError(!validarTelefone(telefone));
    setSenhaError(senha.length < 6);

    if (
      nome.trim().length < 3 ||
      !validarEmail(email) ||
      !validarTelefone(telefone) ||
      senha.length < 6
    ) {
      erro = true;
    }

    return !erro;
  };

  const formatarTelefone = (texto: string) => {
    const n = texto.replace(/\D/g, '');

    if (n.length <= 2) return `(${n}`;
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`;
  };

  const salvarDados = async () => {
    if (!validarFormulario()) {
      Alert.alert('Erro', 'Corrija os erros do formulário.');
      return;
    }

    setSalvando(true);

    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        senha
      );

      const uid = credencial.user.uid;

      await setDoc(doc(db, 'usuarios', uid), {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone,
        criadoEm: Timestamp.now(),
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Erro',
        error.code === 'auth/email-already-in-use'
          ? 'Este email já está cadastrado.'
          : 'Erro ao realizar cadastro.'
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Usuários</Text>

      {/* NOME */}
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={nomeError ? styles.inputError : styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={(t) => {
          setNome(t);
          setNomeError(false);
        }}
      />
      {nomeError && <Text style={styles.textoErro}>Mínimo 3 caracteres</Text>}

      {/* EMAIL */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={emailError ? styles.inputError : styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setEmailError(false);
        }}
      />
      {emailError && <Text style={styles.textoErro}>Email inválido</Text>}

      {/* TELEFONE */}
      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={telefoneError ? styles.inputError : styles.input}
        placeholder="(XX) XXXXX-XXXX"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={(t) => {
          setTelefone(formatarTelefone(t));
          setTelefoneError(false);
        }}
      />
      {telefoneError && (
        <Text style={styles.textoErro}>Telefone com 11 dígitos</Text>
      )}

      {/* SENHA */}
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={senhaError ? styles.inputError : styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={(t) => {
          setSenha(t);
          setSenhaError(false);
        }}
      />
      {senhaError && (
        <Text style={styles.textoErro}>Mínimo 6 caracteres</Text>
      )}

      <TouchableOpacity
        style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
        onPress={salvarDados}
        disabled={salvando}
      >
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>SALVAR</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  inputError: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f44336',
    borderRadius: 8,
    padding: 12,
  },
  textoErro: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  botaoSalvar: {
    backgroundColor: '#4CAF50',
    marginTop: 30,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});