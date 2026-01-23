import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Paths, File } from 'expo-file-system';

export default function RegisterScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [idade, setIdade] = useState('');
    const [phone, setPhone] = useState('');

    // Validação de e-mail com REGEX
    function isValidEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validação de telefone (10 ou 11 dígitos)
    function isValidPhone(phone: string) {
        const phoneNumbers = phone.replace(/\D/g, '');
        const phoneRegex = /^\d{10,11}$/;
        return phoneRegex.test(phoneNumbers);
    }

    //  CREATE - salvar no AsyncStorage e arquivo JSON
    async function saveUser() {
        try {
            console.log('Iniciando salvamento...');
            const newUser = {
                id: Date.now().toString(),
                nome,
                email,
                idade,
                phone,
            };
            console.log('Novo usuário:', newUser);

            const storedUsers = await AsyncStorage.getItem('@users');
            let users = storedUsers ? JSON.parse(storedUsers) : [];
            console.log('Usuários existentes:', users.length);

            users.push(newUser);
            // Converte o array para string
            await AsyncStorage.setItem('@users', JSON.stringify(users));
            console.log('Salvo no AsyncStorage');

            // Salva também em arquivo JSON físico
            try {
                const file = new File(Paths.document, 'usuarios.json');
                const writer = file.writableStream().getWriter();
                const jsonData = JSON.stringify(users, null, 2);
                await writer.write(new TextEncoder().encode(jsonData));
                await writer.close();
                console.log('Salvo no arquivo:', file.uri);

                Alert.alert(
                    'Sucesso',
                    `Usuário salvo com sucesso!\n\nTotal de usuários: ${users.length}\n\nArquivo salvo em:\n${file.uri}`
                );
            } catch (fileError) {
                console.error('Erro ao salvar arquivo:', fileError);
                // Mesmo com erro no arquivo, o AsyncStorage foi salvo
                Alert.alert(
                    'Parcialmente Salvo',
                    `Usuário salvo no AsyncStorage, mas houve erro ao salvar o arquivo.\n\nTotal de usuários: ${users.length}`
                );
            }

            // Limpa formulário
            setNome('');
            setEmail('');
            setIdade('');
            setPhone('');

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            Alert.alert('Erro', `Não foi possível salvar o usuário.\n\nDetalhes: ${error}`);
        }
    }

    // Fluxo principal
    function handleSave() {

        if (!nome || !email || !idade || !phone) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Erro', 'E-mail inválido.');
            return;
        }

        if (!isValidPhone(phone)) {
            Alert.alert('Erro', 'Telefone deve conter 10 ou 11 dígitos.');
            return;
        }

        saveUser();
    }

    // Visualizar dados salvos (prioriza AsyncStorage)
    async function viewSavedData() {
        try {
            console.log('Lendo dados salvos...');
            
            // Primeiro tenta ler do AsyncStorage
            const storedUsers = await AsyncStorage.getItem('@users');
            console.log('Dados do AsyncStorage:', storedUsers);
            
            if (!storedUsers) {
                Alert.alert('Aviso', 'Nenhum usuário foi salvo ainda.');
                return;
            }

            const users = JSON.parse(storedUsers);
            console.log('Usuários encontrados:', users.length);
            
            const userList = users.map((u: any, index: number) => 
                `${index + 1}. ${u.nome} - ${u.email} - Tel: ${u.phone}`
            ).join('\n');

            // Tenta pegar o caminho do arquivo
            let filePath = '';
            try {
                const file = new File(Paths.document, 'usuarios.json');
                filePath = `\n\nArquivo: ${file.uri}`;
            } catch (e) {
                console.log('Erro ao obter caminho do arquivo:', e);
            }

            Alert.alert(
                'Usuários Salvos',
                `Total: ${users.length}\n\n${userList}${filePath}`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Erro ao ler dados:', error);
            Alert.alert('Erro', `Não foi possível ler os dados.\n\nDetalhes: ${error}`);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Idade"
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Telefone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <View style={styles.buttonContainer}>
                <Button title="Salvar" onPress={handleSave} />
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Cancelar"
                    color="red"
                    onPress={() => {
                        setNome('');
                        setEmail('');
                        setIdade('');
                        setPhone('');
                    }}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title="Ver Dados Salvos"
                    color="green"
                    onPress={viewSavedData}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    buttonContainer: {
        marginBottom: 10,
    },
});