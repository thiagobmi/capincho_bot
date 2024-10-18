import * as fs from 'fs';
import * as ical from 'node-ical';

export function timeConverter(UNIX_timestamp, showsec = false, showdate = false, onlydate = false) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = ''
  if (onlydate) {
    time += date + '/' + month + '/' + year + ' '
  }
  else {
    if (showdate == true) {
      time += date + '/' + month + '/' + year + ' '
    }
    time += hour + ':' + min;
    if (showsec == true) {
      time += ':' + sec;
    }
  }
  return time;
}

export async function sendFeriados(msg) {

  const events = ical.fromURL('https://calendar.google.com/calendar/ical/pt.brazilian%23holiday%40group.v.calendar.google.com/public/basic.ics',
    {},
    function (err, data) {

      let mystring = '📝 *FERIADOS NACIONAIS* 📝' +
        '\n(Próximos 3 meses)\n';
      var morethreemonths = new Date();
      morethreemonths.setMonth(morethreemonths.getMonth() + 3);
      let semana = {};
      semana['Sun'] = 'Domingo';
      semana['Mon'] = 'Segunda-feira';
      semana['Tue'] = 'Terça-feira';
      semana['Wed'] = 'Quarta-feira';
      semana['Thu'] = 'Quinta-feira';
      semana['Fri'] = 'Sexta-feira';
      semana['Sat'] = 'Sábado';

      for (const event of Object.values(data || {})) {
        if (event.type === 'VEVENT' && Date.now() < event.start.getTime() && event.start.getTime() < morethreemonths.getTime()) {
          mystring = mystring.concat(
            '\n*' + event.summary.trim() + '*' +
            '\n' + event.start.getDate() + '/' + (event.start.getMonth() + 1) + '/' + (event.start.getFullYear()) +
            '\n*' + semana[event.start.toString().split(' ')[0]] + '*' +
            '\n*' + event.description.replace('Para ocultar as datas comemorativas, acesse Configurações do Google Agenda > Feriados no Brasil', '').trim() + '*' +
            '\n'
          );
        }
      };
      return msg.reply(mystring);

    });
}

export const deleteSingletonFiles = (absoluteProfilePath) => {
  try {
    const files = fs.readdirSync(absoluteProfilePath);
    for (const file of files) {
      if (file.match('Singleton')) {
        const filePath = path.join(absoluteProfilePath, file);
        //console.log(`deleting ${filePath}`);
        fs.unlinkSync(filePath);
      }
    }
  } catch (e) { }
};


export async function mandaMensagemComandos(msg) {
  const mensagemComandos =
    `Comandos Atualizados 🤖:
\n*!meme:* envia um meme aleatório.
\n*!rmeme:* envia um meme aleatório em inglês.
\n*!g <texto>*: envia uma imagem do *google imagens* de acordo com o texto inserido
\n*!st*: pode ser usado como legenda de uma mídia ou como resposta a uma mensagem com mídia. Envia a mídia como figurinha.
\n*!st <texto>*: cria uma figurinha com o *texto* enviado.
\n_( *!st* tambem pode ser usado como resposta a uma mensagem de texto, para criar uma figurinha com o texto da mensagem que esta sendo respondida)_
\n*!r*: usado como resposta a uma figurinha ou imagem de visualização única. Reenvia a imagem da figurinha ou imagem de visualização única.
\n*!p*: envia um post aleatório do subreddit */r/brasil*
\n*!p <subreddit>*: envia um post aleatório do subreddit escolhido
\n*!c <lugar>:* envia informações sobre o *clima* do lugar requisitado.
_( *!clima <lugar>* também funciona!)_
\n*!copy*:
\t*!copy <nome>*: manda a copypasta pelo nome.
\t*!copy list*: manda a lista de copypastas.
\t*!copy add <nome>*: usado como resposta a uma mensagem. Cria uma copypasta com o texto da mensagem respondida.
\t*!copy add <nome> <texto>*: cria uma copypasta com o nome e texto enviados.
\n*!roll*: envia um número aleatório de 1 a 6.
\t*!roll <maximo>*: envia um número aleatório entre 1 e o número enviado.
\n*!mtg <nome-da-carta>: procura e envia cartas de Magic The Gathering pelo nome.
\n\tApenas para ADMINs:
\n*!all*: marca todas as pessoas do grupo.
\t*!all <mensagem>* : marca todas as pessoas do grupo e envia aquela mensagem.
\n*!w change <mensagem>*: muda a mensagem de boas vindas ao grupo. O bot mandará essa mensage sempre que alguém entrar.
\n*!w remove*: remove a mensagem de boas vindas atual.
`
  msg.reply(mensagemComandos)

}

async function printMessage(message_text) {
  let chat = await message_text.getChat();
  if (chat.isGroup) {
    console.log(
      `[${timeConverter(message_text.timestamp, true)}]`,
      "message_text",
      "in",
      chat.name,
      "from",
      `${message_text._data.notifyName}:`,
      `${message_text.body}`
    );
  } else {
    console.log(
      `[${timeConverter(message_text.timestamp, true)}]`,
      "message_text from",
      `${message_text._data.notifyName}:`,
      `"${message_text.body}"`
    );
  }
}

export async function logmessage(message) {

  let chat = await message.getChat();

  if ((message.author && message.fromMe) || !message.fromMe)
    if (chat.isGroup) {
      fs.appendFileSync('log.txt', `${timeConverter(message.timestamp, false, false, true)} [${timeConverter(message.timestamp, true)}] message in ${chat.name} from ${message._data.notifyName}: "${message.body}"\n`);
    }
    else {
      if (!message.fromMe && message._data.notifyName)
        fs.appendFileSync('log.txt', `${timeConverter(message.timestamp, false, false, true)} [${timeConverter(message.timestamp, true)}] message from  ${message._data.notifyName} to me: "${message.body}"\n`)
      else
        fs.appendFileSync('log.txt', `${timeConverter(message.timestamp, false, false, true)} [${timeConverter(message.timestamp, true)}] message from me to ${chat.name} : "${message.body}"\n`)
    }

}

export async function getAdmins(notification) {

  var admins = [];

  const data = await notification.getChat()
  for (let i = 0; i < data.participants.length; i++) {
    if (data.participants[i].isAdmin) {
      admins.push(data.participants[i].id._serialized);
    }
  }

  data.participants.is
  return admins;

}

export async function isFromAdmin(msg) {

  let isADM = false;
  const admins = await getAdmins(msg)
  for (let i = 0; i < admins.length; i++) {
    if (msg._data.id.participant == admins[i]) {
      isADM = true
    }
  }

  return isADM;
}
