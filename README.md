

![alt text](./assets/logo.png)


# Visão Geral

O CapinchoBot é um bot de uso geral para whatsapp. Ele é construido em cima da lib [whatsapp-web.js](https://wwebjs.dev/);

# Princípios
Minha ideia foi criar um bot divertido e que não incomodasse as pessoas no WhatsApp. Por isso, evitei adicionar funcionalidades de spam ou envio de mensagens privadas. A única exceção foi o comando para marcar todos os membros de um grupo, já que essa função é bastante útil.

> **⚠️ Aviso:**  
> Qualquer uso desse bot para fins de spam ou práticas abusivas é desencorajado e passível de banimento pelo whatsapp.

# Funcionalidades 

| Comando                      | Descrição                                                                                                         | API_KEY        |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------- | :------------- |
| **!help**                    | Envia a lista completa de comandos.                                                                               |                |
| **!meme**                    | Envia um meme aleatório.                                                                                          |                |
| **!rmeme**                   | Envia um meme aleatório em inglês.                                                                                |                |
| **!g** `texto`               | Envia uma imagem do Google Imagens com base no texto inserido.                                                    | Google Imagens |
| **!st**                      | Pode ser usado como legenda de uma mídia ou como resposta a uma mensagem com mídia. Envia a mídia como figurinha. |                |
| **!st** `texto`              | Cria uma figurinha com o texto enviado.                                                                           |                |
| **!r**                       | Usado como resposta a uma figurinha ou imagem de visualização única. Reenvia a figurinha ou imagem.               |                |
| **!p**                       | Envia um post aleatório do subreddit /r/brasil.                                                                   |                |
| **!p** `subreddit`           | Envia um post aleatório do subreddit escolhido.                                                                   |                |
| **!clima** `lugar`           | Envia informações sobre o clima do lugar requisitado.                                                             | OpenWeather    |
| **!c** `lugar`               | Comando alternativo para clima do lugar requisitado.                                                              | OpenWeather    |
| **!mtg**  `nome-da-carta`    | Procura e envia cartas de Magic The Gathering pelo nome.                                                          |                |
| **!feriados**                | Envia uma lista com a data dos feriados dos próximos 3 meses.                                                     |                |
| **!copy** `nome`             | Envia a copypasta pelo nome.                                                                                      |                |
| **!copy** `list`             | Envia a lista de copypastas.                                                                                      |                |
| **!copy add** `nome`         | Cria uma copypasta com o nome a partir da mensagem respondida.                                                    |                |
| **!copy add** `nome` `texto` | Cria uma copypasta com o nome e texto enviados.                                                                   |                |
| **!roll**                    | Envia um número aleatório de 1 a 6.                                                                               |                |
| **!roll** `maximo`           | Envia um número aleatório entre 1 e o número máximo informado.                                                    |                |
| **!all**                     | Menciona todas as pessoas do grupo. (ADMIN)                                                                       |                |
| **!all** `mensagem`          | Menciona todas as pessoas do grupo e envia a mensagem. (ADMIN)                                                    |                |
| **!w change** `mensagem`     | Muda a mensagem de boas-vindas do grupo. O bot enviará essa mensagem quando alguém entrar. (ADMIN)                |                |
| **!w remove**                | Remove a mensagem de boas-vindas atual. (ADMIN)                                                                   |                |
| **!gpt** `texto`             | Envia uma resposta de texto do ChatGPT.                                                                           | OpenAI         |



# Setup do ambiente:

## Configuração do .env

O projeto utiliza 2 chaves de API que podem ser obtidas gratuitamente.
- [OpenWeather](https://openweathermap.org/api): Usada para informações do clima.
- [GoogleImages](https://programmablesearchengine.google.com/controlpanel/create): Usada para a busca de imagens na internet.

Após a obtençao das chaves, substituia os campo `<YOUR_KEY>` no arquivo .env pelas suas chaves das APIs.

## Usando Docker (Opcional)

É possível utilizar o bot dentro de um container Docker, permitindo a execução em um ambiente isolado e mais estavel.

Para fazer isso, basta fazer o download do [Docker](https://www.docker.com/) e utilizar o arquivo `docker-compose.yml`, disponibilizado no projeto.

Entre na pasta do projeto e levante o container docker usando:
```bash
docker compose up -d
```

Entre no CLI do container:
```bash
docker exec -it whatsapp-bot bash
```

Entre na pasta contendo os arquivos do projeto:
```
cd /app
```

Após isso, basta seguir o resto tutorial de instalação abaixo.

## Instalação

O bot é um simples projeto node. Para rodar seu bot, crie um arquivo .env na raíz do projeto e siga o mesmo modelo do arquivo .env.example. Instale as dependências com: 

```bash 
npm install
```

Em seguida, inicie o bot com:
```bash
node server.js
```

Fique atento ao terminal pois na primeira vez que você rodar, aparecerá um QR-Code para você scanear e autenticar com o whatsapp. O processo é igual ao se autenticar com o whatsapp web (porque por baixo dos panos é isso que você está fazendo).

    Para desconectar o bot, basta realizar a remoçao do dispositivo nas configurações do whatsapp.
