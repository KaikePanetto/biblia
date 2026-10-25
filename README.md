# Bíblia em um ano

Site estático (HTML, CSS e JavaScript puro, sem build) com o plano de 365 dias, progresso por passagem, notas e grupo de leitura. O login é pelo Google e os dados ficam no Firebase.

Sem configurar nada, o site já funciona: o progresso e as notas ficam salvos no navegador. Siga os passos abaixo para ligar o login, a nuvem e o grupo.

## Estrutura

```
index.html
css/style.css
js/data.js             plano dos 365 dias, livros e eras
js/app.js              telas, progresso, grupo e notas
js/firebase.js         tudo que fala com o Firebase
js/firebase-config.js  suas chaves do Firebase (você preenche)
firestore.rules        regras de segurança do banco
```

## 1. Criar o projeto no Firebase

1. Entre em https://console.firebase.google.com e crie um projeto (pode desligar o Google Analytics).
2. Em Criação > Authentication > Começar > Google, ative o login e escolha um e-mail de suporte.
3. Em Criação > Firestore Database > Criar banco de dados, escolha o modo de produção e a região mais próxima (southamerica-east1, São Paulo).
4. Na aba Regras do Firestore, apague o conteúdo e cole o arquivo `firestore.rules`. Toque em Publicar.
5. Em Configurações do projeto (engrenagem) > Seus apps, adicione um app Web (ícone `</>`). Copie o objeto `firebaseConfig` e cole em `js/firebase-config.js`.

As chaves do Firebase podem ficar públicas. Quem protege os dados são as regras do passo 4.

## 2. Publicar na Vercel

1. Suba a pasta para um repositório no GitHub.
2. Na Vercel, escolha Add New > Project e importe o repositório. Não precisa de build nem de configuração: deixe Framework Preset como Other.
3. Depois do deploy, copie o endereço (por exemplo `biblia-em-um-ano.vercel.app`).

## 3. Autorizar o endereço no login

No Firebase, vá em Authentication > Configurações > Domínios autorizados > Adicionar domínio, e adicione o endereço da Vercel (sem https://). Sem isso, o login com Google falha com o erro `auth/unauthorized-domain`. Se você usar domínio próprio, adicione ele também.

## Como o grupo funciona

- Ao entrar com o Google pela primeira vez, a pessoa ganha um grupo com um código de 8 letras e números.
- Em Grupo, ela copia o código e envia para a namorada. Ela entra com a conta Google dela e digita o código em Entrar em um grupo.
- Cada pessoa marca só o próprio progresso. Na passagem aparece uma bolinha com a inicial de quem do grupo já leu.
- As notas de cada passagem são do grupo: todos leem e escrevem, mas cada um edita e apaga só as suas.
- O progresso e as notas feitos antes do login sobem para a nuvem no primeiro acesso, sem perder nada.

## Limites e cuidados

- Quem tiver o código consegue entrar no grupo. Compartilhe só com quem você quer. O limite é de 10 pessoas por grupo.
- Este código não foi testado com um projeto Firebase real. Faça um teste com duas contas Google antes de confiar no progresso.
