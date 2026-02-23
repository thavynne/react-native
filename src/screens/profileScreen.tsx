import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, loading: authLoading, isSignedIn } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone?: string;
  } | null>(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSignedIn || authLoading) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        const data = userDoc.data();

        setProfile({
          name: data?.nome ?? 'Não informado',
          email: data?.email ?? user.email ?? 'Não informado',
          phone: data?.telefone ?? 'Não informado',
        });
      } catch {
        setProfile({
          name: 'Não informado',
          email: user.email ?? 'Não informado',
          phone: 'Não informado',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isSignedIn, authLoading]);

  if (authLoading || loading || saving) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!user || !isSignedIn) {
    return (
      <View style={styles.center}>
        <Text>Usuário não autenticado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={editName}
          onChangeText={setEditName}
          placeholder="Nome"
        />
      ) : (
        <Text style={styles.value}>{profile?.name}</Text>
      )}

      <Text style={styles.label}>E-mail:</Text>
      <Text style={styles.value}>{profile?.email}</Text>

      <Text style={styles.label}>Telefone:</Text>
      {editing ? (
        <TextInput
          style={styles.input}
          value={editPhone}
          onChangeText={setEditPhone}
          placeholder="Telefone"
          keyboardType="phone-pad"
        />
      ) : (
        <Text style={styles.value}>{profile?.phone}</Text>
      )}

      {!editing ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setEditName(profile?.name === 'Não informado' ? '' : profile?.name || '');
            setEditPhone(profile?.phone === 'Não informado' ? '' : profile?.phone || '');
            setEditing(true);
          }}
        >
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (!user) return;

            setSaving(true);
            try {
              await updateDoc(doc(db, 'usuarios', user.uid), {
                nome: editName,
                telefone: editPhone,
              });

              setProfile((prev) =>
                prev
                  ? {
                      ...prev,
                      name: editName || 'Não informado',
                      phone: editPhone || 'Não informado',
                    }
                  : prev
              );

              setEditing(false);
            } catch {
              Alert.alert('Erro', 'Não foi possível salvar as alterações.');
            } finally {
              setSaving(false);
            }
          }}
        >
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#dc3545', marginTop: 8 }]}
        onPress={async () => {
          try {
            await signOut(auth);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch {
            Alert.alert('Erro', 'Não foi possível sair da conta.');
          }
        }}
      >
        <Text style={styles.buttonText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    width: 220,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;