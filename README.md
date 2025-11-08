# 🎟️ DSMEventos - Equipe 4 (Frontend & API Gateway)

## 👥 Integrantes
- **Marcos Landi**  
- **Ana Laura**  
- **Eduardo**  
- **Héricles Mendes**  
- **Guilherme de Araújo**  
- **Raul Gonçalves**

---

## 🚀 Responsabilidades da Equipe

### 🧩 API Gateway
Criar um servidor **Node.js/Express** simples que atua como ponto de entrada único para o sistema.  
Ele será responsável por:
- Validar o **JWT** de autenticação.  
- Redirecionar as requisições para os microserviços corretos.  

### 🎨 Frontend
Desenvolver a interface do usuário utilizando **Next.js**, consumindo **apenas o API Gateway**.  
A aplicação deve ser intuitiva, responsiva e com boa experiência de uso.

---

## 🧠 Tecnologias Utilizadas
- **Frontend:** Next.js, React, Tailwind  
- **Backend (Gateway):** Node.js / Express  

---

# DSMEventos - Instruções de desenvolvimento

Este arquivo descreve os passos rápidos para quem clonar o repositório e quiser rodar o projeto localmente.

1) Instale dependências no diretório raiz:

```powershell
cd "c:\caminho\para\seu\repo" # ajuste para o seu caminho
npm install
```

2) Instale dependências dos subprojetos e rode em desenvolvimento:

```powershell
# API Gateway
cd api-gateway
npm install

# Frontend
cd ../frontend
npm install

# Voltar ao raiz e rodar mocks + gateway (opcional)
cd ..
npm run dev
```

3) Variáveis de ambiente

- Copie `api-gateway/.env.example` para `api-gateway/.env` e ajuste `PORT`, `JWT_SECRET` e as URLs dos serviços, se necessário.

4) Finais de linha (LF / CRLF)

- O repositório inclui um `.gitattributes` que normaliza finais de linha para LF no repositório. Em Windows, o Git pode converter para CRLF localmente. Para evitar avisos ao commitar, é recomendado configurar no seu Git local (uma vez):

```powershell
git config --global core.autocrlf true
```

