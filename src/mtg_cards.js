import pkg from 'whatsapp-web.js';
const { MessageMedia } = pkg;

export async function sendMtgCard(msg, cardName = 'Black Lotus') {
    try {
        const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
        const data = await response.json();

        if (data.object === 'error') {
            return msg.react("❌");
            return;
        }

        const imageUrl = data.image_uris?.large || '';

        if (!imageUrl) {
            return msg.react("❌");
            return;
        }

        // Create legality information
        // const legalityInfo = Object.entries(data.legalities)
        //     .map(([format, legality]) => `- **${format}**: ${legality}`)
        //     .join('\n');

        msg.react('🃏');

        // Fetch and send the card image
        const cardImage = await MessageMedia.fromUrl(imageUrl, { unsafeMime: true });

        // const caption = `**${data.name}**\n` +
        //     `Set: ${data.set_name}\n` +
        //     `Type: ${data.type_line}\n` +
        //     `Mana Cost: ${data.mana_cost}\n` +
        //     `\n${data.oracle_text || ''}\n\n` +
        //     `**Legalities:**\n${legalityInfo}`;

        await msg.reply(cardImage);
    } catch (error) {
        console.log(error)
    }
}
