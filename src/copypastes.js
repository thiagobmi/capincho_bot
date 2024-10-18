import * as fs from 'fs';

export async function addCopypaste(msg, copypaste_name, copypaste_text) {

    var copypaste_exists

    fs.readFile('./media/copypastas.json', function (err, data) {
        const json = JSON.parse(data)

        copypaste_exists = json.filter(item => item == copypaste_name).length > 0;

        if (copypaste_exists) {
            msg.reply(`🤖 Já existe uma copypasta com o nome ${copypaste_name}`)
            return;
        }

        else {
            json.push(copypaste_name)
            fs.writeFileSync("./media/copypastas.json", JSON.stringify(json))
            msg.reply(`🤖 Copypasta "${copypaste_name}" adicionada com sucesso. Digite *!copy ${copypaste_name}* para o bot enviá-la.`);
        }
        if (err) {
            console.log(`error: `, err)
        }
    })


    if (!copypaste_exists) {
        const mediaPath = './media/copypastas/';
        const extension = 'txt';
        const filename = copypaste_name
        const fullFilename = mediaPath + filename + '.' + extension;
        console.log(fullFilename)
        try {
            fs.writeFileSync(fullFilename, copypaste_text);

        } catch (err) {
            console.log('Failed to save the file:', err);

        }
    }
}


export async function sendCopypasteList(msg) {

    let message = '🤖 *Lista de copypastas:*\n'
    fs.readFile('./media/copypastas.json', function (err, data) {

        const json = JSON.parse(data)

        for (let i = 0; i < json.length; i++) {
            message += `\n${i + 1} - ${json[i]}`
        }

        message += '\n\nDigite *!copy nome-da-copypasta* para receber a copypasta'
        msg.reply(message)

        if (err) {
            console.log(`erro: `, err)
        }
    })
}

export async function sendCopypasteByName(msg, copypaste_name) {

    let flag = false;
    const data = fs.readFileSync('./media/copypastas.json')
    const json = JSON.parse(data)
    for (let i = 0; i < json.length; i++) {
        if (copypaste_name == json[i]) {
            const textomsg = fs.readFileSync(`./media/copypastas/${copypaste_name}.txt`)
            msg.reply(textomsg.toString());
            flag = true
        }
    }
    if (!flag)
        msg.reply('🤖Copypasta nao encontrada.');

}
