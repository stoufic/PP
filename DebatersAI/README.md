# Debaters.AI

An AI-powered platform for connecting debaters with opposing views. Features real-time fact-checking, conversation analysis, and both online and in-person debate modes.

## Features

- **Online Mode**: Get matched with someone who holds an opposing view on your chosen topic
- **In-Person Mode**: Place your phone between two debaters for AI-powered analysis
- **Real-Time Fact-Checking**: AI verifies claims and provides sources instantly
- **Conversation Analysis**: Track sentiment, key arguments, and emotional moments

## Quick Start

### 1. Start the Backend Server
```bash
cd server
pip install -r requirements.txt
python main.py
```
The API will be available at http://localhost:8000

### 2. Start the Proxy Server (for AI features)
```bash
cd proxy
pip install -r requirements.txt
python proxy_server.py
```
The proxy will be available at http://localhost:8080

> **Note**: You need to set your `ANTHROPIC_API_KEY` environment variable for AI features to work.

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev
```
The app will be available at http://localhost:3000

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Python FastAPI + WebSockets
- **AI**: Claude API for analysis and fact-checking

## No Login Required

Start debating immediately - no account needed!

## License

MIT
