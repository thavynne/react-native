# 🚀 Quick Reference - Persistência de Sessão

## 📂 Estrutura de Arquivos

```
MeuPrimeiroApp/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx ⭐ NOVO - Gerenciador de autenticação
│   ├── navigation/
│   │   ├── AppNavigator.tsx ⭐ MODIFICADO - Orquestrador de rotas
│   │   ├── AuthStack.tsx ⭐ PREENCHIDO - Rotas públicas
│   │   └── AppStack.tsx ⭐ PREENCHIDO - Rotas privadas
│   └── screens/
│       ├── LoginScreen.tsx ⭐ MODIFICADO - Sem navegação manual
│       └── HomeScreen.tsx ⭐ MODIFICADO - Com logout
├── App.tsx ⭐ MODIFICADO - Com AuthProvider
├── IMPLEMENTATION_GUIDE.md ⭐ NOVO
├── ARCHITECTURE.md ⭐ NOVO
└── TESTING_GUIDE.md ⭐ NOVO
```

---

## 🎯 Como Funciona em 30 Segundos

```
1. App.tsx envolve tudo com AuthProvider
   ↓
2. AuthProvider escuta onAuthStateChanged do Firebase
   ↓
3. AppNavigator vê o estado (isSignedIn)
   ↓
4. AuthStack (login) → Se não logado
   AppStack (app) → Se logado
   ↓
5. Ao fazer login → isSignedIn fica true → AppStack renderiza
   Ao fazer logout → isSignedIn fica false → AuthStack renderiza
```

---

## 💻 Código Chave

### 1. App.tsx
```tsx
<AuthProvider>
  <AppNavigator />
</AuthProvider>
```

### 2. AuthContext.tsx
```tsx
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  });
  return () => unsubscribe();
}, []);
```

### 3. AppNavigator.tsx
```tsx
if (loading) return <ActivityIndicator />;
return isSignedIn ? <AppStack /> : <AuthStack />;
```

### 4. LoginScreen.tsx
```tsx
await signInWithEmailAndPassword(auth, email, senha);
// Sem navegação manual - AppNavigator detecta automaticamente!
```

### 5. HomeScreen.tsx
```tsx
const { user, logout } = useContext(AuthContext);
// Mostra email do usuário e botão de logout
```

---

## 🔐 Estados de Autenticação

| Estado | loading | isSignedIn | user | Renderização |
|--------|---------|------------|------|--------------|
| Inicializando | true | ? | ? | ActivityIndicator |
| Não autenticado | false | false | null | AuthStack |
| Autenticado | false | true | User | AppStack |

---

## 🔄 Fluxo em Bullet Points

### Login
✅ Usuário faz login
✅ `signInWithEmailAndPassword()` sucesso
✅ `onAuthStateChanged` dispara
✅ `user` = dados do Firebase
✅ `isSignedIn` = true
✅ AppNavigator renderiza AppStack
✅ HomeScreen exibida

### Logout
✅ Usuário clica "Sair"
✅ `logout()` chamado
✅ `signOut()` do Firebase
✅ `onAuthStateChanged` dispara
✅ `user` = null
✅ `isSignedIn` = false
✅ AppNavigator renderiza AuthStack
✅ LoginScreen exibida

### Persistência
✅ App reaberto
✅ `onAuthStateChanged` executa
✅ Firebase verifica token local
✅ Se válido → `user` = dados → AppStack
✅ Se inválido → `user` = null → AuthStack

---

## 🧪 Testes Rápidos

```bash
# 1. Fazer login
Insira credenciais → Clique "Entrar" → Observe transição para HomeScreen

# 2. Fazer logout
Clique "Sair" → Confirme → Observe transição para LoginScreen

# 3. Verificar persistência
Feche app → Reabra → Deve ir para HomeScreen (se estava logado)

# 4. Verificar logout persistente
Faça logout → Feche app → Reabra → Deve ir para LoginScreen
```

---

## 🛠️ Customizações Comuns

### Adicionar Nova Rota Privada
```tsx
// 1. No AppStack.tsx
<Stack.Screen name="Perfil" component={PerfilScreen} />

// 2. Adicionar tipo
export type AppStackParamList = {
  Home: undefined;
  Perfil: undefined;
};

// 3. Usar em componente
navigation.navigate('Perfil')
```

### Adicionar Nova Rota Pública
```tsx
// 1. No AuthStack.tsx
<Stack.Screen name="TermosUso" component={TermosUsoScreen} />

// 2. Adicionar tipo
export type AuthStackParamList = {
  Login: undefined;
  TermosUso: undefined;
};
```

### Acessar Contexto de Autenticação
```tsx
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function MinhaScreen() {
  const { user, isSignedIn, logout, loading } = useContext(AuthContext);
  
  return (
    <Text>Email: {user?.email}</Text>
  );
}
```

---

## ⚠️ Coisas Importantes

❌ **NÃO FAÇA:**
- Não use `navigation.navigate('Home')` após login
- Não acesse telas privadas sem verificar `isSignedIn`
- Não armazene manualmente a sessão (Firebase faz isso)
- Não remova o `onAuthStateChanged`

✅ **FAÇA:**
- Deixe o AppNavigator decidir qual stack renderizar
- Use `useContext(AuthContext)` para acessar usuário
- Confie no `onAuthStateChanged` para detectar mudanças
- Sempre envolver com `AuthProvider` no topo

---

## 📊 Comparação Antes vs Depois

### ❌ ANTES (Sem Persistência)
```
App inicia → Login sempre exibido
Faz login → navigation.navigate('Home') → Vai para Home
Fecha app → Token perdido
Reabra app → Login novamente (sessão perdida)
```

### ✅ DEPOIS (Com Persistência)
```
App inicia → Verifica sessão → Home ou Login
Faz login → AppNavigator auto-detecta → Home (sem navegação manual)
Fecha app → Token mantido
Reabra app → Verifica sessão → Home direto (persistência)
```

---

## 🎓 Conceitos Aprendidos

1. **Context API** - Compartilhar estado globalmente
2. **Firebase Auth** - Autenticação com backend
3. **onAuthStateChanged** - Monitorar estado em tempo real
4. **Rotas Condicionais** - Renderizar baseado em estado
5. **Persistência** - Token armazenado localmente
6. **UX** - Transições automáticas e suaves

---

## 🔗 Referências Rápidas

### Firebase
- Inicializar: `import { auth } from '../config/firebaseConfig'`
- Fazer login: `signInWithEmailAndPassword(auth, email, senha)`
- Fazer logout: `signOut(auth)`
- Monitorar: `onAuthStateChanged(auth, callback)`

### React Navigation
- Tipos: `type RootStackParamList = { ... }`
- Acessar: `navigation.navigate('Screen')`
- Usar tipos: `NativeStackNavigationProp<ParamList, 'Screen'>`

### Context
- Criar: `createContext(defaultValue)`
- Usar: `useContext(Context)`
- Envolver: `<Provider value={...}>`

---

## 📞 Dúvidas Frequentes

### P: Por que não preciso fazer `navigation.navigate()` após login?
**R:** O AppNavigator escuta o contexto. Quando `isSignedIn` muda, ele automaticamente renderiza o stack certo.

### P: Minha sessão está sendo perdida. O que fazer?
**R:** Verifique se `AuthProvider` está envolvendo `AppNavigator` (não o contrário).

### P: Como acessar o email do usuário em qualquer componente?
**R:** Use `const { user } = useContext(AuthContext)` e depois `user?.email`.

### P: Como adicionar uma nova tela privada?
**R:** Adicione em `AppStack.tsx` e, se for rota de parâmetro, atualize `AppStackParamList`.

### P: O loading está muito rápido, posso deixar mais tempo?
**R:** Não recomendado. Firebase verifica em ~100ms. Deixar artificial fica ruim.

---

## ✅ Checklist Final

- [x] Contexto de autenticação funcionando
- [x] Rotas separadas (público/privado)
- [x] onAuthStateChanged monitorando
- [x] Loading visível durante verificação
- [x] Persistência funcionando
- [x] Logout funcionando
- [x] Testes aprovados
- [x] Documentação completa

---

## 📚 Arquivos de Documentação

1. **IMPLEMENTATION_GUIDE.md** - Guia completo com explicações
2. **ARCHITECTURE.md** - Diagramas e fluxos visuais
3. **TESTING_GUIDE.md** - Passo a passo para testar

---

Desenvolvido como parte da atividade de **Persistência de Sessão e Proteção de Rotas em React Native**.

**Status:** ✅ 100% Completo - Pronto para uso e testes!
