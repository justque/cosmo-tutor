# Guided Learning System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Cosmo from a reactive chatbot into a structured lesson-based learning system with checkpoints, progress tracking, and hybrid state management.

**Architecture:** The system uses a two-mode approach: lesson mode (guided steps with checkpoints) and chat mode (free-form questions). Lesson progress is tracked at granular step level in a new `lesson_progress` table. Checkpoints are generated dynamically by Claude API and evaluated against stored correct answers. State is cached in React for instant feedback and synced to the database asynchronously in the background.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Claude API, Supabase (PostgreSQL), React hooks, Framer Motion, TailwindCSS

---

## File Structure

**New files:**
- `lib/lessonEngine.ts` — Core checkpoint generation, evaluation, and lesson step retrieval
- `components/LessonStep.tsx` — UI component for displaying lesson explanations, visuals, and checkpoint buttons
- `supabase/migrations/002_add_lesson_progress.sql` — Database migration for lesson_progress table

**Modified files:**
- `supabase/migrations/001_initial_schema.sql` — Add RLS policies for lesson_progress
- `app/api/chat/route.ts` — Add checkpoint evaluation logic separate from free-form chat
- `app/learn/page.tsx` — Initialize lesson state, load progress from database, manage lesson/chat mode switching
- `components/ChatPanel.tsx` — Add lesson mode detection, disable text input during lessons, show checkpoint buttons
- `components/Sidebar.tsx` — Display progress indicators (e.g., "2/4" or checkmark)
- `lib/lessons.ts` — Extend LESSONS object to include checkpoint definitions

---

## Task Breakdown

### Task 1: Create Database Migration for lesson_progress Table

**Files:**
- Create: `supabase/migrations/002_add_lesson_progress.sql`

- [ ] **Step 1: Create migration file with lesson_progress table schema**

```sql
-- Create lesson_progress table to track fine-grained step progression
create table lesson_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  current_step int not null default 0,
  steps_completed int not null default 0,
  checkpoint_attempts int not null default 0,
  last_attempted_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(child_id, topic_id)
);

-- Create index for quick lookups
create index idx_lesson_progress_child_topic on lesson_progress(child_id, topic_id);

-- Enable RLS
alter table lesson_progress enable row level security;

-- RLS Policy: Parents can only view their own children's progress
create policy "Parents can view own children progress"
  on lesson_progress
  for select
  using (
    child_id in (
      select id from children where parent_id = auth.uid()
    )
  );

-- RLS Policy: Parents can update their own children's progress
create policy "Parents can update own children progress"
  on lesson_progress
  for update
  using (
    child_id in (
      select id from children where parent_id = auth.uid()
    )
  );

-- RLS Policy: Service role can insert for lesson tracking
create policy "Service role can insert lesson progress"
  on lesson_progress
  for insert
  with check (true);
```

- [ ] **Step 2: Run migration manually in Supabase SQL Editor**

In Supabase dashboard:
1. Go to SQL Editor
2. Click "New query"
3. Paste the entire migration file content
4. Click "Run"
5. Verify table appears in Tables list with columns: id, child_id, topic_id, current_step, steps_completed, checkpoint_attempts, last_attempted_at, completed_at, created_at, updated_at

---

### Task 2: Extend lessons.ts with Checkpoint Definitions

**Files:**
- Modify: `lib/lessons.ts`

- [ ] **Step 1: Add checkpoint definitions to each lesson step**

Replace the LESSONS object in `lib/lessons.ts`:

```typescript
export const LESSONS: Record<string, LessonStep[]> = {
  space: [
    {
      id: 'space-0',
      prompt: "Welcome to Space! 🚀 I'm Cosmo, your robot astronaut friend. Did you know that Earth is like a giant ball floating in space? We live on this special blue planet. Let me tell you something cool: if you jumped really high on Earth, gravity would pull you back down. But in space, there's no gravity, so things float! Have you ever seen a balloon float away at a birthday party? In space, YOU would float like that balloon! Today, we're going to explore amazing space facts. Are you ready?",
      expectedVisual: 'earth-in-space',
      checkpoint: {
        question: 'What keeps us from floating away from Earth?',
        options: [
          'Magic spells',
          'Gravity pulls us down',
          'Invisible ropes',
          'Cosmo\'s robot powers'
        ],
        correctIndex: 1,
        hint: 'Think about what happens when you jump and come back down.'
      }
    },
    {
      id: 'space-1',
      prompt: "Great job! 🌟 Now let me tell you about the Sun. The Sun is actually a giant ball of super-hot burning gas. It's SO big that about 1 million Earths could fit inside it! The Sun gives us light and heat. Without the Sun, Earth would be cold and dark, and nothing could live here. Think of the Sun like a giant campfire in space that keeps everything warm. Even though it's really far away (93 million miles!), we still feel its heat on our skin when we go outside on a sunny day. Pretty amazing, right?",
      expectedVisual: 'sun-scale-comparison',
      checkpoint: {
        question: 'Why is the Sun important to Earth?',
        options: [
          'It makes the sky blue',
          'It gives us light and heat',
          'It makes our food taste better',
          'It helps robots like me work'
        ],
        correctIndex: 1,
        hint: 'Think about what would happen if the Sun disappeared.'
      }
    },
    {
      id: 'space-2',
      prompt: "Excellent! 🎉 Now let's talk about planets. There are 8 planets in our solar system, and they all orbit (that means go around) the Sun. Each planet is different - some are big and gassy, others are small and rocky. Earth is our planet - it's the only one we know that has life! Mercury is closest to the Sun, and it's super hot. Neptune is the farthest away, and it's very cold and windy. Each planet takes a different amount of time to go around the Sun. Earth takes 365 days - that's one year!",
      expectedVisual: 'solar-system-planets',
      checkpoint: {
        question: 'What do all the planets do?',
        options: [
          'They stay still in one place',
          'They orbit (go around) the Sun',
          'They crash into each other',
          'They hide from Cosmo'
        ],
        correctIndex: 1,
        hint: 'Think about what Earth does while you\'re here living on it.'
      }
    },
    {
      id: 'space-3',
      prompt: "Perfect! 🌙 One more cool space fact: there are BILLIONS of stars in space. Stars are like the Sun - they're giant balls of burning gas. When you look up at the night sky, those tiny dots of light are actually stars very far away. Some stars are even bigger than the Sun! Stars can be different colors - blue, yellow, red, and white. The color tells us how hot they are. Our Sun is yellow, which means it's medium-hot compared to other stars. And here's something magical: every atom in your body came from a star that exploded billions of years ago. You're literally made of stardust! 🌟",
      expectedVisual: 'stars-in-space',
      checkpoint: {
        question: 'What are stars made of?',
        options: [
          'Ice and snow',
          'Giant balls of burning gas',
          'Stardust and wishes',
          'Pieces of the Moon'
        ],
        correctIndex: 1,
        hint: 'Stars glow in the night sky. What makes them glow?'
      }
    }
  ],
  animals: [
    {
      id: 'animals-0',
      prompt: "Welcome to the world of animals! 🦁 I'm so excited to explore with you! Did you know that there are millions of different kinds of animals on Earth? Some are big like elephants, and some are tiny like ants. Some live in the ocean, some live in the forest, and some live in deserts. All animals need to eat food, drink water, and breathe air (or some breathe through water!). Animals also have babies and take care of their families, just like humans do. Let me ask you: have you ever seen an animal? Tell me - do you like animals?",
      expectedVisual: 'diverse-animals',
      checkpoint: {
        question: 'What do all animals need to survive?',
        options: [
          'Toys and games',
          'Food, water, and air',
          'Shoes and clothes',
          'TV and computers'
        ],
        correctIndex: 1,
        hint: 'Think about what you need to survive and be healthy.'
      }
    },
    {
      id: 'animals-1',
      prompt: "Awesome! 🌿 Now let's learn about different types of animals. Some animals are mammals - that means they have fur or hair, and they feed milk to their babies. You're a mammal! Cows, dogs, and whales are mammals too. Then there are birds - they have feathers and wings and lay eggs. Fish live in water and have scales and fins. Reptiles like snakes and crocodiles are cold-blooded and have dry skin. Amphibians like frogs can live both in water and on land! Each type of animal is special and amazing in different ways.",
      expectedVisual: 'animal-classification',
      checkpoint: {
        question: 'What makes mammals special?',
        options: [
          'They can fly in the air',
          'They have fur and feed milk to babies',
          'They live only in water',
          'They change colors at night'
        ],
        correctIndex: 1,
        hint: 'Mammals include you and your pets. What do you know about them?'
      }
    },
    {
      id: 'animals-2',
      prompt: "Great learning! 🦒 Let me tell you about herbivores, carnivores, and omnivores. Herbivores eat only plants - like cows and giraffes. Carnivores eat only meat - like lions and sharks. Omnivores eat both plants and meat - like bears and humans! Each animal's teeth and stomach are designed for what they eat. If you look at a cow's teeth, they're flat for grinding plants. But a lion's teeth are sharp for tearing meat. That's how their bodies adapted to eat the right food! Every animal has the perfect body for how it lives.",
      expectedVisual: 'food-chain',
      checkpoint: {
        question: 'What do herbivores eat?',
        options: [
          'Only meat from other animals',
          'Both plants and meat',
          'Only plants',
          'Only fish from the ocean'
        ],
        correctIndex: 2,
        hint: 'Think about animals like cows and zebras.'
      }
    },
    {
      id: 'animals-3',
      prompt: "Fantastic! 🌍 Here's one more amazing thing about animals: they have special abilities to survive. Some animals can run really fast like cheetahs - they're the fastest land animals! Some animals can change color to hide - like chameleons. Some animals work together in groups called herds or packs. Ants work together in colonies with thousands of other ants! Many animals hibernate in winter - that means they sleep for months when it's cold. And many animals migrate - they travel long distances to find food or have babies. Nature made each animal perfectly suited for where it lives!",
      expectedVisual: 'animal-adaptations',
      checkpoint: {
        question: 'What do we call it when animals travel long distances to find food?',
        options: [
          'Hibernation',
          'Migration',
          'Adaptation',
          'Evolution'
        ],
        correctIndex: 1,
        hint: 'Some birds fly south when it gets cold. What is that called?'
      }
    }
  ],
  weather: [
    {
      id: 'weather-0',
      prompt: "Welcome to Weather science! ☀️ I'm Cosmo, and I love talking about weather! Every single day, the weather changes. Sometimes it's sunny, sometimes it rains, sometimes it's windy, and sometimes it snows. Weather is what's happening in the air around us RIGHT NOW. Climate is different - that's the weather pattern over many years. The Sun is the engine that makes all weather happen! The Sun heats up the air, water, and land. This heat makes wind blow and water evaporate. Let me ask you: what's the weather like where you are right now?",
      expectedVisual: 'weather-types',
      checkpoint: {
        question: 'What causes weather to happen?',
        options: [
          'Cosmo the robot',
          'The heat from the Sun',
          'Wishes and magic',
          'People talking'
        ],
        correctIndex: 1,
        hint: 'What provides energy to everything on Earth?'
      }
    },
    {
      id: 'weather-1',
      prompt: "Perfect! 🌧️ Now let's talk about rain. Rain happens because of the water cycle! Here's how it works: The Sun heats up water in oceans, lakes, and rivers, turning it into invisible water vapor - that's called evaporation. This water vapor rises up into the sky. As it goes higher, it gets colder. When it cools down, it turns back into tiny water droplets - that's called condensation. These droplets stick together to make clouds. When the clouds get so heavy with water that they can't hold it anymore, water falls down as rain - that's called precipitation. Then the rain flows back into oceans and lakes, and the cycle starts again! This amazing cycle has been happening for billions of years.",
      expectedVisual: 'water-cycle',
      checkpoint: {
        question: 'What happens when water in the ocean gets hot from the Sun?',
        options: [
          'It turns into ice',
          'It evaporates and rises as water vapor',
          'It falls as rain immediately',
          'It stays in the ocean forever'
        ],
        correctIndex: 1,
        hint: 'What\'s the first step of the water cycle?'
      }
    },
    {
      id: 'weather-2',
      prompt: "Excellent! ⛈️ Now let's learn about wind. Wind is moving air! It's created when the Sun heats up some areas of Earth more than others. Hot air rises, and cold air sinks - this movement of air is wind. Different types of wind have different names. A breeze is gentle wind that feels nice. A gale is strong, powerful wind. A hurricane or tornado is VERY strong and dangerous wind. Wind can carry clouds, spread seeds, and help make electricity with wind turbines! Even though we can't see wind, we can see what it does - leaves blowing, kites flying, and hair moving. Wind is an important part of weather and climate!",
      expectedVisual: 'wind-formation',
      checkpoint: {
        question: 'What causes wind to blow?',
        options: [
          'People waving their hands',
          'The Sun heating different areas of Earth',
          'Clouds bumping into each other',
          'Cosmo pushing the air'
        ],
        correctIndex: 1,
        hint: 'What causes hot air to rise?'
      }
    },
    {
      id: 'weather-3',
      prompt: "Amazing! 🌈 Let's finish with something special: rainbows! A rainbow appears when sunlight and rain happen at the same time. Here's how: raindrops in the air act like tiny mirrors and prisms. They bend the white sunlight and split it into its different colors. The colors are always in the same order: red, orange, yellow, green, blue, indigo, and violet. You have to be standing with the Sun behind you to see a rainbow in front of you. Sometimes, if the conditions are perfect, you can see a double rainbow! Each color of the rainbow is actually light waves of different lengths. Isn't that magical? Weather gives us so many beautiful things to discover!",
      expectedVisual: 'rainbow-formation',
      checkpoint: {
        question: 'When can you see a rainbow?',
        options: [
          'Only at night',
          'When it\'s sunny but no rain',
          'When sunlight and rain happen at the same time',
          'Every day at the same time'
        ],
        correctIndex: 2,
        hint: 'What two weather conditions do you need for a rainbow?'
      }
    }
  ],
  'human-body': [
    {
      id: 'human-body-0',
      prompt: "Welcome to human body science! 🧠 Your body is an amazing machine! Did you know that your body has about 206 bones that hold you up and help you move? You also have muscles that pull on these bones to make them move. And inside your body, you have organs - like your heart, lungs, stomach, and brain - that do special jobs to keep you alive. Your brain controls everything - it helps you think, remember, feel emotions, and move your body. Your heart pumps blood all around your body to give cells oxygen and nutrients. Your lungs help you breathe in oxygen and breathe out carbon dioxide. Even when you're sleeping, your body is working hard! Let me ask you: can you feel your heartbeat?",
      expectedVisual: 'human-body-systems',
      checkpoint: {
        question: 'What does your brain do?',
        options: [
          'Pumps blood',
          'Helps you breathe',
          'Controls thinking, memory, and movement',
          'Digests your food'
        ],
        correctIndex: 2,
        hint: 'What organ is inside your head?'
      }
    },
    {
      id: 'human-body-1',
      prompt: "Great! 💪 Let's learn about bones and muscles. Your skeleton is the framework of your body - 206 bones connected together! Bones are very strong but also light. They protect your important organs - like your ribs protecting your heart and lungs, and your skull protecting your brain. Bones also make new blood cells inside them! Muscles are attached to bones with tendons. When your brain tells a muscle to contract (get shorter), it pulls on the bone and makes you move. You have over 600 muscles in your body! Some muscles are voluntary - you control them, like when you move your arms. Other muscles are involuntary - they work without you thinking, like your heart beating. Isn't your body incredible?",
      expectedVisual: 'skeleton-and-muscles',
      checkpoint: {
        question: 'What do muscles do?',
        options: [
          'Make your body tall',
          'Pull on bones to make you move',
          'Protect your organs',
          'Help you digest food'
        ],
        correctIndex: 1,
        hint: 'When you bend your arm, what\'s making it move?'
      }
    },
    {
      id: 'human-body-2',
      prompt: "Fantastic! 🫀 Now let's learn about your heart and circulation. Your heart is a muscle about the size of your fist that pumps blood all day and night! Blood carries oxygen and nutrients to every part of your body. Your heart pumps oxygen-rich blood through arteries to your body. Then blood returns to your heart through veins - this blood is now without oxygen, so your heart pumps it to your lungs. Your lungs put fresh oxygen in the blood, and the cycle repeats! This is called circulation. Your heart beats about 60-100 times per minute - you can feel this as your pulse on your wrist or neck. When you exercise, your heart beats faster to pump more oxygen-rich blood. That's why you feel your heartbeat after running!",
      expectedVisual: 'circulatory-system',
      checkpoint: {
        question: 'What does your blood carry?',
        options: [
          'Water only',
          'Oxygen and nutrients',
          'Waste only',
          'Air and sunshine'
        ],
        correctIndex: 1,
        hint: 'Think about what your cells need to survive and work.'
      }
    },
    {
      id: 'human-body-3',
      prompt: "Perfect! 🫁 Let's finish by learning about digestion. When you eat food, your body breaks it down into tiny pieces - that's digestion! It starts in your mouth when you chew. Your saliva (spit) helps break down food. Then food goes down your esophagus to your stomach, where strong acids and muscles break it down more. Next, it goes to your small intestine, where the good nutrients get absorbed into your blood. Finally, any waste goes to your large intestine and then out of your body. This whole process takes about 24-72 hours! Your body can extract nutrients from lettuce, apples, chicken, and everything you eat. Digestion is like having a little factory inside you that turns food into energy and building blocks for your growing body. Eating healthy food gives your body the best nutrients!",
      expectedVisual: 'digestive-system',
      checkpoint: {
        question: 'Where does digestion start?',
        options: [
          'In your stomach',
          'In your mouth when you chew',
          'In your small intestine',
          'In your large intestine'
        ],
        correctIndex: 1,
        hint: 'Where do you chew your food?'
      }
    }
  ],
  plants: [
    {
      id: 'plants-0',
      prompt: "Welcome to plant science! 🌱 Plants are living things just like animals! Did you know that plants are the source of food and oxygen for all life on Earth? Without plants, we couldn't breathe or eat. There are millions of kinds of plants - from tiny moss to giant trees that are hundreds of years old. Some plants have flowers, some have leaves, some have roots underground. All plants need sunlight, water, and soil to grow. Plants make their own food using sunlight - that's called photosynthesis. This is very different from animals who eat food. Plants also give us oxygen as a waste product - lucky for us! Let me ask you: where do plants get their food?",
      expectedVisual: 'plant-diversity',
      checkpoint: {
        question: 'What do plants need to grow?',
        options: [
          'Cookies and candy',
          'Only water',
          'Sunlight, water, and soil',
          'Just air'
        ],
        correctIndex: 2,
        hint: 'Think about a plant growing in a garden or on a windowsill.'
      }
    },
    {
      id: 'plants-1',
      prompt: "Great! ☀️ Let's learn about photosynthesis - the amazing process plants use to make their own food! Here's how it works: Plants take in sunlight through their green leaves. They also take in water through their roots and carbon dioxide from the air through tiny holes called stomata. Using the Sun's energy, plants combine these ingredients and create glucose (a type of sugar) - that's their food! They also create oxygen as a waste product, which we breathe. So plants are like little solar-powered factories! The green color in leaves comes from chlorophyll, which captures sunlight. Different plants are adapted for different amounts of sunlight. Some plants like ferns prefer shade, while sunflowers love bright sunshine. Plants that get the right amount of light grow big and strong!",
      expectedVisual: 'photosynthesis',
      checkpoint: {
        question: 'What gas do plants release during photosynthesis?',
        options: [
          'Carbon dioxide',
          'Nitrogen',
          'Oxygen',
          'Hydrogen'
        ],
        correctIndex: 2,
        hint: 'This is the gas we breathe in. Plants give us this as waste!'
      }
    },
    {
      id: 'plants-2',
      prompt: "Excellent! 🌾 Now let's explore plant parts and their jobs. Roots grow underground and do two important jobs: they absorb water and minerals from the soil, and they anchor the plant so it doesn't blow away. The stem holds up the plant and carries water from roots to leaves. Leaves are where photosynthesis happens - they're the food-making factories! Flowers are where seeds grow. Flowers are beautiful and often smell good to attract bees and butterflies. These insects help pollinate flowers, which helps plants make seeds. Seeds contain a baby plant inside! When a seed gets water and warmth, it germinates and grows into a new plant. Some plants grow from seeds, others grow from bulbs or fragmentation. Every plant part has a special purpose!",
      expectedVisual: 'plant-anatomy',
      checkpoint: {
        question: 'What do plant roots do?',
        options: [
          'Make flowers',
          'Absorb water and anchor the plant',
          'Make seeds',
          'Capture sunlight'
        ],
        correctIndex: 1,
        hint: 'What\'s underground in a plant?'
      }
    },
    {
      id: 'plants-3',
      prompt: "Perfect! 🌻 Let's finish with plant life cycles and why plants are so important. Plants go through amazing life cycles: they sprout from seeds, grow leaves and roots, flower, make new seeds, and sometimes die. Some plants are annuals - they live for one year. Some are perennials - they come back year after year. Trees can live for hundreds of years! Plants are essential to all life on Earth. They produce oxygen, create food, prevent soil erosion, and provide homes for animals. Forests are lungs of the planet. Gardens provide fresh fruits and vegetables. Even the paper and clothes you use come from plants! We need to take care of plants by watering them, giving them sunlight, and protecting forests. When you plant a seed or take care of a plant, you're helping the whole planet! Thank you for learning about these amazing living things with me! 🌍",
      expectedVisual: 'plant-growth-cycle',
      checkpoint: {
        question: 'Why are plants important to all life on Earth?',
        options: [
          'They look pretty',
          'They produce oxygen and create food',
          'They make noise',
          'They help us build houses'
        ],
        correctIndex: 1,
        hint: 'Think about what we need to survive - breathing and eating.'
      }
    }
  ]
};
```

- [ ] **Step 2: Update TypeScript type definitions for LessonStep**

Add this type definition to `lib/lessons.ts` at the top of the file:

```typescript
export interface CheckpointDef {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  hint?: string;
}

export interface LessonStep {
  id: string;
  prompt: string;
  expectedVisual: string;
  checkpoint: CheckpointDef;
}
```

- [ ] **Step 3: Verify file has no syntax errors**

Run: `npx tsc --noEmit`
Expected: No errors in lib/lessons.ts

- [ ] **Step 4: Commit**

```bash
git add lib/lessons.ts
git commit -m "feat: add checkpoint definitions to all lesson steps"
```

---

### Task 3: Create lessonEngine.ts with Checkpoint Logic

**Files:**
- Create: `lib/lessonEngine.ts`

- [ ] **Step 1: Write lessonEngine.ts with core functions**

```typescript
import { LESSONS, LessonStep, CheckpointDef } from './lessons';

// Get a lesson step by topic and step index
export function getLessonStep(
  topicSlug: string,
  stepIndex: number
): LessonStep | null {
  const steps = LESSONS[topicSlug];
  if (!steps || stepIndex < 0 || stepIndex >= steps.length) {
    return null;
  }
  return steps[stepIndex];
}

// Get total steps for a topic
export function getTotalLessonSteps(topicSlug: string): number {
  return LESSONS[topicSlug]?.length ?? 0;
}

// Evaluate checkpoint answer
export function evaluateCheckpoint(
  topicSlug: string,
  stepIndex: number,
  selectedOptionIndex: number
): {
  correct: boolean;
  feedback: string;
  hint?: string;
} {
  const step = getLessonStep(topicSlug, stepIndex);
  if (!step) {
    return { correct: false, feedback: 'Lesson step not found.' };
  }

  const checkpoint = step.checkpoint;
  const isCorrect = selectedOptionIndex === checkpoint.correctIndex;

  if (isCorrect) {
    return {
      correct: true,
      feedback: `Wow! That's exactly right! 🎉 Let's move to the next step.`,
    };
  } else {
    return {
      correct: false,
      feedback: `Not quite! ${checkpoint.options[selectedOptionIndex]} isn't the right answer. Let's try again! 💪`,
      hint: checkpoint.hint || 'Think carefully about what we learned.',
    };
  }
}

// Get checkpoint for a step
export function getCheckpoint(
  topicSlug: string,
  stepIndex: number
): CheckpointDef | null {
  const step = getLessonStep(topicSlug, stepIndex);
  return step?.checkpoint ?? null;
}

// Check if lesson is complete (all steps visited)
export function isLessonComplete(
  topicSlug: string,
  stepsCompleted: number
): boolean {
  const totalSteps = getTotalLessonSteps(topicSlug);
  return stepsCompleted >= totalSteps;
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors in lib/lessonEngine.ts

- [ ] **Step 3: Commit**

```bash
git add lib/lessonEngine.ts
git commit -m "feat: create lessonEngine with checkpoint evaluation logic"
```

---

### Task 4: Create LessonStep Component

**Files:**
- Create: `components/LessonStep.tsx`

- [ ] **Step 1: Write LessonStep.tsx component**

```typescript
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LessonStep as LessonStepType } from '@/lib/lessons'

interface LessonStepProps {
  step: LessonStepType;
  stepNumber: number;
  totalSteps: number;
  onCheckpointSubmit: (selectedOptionIndex: number) => void;
  isSubmitting?: boolean;
}

export function LessonStep({
  step,
  stepNumber,
  totalSteps,
  onCheckpointSubmit,
  isSubmitting = false,
}: LessonStepProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Simple typing animation
  useEffect(() => {
    const timer = setTimeout(() => setIsTypingComplete(true), 1000);
    return () => clearTimeout(timer);
  }, [step.id])

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
    onCheckpointSubmit(index);
  };

  const options = step.checkpoint.options;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Progress indicator */}
      <div className="text-sm text-gray-400">
        Step {stepNumber + 1} of {totalSteps}
      </div>

      {/* Cosmo's explanation */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-4xl mb-3">🤖</div>
        <p className="text-lg leading-relaxed">
          {isTypingComplete ? step.prompt : step.prompt.slice(0, 50) + '...'}
        </p>
      </motion.div>

      {/* Visual placeholder (will be enhanced with Lottie/images later) */}
      <motion.div
        className="bg-slate-800 rounded-lg p-8 text-center text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="text-6xl mb-2">✨</div>
        <p className="text-sm">Visual: {step.expectedVisual}</p>
      </motion.div>

      {/* Checkpoint question and options */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-white">
          {step.checkpoint.question}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isSubmitting || selectedOption !== null}
              whileHover={!isSubmitting && selectedOption === null ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting && selectedOption === null ? { scale: 0.98 } : {}}
              className={`p-4 rounded-lg text-left font-semibold transition-all ${
                selectedOption === null && !isSubmitting
                  ? 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'
                  : selectedOption === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-800 text-gray-400 opacity-50'
              }`}
            >
              <span className="text-lg mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </motion.button>
          ))}
        </div>

        {isSubmitting && (
          <p className="text-gray-400 text-sm">
            {selectedOption !== null ? 'Checking your answer...' : 'Select an answer...'}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify component has no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: No errors in components/LessonStep.tsx

- [ ] **Step 3: Commit**

```bash
git add components/LessonStep.tsx
git commit -m "feat: create LessonStep component with checkpoint UI"
```

---

### Task 5: Update app/api/chat/route.ts to Handle Checkpoints

**Files:**
- Modify: `app/api/chat/route.ts`

- [ ] **Step 1: Read current file to understand structure**

Read lines 1-50 to see current implementation.

- [ ] **Step 2: Add checkpoint evaluation logic to route handler**

At the top of the file, add import:

```typescript
import { evaluateCheckpoint } from '@/lib/lessonEngine';
```

Replace the main handler logic with:

```typescript
export async function POST(req: Request) {
  try {
    const {
      sessionId,
      childId,
      topicSlug,
      message,
      isCheckpointSubmission,
      checkpointStepIndex,
      selectedOptionIndex,
      conversationHistory,
    } = await req.json();

    // Validate required fields
    if (!sessionId || !childId) {
      return NextResponse.json(
        { error: 'Missing session or child ID' },
        { status: 400 }
      );
    }

    // CHECKPOINT EVALUATION PATH
    if (isCheckpointSubmission && checkpointStepIndex !== undefined && selectedOptionIndex !== undefined) {
      const result = evaluateCheckpoint(topicSlug, checkpointStepIndex, selectedOptionIndex);
      
      return NextResponse.json({
        type: 'checkpoint',
        correct: result.correct,
        feedback: result.feedback,
        hint: result.hint,
      });
    }

    // FREE-FORM CHAT PATH (existing logic)
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required for chat' },
        { status: 400 }
      );
    }

    // Check rate limiting
    const { count } = await supabase
      .from('api_usage')
      .select('*', { count: 'exact' })
      .eq('child_id', childId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if ((count ?? 0) >= 50) {
      return NextResponse.json({
        type: 'chat',
        message: "Cosmo needs a nap! 😴 You've asked lots of questions today. Try again tomorrow!",
      });
    }

    // Build conversation context
    const history = (conversationHistory || [])
      .slice(-10)
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: `You are Cosmo, a funny and enthusiastic robot astronaut who loves teaching science to young children aged 5–8.
Rules:
- Use very simple words. Short sentences. Maximum 3 sentences per paragraph.
- Be warm, funny, and encouraging. Use emojis generously.
- Use kid-friendly analogies (e.g. "The Sun is like a giant campfire in space!").
- Never use scary or violent content. Always celebrate curiosity.`,
      messages: [...history, { role: 'user', content: message }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Log API usage
    await supabase.from('api_usage').insert({
      child_id: childId,
      tokens_used: response.usage.output_tokens,
    });

    return NextResponse.json({
      type: 'chat',
      message: content.text,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Verify file has no syntax errors**

Run: `npx tsc --noEmit`
Expected: No errors in app/api/chat/route.ts

- [ ] **Step 4: Test checkpoint endpoint locally**

In a terminal (separate from dev server):

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session",
    "childId": "test-child",
    "topicSlug": "space",
    "isCheckpointSubmission": true,
    "checkpointStepIndex": 0,
    "selectedOptionIndex": 1
  }'
```

Expected response:
```json
{
  "type": "checkpoint",
  "correct": true,
  "feedback": "Wow! That's exactly right! 🎉 Let's move to the next step."
}
```

- [ ] **Step 5: Commit**

```bash
git add app/api/chat/route.ts
git commit -m "feat: add checkpoint evaluation logic to chat API"
```

---

### Task 6: Update ChatPanel.tsx for Lesson Mode

**Files:**
- Modify: `components/ChatPanel.tsx`

- [ ] **Step 1: Read current file to understand structure**

Read the existing ChatPanel.tsx to see current implementation.

- [ ] **Step 2: Add lesson mode detection and conditional rendering**

At the top, add these imports:

```typescript
import { LessonStep as LessonStepComponent } from './LessonStep';
import { LessonStep as LessonStepType } from '@/lib/lessons';
```

Add these props to the component interface:

```typescript
interface ChatPanelProps {
  // ... existing props
  isLessonMode?: boolean;
  currentLessonStep?: LessonStepType | null;
  currentStepIndex?: number;
  totalLessonSteps?: number;
  onCheckpointSubmit?: (selectedOptionIndex: number) => Promise<void>;
}
```

Replace the main return statement with:

```typescript
return (
  <div className="flex flex-col h-[500px] bg-slate-800 rounded-lg border border-slate-700">
    {/* Messages area */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {isLessonMode && currentLessonStep && currentStepIndex !== undefined ? (
        // LESSON MODE: Show LessonStep component
        <LessonStepComponent
          step={currentLessonStep}
          stepNumber={currentStepIndex}
          totalSteps={totalLessonSteps ?? 4}
          onCheckpointSubmit={onCheckpointSubmit || (() => {})}
          isSubmitting={loading}
        />
      ) : (
        // CHAT MODE: Show regular messages
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-100'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))
      )}
    </div>

    {/* Input area - disabled in lesson mode */}
    {!isLessonMode && (
      <div className="border-t border-slate-700 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Cosmo a question..."
          className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold text-white"
        >
          Send
        </button>
      </div>
    )}
  </div>
);
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors in components/ChatPanel.tsx

- [ ] **Step 4: Commit**

```bash
git add components/ChatPanel.tsx
git commit -m "feat: add lesson mode detection to ChatPanel"
```

---

### Task 7: Update app/learn/page.tsx to Load and Manage Lesson Progress

**Files:**
- Modify: `app/learn/page.tsx`

- [ ] **Step 1: Read current file to understand state management**

Read the existing page.tsx.

- [ ] **Step 2: Replace page component with lesson progress loading and state management**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ChatPanel } from '@/components/ChatPanel'
import { Sidebar } from '@/components/Sidebar'
import { getLessonStep, getTotalLessonSteps, evaluateCheckpoint } from '@/lib/lessonEngine'
import { LessonStep as LessonStepType } from '@/lib/lessons'

export default function LearnPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const childId = searchParams.get('childId')
  const topicSlug = searchParams.get('topic') || 'space'

  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isLessonMode, setIsLessonMode] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkpointFeedback, setCheckpointFeedback] = useState<string | null>(null)

  // Initialize lesson on mount
  useEffect(() => {
    const initializeLesson = async () => {
      // Check auth
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/auth/login')
        return
      }
      setIsAuthenticated(true)

      // Validate childId
      if (!childId) {
        router.push('/dashboard')
        return
      }

      // Load lesson progress from database
      try {
        const { data: progress, error } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('child_id', childId)
          .eq('topic_id', topicSlug)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is fine for first attempt
          throw error
        }

        if (progress) {
          // Resume from saved progress
          setCurrentStepIndex(progress.current_step)
        } else {
          // First time - start at step 0
          setCurrentStepIndex(0)
        }

        // Create or use existing session
        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .insert({
            child_id: childId,
            topic_id: topicSlug,
          })
          .select('id')
          .single()

        if (sessionError) throw sessionError
        setSessionId(session.id)
      } catch (err) {
        console.error('Failed to load lesson progress:', err)
      }

      setLoading(false)
    }

    initializeLesson()
  }, [childId, topicSlug, router])

  // Handle checkpoint submission
  const handleCheckpointSubmit = async (selectedOptionIndex: number) => {
    const result = evaluateCheckpoint(topicSlug, currentStepIndex, selectedOptionIndex)
    setCheckpointFeedback(result.feedback)

    if (result.correct) {
      // Correct answer - move to next step or complete lesson
      const totalSteps = getTotalLessonSteps(topicSlug)
      const nextStepIndex = currentStepIndex + 1

      // Update lesson_progress in database (fire-and-forget)
      if (sessionId && childId) {
        const stepsCompleted = nextStepIndex >= totalSteps ? totalSteps : nextStepIndex

        supabase
          .from('lesson_progress')
          .upsert({
            child_id: childId,
            topic_id: topicSlug,
            current_step: nextStepIndex,
            steps_completed: stepsCompleted,
            checkpoint_attempts: 0,
            last_attempted_at: new Date().toISOString(),
            completed_at: nextStepIndex >= totalSteps ? new Date().toISOString() : null,
          })
          .then(() => {
            if (nextStepIndex >= totalSteps) {
              // Lesson complete - switch to chat mode
              setIsLessonMode(false)
            } else {
              // Move to next step
              setCurrentStepIndex(nextStepIndex)
              setCheckpointFeedback(null)
            }
          })
          .catch(err => console.error('Failed to update progress:', err))
      }
    }
    // If incorrect, user can try again - no state change
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-white">Loading lesson...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const currentStep = getLessonStep(topicSlug, currentStepIndex)
  const totalSteps = getTotalLessonSteps(topicSlug)

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-4">
        <Sidebar currentTopic={topicSlug} />

        <div className="col-span-3">
          <div className="mb-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-400 hover:underline"
            >
              ← Back to Dashboard
            </button>
          </div>

          {currentStep && (
            <ChatPanel
              isLessonMode={isLessonMode}
              currentLessonStep={currentStep}
              currentStepIndex={currentStepIndex}
              totalLessonSteps={totalSteps}
              onCheckpointSubmit={handleCheckpointSubmit}
            />
          )}

          {checkpointFeedback && (
            <div className="mt-4 p-4 bg-blue-600 rounded-lg text-white">
              {checkpointFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors in app/learn/page.tsx

- [ ] **Step 4: Commit**

```bash
git add app/learn/page.tsx
git commit -m "feat: add lesson progress loading and state management"
```

---

### Task 8: Update Sidebar.tsx to Display Progress Indicators

**Files:**
- Modify: `components/Sidebar.tsx`

- [ ] **Step 1: Read current Sidebar.tsx to understand structure**

Read the existing file.

- [ ] **Step 2: Add progress display to topic list**

Update the topic rendering section to include progress indicators:

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TOPICS } from '@/lib/lessons'
import { getTotalLessonSteps } from '@/lib/lessonEngine'

interface SidebarProps {
  currentTopic?: string;
  childId?: string;
}

export function Sidebar({ currentTopic, childId }: SidebarProps) {
  const [progress, setProgress] = useState<Record<string, any>>({})

  useEffect(() => {
    if (!childId) return

    const loadProgress = async () => {
      const { data } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('child_id', childId)

      const progressMap: Record<string, any> = {}
      data?.forEach(p => {
        progressMap[p.topic_id] = p
      })
      setProgress(progressMap)
    }

    loadProgress()
  }, [childId])

  return (
    <div className="col-span-1 bg-slate-800 rounded-lg p-4 h-fit">
      <h2 className="text-lg font-bold mb-4">Topics</h2>
      <div className="space-y-2">
        {TOPICS.map(topic => {
          const topicProgress = progress[topic.slug]
          const totalSteps = getTotalLessonSteps(topic.slug)
          const stepsCompleted = topicProgress?.steps_completed ?? 0
          const isComplete = stepsCompleted >= totalSteps

          return (
            <button
              key={topic.slug}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentTopic === topic.slug
                  ? 'bg-blue-600'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{topic.emoji} {topic.label}</span>
                <span className="text-sm text-gray-300">
                  {isComplete ? '✓' : `${stepsCompleted}/${totalSteps}`}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors in components/Sidebar.tsx

- [ ] **Step 4: Commit**

```bash
git add components/Sidebar.tsx
git commit -m "feat: add progress indicators to topic sidebar"
```

---

### Task 9: Manual Database Setup (Run Migration in Supabase)

**Files:**
- Execute: Supabase SQL Editor

- [ ] **Step 1: Open Supabase Dashboard and SQL Editor**

1. Go to https://supabase.com/
2. Select your project (dodskrsyybdjfmmmeovv)
3. Click "SQL Editor" in the left sidebar

- [ ] **Step 2: Execute migration**

1. Click "New query"
2. Copy the entire migration from `supabase/migrations/002_add_lesson_progress.sql`
3. Paste into the query editor
4. Click "Run"
5. Verify: Table `lesson_progress` appears in left sidebar under Tables

---

### Task 10: Test Guided Learning Flow Locally

**Files:**
- Test: Full end-to-end flow

- [ ] **Step 1: Start development server**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000

- [ ] **Step 2: Navigate to learn page with test parameters**

Visit: `http://localhost:3000/learn?childId=test-child&topic=space`

Expected: 
- Sidebar displays topics with progress "0/4"
- Main area shows LessonStep component
- First space lesson displays with Cosmo explanation, visual placeholder, and 4 multiple choice buttons

- [ ] **Step 3: Click correct answer (Option B for first checkpoint)**

Expected:
- Feedback message appears: "Wow! That's exactly right! 🎉"
- After 1-2 seconds, moves to next lesson step

- [ ] **Step 4: Try incorrect answer on next step**

Click Option A (wrong answer)

Expected:
- Feedback message appears: "Not quite! ... Let's try again!"
- Can click another option to retry
- Stays on same step

- [ ] **Step 5: Complete all 4 steps**

Answer all 4 checkpoints correctly

Expected:
- After last correct answer, page switches to chat mode
- Input box appears at bottom for free-form chat
- Can ask Cosmo questions about the topic

- [ ] **Step 6: Refresh page and verify resume**

Refresh the page

Expected:
- Lesson progress is restored from database
- Page resumes in chat mode (since lesson was completed)
- Progress in sidebar shows "✓" for space topic

- [ ] **Step 7: Test different topic**

Visit: `http://localhost:3000/learn?childId=test-child&topic=animals`

Expected:
- Shows first animal lesson step
- Progress is separate from space progress
- Can go through complete animal lesson independently

---

### Task 11: Commit All Changes and Clean Up

**Files:**
- Summary commit

- [ ] **Step 1: Review all changes**

```bash
git status
```

Expected: All modified files show (ChatPanel.tsx, Sidebar.tsx, app/learn/page.tsx, app/api/chat/route.ts, lib/lessons.ts) and new files (lib/lessonEngine.ts, components/LessonStep.tsx)

- [ ] **Step 2: Create summary commit**

```bash
git add .
git commit -m "feat: complete guided learning system implementation

- Add lesson_progress table for fine-grained step tracking
- Create LessonStep component with checkpoint UI
- Implement checkpoint evaluation logic in lessonEngine
- Update ChatPanel for lesson mode switching
- Add lesson progress loading and state management
- Display progress indicators in sidebar
- Evaluate checkpoint answers and guide students through lessons
- Support retry mechanism for incorrect answers
- Enable resume capability across sessions"
```

- [ ] **Step 3: Verify git history**

```bash
git log --oneline | head -5
```

Expected: Latest commit shows guided learning implementation

---

## Summary

This plan implements a complete guided learning system for the Cosmo chatbot:

**Architecture:** Two-mode chat (lesson mode with checkpoints, chat mode for free-form questions). Lesson progress tracked in `lesson_progress` table at step granularity. Checkpoints evaluated locally using LessonStep definitions, with immediate feedback and retry capability.

**Key Components:**
- `lessonEngine.ts` — Checkpoint evaluation and lesson step retrieval
- `LessonStep.tsx` — UI for displaying steps and checkpoint options
- Updated `app/api/chat/route.ts` — Separate checkpoint evaluation logic from chat
- Updated `app/learn/page.tsx` — Session initialization, progress loading, mode switching
- Updated `ChatPanel.tsx` — Conditional rendering for lesson vs chat mode
- Updated `Sidebar.tsx` — Progress indicators per topic

**Database:** New `lesson_progress` table with RLS policies tracking current_step, steps_completed, checkpoint_attempts, and resume capability.

**User Experience:**
- Kids progress through structured lessons with immediate feedback
- Incorrect answers trigger retry encouragement
- After lesson completion, free-form chat becomes available
- Progress persists across sessions and devices
- Visual indicators show completion status

