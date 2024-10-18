import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;
import { client } from '../server.js';

export async function sendRedditPost(msg, subReddit = 'brasil') {
    try {
        await
            fetch(`https://meme-api.com/gimme/${subReddit}`)
                .then(res => res.json())
                .then(async json => {
                    const ImageUrl = json.url
                    msg.react('🤖')
                    const memeImg = await MessageMedia.fromUrl(ImageUrl);
                    client.sendMessage(msg.id.remote, memeImg, { caption: `from /r/${json.subreddit}: ${json.title}` }).then(() => {
                    }).catch(error => console.log('error: ', error));

                }).catch((error) => console.log('error: ', error))
    }
    catch (error) {
        console.log('error: ', error)
    }
}


export async function sendRandomMeme(msg) {
    try {
        await
            fetch(`https://meme-api.com/gimme`)
                .then(res => res.json())
                .then(async json => {
                    const ImageUrl = json.url
                    msg.react('🥸')
                    const memeImg = await MessageMedia.fromUrl(ImageUrl);
                    msg.reply(memeImg).then(() => {
                    }).catch(error => console.log(' error: ', error)
                    );
                }).catch((error) => console.log('error: ', error))
    }
    catch (error) {
        console.log('error: ', error)
    }
}


export async function sendRandomMemeFromSource(msg) {
    const subReddits = ["HUEstation", "AgiotasClub", "eu_nvr"];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];
    try {
        await
            fetch(`https://meme-api.com/gimme/${random}`)
                .then(res => res.json())
                .then(async json => {
                    const ImageUrl = json.url
                    msg.react('🥸')
                    const memeImg = await MessageMedia.fromUrl(ImageUrl);
                    msg.reply(memeImg).then(() => {
                    }).catch(error => console.log('error: ', error));

                }).catch((error) => console.log('error: ', error))
    }
    catch (error) {
        console.log('error: ', error)
    }
}
