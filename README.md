# WhatsApp AI Auto-Responder

An AI-powered WhatsApp auto-responder built using Node.js, whatsapp-web.js, and Ollama.

The bot selectively replies to unsaved contacts and uses a local LLM to generate natural, human-like responses with a customized personality.

---

## Features

- AI-generated conversational replies
- Runs entirely locally using Ollama
- Replies only to unsaved contacts
- Human-like random reply delays
- Random conversation cutoff to avoid endless chats
- Handles stickers and media separately
- Ignores:
  - Group chats
  - Status updates
  - Broadcast messages
- Custom personality through prompt engineering
- No paid APIs or cloud services required

---

## Tech Stack

- JavaScript
- Node.js
- whatsapp-web.js
- Ollama
- Mistral LLM

---

## How It Works

```
Incoming WhatsApp Message
            |
            v
      Message Filter
            |
            v
      Personality Prompt
            |
            v
    Local Mistral Model
            |
            v
   Human-like AI Response
            |
            v
      WhatsApp Reply
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-ai-autoresponder.git
cd whatsapp-ai-autoresponder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Ollama

Download and install Ollama from:

https://ollama.com

### 4. Download Mistral

```bash
ollama pull mistral
```

### 5. Run the bot

Start Ollama:

```bash
ollama run mistral
```

In another terminal:

```bash
node index.js
```

Scan the QR code using WhatsApp Linked Devices.

---

## Project Structure

```text
whatsapp-ai-autoresponder
├── index.js          # Main bot logic
├── package.json      # Dependencies and scripts
├── README.md         # Project documentation
└── .gitignore        # Ignored files and folders
```

---

## Safety & Privacy

- WhatsApp authentication files are excluded from the repository
- Conversations are not stored permanently
- The AI model runs locally on the user's machine
- No messages are sent to third-party AI APIs

---

## Future Improvements

- Better personality fine-tuning
- Context-aware conversations
- Voice message support
- Web dashboard for configuration
- Deployment on dedicated hardware

---

## Disclaimer

This project uses unofficial WhatsApp Web automation. Use responsibly.
