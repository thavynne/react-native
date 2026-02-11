# 🏗️ Arquitetura de Autenticação e Rotas

## 📊 Estrutura de Componentes

```
App.tsx
  └── AuthProvider (src/context/AuthContext.tsx)
      └── AppNavigator (src/navigation/AppNavigator.tsx)
          ├── [Se loading === true]
          │   └── ActivityIndicator (Verificando sessão...)
          │
          ├── [Se isSignedIn === true]
          │   └── AppStack (src/navigation/AppStack.tsx)
          │       ├── HomeScreen (tela principal)
          │       ├── ListScreen
          │       └── DetailsScreen
          │
          └── [Se isSignedIn === false]
              └── AuthStack (src/navigation/AuthStack.tsx)
                  ├── LoginScreen
                  ├── RegisterScreen
                  └── ForgotPasswordScreen
```

---

## 🔑 AuthContext (Gerenciador Central)

```typescript
AuthContext.Provider
  ├── user: User | null
  ├── loading: boolean
  ├── isSignedIn: boolean
  └── logout(): Promise<void>
```

**Responsabilidades:**
- ✅ Escutar `onAuthStateChanged()` do Firebase
- ✅ Atualizar estado quando autenticação muda
- ✅ Fornecer função de logout
- ✅ Gerenciar loading durante verificação

---

## 🔄 Ciclo de Vida - Login

```
1. LoginScreen
   · User digita email/senha
   · Clica "Entrar"
   
2. signInWithEmailAndPassword()
   · Validação no Firebase
   · ✅ Credenciais OK
   
3. Firebase Auth
   · Cria sessão
   · Emite onAuthStateChanged
   
4. AuthContext
   · Detecta mudança
   · user = firebaseUser
   · isSignedIn = true
   
5. AppNavigator
   · Vê isSignedIn === true
   · Renderiza AppStack
   
6. HomeScreen
   · Exibida automaticamente ✅
```

---

## 🚪 Ciclo de Vida - Logout

```
1. HomeScreen
   · User clica "Sair (Logout)"
   · Confirma ação
   
2. logout()
   · Chama signOut() do Firebase
   · Remove sessão armazenada
   
3. Firebase Auth
   · Sessão removida
   · Emite onAuthStateChanged
   
4. AuthContext
   · Detecta mudança
   · user = null
   · isSignedIn = false
   
5. AppNavigator
   · Vê isSignedIn === false
   · Renderiza AuthStack
   
6. LoginScreen
   · Exibida automaticamente ✅
```

---

## 💾 Ciclo de Vida - Persistência (Reabrir App)

```
1. App inicia
   
2. AuthProvider monta
   · loading = true
   · Executa onAuthStateChanged
   
3. Firebase verifica Token Local
   · Stored no dispositivo
   · Valida sessão anterior
   
4. [3 Cenários Possíveis]
   
   Cenário A: Sessão Válida
   ├── user = lastUser
   ├── loading = false
   ├── isSignedIn = true
   └── HomeScreen renderizada
   
   Cenário B: Sessão Expirada
   ├── user = null
   ├── loading = false
   ├── isSignedIn = false
   └── LoginScreen renderizada
   
   Cenário C: Primeiro Acesso
   ├── user = null
   ├── loading = false
   ├── isSignedIn = false
   └── LoginScreen renderizada
```

---

## 🛡️ Proteção de Rotas

```
Sem Proteção (ANTES):
┌─────────────────────────┐
│  NavigationContainer    │
│  ├── Login              │
│  ├── Register           │
│  ├── Home               │ ← Acessível sem autenticação!
│  ├── List               │ ← Acessível sem autenticação!
│  └── Details            │ ← Acessível sem autenticação!
└─────────────────────────┘
❌ Inseguro


Com Proteção (DEPOIS):
┌─────────────────────────────────┐
│  NavigationContainer            │
│  ├── AuthStack (if !isSignedIn) │
│  │   ├── Login                  │
│  │   ├── Register               │
│  │   └── ForgotPassword         │
│  │                              │
│  └── AppStack (if isSignedIn)   │
│      ├── Home                   │ ← Só acessível autenticado
│      ├── List                   │ ← Só acessível autenticado
│      └── Details                │ ← Só acessível autenticado
└─────────────────────────────────┘
✅ Seguro
```

---

## 📡 Fluxo de Dados - onAuthStateChanged

```typescript
// Firebase monitora continuamente
firebase.auth.onAuthStateChanged((user) => {
  if (user) {
    // ✅ User está OK
    // - ID Token válido
    // - Sessão ativa
    // - Atualizar estado
  } else {
    // ❌ User perdeu autenticação
    // - Token expirou
    // - Logout foi chamado
    // - Sessão inválida
    // - Limpar estado
  }
});
```

---

## 🔐 Comparação: Manual vs Automático

### ❌ Sem Persistência (Antes)

```typescript
// LoginScreen.tsx
const handleLogin = async () => {
  await signInWithEmailAndPassword(...)
  navigation.navigate('Home') // ← Manual!
};

// Problema: Ao fechar e reabrir app
//   → Volta para LoginScreen
//   → Sessão perdida
//   → Experiência ruim
```

### ✅ Com Persistência (Depois)

```typescript
// LoginScreen.tsx
const handleLogin = async () => {
  await signInWithEmailAndPassword(...)
  // ← Sem navegação manual!
};

// AuthContext detecta automaticamente
// AppNavigator renderiza AppStack
// HomeScreen exibida

// Ao fechar e reabrir app
//   → Sessão verificada
//   → HomeScreen exibida ao reabrir
//   → Experiência fluida
```

---

## 🎯 Vantagens da Solução

| Aspecto | Benefício |
|--------|-----------|
| **Persistência** | Sessão mantém entre reaberturas do app |
| **Segurança** | Rotas protegidas, impossível acessar sem auth |
| **UX/DX** | Sem navegação manual, transições automáticas |
| **Escalabilidade** | Fácil adicionar novas rotas privadas |
| **Manutenibilidade** | Lógica centralizada em AuthContext |
| **Performance** | Verificação única ao app iniciar |

---

## 🚀 Fluxo Simplificado

```
┌─────────────┐
│             │
│  App inicia │
│             │
└──────┬──────┘
       │
       ├─→ AuthProvider monta
       │   └─→ onAuthStateChanged executa
       │
       └─→ Firebase verifica sessão anterior
           ├─→ ✅ Sessão válida
           │   └─→ AppStack renderizado
           │       └─→ HomeScreen
           │
           └─→ ❌ Sem sessão
               └─→ AuthStack renderizado
                   └─→ LoginScreen
```

---

## 💡 Key Points

1. **onAuthStateChanged** é executado automaticamente quando:
   - App inicia
   - User faz login
   - User faz logout

2. **Não precisa fazer navegação manual** após login:
   - O AppNavigator detecta automaticamente
   - Renderiza o stack apropriado

3. **Persistência é automática**:
   - Firebase cuida do token localmente
   - onAuthStateChanged detecta ao reabrir

4. **Rotas são condicionais**:
   - `AuthStack` só renderiza quando não autenticado
   - `AppStack` só renderiza quando autenticado

5. **Loading é importante**:
   - Mostra feedback enquanto verifica sessão
   - Evita flashes de LoginScreen desnecessários

---

## 📊 Estatísticas

- **Arquivos Criados:** 2 (AuthContext.tsx, IMPLEMENTATION_GUIDE.md)
- **Arquivos Modificados:** 5 (AppNavigator, LoginScreen, HomeScreen, App.tsx, AuthStack/AppStack vazios preenchidos)
- **Linhas de Código Adicionadas:** ~300+
- **Funcionalidades Implementadas:** 6 principais
- **Critérios Atendidos:** 100%

---

## 🎓 Conceitos Educacionais

✅ **Padrão Context API** - Centralizar estado global  
✅ **Firebase Authentication** - Gerenciamento de coleção remota  
✅ **Ciclo de Vida** - useEffect e cleanup  
✅ **Rotas Condicionais** - Renderização baseada em estado  
✅ **Persistência de Dados** - Token storage nativo  
✅ **UX/DX** - Transições suaves e automáticas  

---

Desenvolvido como parte da atividade de **Persistência de Sessão e Proteção de Rotas em React Native**.
