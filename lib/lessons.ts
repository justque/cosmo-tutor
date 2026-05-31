export interface CheckpointDef {
  question: string
  options: [string, string, string, string]
  correctIndex: number
  hint?: string
}

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
  checkpoint: CheckpointDef
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
        checkpoint: {
          question: 'What keeps us from floating away from Earth?',
          options: ['Magic spells', 'Gravity pulls us down', 'Invisible ropes', "Cosmo's robot powers"],
          correctIndex: 1,
          hint: 'Think about why things fall down when you drop them!',
        },
      },
      {
        id: 'space-2',
        prompt:
          "The Sun is SO big! About 1 million Earths could fit inside it! Can you imagine? 🔥 It gives us light and warmth every day.",
        checkpoint: {
          question: 'Why is the Sun important to Earth?',
          options: ['It makes the sky blue', 'It gives us light and heat', 'It makes our food taste better', 'It helps robots like me work'],
          correctIndex: 1,
          hint: 'What do you feel when you go outside on a sunny day?',
        },
      },
      {
        id: 'space-3',
        prompt:
          "Around our Sun, there are other planets too! Some are close, some are far away. They all spin around the Sun in a cosmic dance! 🪐💫",
        expectedVisual: {
          type: 'animation',
          subject: 'planets in solar system',
        },
        checkpoint: {
          question: 'What do all the planets do?',
          options: ['They stay still in one place', 'They orbit (go around) the Sun', 'They crash into each other', 'They hide from Cosmo'],
          correctIndex: 1,
          hint: 'Remember the cosmic dance around the Sun!',
        },
      },
      {
        id: 'space-4',
        prompt:
          "At night, you can see stars! Those are actually suns too — really, really far away. They might even have planets orbiting them! 🌟",
        checkpoint: {
          question: 'What are stars made of?',
          options: ['Ice and snow', 'Giant balls of burning gas', 'Stardust and wishes', 'Pieces of the Moon'],
          correctIndex: 1,
          hint: 'Stars are hot like the Sun, which is also a star!',
        },
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
        checkpoint: {
          question: 'How many different types of animals are on Earth?',
          options: ['Just a few', 'Hundreds', 'Thousands', 'Millions'],
          correctIndex: 3,
          hint: 'It is a LOT! More than you can count!',
        },
      },
      {
        id: 'animals-2',
        prompt:
          "Some animals have super hearing, like bats! They use sound to find food in the dark. It's like having a special superpower! 🦇",
        checkpoint: {
          question: 'What superpower do bats have?',
          options: ['Super speed', 'Super hearing', 'Super strength', 'Super vision'],
          correctIndex: 1,
          hint: 'Bats use this sense to find food in the dark!',
        },
      },
      {
        id: 'animals-3',
        prompt:
          "Other animals have camouflage — their skin colors match where they live so predators can't see them! It's like wearing an invisibility cloak! 🦎✨",
        expectedVisual: {
          type: 'image',
          subject: 'camouflaged animals',
        },
        checkpoint: {
          question: 'What is camouflage?',
          options: ['Moving really fast', 'Being really loud', 'Colors that match where you live', 'Having lots of friends'],
          correctIndex: 2,
          hint: 'Think about hiding in nature!',
        },
      },
      {
        id: 'animals-4',
        prompt:
          "And some animals migrate — they travel super far every year! Butterflies fly thousands of miles! 🦋 Nature is AMAZING!",
        checkpoint: {
          question: 'What is migration?',
          options: ['Staying in one place all year', 'Flying backwards', 'Traveling really far every year', 'Building a home'],
          correctIndex: 2,
          hint: 'Some animals take epic journeys!',
        },
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
        checkpoint: {
          question: 'Where does rain water come from?',
          options: ['The clouds make it', 'Oceans and rivers send it up to clouds', 'It rains from space', 'Plants create all the rain'],
          correctIndex: 1,
          hint: 'Water travels from the ocean to the clouds!',
        },
      },
      {
        id: 'weather-2',
        prompt:
          "Rainbows appear when sunlight and water droplets play together! The light bends and splits into all the colors of the rainbow. How cool is that? 🌈",
        checkpoint: {
          question: 'What do you need to make a rainbow?',
          options: ['Just water', 'Just sunlight', 'Sunlight and water droplets together', 'Magic and wishes'],
          correctIndex: 2,
          hint: 'You need both sun and rain or water!',
        },
      },
      {
        id: 'weather-3',
        prompt:
          "Lightning is electricity in the sky! It heats the air so fast that it creates a huge boom of sound — that's thunder! ⚡💥",
        expectedVisual: {
          type: 'animation',
          subject: 'lightning storm',
        },
        checkpoint: {
          question: 'What causes thunder?',
          options: ['Clouds bumping together', 'The sound from lightning heating air', 'Rain falling really hard', 'Wind blowing strong'],
          correctIndex: 1,
          hint: 'Lightning heats the air super fast!',
        },
      },
      {
        id: 'weather-4',
        prompt:
          "Tornadoes and hurricanes are spinning storms that can be really powerful. Nature shows us that weather is always changing and moving! 🌪️",
        checkpoint: {
          question: 'What are tornadoes and hurricanes?',
          options: ['Light winds', 'Spinning storms that are very powerful', 'Types of clouds', 'Cool weather patterns'],
          correctIndex: 1,
          hint: 'They spin really fast and are very strong!',
        },
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
        checkpoint: {
          question: 'What does your heart do?',
          options: ['Makes you think', 'Pumps blood around your body', 'Helps you see', 'Makes you grow taller'],
          correctIndex: 1,
          hint: 'You can feel it beating in your chest!',
        },
      },
      {
        id: 'body-2',
        prompt:
          "Your brain controls EVERYTHING! It helps you think, move, remember, and feel emotions. It's like the boss of your whole body! 🧠✨",
        checkpoint: {
          question: 'What is the boss of your body?',
          options: ['Your heart', 'Your muscles', 'Your brain', 'Your bones'],
          correctIndex: 2,
          hint: 'It helps you think and remember!',
        },
      },
      {
        id: 'body-3',
        prompt:
          "Your bones are super strong! They hold up your whole body and protect your important organs inside. You have 206 bones! 🦴",
        expectedVisual: {
          type: 'image',
          subject: 'human skeleton',
        },
        checkpoint: {
          question: 'What do your bones do?',
          options: ['Make you blue', 'Hold you up and protect your organs', 'Help you sleep', 'Make sounds'],
          correctIndex: 1,
          hint: 'They are strong and keep you standing!',
        },
      },
      {
        id: 'body-4',
        prompt:
          "When you eat food, your stomach breaks it down into fuel that your body uses for energy! Your body is like a super cool machine! 🍎💪",
        checkpoint: {
          question: 'What does your stomach do with food?',
          options: ['Stores it forever', 'Breaks it down into fuel for energy', 'Turns it into bones', 'Makes it taste better'],
          correctIndex: 1,
          hint: 'It breaks food down so your body can use it!',
        },
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
        checkpoint: {
          question: 'How do plants make their own food?',
          options: ['They eat dirt', 'They use sunlight with a special power called photosynthesis', 'They drink milk', 'They ask animals for food'],
          correctIndex: 1,
          hint: 'Plants use the sun to create energy!',
        },
      },
      {
        id: 'plants-2',
        prompt:
          "Plants have roots underground that drink water, like a straw! The water travels up to the leaves where it helps make food. 💧🌱",
        checkpoint: {
          question: 'What do plant roots do?',
          options: ['Catch raindrops', 'Drink water like a straw', 'Make flowers grow', 'Push the plant up'],
          correctIndex: 1,
          hint: 'Roots work like straws for plants!',
        },
      },
      {
        id: 'plants-3',
        prompt:
          "Flowers are how plants make baby plants! They make seeds that can grow into new plants. Some flowers are super pretty colors to attract bees! 🌸🐝",
        expectedVisual: {
          type: 'image',
          subject: 'colorful flowers',
        },
        checkpoint: {
          question: 'What do flowers do?',
          options: ['Make the plant smell bad', 'Make baby plants with seeds', 'Keep the plant cold', 'Tell the time'],
          correctIndex: 1,
          hint: 'Flowers help make new plants!',
        },
      },
      {
        id: 'plants-4',
        prompt:
          "Trees are special plants that can live for hundreds of years! Some trees are taller than buildings. They give us oxygen to breathe! 🌳💚",
        checkpoint: {
          question: 'What do trees give us?',
          options: ['Snow', 'Oxygen to breathe', 'Thunder', 'Clouds'],
          correctIndex: 1,
          hint: 'Trees help us breathe!',
        },
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
