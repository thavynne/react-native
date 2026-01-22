import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native"
import { useState } from "react"

export default function RegisterScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [idade, setIdade] = useState("")
  const [phone, setPhone] = useState("")

  function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
    }

    function isValidPhone(phone: string) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return phoneRegex.test(phone)
    }

  function handleSave() {
    
    if (name === "" || email === "" || idade === "" || phone === "") {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.')
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.')
      return
    }

    if (!isValidPhone(phone)) {
      Alert.alert('Erro', 'Por favor, insira um telefone válido.')
      return
    }

    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!')

    console.log('Nome:', name)
    console.log('Email:', email)
    console.log('Idade:', idade)
    console.log('Telefone:', phone)

    //Futuramente entra CRUD aqui




    //Limpa o formulário
    setName("")
    setEmail("")
    setIdade("")
    setPhone("")
  }

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

        <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={"#aaa"}
            value={name}
            onChangeText={setName}
        />

        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={"#aaa"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
        />

        <TextInput
            style={styles.input}
            placeholder="Idade"
            placeholderTextColor={"#aaa"}
            value={idade}
            onChangeText={setIdade}
            keyboardType="numeric"
        />

        <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor={"#aaa"}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
        />

        <View style={styles.buttonContainer}>
            <Button title="Salvar" onPress={handleSave} />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Cancelar" onPress={() => {
            setName("")
            setEmail("")
            setIdade("")
            setPhone("")
          }} />
        </View>
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
    },
    input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: "#fff",
    },
    buttonContainer: {
    marginTop: 15,
    paddingHorizontal: 50,
    },
});