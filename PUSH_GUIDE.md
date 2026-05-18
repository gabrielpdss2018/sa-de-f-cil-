# Guia de Atualização para o GitHub 🚀

Como o ambiente atual não possui o comando `git` configurado, siga estes passos para atualizar o seu repositório [gabrielpdss2018/sa-de-f-cil](https://github.com/gabrielpdss2018/sa-de-f-cil) com a versão mais recente do sistema (Backend + Frontend).

## Opção 1: Via Terminal (Recomendado)

Abra o terminal na pasta raiz do projeto (`saude facil site`) e execute:

```bash
# 1. Iniciar o repositório (caso ainda não tenha o .git local)
git init

# 2. Adicionar o repositório remoto
git remote add origin https://github.com/gabrielpdss2018/sa-de-f-cil.git

# 3. Adicionar todos os arquivos
git add .

# 4. Criar o commit
git commit -m "Update: Implementação completa Full-Stack (Backend + Frontend) e nova documentação"

# 5. Enviar para o GitHub
git push -u origin main --force
```

## Opção 2: Via GitHub Desktop
1. Abra o **GitHub Desktop**.
2. Clique em `File` -> `Add Local Repository`.
3. Selecione esta pasta (`saude facil site`).
4. Se ele perguntar se deseja criar um repositório, diga que sim.
5. Faça o **Commit** das alterações.
6. Clique em **Publish** ou **Push origin**.

## O que foi atualizado:
- [x] **README.md**: Totalmente reformulado e profissional.
- [x] **DOCUMENTACAO_V6.md**: Atualizada para a Versão 7.0 com checklist completo.
- [x] **Estrutura Full-Stack**: Preparada para subir tanto o `saude-facil-backend` quanto o `saude-facil-front-end`.

---
*Dica: Certifique-se de que o seu `.gitignore` no backend e frontend ignore a pasta `node_modules` para evitar problemas no upload.*
