import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native"
import { useState } from "react"

export default function ResgisterScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [idade, setIdade] = useState("")

  function handleSave() {
    console.log('Nome:', name)
    console.log('Email:', email)
    console.log('Idade:', idade)

    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!')

    //Limpa o formulário
    setName("")
    setEmail("")
    setIdade("")
  }

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

        <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
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

        <Button title="Salvar" onPress={handleSave} />
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
    },
    input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    },
});