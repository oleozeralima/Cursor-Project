# 📝 COMANDOS GIT CORRETOS - Terminal

## ⚠️ IMPORTANTE: Execute na pasta do projeto!

Abra o terminal (PowerShell ou CMD) **dentro da pasta do projeto**:
```
C:\Users\leofo\OneDrive\Área de Trabalho\Cursor-Project-main
```

---

## ✅ COMANDOS CORRETOS (Copie e cole um por vez)

### 1. Inicializar o repositório Git
```bash
git init
```

### 2. Adicionar arquivos (o .gitignore vai ignorar arquivos perigosos)
```bash
git add .
```

### 3. Verificar o que será enviado (OPCIONAL - mas recomendado)
```bash
git status
```
Isso mostra quais arquivos serão commitados. Verifique se não há arquivos `.android\`, `.cursor\`, ou `.key`

### 4. Fazer o commit
```bash
git commit -m "Initial commit - projeto HYPE simplificado"
```

### 5. Renomear branch para main
```bash
git branch -M main
```

### 6. Adicionar o repositório remoto do GitHub
```bash
git remote add origin https://github.com/oleozeralima/cursor-project.git
```

**⚠️ ATENÇÃO:** Substitua `oleozeralima` pelo seu usuário do GitHub e `cursor-project` pelo nome do seu repositório!

### 7. Enviar para o GitHub
```bash
git push -u origin main
```

---

## 🔒 COMANDOS ALTERNATIVOS (Mais Seguros)

Se você quiser adicionar arquivos manualmente (um por um):

### Adicionar apenas arquivos específicos:
```bash
git add index.html
git add login.html
git add quiz.html
git add results.html
git add script.js
git add questions.js
git add results.js
git add styles.css
git add supabase-config.js
git add supabase-auth.js
git add supabase-quiz.js
git add supabase-setup.sql
git add supabase-cleanup.sql
git add vercel.json
git add .gitignore
git add favicon.svg
git add README.md
git add *.md
```

Depois faça o commit:
```bash
git commit -m "Initial commit - projeto HYPE simplificado"
```

---

## 🆘 SE DER ERRO

### Erro: "fatal: not a git repository"
**Solução:** Execute `git init` primeiro

### Erro: "remote origin already exists"
**Solução:** Execute:
```bash
git remote remove origin
git remote add origin https://github.com/oleozeralima/cursor-project.git
```

### Erro: "failed to push some refs"
**Solução:** Execute:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Erro: "authentication failed"
**Solução:** Você precisa autenticar. Use:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

---

## ✅ VERIFICAR SE FUNCIONOU

1. Acesse: `https://github.com/oleozeralima/cursor-project`
2. Você deve ver os arquivos do projeto
3. Deve ter cerca de 20-25 arquivos (não 141.000!)

---

## 📝 RESUMO RÁPIDO

```bash
git init
git add .
git commit -m "Initial commit - projeto HYPE simplificado"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

**Substitua:**
- `SEU-USUARIO` → seu usuário do GitHub (ex: `oleozeralima`)
- `SEU-REPOSITORIO` → nome do seu repositório (ex: `cursor-project`)

---

**Última atualização:** Dezembro 2024

