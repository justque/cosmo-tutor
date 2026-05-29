# Cosmo — Interactive Science Tutor for Kids

A web-based AI tutor that teaches science to kids aged 5–8 using words, pictures, animations, and voice. Cosmo is a funny robot astronaut who explains complex concepts in simple, engaging ways.

🚀 **[Live Demo](#)** | 📖 **[Deployment Guide](DEPLOYMENT.md)** | 🎓 **[How It Works](#how-it-works)**

## Features

✨ **Interactive Learning**
- Text and voice input — kids can ask questions naturally
- Voice output — Cosmo speaks answers aloud
- Topic-guided lessons or free exploration

🎨 **Engaging Experience**
- Space Explorer visual theme (dark cosmic design)
- Robot astronaut mascot (Cosmo) with personality and humor
- Animations and real science images alongside explanations
- Tailored for ages 5–8 (simple words, short sentences, emojis)

🧠 **Powered by Claude AI**
- Answers explained at a kindergarten level
- Kid-friendly analogies (e.g., "The Sun is like a giant campfire!")
- Celebrates curiosity and encourages more questions

👨‍👩‍👧 **Parent-Friendly**
- Parent accounts manage child profiles
- Dashboard tracks learning history and topics explored
- COPPA-compliant privacy (no ads, no data sharing)

📊 **Rate Limiting**
- 50 API calls per child per day (prevents overuse)
- Friendly message when limit reached

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API routes, Claude API
- **Auth & Database:** Supabase (Postgres)
- **Voice:** Web Speech API (browser-native)
- **Images:** Unsplash API
- **Deployment:** Vercel

## Getting Started

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with API keys (see DEPLOYMENT.md)
cp .env.local.example .env.local

# 3. Run dev server
npm run dev

# 4. Open http://localhost:3000
```

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions to:
1. Create Supabase project and run migrations
2. Get API keys (Anthropic, Unsplash)
3. Deploy to Vercel
4. Configure environment variables

## Project Structure

```
chatbot/
├── app/                    # Next.js pages and API routes
│   ├── page.tsx           # Landing page (public)
│   ├── auth/              # Parent auth (signup/login)
│   ├── dashboard/         # Parent dashboard (manage kids)
│   ├── learn/             # Main learning screen
│   └── api/chat/          # Claude API endpoint
├── components/            # Reusable React components
│   ├── ChatPanel.tsx      # Message list and input
│   ├── CosmoMessage.tsx   # Bot message with animation
│   ├── Sidebar.tsx        # Topic navigation
│   ├── VoiceButton.tsx    # Mic input button
│   └── VisualPanel.tsx    # Image/animation display
├── lib/                   # Utilities and config
│   ├── claude.ts          # Claude API client
│   ├── lessons.ts         # Mini-lesson sequences
│   └── supabase.ts        # Supabase client
├── supabase/
│   └── migrations/        # Database schema
└── public/                # Static assets
```

## How It Works

### Learning Flow

1. **Parent signs up** → creates child profile → shares with kid
2. **Kid opens app** → sees Cosmo and topic sidebar
3. **Kid asks a question** (text or voice) → Cosmo responds
4. **Cosmo's response includes:**
   - Simple explanation with kid-friendly analogies
   - A fun fact or follow-up question
   - Optional animation or image (via VISUAL tag)
   - Text spoken aloud via SpeechSynthesis API
5. **Progress is saved** → parent dashboard shows what was learned

### AI System Prompt

Cosmo's personality is defined by a detailed system prompt that ensures:
- Very simple vocabulary and short sentences
- Warm, funny tone with emojis
- Kid-friendly analogies
- Celebration of curiosity
- No scary or violent content

See `lib/claude.ts` for the full prompt.

### Lesson Sequences

Each topic (Space, Animals, Weather, Human Body, Plants) has 3–5 pre-defined lesson steps that guide kids through a concept:

1. **Hook** — an exciting question to spark interest
2. **Explanation** — the main idea in simple terms
3. **Fun Fact** — something surprising to remember

Kids can then ask free-form questions about that topic.

## Privacy & Safety (COPPA)

Cosmo is COPPA-compliant:
- ✅ Parent accounts own all data
- ✅ No ads or tracking
- ✅ No third-party data sharing
- ✅ Explicit privacy disclosure at signup
- ✅ Children never create accounts directly

## API Costs

### Claude API
- ~$0.003 per response (200-500 tokens)
- Estimated: $0.30-0.45/day @ 100-150 calls/day
- Capped at 50 calls per child per day

### Supabase
- Free tier: 50k monthly active users
- Free tier: 500 MB storage
- Upgrade to Pro if usage exceeds limits

### Unsplash
- Free tier: 50 requests/hour
- No cost for images

## Testing

### Local Testing Checklist
- [ ] Sign up as parent
- [ ] Create a child profile
- [ ] Open learning screen
- [ ] Ask a text question
- [ ] Ask a voice question (mic input)
- [ ] Hear Cosmo's response spoken aloud
- [ ] See animation/image render alongside response
- [ ] Check parent dashboard shows learning history
- [ ] Test rate limit (trigger after 50 calls)

### Mobile Testing
- [ ] Test on iOS Safari (voice input/output)
- [ ] Test on Android Chrome (voice input/output)
- [ ] Test on landscape/portrait orientation
- [ ] Check touch interactions (buttons, input)

## Roadmap

Future improvements (not in v1):
- [ ] Lottie animation library instead of placeholders
- [ ] Multi-language support
- [ ] Achievement badges and gamification
- [ ] Offline mode (store messages locally)
- [ ] Custom lessons for teachers
- [ ] Integration with school systems

## Contributing

This is a personal project. To modify or extend:
1. Read the [deployment guide](DEPLOYMENT.md)
2. Run locally with `npm run dev`
3. Make changes and test thoroughly
4. Commit with clear messages

## License

Private project (not open source).

## Questions?

- Check [DEPLOYMENT.md](DEPLOYMENT.md) for setup help
- See `lib/claude.ts` to customize Cosmo's personality
- Review `lib/lessons.ts` to add new topics

---

**Built by:** Jay  
**Status:** Initial release (v1) — Ready for testing  
**Last updated:** 2026-05-29
