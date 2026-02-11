import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { app, db } from './src/config/firebaseConfig';

console.log("Firebase conectado:", app.name);
console.log('Firestore instância:', db ? 'Disponível' : 'Indisponível');

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}