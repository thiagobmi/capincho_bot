import pkg from "whatsapp-web.js";
const { Client, Location, List, Buttons, LocalAuth, MessageMedia } = pkg;
import {
  sendRedditPost,
  sendRandomMeme,
  sendRandomMemeFromSource
} from "./src/memes.js";
import { ImageGoogle } from "./src/google-images.js";
import { SendQuestion } from "./src/question-gpt.js";
import { sendClimateInfo } from "./src/climate.js";
import {
  sendSticker,
  sendImageQuoted,
  sendStickerQuoted,
  sendStickerFromText,
} from "./src/stickers.js";
import {
  sendCopypasteList,
  sendCopypasteByName,
  addCopypaste
} from "./src/copypastes.js";
import {
  sendWelcomeMessage,
  changeWelcomeMessage,
  userJoined,
  removeWelcomeMessage,
} from "./src/welcome-messages.js";
import {
  mandaMensagemComandos,
  isFromAdmin,
  deleteSingletonFiles,
  sendFeriados
} from "./src/utils.js";
import qrcode from 'qrcode-terminal'
import {sendMtgCard} from "./src/mtg_cards.js"
var logmessages = false;
deleteSingletonFiles("./.wwebjs_auth/session/");

export const client = new Client({
    webVersionCache: { type: 'remote', remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html', },
    authStrategy: new LocalAuth(),
    puppeteer: {
    executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
    headless: true,
    ignoreDefaultArgs: ['--disable-extensions']
  },
});
client.initialize();

client.on("loading_screen", (percent, message_text) => {
  console.log("LOADING SCREEN", percent, message_text);
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("[QR RECEIVED]. Scan to start the bot!");
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});


client.on("message_create", async (msg) => {

  if (logmessages) logmessage(msg);
  if (!msg.body.startsWith("!")) return;

  const quoted_msg = await msg.getQuotedMessage();
  const chat = await msg.getChat();
  const msg_from_admin = chat.isGroup ? await isFromAdmin(msg) : false;
  const command = msg.body.split(" ")[0];
  const args = msg.body.replace(command, "", 1).trim();

  //if(msg.fromMe)
  //  msg.delete()

  switch (command) {
    case "!ping":
      return msg.react("✅");
      break;
    case "!st":
      if (msg.body == "!st") {
        if (msg.hasMedia) return sendSticker(msg);
        else if (msg.hasQuotedMsg) {
          if (quoted_msg.hasMedia) return sendStickerQuoted(msg);
          else if (quoted_msg && !quoted_msg.hasMedia) return sendStickerFromText(msg, quoted_msg.body);
          else if (!msg.hasQuotedMsg && !msg.hasMedia) return msg.reply(
            "🤖 Use *!st* seguido por um texto (para fazer figurinha do texto), em uma mensagem com mídia ou como resposta a uma mensagem com mídia!"
          );
        }
      }
      else return sendStickerFromText(msg, args);
      break;

    case "!mtg":
      return sendMtgCard(msg,args);

    case "!clima":
    case "!c":
      return sendClimateInfo(msg,input);
      break;
    // case "!gpt":
      // return SendQuestion(msg,input);
      // break;
    case "!meme":
      return sendRandomMemeFromSource(msg);
      break;
    case "!rmeme":
      return sendRandomMeme(msg);
      break;
    case "!p":
      if (msg.body == "!p") return sendRedditPost(msg);
      else return sendRedditPost(msg, args);
      break;
    case "!g":
      return ImageGoogle(msg, args);
      break;
    case "!menu":
    case "!comandos":
    case "!help":
      return mandaMensagemComandos(msg);
      break;

    case "!r":
      if (msg.hasQuotedMsg && quoted_msg.hasMedia && (!quoted_msg.fromMe || msg.fromMe))
        return sendImageQuoted(msg);
      else return msg.reply(
        "🤖 *!r* deve ser usado como resposta a uma figurinha ou imagem de visualização única. Reenvia a imagem da figurinha ou imagem de visualização única."
      );
      break;

    case "!all":
      if (!chat.isGroup) return msg.react("❌");
      if (!msg_from_admin && !msg.fromMe) return msg.react("❌");
      let message_text = msg.body.replace("!all", "");
      msg.react("✅");
      let text = "";
      let mentions = [];
      for (let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);
        mentions.push(contact);
      }
      text = `*@all*`;
      text += msg.hasQuotedMsg ? " " + quoted_msg.body : message_text;
      await chat.sendMessage(text, { mentions });
      break;

    case "!roll":
      let roll_args = args.split(" ")[0];
      switch (roll_args) {
        case "":
          return msg.reply(
            `🎲 Você rolou ${Math.floor(Math.random() * 6) + 1}.`
          );
        default:
          let roll_max = msg.body.replace("!roll ", "");
          if (!isNaN(roll_max)) {
            const rndInt = Math.floor(Math.random() * roll_max) + 1;
            msg.reply(`🎲 Você rolou ${rndInt}.`);
          } else return msg.react("❌");
      }
      break;

    case "!copy":
      if (msg.hasMedia) return msg.reply("🤖 Não é possível adicionar copypastas com mídia.");
      let copy_subcommand = args.split(" ")[0];
      let copy_args = args.replace(copy_subcommand, "", 1);
      let copy_name = "";
      let copy_text = "";
      switch (copy_subcommand) {
        case "add":
          if (copy_args == "" && msg.hasQuotedMsg) return msg.reply("🤖 Erro. Faltou dar um nome à sua copypasta.");
          if (!msg.hasQuotedMsg) {
            console.log(copy_args);
            if (copy_args.includes(" ")) {
              copy_args = copy_args.trimStart();
              copy_name = copy_args.slice(0, copy_args.indexOf(" ")).replace(" ", "");
            }
            else
              return msg.reply(
                "🤖 Erro ao adicionar copypasta. Além do nome, deve colocar o texto da copypasta, ou responder com o comando à mensagem com o texto que deseja adicionar."
              );
          }
          if (["add", "help", "search", "list"].includes(copy_name)) return msg.reply("🤖Erro! Esse nome não é permitido");

          copy_text = copy_name.replace(copy_name, "");

          if (copy_text == "" && msg.hasQuotedMsg && !quoted_msg.hasMedia) {
            msg.react("👍");
            return addCopypaste(msg, copy_name, quoted_msg.body);
          } else if (!msg.hasMedia) {
            msg.react("👍");
            return addCopypaste(msg, copy_name, copy_text);
          }
          break;

        case "list":
          msg.react("👍");
          return sendCopypasteList(msg);
          break;

        default:
          msg.react("👍");
          return sendCopypasteByName(msg, copy_subcommand);
          break;
      }

    case "!w":
      const w_subcommand = args.split(" ")[0];
      const w_text = args.replace(w_subcommand, "", 1).trim();
      if (msg.hasMedia)
        return msg.reply(
          "🤖 Não é possível adicionar mensagem de boas vindas com mídia."
        );
      switch (w_subcommand) {
        case "change":
          return changeWelcomeMessage(msg, w_text);
          break;
        case "remove":
          return removeWelcomeMessage(msg);
          break;
        default:
          return sendWelcomeMessage(msg);
          break;
      }
      break;

    case "!feriados":
      return sendFeriados(msg);
      break;

    case "!off":
      if (msg.fromMe) {
        await msg.react("✅");
        client.destroy();
        process.exit();
      }
      break;
  }

});

client.on("message_revoke_everyone", async (after, before) => {
  // Fired whenever a message_text is deleted by anyone (including you)
  //console.log('message_text deletada'); // message_text after it was deleted.
  //if (before) {
    //console.log(before); // message_text before it was deleted.
  //}
});

client.on("message_revoke_me", async (msg) => {
  // Fired whenever a message_text is only deleted in your own view.
  //if (!msg.fromMe) {
  //    logmessage(msg);
  //}
  // message_text before it was deleted.
});

client.on("message_ack", (msg, ack) => {
  /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

  //if (ack == 3) {
    // The message_text was read
  //}
});

client.on("group_join", (notification) => {
  // User has joined or been added to the group.
  userJoined(notification);
  //console.log('join', notification);
  //notification.reply('User joined.');
});

client.on("group_leave", (notification) => {
  // User has left or been kicked from the group.
  //console.log('leave', notification);
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});
