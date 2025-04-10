// Bibliotecas
const qrcode = require('qrcode');
const express = require('express');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');

// Servidor web
const app = express();
let qrCodeImage = ''; // Armazenar o QR code como imagem base64

// Instância do cliente
const client = new Client();

// Exibir QR Code via navegador
client.on('qr', async (qr) => {
    qrCodeImage = await qrcode.toDataURL(qr); // Gera a imagem em base64
    console.log('QR code gerado! Acesse o navegador para escanear.');
});

// Confirmação de conexão
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

// Página para exibir o QR code
app.get('/', (req, res) => {
    if (!qrCodeImage) {
        return res.send('QR Code ainda não gerado. Aguarde alguns segundos e recarregue a página.');
    }
    res.send(`
        <html>
            <body style="text-align: center; font-family: Arial;">
                <h1>Escaneie o QR Code para conectar o WhatsApp</h1>
                <img src="${qrCodeImage}" />
            </body>
        </html>
    `);
});

// Porta
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});

// Delay entre ações
const delay = ms => new Promise(res => setTimeout(res, ms));

// Palavras-chave para mensagens automáticas
const keywordsMsgInicial = [ /* ... mantive tudo como no seu código ... */ ];

// Controle de usuários
const userStatus = {};

// Resposta automática
client.on('message', async msg => {
    const chat = await msg.getChat();

    if (msg.hasMedia && msg.type === "ptt") {
        console.log(`🎙️ O usuário ${msg.from} enviou um áudio.`);
        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from,
            "🎧 *Recebemos seu áudio!*\n" +
            "Atualmente, não conseguimos interpretar mensagens de voz. Poderia escrever sua dúvida? 😊\n\n");
        return;
    }

    if (keywordsMsgInicial.some((keyword) => msg.body.toLowerCase().includes(keyword)) && msg.from.endsWith("@c.us")) {
        if (userStatus[msg.from] === "aguardando") return;
        userStatus[msg.from] = "aguardando";

        await chat.sendStateTyping();
        const image = MessageMedia.fromFilePath("cardapio.jpeg");
        const image2 = MessageMedia.fromFilePath("cardapio2.jpeg");
        const audio = MessageMedia.fromFilePath("cardapio_audio.mp3");

        await client.sendMessage(
            msg.from,
            `📜 *CARDÁPIO - Pizzaria* 🍕\n\n🍕 Pizzas, porções, milk shakes e muito mais!\n\n📦 *DELIVERY:* (75) 97400-3081 🚗💨`
        );
        await delay(1000);
        await chat.sendStateTyping();
        await delay(2000);
        await client.sendMessage(msg.from, image);
        await delay(1000);
        await client.sendMessage(msg.from, image2);
        await chat.sendStateRecording();
        await delay(2000);
        await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });
        await client.sendMessage(msg.from, "🎙️ *Aqui está nosso cardápio em áudio!* Caso precise de mais informações, estou à disposição! 😉");
    }
});
