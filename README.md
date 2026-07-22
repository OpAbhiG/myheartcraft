# Memora 💌 — Digital Keepsakes & Experiences

Memora is a premium web platform designed to convert raw emotions, personal letters, and cherished memories into beautiful, interactive digital keepsakes. It allows creators to build custom, private surprise cards with ambient synthesized music, floating particle effects, memory scrapbooks, and interactive unlocking minigames for their loved ones.

**Live Website:** [https://memora.vercel.app/](https://memora.vercel.app/)

---

## ✨ Key Features & Experiences

- **🎂 Virtual Birthday Bash**: A festive, interactive surprise card with virtual candles that recipients can blow out, accompanied by celebratory confetti and music loops.
- **💍 Perfect Proposal**: A romantic, cinematic countdown and question card with falling gold dust, romantic strings, and private messaging.
- **🧩 Surprise Photo Puzzle**: A playful memory card where recipients solve an interactive jigsaw puzzle of a customized photograph to unlock their secret letter.
- **💌 Love Letter**: A vintage, wax-sealed parchment envelope that breaks open to reveal personal scrapbook memories and romantic piano audio loops.
- **🌹 Anniversary Special**: A curated timeline gallery walking through memorable years together in a beautifully designed scrapbook interface.
- **💔 Apology/Sorry Card**: A sincere, calming handwritten note card with soft acoustic guitar background music to express genuine reconciliation.
- **🌸 Mother's Day Keepsake**: A warm, appreciative tribute scrapbook to honor moms with floating stars and gratitude letters.
- **🔒 Creator Studio Control Center**: A passcode-protected dashboard allowing administrators to check live recipient views, replies, and manage global keepsakes.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Styling & Theme**: Vanilla CSS / TailwindCSS V4
- **Security & Privacy**: SHA-256 Web Crypto API password hashing, brute-force rate-limiting, and XSS input sanitization.
- **Database & Sync**: Primary unlimited JSON store with failover redundancy.

---

## 💻 Running Locally

### Prerequisites
Make sure you have **Node.js** (v18+) installed.

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/OpAbhiG/myheartcraft.git
   cd myheartcraft
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` to start crafting.

5. **Build for Production**:
   ```bash
   npm run build
   ```
