export interface Lesson {
  id: string
  title: string
  steps: LessonStep[]
}

export interface LessonStep {
  id: string
  prompt: string
  expectedVisual?: {
    type: 'animation' | 'image'
    subject: string
  }
}

export const LESSONS: Record<string, Lesson> = {
  space: {
    id: 'space',
    title: '🚀 Exploring Space',
    steps: [
      {
        id: 'space-1',
        prompt:
          "Did you know that our planet Earth is floating in space? And it orbits around the Sun, which is a giant ball of super hot fire! 🌍✨",
        expectedVisual: {
          type: 'animation',
          subject: 'Earth orbiting the Sun',
        },
      },
      {
        id: 'space-2',
        prompt:
          "The Sun is SO big! About 1 million Earths could fit inside it! Can you imagine? 🔥 It gives us light and warmth every day.",
      },
      {
        id: 'space-3',
        prompt:
          "Around our Sun, there are other planets too! Some are close, some are far away. They all spin around the Sun in a cosmic dance! 🪐💫",
        expectedVisual: {
          type: 'animation',
          subject: 'planets in solar system',
        },
      },
      {
        id: 'space-4',
        prompt:
          "At night, you can see stars! Those are actually suns too — really, really far away. They might even have planets orbiting them! 🌟",
      },
    ],
  },
  animals: {
    id: 'animals',
    title: '🦁 Amazing Animals',
    steps: [
      {
        id: 'animals-1',
        prompt:
          "There are MILLIONS of different animals on Earth! From tiny bugs to huge whales, they all have special powers! 🐝🐋",
        expectedVisual: {
          type: 'image',
          subject: 'diverse animals',
        },
      },
      {
        id: 'animals-2',
        prompt:
          "Some animals have super hearing, like bats! They use sound to find food in the dark. It's like having a special superpower! 🦇",
      },
      {
        id: 'animals-3',
        prompt:
          "Other animals have camouflage — their skin colors match where they live so predators can't see them! It's like wearing an invisibility cloak! 🦎✨",
        expectedVisual: {
          type: 'image',
          subject: 'camouflaged animals',
        },
      },
      {
        id: 'animals-4',
        prompt:
          "And some animals migrate — they travel super far every year! Butterflies fly thousands of miles! 🦋 Nature is AMAZING!",
      },
    ],
  },
  weather: {
    id: 'weather',
    title: '⛈️ Wild Weather',
    steps: [
      {
        id: 'weather-1',
        prompt:
          "Rain happens because of something called the water cycle! Water from oceans and rivers goes up into the clouds, then falls back down. 💧☁️",
        expectedVisual: {
          type: 'animation',
          subject: 'water cycle',
        },
      },
      {
        id: 'weather-2',
        prompt:
          "Rainbows appear when sunlight and water droplets play together! The light bends and splits into all the colors of the rainbow. How cool is that? 🌈",
      },
      {
        id: 'weather-3',
        prompt:
          "Lightning is electricity in the sky! It heats the air so fast that it creates a huge boom of sound — that's thunder! ⚡💥",
        expectedVisual: {
          type: 'animation',
          subject: 'lightning storm',
        },
      },
      {
        id: 'weather-4',
        prompt:
          "Tornadoes and hurricanes are spinning storms that can be really powerful. Nature shows us that weather is always changing and moving! 🌪️",
      },
    ],
  },
  human_body: {
    id: 'human_body',
    title: '🫀 Your Amazing Body',
    steps: [
      {
        id: 'body-1',
        prompt:
          "Your heart is a super strong muscle that pumps blood all around your body! It beats about 100,000 times a day. That's incredible! 💓",
        expectedVisual: {
          type: 'animation',
          subject: 'heart pumping blood',
        },
      },
      {
        id: 'body-2',
        prompt:
          "Your brain controls EVERYTHING! It helps you think, move, remember, and feel emotions. It's like the boss of your whole body! 🧠✨",
      },
      {
        id: 'body-3',
        prompt:
          "Your bones are super strong! They hold up your whole body and protect your important organs inside. You have 206 bones! 🦴",
        expectedVisual: {
          type: 'image',
          subject: 'human skeleton',
        },
      },
      {
        id: 'body-4',
        prompt:
          "When you eat food, your stomach breaks it down into fuel that your body uses for energy! Your body is like a super cool machine! 🍎💪",
      },
    ],
  },
  plants: {
    id: 'plants',
    title: '🌿 Growing Plants',
    steps: [
      {
        id: 'plants-1',
        prompt:
          "Plants make their own food using sunlight! They have a special power called photosynthesis. They turn sunlight into energy! ☀️✨",
        expectedVisual: {
          type: 'animation',
          subject: 'photosynthesis process',
        },
      },
      {
        id: 'plants-2',
        prompt:
          "Plants have roots underground that drink water, like a straw! The water travels up to the leaves where it helps make food. 💧🌱",
      },
      {
        id: 'plants-3',
        prompt:
          "Flowers are how plants make baby plants! They make seeds that can grow into new plants. Some flowers are super pretty colors to attract bees! 🌸🐝",
        expectedVisual: {
          type: 'image',
          subject: 'colorful flowers',
        },
      },
      {
        id: 'plants-4',
        prompt:
          "Trees are special plants that can live for hundreds of years! Some trees are taller than buildings. They give us oxygen to breathe! 🌳💚",
      },
    ],
  },
}

export const TOPICS = Object.values(LESSONS).map((lesson) => ({
  id: lesson.id,
  label: lesson.title.split(' ').slice(1).join(' '),
  emoji: lesson.title.split(' ')[0],
  slug: lesson.id,
  displayOrder: Object.keys(LESSONS).indexOf(lesson.id),
}))
