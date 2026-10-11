# Energias Pokémon: app para jogar online (um celular por jogador)

Não pede login nem cadastro. A tela inicial só pede o CÓDIGO DA SALA.
O primeiro celular a entrar vira o Jogador 1 e o segundo vira o Jogador 2 (os nomes podem ser editados no jogo).
Um terceiro celular com o mesmo código recebe o aviso "Sala cheia".

## Publicar na internet (uma vez só, grátis no Render)
1. Crie um repositório no GitHub e envie todos os arquivos desta pasta (Add file > Upload files).
2. Em render.com: New > Web Service > conecte o repositório.
3. Build Command: `npm install`  |  Start Command: `npm start`  |  Plano: Free.
4. Quando terminar, o Render mostra um endereço (https://...onrender.com). Esse é o endereço do app.

## Instalar no celular (os dois)
1. Abra o endereço no Chrome do celular.
2. Menu ⋮ > "Instalar app" (ou o botão "Instalar app neste celular" na tela inicial).
   No iPhone: Compartilhar > "Adicionar à Tela de Início".
3. Abra o app, digite o MESMO código de sala nos dois celulares e toque em "Entrar na sala".

## Testar no PC (mesma rede Wi-Fi)
`npm install` e depois `npm start`, e abra `http://IP-DO-PC:3000` nos celulares.
Sem HTTPS o botão de instalar não aparece, mas dá para usar "Adicionar à tela inicial".

## Observações
- No plano grátis o servidor "dorme" após alguns minutos sem uso. A primeira abertura pode levar cerca de 1 minuto.
- A partida fica guardada no servidor e em cada celular. Se o celular perder a conexão, ele volta sozinho para a mesma sala e o mesmo jogador.
- Menu ⋮ > "Sair da sala" volta para a tela do código.
- Os planos gratuitos mudam com o tempo, confira no site do Render.
