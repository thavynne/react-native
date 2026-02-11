# 🧪 Guia de Testes - Persistência de Sessão

## ✅ Preparação

Antes de testar, certifique-se de:
- [ ] Ter um usuário cadastrado no Firebase
- [ ] O app está rodando com sucesso
- [ ] Console aberto para verificar logs

---

## 📝 Testes a Executar

### ✔️ Teste 1: Login Básico

**Objetivo:** Verificar se o login redireciona automaticamente

**Passos:**
1. Abra o app - deve exibir `LoginScreen`
2. Verifique no console: `"Estado de autenticação mudou: Não autenticado"`
3. Insira email e senha válidos
4. Clique em "Entrar"
5. Console deve exibir: `"Usuário logado: seu@email.com"`
6. Automaticamente deve ir para `HomeScreen`
7. Console deve exibir: `"Estado de autenticação mudou: seu@email.com"`

**Resultado Esperado:** ✅ Transição automática para HomeScreen sem navegação manual

---

### ✔️ Teste 2: Logout

**Objetivo:** Verificar se o logout redireciona automaticamente

**Pré-requisito:** Estar logado (Teste 1 completo)

**Passos:**
1. Estando na `HomeScreen`
2. Clique no botão "Sair (Logout)"
3. Confirme a ação no Alert
4. Console deve exibir: `"Usuário desconectado com sucesso"`
5. Deve exibir `ActivityIndicator` brevemente
6. Automaticamente deve ir para `LoginScreen`
7. Console deve exibir: `"Estado de autenticação mudou: Não autenticado"`

**Resultado Esperado:** ✅ Transição automática para LoginScreen sem navegação manual

---

### ✔️ Teste 3: Persistência de Sessão - Reabrir App

**Objetivo:** Verificar se a sessão persiste ao reabrir o app

**Pré-requisito:** Estar logado (Teste 2 incompleto - não fazer logout)

**Passos:**
1. Estando na `HomeScreen` (logado)
2. Feche o app completamente:
   - iOS: Deslize para cima (swipe e segure)
   - Android: Clique em recents e deslize para cima
   - Web: Feche a aba ou rebote a página
3. Aguarde 3 segundos
4. Reabra o app (toque no ícone)
5. Deve exibir `ActivityIndicator` (verificando sessão)
6. Console deve exibir: `"Estado de autenticação mudou: seu@email.com"`
7. Automaticamente deve ir para `HomeScreen`

**Resultado Esperado:** ✅ Sessão persistida - HomeScreen exibida sem login novamente

---

### ✔️ Teste 4: Logout e Reabrir App

**Objetivo:** Verificar se o logout é persistente

**Pré-requisito:** Nenhum (fazer logout antes)

**Passos:**
1. Estando na `HomeScreen`
2. Clique em "Sair (Logout)"
3. Confirme a ação
4. Aguarde transição para `LoginScreen`
5. Feche o app completamente
6. Reabra o app
7. Console deve exibir: `"Estado de autenticação mudou: Não autenticado"`
8. Deve exibir `LoginScreen`

**Resultado Esperado:** ✅ Logout é persistente - LoginScreen exibida ao reabrir

---

### ✔️ Teste 5: Verificação de Loading

**Objetivo:** Verificar se o indicador de carregamento aparece

**Pré-requisito:** Nenhum

**Passos:**
1. Feche o app completamente
2. Verifique no console: `"loading: true"`
3. Reabra o app
4. Observe brevemente um `ActivityIndicator` (spinner)
5. Aguarde 1-2 segundos
6. Console deve exibir: `"loading: false"`
7. Deve renderizar `AuthStack` ou `AppStack`

**Resultado Esperado:** ✅ Indicador de carregamento aparece durante verificação

---

### ✔️ Teste 6: Proteção de Rotas

**Objetivo:** Verificar se rotas privadas estão protegidas

**Pré-requisito:** Estar deslogado (LoginScreen)

**Passos:**
1. Estando em `LoginScreen` (deslogado)
2. Abra DevTools do React Navigation
3. Verifique que só `AuthStack` está disponível:
   - ✅ Login
   - ✅ Register
   - ✅ ForgotPassword
4. Verifique que `AppStack` NÃO está disponível:
   - ❌ Home (não aparece)
   - ❌ List (não aparece)
   - ❌ Details (não aparece)
5. Faça login
6. Verifique que agora `AppStack` está disponível:
   - ✅ Home
   - ✅ List
   - ✅ Details
7. Verifique que `AuthStack` NÃO aparece:
   - ❌ Login (não aparece)
   - ❌ Register (não aparece)

**Resultado Esperado:** ✅ Rotas são protegidas - só aparecem conforme autenticação

---

### ✔️ Teste 7: Email do Usuário em HomeScreen

**Objetivo:** Verificar se HomeScreen exibe o email do usuário logado

**Pré-requisito:** Estar logado

**Passos:**
1. Estando em `HomeScreen`
2. Verifique o texto: "Logado como: seu@email.com"
3. O email deve corresponder ao que você logou

**Resultado Esperado:** ✅ Email do usuário exibido corretamente

---

### ✔️ Teste 8: Navegação Entre Abas

**Objetivo:** Verificar se a navegação funciona entre rotas privadas

**Pré-requisito:** Estar logado

**Passos:**
1. Estando em `HomeScreen`
2. Clique em "Lista de Usuários"
3. Deve ir para `ListScreen`
4. Clique em "Detalhes"
5. Deve ir para `DetailsScreen`
6. Use o botão "Voltar" (back button)
7. Deve voltar para a tela anterior

**Resultado Esperado:** ✅ Navegação entre rotas privadas funciona

---

## 📊 Checklist de Testes

| # | Teste | Status |
|---|-------|--------|
| 1 | Login Básico | ⏳ |
| 2 | Logout | ⏳ |
| 3 | Persistência - Reabrir App | ⏳ |
| 4 | Logout e Reabrir App | ⏳ |
| 5 | Indicador de Loading | ⏳ |
| 6 | Proteção de Rotas | ⏳ |
| 7 | Email em HomeScreen | ⏳ |
| 8 | Navegação Entre Rotas | ⏳ |

**Como marcar:**
- ⏳ = Não testado
- ✅ = Passou
- ❌ = Falhou

---

## 🔍 Verificação no Console

### Logs Esperados ao Iniciar App:

```
Firebase conectado: [nome-do-app]
Firestore instância: Disponível
Estado de autenticação mudou: Não autenticado
(ou)
Estado de autenticação mudou: seu@email.com
```

### Logs ao Fazer Login:

```
Usuário logado: seu@email.com
Estado de autenticação mudou: seu@email.com
HomeScreen montado - Usuário: seu@email.com
```

### Logs ao Fazer Logout:

```
Usuário desconectado com sucesso
Estado de autenticação mudou: Não autenticado
LoginScreen montado
```

---

## 🐛 Troubleshooting

### Problema: LoginScreen sempre aparece mesmo estando logado

**Causas Possíveis:**
- [ ] `AuthProvider` não está envolvendo `AppNavigator`
- [ ] `onAuthStateChanged` não está sendo executado
- [ ] Token expirou

**Solução:**
```tsx
// App.tsx deve estar assim:
<AuthProvider>
  <AppNavigator />
</AuthProvider>
```

---

### Problema: App fica travado no loading infinitamente

**Causas Possíveis:**
- [ ] Firebase config inválido
- [ ] Problema de conexão
- [ ] `onAuthStateChanged` não chamado

**Solução:**
1. Verifique `firebaseConfig.ts`
2. Teste conexão de internet
3. Reinicie o app

---

### Problema: Não consegue fazer logout

**Causas Possíveis:**
- [ ] `logout()` não está sendo chamado
- [ ] `signOut()` falhou
- [ ] Erro no contexto

**Solução:**
1. Verifique console para mensagens de erro
2. Reinicie app
3. Tente novamente

---

### Problema: Email não aparece em HomeScreen

**Causas Possíveis:**
- [ ] `user` está null
- [ ] Contexto não está sendo acessado
- [ ] User não logou corretamente

**Solução:**
1. Verifique se está realmente logado
2. Veja no console o email do usuário
3. Reinicie o app

---

## 📱 Testes em Diferentes Dispositivos

### iOS
- [ ] Teste em simulator
- [ ] Teste em device real (se possível)
- [ ] Teste dark mode

### Android
- [ ] Teste em emulator
- [ ] Teste em device real (se possível)
- [ ] Teste orientação landscape

### Web
- [ ] Teste no Chrome
- [ ] Teste no Firefox
- [ ] Teste DevTools

---

## 🎯 Critérios de Sucesso

Para considerar a atividade **100% completa**, todos os testes abaixo devem passar:

- [ ] ✅ Teste 1: Login → Redirecionamento automático
- [ ] ✅ Teste 2: Logout → Redirecionamento automático
- [ ] ✅ Teste 3: Persistência → Sessão mantida ao reabrir
- [ ] ✅ Teste 4: Logout Persistente → Sessão removida ao reabrir
- [ ] ✅ Teste 5: Loading Visível → Indicador aparece durante verificação
- [ ] ✅ Teste 6: Proteção → Rotas privadas inacessíveis sem auth
- [ ] ✅ Teste 7: User Info → Email exibido em HomeScreen
- [ ] ✅ Teste 8: Navegação → Funciona entre rotas privadas

---

## 📚 Documentos Relacionados

- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Guia técnico de implementação
- [ARCHITECTURE.md](ARCHITECTURE.md) - Diagramas de arquitetura
- [Login Screen](src/screens/LoginScreen.tsx)
- [Home Screen](src/screens/HomeScreen.tsx)
- [Auth Context](src/context/AuthContext.tsx)
- [App Navigator](src/navigation/AppNavigator.tsx)

---

Desenvolvido como parte da atividade de **Persistência de Sessão e Proteção de Rotas em React Native**.
