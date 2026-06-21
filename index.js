const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const fs = require('fs');

const client = new Client();

// ===== STORAGE =====
let messageCount = {};
let chatHistory = {};
let maxRepliesMap = {};

// ================= AI FUNCTION =================
async function getAIReply(user, message) {
    try {
        const history = chatHistory[user]?.join("\n") || "";

        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistral",
                stream: false,
                prompt: `
You are me.
Tone: casual, slightly sarcastic, use short replies.
Don't sound like AI. Don't use lots of emoji.

Always reply in the SAME language as the message.

Do NOT reuse phrases from previous replies in this conversation.

Never share personal, sensitive, or private information.

Conversation so far:
${history}

Examples:

Friend: bro kya kar raha hai
Me: araam. kyu kya hua?

Friend: kal free hai kya?
Me: shayad. college nhi gaya toh. kya hua?

Friend: chal kal milte phir
Me: ehh. time nhi hai tere saath ghoomne.

Friend: abe attitude kyu dikha raha hai
Me: nhi aana

Friend: theek hai bhai yaad rakhunga
Me: bhoolne dunga bhi nhi

---

Message: ${message}
Reply:
`
            })
        });

        const data = await response.json();
        return data.response?.trim() || "hmm";

    } catch (err) {
        console.log("AI error:", err.message);
        return "baad mein baat karte";
    }
}
// =================================================

// QR
client.on('qr', qr => {
    console.log('Scan this QR:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

// ================= MESSAGE HANDLER =================
client.on('message', async msg => {

    try {

        if (msg.from === 'status@broadcast') return;
        if (msg.broadcast) return;
        if (msg.from.includes('@g.us')) return;

        const contact = await msg.getContact();

        if (!contact.isMyContact) {

            const user = msg.from;
            const text = msg.body?.toLowerCase() || "";

            // ignore basic greetings
            if (msg.type === "chat" && ["hi", "hello", "hey"].includes(text)) {
                return;
            }

            // ===== INIT =====
            if (!messageCount[user]) messageCount[user] = 0;
            if (!chatHistory[user]) chatHistory[user] = [];
            if (!maxRepliesMap[user]) {
                maxRepliesMap[user] = 4 + Math.floor(Math.random() * 3);
            }

            messageCount[user]++;

            console.log(`User: ${user}, Count: ${messageCount[user]}`);

            // ===== LOGGING (fixed) =====
            fs.appendFileSync("logs.txt", `${user} [${msg.type}]: ${msg.body}\n`);

            // ===== STORE HISTORY =====
            if (msg.type === "chat") {
                chatHistory[user].push(`User: ${msg.body}`);

                if (chatHistory[user].length > 4) {
                    chatHistory[user].shift();
                }
            }

            if (messageCount[user] <= maxRepliesMap[user]) {

                const delay = 1500 + Math.floor(Math.random() * 1500);

                setTimeout(async () => {
                    try {

                        // ===== STICKER =====
                        if (msg.type === "sticker") {
                            const replies = ["da hek", "nice", "lol"];
                            const r = replies[Math.floor(Math.random() * replies.length)];
                            await msg.reply(r);
                            return;
                        }

                        // ===== MEDIA =====
                        if (msg.type !== "chat") {
                            await msg.reply("nice");
                            return;
                        }

                        let reply = await getAIReply(user, msg.body);

                        // ===== EXIT MESSAGE =====
                        if (messageCount[user] === maxRepliesMap[user]) {
                            reply = "baad me baat karte, thoda busy hoon";
                        }

                        // store reply
                        chatHistory[user].push(`Me: ${reply}`);

                        await msg.reply(reply);

                    } catch (err) {
                        console.log("Reply error:", err.message);
                    }
                }, delay);

            } else {
                console.log("Limit reached.");
            }
        }

    } catch (err) {
        console.log("Handler error:", err.message);
    }
});

// ================= TERMINAL COMMAND =================
process.stdin.on('data', async (data) => {
    const input = data.toString().trim();

    if (input === 'logout') {
        console.log("Logging out...");
        await client.logout();
        process.exit();
    }
});

// start bot
client.initialize();