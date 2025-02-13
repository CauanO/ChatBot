// Leitor de qr code
const qrcode = require('qrcode-terminal');
  
// Chamada da biblioteca do whatsapp web pelo Mac
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js');

// Instacia do Cliente
const client = new Client();

// Serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

// Comfirmação da conexão
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

// Inicialização 
client.initialize();

// Função delay = Entre uma ação e outra
const delay = ms => new Promise(res => setTimeout(res, ms)); 

// Declaração de Arrays para organização
const keywordsMsgInicial = [
    "eii", "ei", "menu", "quero", "cardápio", "pizza", "pizzas", "sabores", "promoção", "promoções",
    "valores", "horário", "funcionamento", "endereço", "localização", "entrega",
    "delivery", "taxa", "pedido", "fazer pedido", "comprar", "reservar", "reservas",
    "agendar", "dia", "tarde", "noite", "oi", "olá", "ola", "eai", "fala", "opa",
    "blz", "beleza", "tudo bem", "td bem", "bom dia", "boa tarde", "boa noite",
    "comofas", "ajuda", "socorro", "mw", "to com fome", "gostaria", "quero pedir",
    "qual o preço", "qual o valor", "quais os preços", "tem promoção", "tem desconto",
    "tem pizza", "o que tem", "quais opções", "quais sabores", "qual o cardápio",
    "mostrar cardápio", "me envie o cardápio", "qual a taxa", "quanto custa",
    "me passa o menu", "tem combo", "tem porção", "quero um lanche", "quero pedir uma pizza",
    "vocês fazem entrega", "posso pedir", "quanto tempo demora", "qual o tempo de entrega",
    "tem refrigerante", "tem milkshake", "qual o telefone", "como faço para pedir"
];

// Validador para verificar se usuario já recebeu a msg
const userStatus = {};

// Script
client.on('message', async msg => {
    const chat = await msg.getChat();

    if (msg.hasMedia && msg.type === "ptt") { 
        console.log(`🎙️ O usuário ${msg.from} enviou um áudio.`);

        await chat.sendStateTyping(); // Simulando digitação
        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay para parecer natural

        await client.sendMessage(msg.from,
            "🎧 *Recebemos seu áudio!*\n" +
            "Atualmente, não conseguimos interpretar mensagens de voz. Poderia escrever sua dúvida? 😊\n\n");
        return;
    }

    if (keywordsMsgInicial.some((keyword) => msg.body.toLowerCase().includes(keyword)) && msg.from.endsWith("@c.us")) {

        // Verifica se o usuário já recebeu a mensagem e está em um estado de espera
        if (userStatus[msg.from] === "aguardando") {
            console.log(`⏳ O usuário ${msg.from} já recebeu a mensagem e está aguardando.`);
            return;
        }

        // Define o status do usuário como "aguardando" para evitar respostas repetidas
        userStatus[msg.from] = "aguardando";

        // Simulando Digitação
        await chat.sendStateTyping();

        // Carregar a imagem e o áudio do cardápio
        const image = MessageMedia.fromFilePath("cardapio.jpeg");
        const image2 = MessageMedia.fromFilePath("cardapio2.jpeg");
        const audio = MessageMedia.fromFilePath("cardapio_audio.mp3");

        // Enviar a mensagem de introdução
        await client.sendMessage(
            msg.from,
            `📜 *CARDÁPIO - Pizzaria* 🍕\n\n` +
            "🍕 Pizzas, porções, milk shakes e muito mais! \n\n" +
            "📦 *DELIVERY:* (75) 97400-3081 🚗💨"
        );
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pequeno delay

        // Digitação 
        await chat.sendStateTyping();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pequeno delay para parecer natural
        
        // Enviar as imagens do cardápio
        await client.sendMessage(msg.from, image);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pequeno delay
        await client.sendMessage(msg.from, image2);

        // Simulando Gravação antes de enviar áudio
        await chat.sendStateRecording();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pequeno delay

        // Enviar o áudio como mensagem de voz
        await client.sendMessage(msg.from, audio, { sendAudioAsVoice: true });

        // Mensagem final
        await client.sendMessage(
            msg.from,
            "🎙️ *Aqui está nosso cardápio em áudio!* Caso precise de mais informações, estou à disposição! 😉"
        );
    }

    if (keywordsMsgInicial.some(keyword => msg.body.toLowerCase().includes(keyword)) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

    }

    if (keywordsMsgInicial.some(keyword => msg.body.toLowerCase().includes(keyword)) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

    }
});