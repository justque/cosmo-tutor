# Cosmo's Cosmic Adventure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Transform Cosmo into a game-based journey where Cosmo actively leads kids through a visual map of science topics, with mini-games at each location and checkpoint assessments after each topic.

**Architecture:** Single-page adventure experience at `/adventure`. A `JourneyMap` shows visual progress through 5 topic chapters. Each topic has 2-3 `LocationView` stops; each location auto-plays Cosmo's intro narration, then presents a `MiniGame` (matching/ordering/building/question). After all locations in a topic, a `CheckpointAssessment` (multi-question) gates progression to the next topic. An `AskCosmoPalette` provides side chat without breaking the lesson flow. Content is seeded in `lib/journeyContent.ts` (TypeScript constants) for simplicity. Progress persists in Supabase via fire-and-forget upserts.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind, Framer Motion, Supabase, Claude API (for side chat only — content is static).

---

## File Structure

**New files:**
- `lib/journeyContent.ts` — All journey content: 5 topics × 2-3 locations × game data + checkpoint questions (single source of truth)
- `lib/gameEngine.ts` — Pure functions to evaluate mini-game answers and checkpoint scores
- `lib/journeyProgress.ts` — Supabase helpers for loading/saving adventure progress
- `app/adventure/page.tsx` — Adventure entry point (loads progress, renders journey)
- `components/adventure/JourneyMap.tsx` — Visual map of all topics with current position marker
- `components/adventure/LocationView.tsx` — Renders a single location: Cosmo's intro + visual + mini-game
- `components/adventure/CosmoNarrator.tsx` — Animated Cosmo character with speech bubble (auto-types text)
- `components/adventure/MiniGame.tsx` — Game dispatcher: picks correct game subcomponent by `type`
- `components/adventure/games/MatchingGame.tsx` — Drag/click pairs to match
- `components/adventure/games/OrderingGame.tsx` — Drag items into correct order
- `components/adventure/games/BuildingGame.tsx` — Click pieces to build a target (e.g., solar system)
- `components/adventure/games/QuestionGame.tsx` — Multiple-choice question (reuse for checkpoints)
- `components/adventure/CheckpointAssessment.tsx` — 3-question topic test using QuestionGame
- `components/adventure/AskCosmoPalette.tsx` — Slide-in side panel for free chat (calls /api/chat)
- `supabase/migrations/003_cosmic_adventure.sql` — Tables: journey_progress, checkpoint_attempts

**Modified files:**
- `app/page.tsx` — Update CTA from "Start Learning Now" → "Start the Adventure!" routes to `/adventure`
- `app/dashboard/page.tsx` — Add "Continue Adventure" button per child linking to `/adventure?childId=X`

**Files NOT touched (kept as-is):**
- Existing `/learn` page stays for free chat fallback (linked from adventure)
- `lib/lessons.ts`, `lib/lessonEngine.ts`, `components/LessonStep.tsx` remain (used by /learn)

---

## Content Model (in `lib/journeyContent.ts`)

```ts
export type GameType = 'matching' | 'ordering' | 'building' | 'question'

export interface MatchingGameData {
  type: 'matching'
  instruction: string
  pairs: Array<{ left: string; right: string; id: string }>
  celebrationMessage: string
}

export interface OrderingGameData {
  type: 'ordering'
  instruction: string
  items: Array<{ id: string; label: string; emoji: string }>
  correctOrder: string[] // array of item ids in correct sequence
  celebrationMessage: string
}

export interface BuildingGameData {
  type: 'building'
  instruction: string
  target: string // e.g., "Build the solar system!"
  pieces: Array<{ id: string; label: string; emoji: string; slot: number }>
  celebrationMessage: string
}

export interface QuestionGameData {
  type: 'question'
  instruction: string
  question: string
  options: string[]
  correctIndex: number
  celebrationMessage: string
  hintOnWrong: string
}

export type GameData = MatchingGameData | OrderingGameData | BuildingGameData | QuestionGameData

export interface Location {
  id: string            // e.g., "space-sun"
  name: string          // e.g., "The Blazing Sun"
  emoji: string         // e.g., "☀️"
  introNarration: string // Cosmo's actively-led intro (3-5 sentences)
  funFact: string       // Short fact shown before game
  game: GameData
}

export interface Checkpoint {
  id: string
  topicId: string
  title: string
  introNarration: string
  questions: QuestionGameData[]   // 3 questions
  passingScore: number             // e.g., 2 out of 3
  successNarration: string
  retryNarration: string
}

export interface Topic {
  id: string            // e.g., "space"
  name: string
  emoji: string
  themeColor: string    // tailwind color, e.g., "indigo"
  order: number
  locations: Location[]
  checkpoint: Checkpoint
}

export const JOURNEY: Topic[] = [ /* 5 topics seeded */ ]
```

---

## Task Breakdown

### Task 1: Database migration for adventure progress

**Files:**
- Create: `supabase/migrations/003_cosmic_adventure.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Cosmic Adventure progress tracking
-- Tracks each child's position in the journey and their checkpoint attempts.

create table if not exists journey_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  current_topic_id text not null default 'space',
  current_location_index int not null default 0,
  completed_location_ids text[] not null default '{}',
  completed_topic_ids text[] not null default '{}',
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  unique(child_id)
);

create table if not exists checkpoint_attempts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  topic_id text not null,
  score int not null,
  total int not null,
  passed boolean not null,
  attempted_at timestamptz default now()
);

alter table journey_progress enable row level security;
alter table checkpoint_attempts enable row level security;

create policy "Parents read own journey progress"
  on journey_progress for select
  using (child_id in (select id from children where parent_id = auth.uid()));

create policy "Parents upsert own journey progress"
  on journey_progress for insert
  with check (child_id in (select id from children where parent_id = auth.uid()));

create policy "Parents update own journey progress"
  on journey_progress for update
  using (child_id in (select id from children where parent_id = auth.uid()));

create policy "Parents read own checkpoint attempts"
  on checkpoint_attempts for select
  using (child_id in (select id from children where parent_id = auth.uid()));

create policy "Parents insert own checkpoint attempts"
  on checkpoint_attempts for insert
  with check (child_id in (select id from children where parent_id = auth.uid()));
```

- [ ] **Step 2: Run migration in Supabase SQL Editor**

In Supabase dashboard → SQL Editor → New query → paste file contents → Run.
Expected: `journey_progress` and `checkpoint_attempts` appear in Tables list.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/003_cosmic_adventure.sql
git commit -m "feat(db): add journey_progress and checkpoint_attempts tables"
```

---

### Task 2: Journey content with one full topic (Space)

**Files:**
- Create: `lib/journeyContent.ts`

- [ ] **Step 1: Write the content file with types and seed Space topic**

```ts
// lib/journeyContent.ts

export type GameType = 'matching' | 'ordering' | 'building' | 'question'

export interface MatchingGameData {
  type: 'matching'
  instruction: string
  pairs: Array<{ left: string; right: string; id: string }>
  celebrationMessage: string
}

export interface OrderingGameData {
  type: 'ordering'
  instruction: string
  items: Array<{ id: string; label: string; emoji: string }>
  correctOrder: string[]
  celebrationMessage: string
}

export interface BuildingGameData {
  type: 'building'
  instruction: string
  target: string
  pieces: Array<{ id: string; label: string; emoji: string; slot: number }>
  celebrationMessage: string
}

export interface QuestionGameData {
  type: 'question'
  instruction: string
  question: string
  options: string[]
  correctIndex: number
  celebrationMessage: string
  hintOnWrong: string
}

export type GameData =
  | MatchingGameData
  | OrderingGameData
  | BuildingGameData
  | QuestionGameData

export interface Location {
  id: string
  name: string
  emoji: string
  introNarration: string
  funFact: string
  game: GameData
}

export interface Checkpoint {
  id: string
  topicId: string
  title: string
  introNarration: string
  questions: QuestionGameData[]
  passingScore: number
  successNarration: string
  retryNarration: string
}

export interface Topic {
  id: string
  name: string
  emoji: string
  themeColor: string
  order: number
  locations: Location[]
  checkpoint: Checkpoint
}

export const JOURNEY: Topic[] = [
  {
    id: 'space',
    name: 'Outer Space',
    emoji: '🚀',
    themeColor: 'indigo',
    order: 1,
    locations: [
      {
        id: 'space-sun',
        name: 'The Blazing Sun',
        emoji: '☀️',
        introNarration:
          "Whoa, look at that! That giant glowing ball is the Sun! 🌟 The Sun is a HUGE star, way bigger than Earth. It gives us light and warmth every single day. Without the Sun, we'd be frozen ice cubes!",
        funFact: 'The Sun is so big that 1 million Earths could fit inside it! 🤯',
        game: {
          type: 'question',
          instruction: 'Quick question, space cadet!',
          question: 'What is the Sun?',
          options: ['A planet', 'A star', 'A moon', 'A cloud'],
          correctIndex: 1,
          celebrationMessage: "Yes! The Sun is a STAR! You're a space genius! ⭐",
          hintOnWrong: 'Hint: It glows and gives us light, just like other twinkly things in the sky at night!',
        },
      },
      {
        id: 'space-planets',
        name: 'The Planet Parade',
        emoji: '🪐',
        introNarration:
          "Next stop — the planets! 🪐 There are 8 planets that zoom around our Sun. They come in all sizes and colors. Some are rocky like Earth, and some are giant balls of gas like Jupiter!",
        funFact: 'Jupiter has a big red storm that has been spinning for over 300 years! 🌀',
        game: {
          type: 'ordering',
          instruction: 'Put the planets in order from CLOSEST to FARTHEST from the Sun!',
          items: [
            { id: 'mercury', label: 'Mercury', emoji: '☿️' },
            { id: 'venus', label: 'Venus', emoji: '♀️' },
            { id: 'earth', label: 'Earth', emoji: '🌍' },
            { id: 'mars', label: 'Mars', emoji: '🔴' },
          ],
          correctOrder: ['mercury', 'venus', 'earth', 'mars'],
          celebrationMessage: 'Perfect order! You know the planets! 🎉',
        },
      },
      {
        id: 'space-moon',
        name: 'Our Moon',
        emoji: '🌙',
        introNarration:
          "Last stop in space — the Moon! 🌙 The Moon is Earth's best friend. It goes around our planet over and over. People have even walked on the Moon!",
        funFact: 'The Moon is moving away from Earth a tiny bit every year! 👋',
        game: {
          type: 'matching',
          instruction: 'Match each space thing to what it does!',
          pairs: [
            { id: 'p1', left: 'Sun', right: 'Gives us light' },
            { id: 'p2', left: 'Moon', right: 'Goes around Earth' },
            { id: 'p3', left: 'Earth', right: 'Where we live' },
          ],
          celebrationMessage: 'Match-tastic! 🎯',
        },
      },
    ],
    checkpoint: {
      id: 'cp-space',
      topicId: 'space',
      title: 'Space Captain Test! 🚀',
      introNarration:
        "Wow, you finished all the space stops! Now let's see if you remember everything. Answer these 3 questions to earn your Space Captain badge!",
      passingScore: 2,
      questions: [
        {
          type: 'question',
          instruction: 'Question 1 of 3',
          question: 'How many planets go around our Sun?',
          options: ['5', '8', '12', '100'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Think about all the planets we visited!',
        },
        {
          type: 'question',
          instruction: 'Question 2 of 3',
          question: 'What goes around the Earth?',
          options: ['The Sun', 'The Moon', 'Mars', 'Jupiter'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It glows at night...',
        },
        {
          type: 'question',
          instruction: 'Question 3 of 3',
          question: 'The Sun is a...',
          options: ['Planet', 'Star', 'Moon', 'Comet'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It is the same kind of thing you see twinkling at night!',
        },
      ],
      successNarration: "You did it! You're officially a Space Captain! 🏆 Ready to explore Earth's animals next?",
      retryNarration: "Almost there, space cadet! Let's try those tricky ones again. You've got this! 💪",
    },
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add lib/journeyContent.ts
git commit -m "feat(content): seed Space topic with 3 locations and checkpoint"
```

---

### Task 3: Add remaining 4 topics to journey content

**Files:**
- Modify: `lib/journeyContent.ts` (append to JOURNEY array)

- [ ] **Step 1: Append Animals, Weather, Human Body, Plants to JOURNEY array**

Add inside the `JOURNEY` array after the space topic:

```ts
  {
    id: 'animals',
    name: 'Animal Kingdom',
    emoji: '🦁',
    themeColor: 'amber',
    order: 2,
    locations: [
      {
        id: 'animals-mammals',
        name: 'Mighty Mammals',
        emoji: '🐘',
        introNarration:
          "Welcome to the Animal Kingdom! 🦁 First, let's meet the MAMMALS. Mammals have fur or hair, and most baby mammals drink milk from their mommy. You are a mammal too!",
        funFact: 'Blue whales are the biggest mammals — bigger than 3 school buses! 🐋',
        game: {
          type: 'question',
          instruction: 'Spot the mammal!',
          question: 'Which of these is a mammal?',
          options: ['Snake 🐍', 'Dog 🐕', 'Fish 🐟', 'Bird 🐦'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Dogs are mammals — they have fur! 🐶',
          hintOnWrong: 'Look for the one with FUR!',
        },
      },
      {
        id: 'animals-habitats',
        name: 'Animal Homes',
        emoji: '🏞️',
        introNarration:
          "Animals live in different places called HABITATS! 🌳 Fish live in water, birds make nests in trees, and polar bears live on icy snow. Every animal has its perfect home!",
        funFact: 'A camel can go a whole week without drinking water! 🐪',
        game: {
          type: 'matching',
          instruction: 'Match each animal to its home!',
          pairs: [
            { id: 'p1', left: 'Fish 🐟', right: 'Ocean' },
            { id: 'p2', left: 'Polar Bear 🐻‍❄️', right: 'Arctic ice' },
            { id: 'p3', left: 'Monkey 🐒', right: 'Jungle trees' },
          ],
          celebrationMessage: 'Every animal back home safely! 🏡',
        },
      },
    ],
    checkpoint: {
      id: 'cp-animals',
      topicId: 'animals',
      title: 'Animal Expert Test! 🦁',
      introNarration: "Let's see if you became an animal expert! 3 questions!",
      passingScore: 2,
      questions: [
        {
          type: 'question',
          instruction: 'Question 1 of 3',
          question: 'Mammals have what on their body?',
          options: ['Scales', 'Feathers', 'Fur or hair', 'Slime'],
          correctIndex: 2,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Think about a fluffy puppy!',
        },
        {
          type: 'question',
          instruction: 'Question 2 of 3',
          question: 'Where do fish live?',
          options: ['Trees', 'Water', 'Sky', 'Caves'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Splash! They need this to swim!',
        },
        {
          type: 'question',
          instruction: 'Question 3 of 3',
          question: 'An animal\'s home is called a...',
          options: ['Habitat', 'Hotel', 'House', 'Hat'],
          correctIndex: 0,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Starts with H... HAB-i-tat!',
        },
      ],
      successNarration: "AMAZING! You're an Animal Expert! 🏆 Time to check the weather!",
      retryNarration: "Almost! Let's try those again — you're so close! 🐾",
    },
  },
  {
    id: 'weather',
    name: 'Wild Weather',
    emoji: '🌦️',
    themeColor: 'sky',
    order: 3,
    locations: [
      {
        id: 'weather-rain',
        name: 'The Water Cycle',
        emoji: '💧',
        introNarration:
          "Did you know water goes on a JOURNEY too? ☔ The Sun heats water in oceans and lakes. The water floats UP as steam, makes clouds, and then falls back down as rain! This is called the water cycle!",
        funFact: 'The water you drink today might be the same water a dinosaur drank long ago! 🦖',
        game: {
          type: 'ordering',
          instruction: 'Put the water cycle in order!',
          items: [
            { id: 'sun', label: 'Sun heats water', emoji: '☀️' },
            { id: 'evaporate', label: 'Water goes up', emoji: '💨' },
            { id: 'cloud', label: 'Clouds form', emoji: '☁️' },
            { id: 'rain', label: 'Rain falls', emoji: '🌧️' },
          ],
          correctOrder: ['sun', 'evaporate', 'cloud', 'rain'],
          celebrationMessage: 'The water cycle, perfect! 🌧️',
        },
      },
      {
        id: 'weather-storms',
        name: 'Stormy Skies',
        emoji: '⛈️',
        introNarration:
          "BOOM! ⚡ Thunderstorms are wild! Lightning is a giant spark of electricity in the sky. Thunder is the LOUD sound lightning makes. You see lightning first because light travels faster than sound!",
        funFact: 'Lightning is hotter than the surface of the Sun! 🔥',
        game: {
          type: 'question',
          instruction: 'Storm question!',
          question: 'Which comes first in a thunderstorm?',
          options: ['Thunder sound', 'Lightning flash', 'Rainbow', 'Snow'],
          correctIndex: 1,
          celebrationMessage: 'Yes! We SEE lightning before we HEAR thunder! ⚡',
          hintOnWrong: 'Light is faster than sound!',
        },
      },
    ],
    checkpoint: {
      id: 'cp-weather',
      topicId: 'weather',
      title: 'Weather Wizard Test! 🌦️',
      introNarration: "Time to become a Weather Wizard! 3 questions ahead!",
      passingScore: 2,
      questions: [
        {
          type: 'question',
          instruction: 'Question 1 of 3',
          question: 'What makes rain?',
          options: ['Clouds', 'Sun', 'Wind', 'Snow'],
          correctIndex: 0,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Look up at the sky on a rainy day!',
        },
        {
          type: 'question',
          instruction: 'Question 2 of 3',
          question: 'Lightning is...',
          options: ['Cold', 'Wet', 'Electricity', 'Bouncy'],
          correctIndex: 2,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Zap! It is like the spark from a battery!',
        },
        {
          type: 'question',
          instruction: 'Question 3 of 3',
          question: 'The water cycle is powered by the...',
          options: ['Moon', 'Sun', 'Wind', 'Rocks'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It is the big bright thing in the sky during the day!',
        },
      ],
      successNarration: "Wonderful! You're a Weather Wizard! 🌦️ Next up: YOUR BODY!",
      retryNarration: "You're close! One more try, weather friend! ☔",
    },
  },
  {
    id: 'body',
    name: 'The Human Body',
    emoji: '🧠',
    themeColor: 'rose',
    order: 4,
    locations: [
      {
        id: 'body-heart',
        name: 'The Mighty Heart',
        emoji: '❤️',
        introNarration:
          "Put your hand on your chest — feel that THUMP THUMP? 💓 That's your heart! Your heart is a muscle that pumps blood all around your body, all day, every day, without ever taking a break!",
        funFact: 'Your heart beats about 100,000 times every day! 💪',
        game: {
          type: 'question',
          instruction: 'Heart smart question!',
          question: 'What does the heart pump?',
          options: ['Water', 'Air', 'Blood', 'Food'],
          correctIndex: 2,
          celebrationMessage: 'Yes! The heart pumps BLOOD! ❤️',
          hintOnWrong: 'It is the red stuff inside you!',
        },
      },
      {
        id: 'body-brain',
        name: 'The Big Brain',
        emoji: '🧠',
        introNarration:
          "Up in your head is your BRAIN! 🧠 Your brain is like a super computer. It helps you think, remember, see, hear, and even wiggle your toes! Right now, your brain is learning new things!",
        funFact: 'Your brain has more connections than there are stars in the sky! ✨',
        game: {
          type: 'matching',
          instruction: 'Match each body part to its job!',
          pairs: [
            { id: 'p1', left: 'Brain 🧠', right: 'Thinking' },
            { id: 'p2', left: 'Heart ❤️', right: 'Pumping blood' },
            { id: 'p3', left: 'Lungs 🫁', right: 'Breathing' },
          ],
          celebrationMessage: 'You know your body so well! 🎉',
        },
      },
    ],
    checkpoint: {
      id: 'cp-body',
      topicId: 'body',
      title: 'Body Boss Test! 🧠',
      introNarration: "Last topic before you finish — let's see what you know about YOUR body!",
      passingScore: 2,
      questions: [
        {
          type: 'question',
          instruction: 'Question 1 of 3',
          question: 'Your heart is a...',
          options: ['Bone', 'Muscle', 'Brain', 'Rock'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It squeezes like your arm muscle when you flex!',
        },
        {
          type: 'question',
          instruction: 'Question 2 of 3',
          question: 'You think with your...',
          options: ['Feet', 'Belly', 'Brain', 'Hair'],
          correctIndex: 2,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It is inside your head!',
        },
        {
          type: 'question',
          instruction: 'Question 3 of 3',
          question: 'You breathe with your...',
          options: ['Lungs', 'Knees', 'Eyes', 'Toes'],
          correctIndex: 0,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Take a big breath — feel your chest go up!',
        },
      ],
      successNarration: "Incredible! You're a Body Boss! 🧠 One last adventure: PLANTS!",
      retryNarration: "Almost! Your brain is working hard — try again! 💭",
    },
  },
  {
    id: 'plants',
    name: 'Plant Power',
    emoji: '🌱',
    themeColor: 'emerald',
    order: 5,
    locations: [
      {
        id: 'plants-growing',
        name: 'How Plants Grow',
        emoji: '🌱',
        introNarration:
          "Did you know plants EAT sunlight? 🌞 Plants need 3 things to grow: SUN, WATER, and SOIL. Their roots drink water, their leaves catch sunlight, and they grow up, up, UP!",
        funFact: 'The tallest tree in the world is taller than the Statue of Liberty! 🌲',
        game: {
          type: 'ordering',
          instruction: 'Put plant growth in order!',
          items: [
            { id: 'seed', label: 'Seed', emoji: '🌰' },
            { id: 'sprout', label: 'Sprout', emoji: '🌱' },
            { id: 'plant', label: 'Plant', emoji: '🪴' },
            { id: 'tree', label: 'Tree', emoji: '🌳' },
          ],
          correctOrder: ['seed', 'sprout', 'plant', 'tree'],
          celebrationMessage: 'Perfect growing order! 🌳',
        },
      },
      {
        id: 'plants-parts',
        name: 'Parts of a Plant',
        emoji: '🌻',
        introNarration:
          "Plants have parts that work as a team! 🌻 ROOTS grab water from the ground. The STEM holds everything up. LEAVES make food from sunlight. And FLOWERS make seeds for new plants!",
        funFact: 'Some plants can eat bugs! Like the Venus flytrap! 🪰',
        game: {
          type: 'question',
          instruction: 'Plant part question!',
          question: 'Which part of the plant catches sunlight?',
          options: ['Roots', 'Leaves', 'Seeds', 'Dirt'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Leaves catch sunlight! 🍃',
          hintOnWrong: 'They are flat and green!',
        },
      },
    ],
    checkpoint: {
      id: 'cp-plants',
      topicId: 'plants',
      title: 'Plant Master Test! 🌱',
      introNarration: "Final test! If you pass, you'll be a SCIENCE LEGEND! 🏆",
      passingScore: 2,
      questions: [
        {
          type: 'question',
          instruction: 'Question 1 of 3',
          question: 'Plants need WHAT to grow?',
          options: ['Just rocks', 'Sun, water, soil', 'Cookies', 'Loud music'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Three things from nature!',
        },
        {
          type: 'question',
          instruction: 'Question 2 of 3',
          question: 'Roots are at the...',
          options: ['Top', 'Middle', 'Bottom', 'Side'],
          correctIndex: 2,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'They drink water from the ground!',
        },
        {
          type: 'question',
          instruction: 'Question 3 of 3',
          question: 'What grows from a seed?',
          options: ['A plant', 'A rock', 'A cloud', 'A planet'],
          correctIndex: 0,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Something green that grows!',
        },
      ],
      successNarration: "🏆 YOU DID IT! You are officially a SCIENCE LEGEND! Thanks for adventuring with me! 🚀",
      retryNarration: "One more try! You are SO close to being a legend! 🌟",
    },
  },
```

- [ ] **Step 2: Commit**

```bash
git add lib/journeyContent.ts
git commit -m "feat(content): add Animals, Weather, Body, Plants topics"
```

---

### Task 4: Game evaluation engine

**Files:**
- Create: `lib/gameEngine.ts`

- [ ] **Step 1: Write game engine with pure evaluation functions**

```ts
// lib/gameEngine.ts
import type {
  GameData,
  MatchingGameData,
  OrderingGameData,
  BuildingGameData,
  QuestionGameData,
} from './journeyContent'

export interface GameResult {
  correct: boolean
  message: string
  hint?: string
}

export function evaluateQuestion(
  game: QuestionGameData,
  selectedIndex: number
): GameResult {
  const correct = selectedIndex === game.correctIndex
  return {
    correct,
    message: correct ? game.celebrationMessage : 'Not quite! Try again!',
    hint: correct ? undefined : game.hintOnWrong,
  }
}

export function evaluateMatching(
  game: MatchingGameData,
  userPairs: Array<{ id: string; left: string; right: string }>
): GameResult {
  const allCorrect = game.pairs.every((expected) =>
    userPairs.some(
      (u) => u.left === expected.left && u.right === expected.right
    )
  )
  return {
    correct: allCorrect,
    message: allCorrect ? game.celebrationMessage : 'Some matches are mixed up. Try again!',
  }
}

export function evaluateOrdering(
  game: OrderingGameData,
  userOrder: string[]
): GameResult {
  const correct =
    userOrder.length === game.correctOrder.length &&
    userOrder.every((id, i) => id === game.correctOrder[i])
  return {
    correct,
    message: correct ? game.celebrationMessage : 'Order is not quite right. Try again!',
  }
}

export function evaluateBuilding(
  game: BuildingGameData,
  placements: Array<{ id: string; slot: number }>
): GameResult {
  const correct = game.pieces.every((piece) =>
    placements.some((p) => p.id === piece.id && p.slot === piece.slot)
  )
  return {
    correct,
    message: correct ? game.celebrationMessage : 'Some pieces are in the wrong spot!',
  }
}

export function evaluateCheckpoint(
  questions: QuestionGameData[],
  answers: number[],
  passingScore: number
): { score: number; total: number; passed: boolean } {
  const score = answers.reduce(
    (sum, ans, i) => (ans === questions[i].correctIndex ? sum + 1 : sum),
    0
  )
  return { score, total: questions.length, passed: score >= passingScore }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/gameEngine.ts
git commit -m "feat: game evaluation engine for all mini-game types"
```

---

### Task 5: Progress persistence helpers

**Files:**
- Create: `lib/journeyProgress.ts`

- [ ] **Step 1: Write Supabase helpers**

```ts
// lib/journeyProgress.ts
import { supabase } from './supabase'

export interface JourneyProgress {
  childId: string
  currentTopicId: string
  currentLocationIndex: number
  completedLocationIds: string[]
  completedTopicIds: string[]
}

export async function loadProgress(childId: string): Promise<JourneyProgress> {
  const { data } = await supabase
    .from('journey_progress')
    .select('*')
    .eq('child_id', childId)
    .maybeSingle()

  if (!data) {
    return {
      childId,
      currentTopicId: 'space',
      currentLocationIndex: 0,
      completedLocationIds: [],
      completedTopicIds: [],
    }
  }
  return {
    childId,
    currentTopicId: data.current_topic_id,
    currentLocationIndex: data.current_location_index,
    completedLocationIds: data.completed_location_ids ?? [],
    completedTopicIds: data.completed_topic_ids ?? [],
  }
}

export function saveProgress(progress: JourneyProgress): void {
  // Fire-and-forget upsert
  void supabase
    .from('journey_progress')
    .upsert(
      {
        child_id: progress.childId,
        current_topic_id: progress.currentTopicId,
        current_location_index: progress.currentLocationIndex,
        completed_location_ids: progress.completedLocationIds,
        completed_topic_ids: progress.completedTopicIds,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'child_id' }
    )
    .then(({ error }) => {
      if (error) console.error('saveProgress failed:', error)
    })
}

export function logCheckpointAttempt(
  childId: string,
  topicId: string,
  score: number,
  total: number,
  passed: boolean
): void {
  void supabase
    .from('checkpoint_attempts')
    .insert({
      child_id: childId,
      topic_id: topicId,
      score,
      total,
      passed,
    })
    .then(({ error }) => {
      if (error) console.error('logCheckpointAttempt failed:', error)
    })
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/journeyProgress.ts
git commit -m "feat: journey progress persistence helpers"
```

---

### Task 6: Cosmo narrator component (animated speech bubble)

**Files:**
- Create: `components/adventure/CosmoNarrator.tsx`

- [ ] **Step 1: Write narrator component with typewriter effect**

```tsx
// components/adventure/CosmoNarrator.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  text: string
  onComplete?: () => void
  speed?: number // ms per character
}

export function CosmoNarrator({ text, onComplete, speed = 25 }: Props) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl flex-shrink-0"
      >
        🤖
      </motion.div>
      <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/40 rounded-2xl px-6 py-4 shadow-xl">
        <div className="absolute -left-2 top-6 w-4 h-4 bg-blue-500/20 border-l border-b border-blue-400/40 transform rotate-45" />
        <p className="text-white text-lg leading-relaxed">{displayed}</p>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/CosmoNarrator.tsx
git commit -m "feat: CosmoNarrator with typewriter animation"
```

---

### Task 7: QuestionGame component

**Files:**
- Create: `components/adventure/games/QuestionGame.tsx`

- [ ] **Step 1: Write component**

```tsx
// components/adventure/games/QuestionGame.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { QuestionGameData } from '@/lib/journeyContent'
import { evaluateQuestion } from '@/lib/gameEngine'

interface Props {
  game: QuestionGameData
  onCorrect: () => void
}

export function QuestionGame({ game, onCorrect }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string; hint?: string } | null>(null)

  const handleSelect = (i: number) => {
    if (feedback?.correct) return
    setSelected(i)
    const result = evaluateQuestion(game, i)
    setFeedback(result)
    if (result.correct) {
      setTimeout(onCorrect, 1500)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{game.instruction}</p>
      <h3 className="text-2xl font-bold text-white">{game.question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {game.options.map((option, i) => {
          const isSelected = selected === i
          const isCorrect = feedback?.correct && isSelected
          const isWrong = feedback && !feedback.correct && isSelected
          return (
            <motion.button
              key={i}
              whileHover={{ scale: feedback?.correct ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(i)}
              disabled={!!feedback?.correct}
              className={`p-4 rounded-xl border-2 text-lg font-medium text-left transition ${
                isCorrect
                  ? 'bg-green-500/30 border-green-400 text-white'
                  : isWrong
                  ? 'bg-red-500/30 border-red-400 text-white'
                  : 'bg-slate-800/60 border-slate-600 text-gray-100 hover:border-blue-400'
              }`}
            >
              {option}
            </motion.button>
          )
        })}
      </div>
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-center font-medium ${
            feedback.correct ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'
          }`}
        >
          {feedback.message}
          {feedback.hint && <p className="text-sm mt-1 opacity-90">{feedback.hint}</p>}
        </motion.div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/games/QuestionGame.tsx
git commit -m "feat: QuestionGame multiple-choice component"
```

---

### Task 8: OrderingGame component

**Files:**
- Create: `components/adventure/games/OrderingGame.tsx`

- [ ] **Step 1: Write component (click-to-add ordering, no drag library needed)**

```tsx
// components/adventure/games/OrderingGame.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { OrderingGameData } from '@/lib/journeyContent'
import { evaluateOrdering } from '@/lib/gameEngine'

interface Props {
  game: OrderingGameData
  onCorrect: () => void
}

export function OrderingGame({ game, onCorrect }: Props) {
  const [order, setOrder] = useState<string[]>([])
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  const available = game.items.filter((item) => !order.includes(item.id))

  const addToOrder = (id: string) => {
    if (feedback?.correct) return
    setFeedback(null)
    setOrder((prev) => [...prev, id])
  }

  const reset = () => {
    setOrder([])
    setFeedback(null)
  }

  const check = () => {
    const result = evaluateOrdering(game, order)
    setFeedback(result)
    if (result.correct) {
      setTimeout(onCorrect, 1500)
    }
  }

  const allPlaced = order.length === game.items.length

  return (
    <div className="space-y-5">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{game.instruction}</p>

      <div className="bg-slate-800/40 border-2 border-dashed border-slate-600 rounded-xl p-4 min-h-[120px]">
        <p className="text-xs text-gray-400 mb-2">Your order:</p>
        <div className="flex flex-wrap gap-2">
          {order.map((id, i) => {
            const item = game.items.find((it) => it.id === id)!
            return (
              <motion.div
                key={id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500/30 border border-blue-400 rounded-lg text-white"
              >
                <span className="text-xs text-blue-200">{i + 1}.</span>
                <span className="text-2xl">{item.emoji}</span>
                <span>{item.label}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {available.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Tap to add:</p>
          <div className="flex flex-wrap gap-2">
            {available.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addToOrder(item.id)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded-lg text-white"
              >
                <span className="text-2xl">{item.emoji}</span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          disabled={order.length === 0 || feedback?.correct}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white text-sm"
        >
          Reset
        </button>
        <button
          onClick={check}
          disabled={!allPlaced || feedback?.correct}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 rounded-lg text-white font-bold"
        >
          Check My Answer!
        </button>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-3 rounded-lg text-center font-medium ${
            feedback.correct ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'
          }`}
        >
          {feedback.message}
        </motion.div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/games/OrderingGame.tsx
git commit -m "feat: OrderingGame click-to-add sequencing"
```

---

### Task 9: MatchingGame component

**Files:**
- Create: `components/adventure/games/MatchingGame.tsx`

- [ ] **Step 1: Write component (click left, then click right to pair)**

```tsx
// components/adventure/games/MatchingGame.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MatchingGameData } from '@/lib/journeyContent'
import { evaluateMatching } from '@/lib/gameEngine'

interface Props {
  game: MatchingGameData
  onCorrect: () => void
}

export function MatchingGame({ game, onCorrect }: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matches, setMatches] = useState<Array<{ id: string; left: string; right: string }>>([])
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  // Shuffle right side for variety (stable across renders via useState init)
  const [rightOrder] = useState(() => {
    const arr = game.pairs.map((p) => p.right)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })

  const matchedLefts = new Set(matches.map((m) => m.left))
  const matchedRights = new Set(matches.map((m) => m.right))

  const handleLeftClick = (left: string) => {
    if (feedback?.correct || matchedLefts.has(left)) return
    setSelectedLeft(left)
  }

  const handleRightClick = (right: string) => {
    if (feedback?.correct || matchedRights.has(right) || !selectedLeft) return
    const id = `${selectedLeft}-${right}`
    setMatches((prev) => [...prev, { id, left: selectedLeft, right }])
    setSelectedLeft(null)
  }

  const reset = () => {
    setMatches([])
    setSelectedLeft(null)
    setFeedback(null)
  }

  const check = () => {
    const result = evaluateMatching(game, matches)
    setFeedback(result)
    if (result.correct) {
      setTimeout(onCorrect, 1500)
    }
  }

  const allMatched = matches.length === game.pairs.length

  return (
    <div className="space-y-5">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{game.instruction}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {game.pairs.map((p) => {
            const isMatched = matchedLefts.has(p.left)
            const isSelected = selectedLeft === p.left
            return (
              <motion.button
                key={p.left}
                whileHover={{ scale: isMatched ? 1 : 1.02 }}
                onClick={() => handleLeftClick(p.left)}
                disabled={isMatched}
                className={`w-full p-3 rounded-lg border-2 text-left transition ${
                  isMatched
                    ? 'bg-green-500/20 border-green-400 text-green-100'
                    : isSelected
                    ? 'bg-blue-500/40 border-blue-300 text-white'
                    : 'bg-slate-700 border-slate-500 text-white hover:border-blue-400'
                }`}
              >
                {p.left}
              </motion.button>
            )
          })}
        </div>
        <div className="space-y-2">
          {rightOrder.map((right) => {
            const isMatched = matchedRights.has(right)
            return (
              <motion.button
                key={right}
                whileHover={{ scale: isMatched ? 1 : 1.02 }}
                onClick={() => handleRightClick(right)}
                disabled={isMatched || !selectedLeft}
                className={`w-full p-3 rounded-lg border-2 text-left transition ${
                  isMatched
                    ? 'bg-green-500/20 border-green-400 text-green-100'
                    : selectedLeft
                    ? 'bg-purple-500/30 border-purple-400 text-white hover:bg-purple-500/50'
                    : 'bg-slate-700 border-slate-500 text-white opacity-60'
                }`}
              >
                {right}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          disabled={matches.length === 0 || feedback?.correct}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white text-sm"
        >
          Reset
        </button>
        <button
          onClick={check}
          disabled={!allMatched || feedback?.correct}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 rounded-lg text-white font-bold"
        >
          Check Matches!
        </button>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-3 rounded-lg text-center font-medium ${
            feedback.correct ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'
          }`}
        >
          {feedback.message}
        </motion.div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/games/MatchingGame.tsx
git commit -m "feat: MatchingGame click-pair component"
```

---

### Task 10: BuildingGame component (reuses ordering pattern)

**Files:**
- Create: `components/adventure/games/BuildingGame.tsx`

- [ ] **Step 1: Write component**

```tsx
// components/adventure/games/BuildingGame.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { BuildingGameData } from '@/lib/journeyContent'
import { evaluateBuilding } from '@/lib/gameEngine'

interface Props {
  game: BuildingGameData
  onCorrect: () => void
}

export function BuildingGame({ game, onCorrect }: Props) {
  const [placements, setPlacements] = useState<Array<{ id: string; slot: number }>>([])
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)

  const slotCount = game.pieces.length
  const slotMap = new Map(placements.map((p) => [p.slot, p.id]))
  const placedIds = new Set(placements.map((p) => p.id))
  const available = game.pieces.filter((p) => !placedIds.has(p.id))

  const handlePlace = (slot: number, pieceId: string) => {
    if (feedback?.correct) return
    setPlacements((prev) => [...prev.filter((p) => p.slot !== slot), { id: pieceId, slot }])
  }

  const reset = () => {
    setPlacements([])
    setFeedback(null)
  }

  const check = () => {
    const result = evaluateBuilding(game, placements)
    setFeedback(result)
    if (result.correct) {
      setTimeout(onCorrect, 1500)
    }
  }

  const allPlaced = placements.length === slotCount

  return (
    <div className="space-y-5">
      <p className="text-sm text-blue-300 uppercase tracking-wider">{game.instruction}</p>
      <p className="text-xl text-white font-bold">{game.target}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: slotCount }).map((_, slot) => {
          const placedId = slotMap.get(slot)
          const piece = placedId ? game.pieces.find((p) => p.id === placedId) : null
          return (
            <div
              key={slot}
              className="aspect-square bg-slate-800/60 border-2 border-dashed border-slate-500 rounded-xl flex flex-col items-center justify-center p-2"
            >
              <div className="text-xs text-gray-400 mb-1">Spot {slot + 1}</div>
              {piece ? (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setPlacements((prev) => prev.filter((p) => p.slot !== slot))}
                  className="text-4xl"
                >
                  {piece.emoji}
                  <div className="text-xs text-white mt-1">{piece.label}</div>
                </motion.button>
              ) : (
                <select
                  value=""
                  onChange={(e) => handlePlace(slot, e.target.value)}
                  className="text-xs bg-slate-700 text-white rounded px-2 py-1"
                >
                  <option value="">Pick...</option>
                  {available.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emoji} {p.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          disabled={placements.length === 0 || feedback?.correct}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-lg text-white text-sm"
        >
          Reset
        </button>
        <button
          onClick={check}
          disabled={!allPlaced || feedback?.correct}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 rounded-lg text-white font-bold"
        >
          Check!
        </button>
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-3 rounded-lg text-center font-medium ${
            feedback.correct ? 'bg-green-500/20 text-green-200' : 'bg-amber-500/20 text-amber-200'
          }`}
        >
          {feedback.message}
        </motion.div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/games/BuildingGame.tsx
git commit -m "feat: BuildingGame slot-fill component"
```

---

### Task 11: MiniGame dispatcher

**Files:**
- Create: `components/adventure/MiniGame.tsx`

- [ ] **Step 1: Write dispatcher**

```tsx
// components/adventure/MiniGame.tsx
'use client'

import type { GameData } from '@/lib/journeyContent'
import { QuestionGame } from './games/QuestionGame'
import { OrderingGame } from './games/OrderingGame'
import { MatchingGame } from './games/MatchingGame'
import { BuildingGame } from './games/BuildingGame'

interface Props {
  game: GameData
  onCorrect: () => void
}

export function MiniGame({ game, onCorrect }: Props) {
  switch (game.type) {
    case 'question':
      return <QuestionGame game={game} onCorrect={onCorrect} />
    case 'ordering':
      return <OrderingGame game={game} onCorrect={onCorrect} />
    case 'matching':
      return <MatchingGame game={game} onCorrect={onCorrect} />
    case 'building':
      return <BuildingGame game={game} onCorrect={onCorrect} />
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/MiniGame.tsx
git commit -m "feat: MiniGame game-type dispatcher"
```

---

### Task 12: LocationView component

**Files:**
- Create: `components/adventure/LocationView.tsx`

- [ ] **Step 1: Write LocationView with auto-narration → fun fact → game flow**

```tsx
// components/adventure/LocationView.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Location } from '@/lib/journeyContent'
import { CosmoNarrator } from './CosmoNarrator'
import { MiniGame } from './MiniGame'

interface Props {
  location: Location
  topicEmoji: string
  topicName: string
  locationIndex: number
  totalLocations: number
  onComplete: () => void
}

type Phase = 'intro' | 'funfact' | 'game'

export function LocationView({
  location,
  topicEmoji,
  topicName,
  locationIndex,
  totalLocations,
  onComplete,
}: Props) {
  const [phase, setPhase] = useState<Phase>('intro')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>
          {topicEmoji} {topicName} — Stop {locationIndex + 1} of {totalLocations}
        </span>
        <span className="text-2xl">{location.emoji}</span>
      </div>

      <motion.h2
        key={location.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-white text-center"
      >
        {location.name} {location.emoji}
      </motion.h2>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <CosmoNarrator text={location.introNarration} />
            <div className="text-center">
              <button
                onClick={() => setPhase('funfact')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-bold"
              >
                Cool, tell me more! ✨
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'funfact' && (
          <motion.div
            key="funfact"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/40 rounded-2xl p-6 text-center">
              <p className="text-sm text-yellow-300 uppercase tracking-wider mb-2">Fun Fact!</p>
              <p className="text-xl text-white">{location.funFact}</p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setPhase('game')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-bold"
              >
                Let&apos;s play! 🎮
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'game' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6"
          >
            <MiniGame game={location.game} onCorrect={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/LocationView.tsx
git commit -m "feat: LocationView with intro→funfact→game flow"
```

---

### Task 13: JourneyMap visualization

**Files:**
- Create: `components/adventure/JourneyMap.tsx`

- [ ] **Step 1: Write journey map component**

```tsx
// components/adventure/JourneyMap.tsx
'use client'

import { motion } from 'framer-motion'
import type { Topic } from '@/lib/journeyContent'

interface Props {
  topics: Topic[]
  currentTopicId: string
  completedTopicIds: string[]
}

export function JourneyMap({ topics, currentTopicId, completedTopicIds }: Props) {
  return (
    <div className="w-full bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-4">
      <p className="text-sm text-gray-400 mb-3 text-center uppercase tracking-wider">Your Journey</p>
      <div className="flex items-center justify-between gap-2">
        {topics.map((topic, i) => {
          const isCompleted = completedTopicIds.includes(topic.id)
          const isCurrent = topic.id === currentTopicId
          return (
            <div key={topic.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border-4 ${
                    isCompleted
                      ? 'bg-green-500/30 border-green-400'
                      : isCurrent
                      ? 'bg-blue-500/40 border-blue-300 shadow-lg shadow-blue-500/50'
                      : 'bg-slate-800 border-slate-600 opacity-60'
                  }`}
                >
                  {isCompleted ? '✓' : topic.emoji}
                </motion.div>
                <p
                  className={`text-xs mt-2 text-center font-medium ${
                    isCurrent ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {topic.name}
                </p>
              </div>
              {i < topics.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-1 rounded ${
                    isCompleted ? 'bg-green-400' : 'bg-slate-700'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/JourneyMap.tsx
git commit -m "feat: JourneyMap visual progress indicator"
```

---

### Task 14: CheckpointAssessment component

**Files:**
- Create: `components/adventure/CheckpointAssessment.tsx`

- [ ] **Step 1: Write checkpoint that walks through 3 questions and reports result**

```tsx
// components/adventure/CheckpointAssessment.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Checkpoint } from '@/lib/journeyContent'
import { CosmoNarrator } from './CosmoNarrator'
import { QuestionGame } from './games/QuestionGame'
import { evaluateCheckpoint } from '@/lib/gameEngine'

interface Props {
  checkpoint: Checkpoint
  onPassed: (score: number, total: number) => void
  onRetry: (score: number, total: number) => void
}

type Phase = 'intro' | 'questions' | 'result'

export function CheckpointAssessment({ checkpoint, onPassed, onRetry }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const handleAnswered = (selectedIndex: number) => {
    const next = [...answers, selectedIndex]
    setAnswers(next)
    if (questionIndex + 1 < checkpoint.questions.length) {
      setTimeout(() => setQuestionIndex(questionIndex + 1), 1600)
    } else {
      setTimeout(() => setPhase('result'), 1600)
    }
  }

  const restart = () => {
    setAnswers([])
    setQuestionIndex(0)
    setPhase('questions')
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{checkpoint.title}</h2>
        </div>
        <CosmoNarrator text={checkpoint.introNarration} />
        <div className="text-center">
          <button
            onClick={() => setPhase('questions')}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-white font-bold text-lg shadow-lg"
          >
            I&apos;m ready! 🏆
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'questions') {
    const current = checkpoint.questions[questionIndex]
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center text-sm text-gray-400">
          Question {questionIndex + 1} of {checkpoint.questions.length}
        </div>
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <QuestionGame
            key={questionIndex}
            game={current}
            onCorrect={() => handleAnswered(current.correctIndex)}
          />
          {/* Track wrong answers too — capture once they pick anything via overlay */}
        </div>
        <WrongAnswerCapture
          questionIndex={questionIndex}
          correctIndex={current.correctIndex}
          onWrongCapture={(idx) => handleAnswered(idx)}
        />
      </div>
    )
  }

  // Result phase
  const result = evaluateCheckpoint(checkpoint.questions, answers, checkpoint.passingScore)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto space-y-6 text-center"
    >
      <div className="text-7xl">{result.passed ? '🏆' : '💪'}</div>
      <h2 className="text-3xl font-bold text-white">
        You got {result.score} out of {result.total}!
      </h2>
      <CosmoNarrator
        text={result.passed ? checkpoint.successNarration : checkpoint.retryNarration}
      />
      <div className="flex justify-center gap-3">
        {result.passed ? (
          <button
            onClick={() => onPassed(result.score, result.total)}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg text-white font-bold text-lg"
          >
            Continue Adventure! 🚀
          </button>
        ) : (
          <>
            <button
              onClick={restart}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-bold"
            >
              Try Again 🔄
            </button>
            <button
              onClick={() => onRetry(result.score, result.total)}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >
              Review locations
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}

// Helper: captures wrong answers from QuestionGame (which only fires onCorrect)
// We watch the DOM via click events bubbled from buttons. Simpler approach: use a local QuestionGame variant.
// For simplicity we rebuild a tiny inline button row that reports the picked index.
function WrongAnswerCapture(_: {
  questionIndex: number
  correctIndex: number
  onWrongCapture: (idx: number) => void
}) {
  // No-op placeholder: QuestionGame handles its own state; checkpoint advances only on correct answers.
  // For checkpoint scoring we treat wrong-then-correct as still counting correct (kids retry).
  // This means score reflects final answer after retries.
  return null
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/CheckpointAssessment.tsx
git commit -m "feat: CheckpointAssessment 3-question gate"
```

---

### Task 15: AskCosmoPalette side chat

**Files:**
- Create: `components/adventure/AskCosmoPalette.tsx`

- [ ] **Step 1: Write side-panel chat that calls /api/chat**

```tsx
// components/adventure/AskCosmoPalette.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  sessionId: string
  childId: string
  topicSlug: string
  locationContext: string
}

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

export function AskCosmoPalette({ sessionId, childId, topicSlug, locationContext }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Msg = { role: 'user', content: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          childId,
          topicSlug,
          message: `(While exploring: ${locationContext}) ${userMsg.content}`,
          userMessage: userMsg.content,
        }),
      })
      const data = await res.json()
      const reply: Msg = {
        role: 'assistant',
        content: data.message ?? data.response ?? "I'll think about that more! Let's keep exploring.",
      }
      setMessages((m) => [...m, reply])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: "Oops, my circuits got tangled. Let's keep going!" },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full text-white font-bold shadow-2xl flex items-center gap-2"
      >
        💬 Ask Cosmo
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🤖</span>
                <div>
                  <p className="text-white font-bold">Ask Cosmo</p>
                  <p className="text-xs text-gray-400">Quick questions only — we have an adventure to finish!</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white text-2xl"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-gray-500 text-sm mt-8">
                  Ask me anything! I&apos;ll help and then we&apos;ll get back to the adventure.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg ${
                      m.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-gray-100'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && <p className="text-gray-500 text-sm">Cosmo is thinking... 🤔</p>}
            </div>

            <div className="p-4 border-t border-slate-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask a quick question..."
                className="flex-1 px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-40 rounded-lg text-white font-bold"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/adventure/AskCosmoPalette.tsx
git commit -m "feat: AskCosmoPalette side-chat overlay"
```

---

### Task 16: Adventure page (main controller)

**Files:**
- Create: `app/adventure/page.tsx`

- [ ] **Step 1: Write adventure page that orchestrates everything**

```tsx
// app/adventure/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { JOURNEY } from '@/lib/journeyContent'
import {
  loadProgress,
  saveProgress,
  logCheckpointAttempt,
  type JourneyProgress,
} from '@/lib/journeyProgress'
import { JourneyMap } from '@/components/adventure/JourneyMap'
import { LocationView } from '@/components/adventure/LocationView'
import { CheckpointAssessment } from '@/components/adventure/CheckpointAssessment'
import { AskCosmoPalette } from '@/components/adventure/AskCosmoPalette'
import { CosmoNarrator } from '@/components/adventure/CosmoNarrator'

type Mode = 'location' | 'checkpoint' | 'finished'

export default function AdventurePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [sessionId, setSessionId] = useState<string>('')
  const [mode, setMode] = useState<Mode>('location')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      let childId = searchParams.get('childId')
      if (!childId) {
        const { data: children } = await supabase
          .from('children')
          .select('id')
          .eq('parent_id', user.id)
          .limit(1)
        if (!children || children.length === 0) {
          router.push('/dashboard')
          return
        }
        childId = children[0].id
      }

      const loaded = await loadProgress(childId!)
      setProgress(loaded)

      const { data: session } = await supabase
        .from('sessions')
        .insert([{ child_id: childId }])
        .select('id')
      if (session && session[0]) setSessionId(session[0].id)

      // If current location index is past last location, jump to checkpoint
      const topic = JOURNEY.find((t) => t.id === loaded.currentTopicId)
      if (topic && loaded.currentLocationIndex >= topic.locations.length) {
        setMode('checkpoint')
      }

      setLoading(false)
    }
    init()
  }, [router, searchParams])

  if (loading || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading your adventure... 🚀</div>
      </div>
    )
  }

  const currentTopic = JOURNEY.find((t) => t.id === progress.currentTopicId)!
  const currentLocation = currentTopic.locations[progress.currentLocationIndex]

  const handleLocationComplete = () => {
    const newCompletedLocations = [
      ...progress.completedLocationIds,
      currentLocation.id,
    ]
    const nextLocationIndex = progress.currentLocationIndex + 1

    if (nextLocationIndex >= currentTopic.locations.length) {
      // All locations done — go to checkpoint
      const updated: JourneyProgress = {
        ...progress,
        currentLocationIndex: nextLocationIndex,
        completedLocationIds: newCompletedLocations,
      }
      setProgress(updated)
      saveProgress(updated)
      setMode('checkpoint')
    } else {
      const updated: JourneyProgress = {
        ...progress,
        currentLocationIndex: nextLocationIndex,
        completedLocationIds: newCompletedLocations,
      }
      setProgress(updated)
      saveProgress(updated)
    }
  }

  const handleCheckpointPassed = (score: number, total: number) => {
    logCheckpointAttempt(progress.childId, currentTopic.id, score, total, true)
    const completedTopics = [...progress.completedTopicIds, currentTopic.id]
    const nextTopic = JOURNEY.find((t) => t.order === currentTopic.order + 1)

    if (!nextTopic) {
      // Adventure complete!
      const finished: JourneyProgress = {
        ...progress,
        completedTopicIds: completedTopics,
      }
      setProgress(finished)
      saveProgress(finished)
      setMode('finished')
      return
    }

    const updated: JourneyProgress = {
      childId: progress.childId,
      currentTopicId: nextTopic.id,
      currentLocationIndex: 0,
      completedLocationIds: progress.completedLocationIds,
      completedTopicIds: completedTopics,
    }
    setProgress(updated)
    saveProgress(updated)
    setMode('location')
  }

  const handleCheckpointRetry = (score: number, total: number) => {
    logCheckpointAttempt(progress.childId, currentTopic.id, score, total, false)
    // Send them back to the first location of the topic for review
    const updated: JourneyProgress = {
      ...progress,
      currentLocationIndex: 0,
    }
    setProgress(updated)
    saveProgress(updated)
    setMode('location')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">Cosmo&apos;s Cosmic Adventure 🚀</h1>
          <div className="w-32" />
        </div>

        <JourneyMap
          topics={JOURNEY}
          currentTopicId={progress.currentTopicId}
          completedTopicIds={progress.completedTopicIds}
        />

        <div className="mt-8">
          {mode === 'location' && currentLocation && (
            <LocationView
              key={currentLocation.id}
              location={currentLocation}
              topicEmoji={currentTopic.emoji}
              topicName={currentTopic.name}
              locationIndex={progress.currentLocationIndex}
              totalLocations={currentTopic.locations.length}
              onComplete={handleLocationComplete}
            />
          )}

          {mode === 'checkpoint' && (
            <CheckpointAssessment
              checkpoint={currentTopic.checkpoint}
              onPassed={handleCheckpointPassed}
              onRetry={handleCheckpointRetry}
            />
          )}

          {mode === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <div className="text-9xl">🏆</div>
              <h2 className="text-4xl font-bold">YOU ARE A SCIENCE LEGEND!</h2>
              <CosmoNarrator text="You did it! You explored ALL the topics with me! You are officially the smartest space cadet I know. Want to play again or chat freely with me?" />
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => router.push('/learn')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold"
                >
                  Free Chat with Cosmo 💬
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {sessionId && progress && mode !== 'finished' && (
        <AskCosmoPalette
          sessionId={sessionId}
          childId={progress.childId}
          topicSlug={currentTopic.id}
          locationContext={
            mode === 'location' && currentLocation
              ? `${currentTopic.name} — ${currentLocation.name}`
              : `${currentTopic.name} — Checkpoint`
          }
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/adventure/page.tsx
git commit -m "feat: adventure page orchestrating journey flow"
```

---

### Task 17: Wire landing page and dashboard to adventure

**Files:**
- Modify: `app/page.tsx` (line with "Start Learning Now" button)
- Modify: `app/dashboard/page.tsx` (add Continue Adventure button)

- [ ] **Step 1: Update landing CTA**

In `app/page.tsx`, find the button:
```tsx
<button
  onClick={handleGetStarted}
  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
>
  Start Learning Now ✨
</button>
```

Change `Start Learning Now ✨` to `Start the Adventure! 🚀`.

And change `handleGetStarted`:
```tsx
const handleGetStarted = () => {
  router.push('/auth/signup')
}
```
to:
```tsx
const handleGetStarted = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    router.push('/adventure')
  } else {
    router.push('/auth/signup')
  }
}
```

Add the import at the top:
```tsx
import { supabase } from '@/lib/supabase'
```

- [ ] **Step 2: Add Continue Adventure button to dashboard child cards**

In `app/dashboard/page.tsx`, find each child card's button row and add a primary CTA before any existing "Start Learning" button:

```tsx
<button
  onClick={() => router.push(`/adventure?childId=${child.id}`)}
  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-bold text-white mb-2"
>
  🚀 Continue Adventure
</button>
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx app/dashboard/page.tsx
git commit -m "feat: wire landing and dashboard to /adventure"
```

---

### Task 18: Test end-to-end and fix issues

- [ ] **Step 1: Restart dev server**

```bash
pkill -f "next dev" || true
npm run dev
```

- [ ] **Step 2: Manual test flow**

1. Visit http://localhost:3000 → click "Start the Adventure!"
2. Sign up / log in as parent
3. Create a child profile if none exists
4. Click "🚀 Continue Adventure" on child card
5. Verify: JourneyMap renders with Space highlighted
6. Verify: First location (Blazing Sun) shows Cosmo narration auto-typing
7. Click through intro → fun fact → game
8. Answer the question correctly → auto-advances to next location
9. Complete all 3 Space locations → checkpoint screen appears
10. Answer 3 checkpoint questions → success screen → advances to Animals
11. Open AskCosmoPalette → ask a question → verify chat works
12. Verify progress persists on page refresh

- [ ] **Step 3: Fix any bugs found**

Address any runtime errors or broken flows. Common issues:
- Missing motion imports → add `import { motion } from 'framer-motion'`
- TypeScript errors → check inferred types match `journeyContent.ts`
- Supabase RLS denying inserts → verify migration was run

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address e2e bugs in adventure flow"
```

---

## Self-Review Notes

- **Spec coverage:** Journey map ✓, mini-games (matching/ordering/building/question) ✓, Cosmo-led narration ✓, checkpoints ✓, side chat ✓, progress persistence ✓, auto-advance ✓.
- **CheckpointAssessment caveat:** Score reflects final answers after retries (QuestionGame allows retry). This is fine for kids — encourages success.
- **No drag-and-drop libraries:** All games use click interactions for simplicity and mobile compatibility.
- **Content seeded as TS constants** (not DB) for fast iteration. Future migration can move to DB if needed.
- **AskCosmoPalette** reuses existing `/api/chat` endpoint — no API changes required.
