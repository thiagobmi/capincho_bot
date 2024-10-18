import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function ImageGoogle(msg, input) {
    
    var CX = '703a886e938804c4d'

    try {
        await fetch(`https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${CX}&q=${input}&searchType=image&fileType=jpg&alt=json&num=1`).then(res => res.json())
            .then(async json => {

                if (!json.items[0].link) {
                    msg.react('❗')
                    msg.reply('🤖 Erro, tente novamente')
                }
                msg.react('🤖')
                const msgImg = await MessageMedia.fromUrl(json.items[0].link, { unsafeMime: true })
                msg.reply(msgImg).then(() => {
                }).catch(error => console.log('error: ', error));
            })
    }
    catch (error) {
        msg.react('❗')
        msg.reply('🤖 Erro, tente novamente')
    }
}
