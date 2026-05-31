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
          "Whoa, look at that! That giant glowing ball is the Sun! The Sun is a HUGE star, way bigger than Earth. It gives us light and warmth every single day. Without the Sun, we would be frozen ice cubes!",
        funFact: 'The Sun is so big that 1 million Earths could fit inside it!',
        game: {
          type: 'question',
          instruction: 'Quick question, space cadet!',
          question: 'What is the Sun?',
          options: ['A planet', 'A star', 'A moon', 'A cloud'],
          correctIndex: 1,
          celebrationMessage: "Yes! The Sun is a STAR! You are a space genius!",
          hintOnWrong: 'Hint: It glows and gives us light, just like other twinkly things in the sky at night!',
        },
      },
      {
        id: 'space-planets',
        name: 'The Planet Parade',
        emoji: '🪐',
        introNarration:
          "Next stop — the planets! There are 8 planets that zoom around our Sun. They come in all sizes and colors. Some are rocky like Earth, and some are giant balls of gas like Jupiter!",
        funFact: 'Jupiter has a big red storm that has been spinning for over 300 years!',
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
          celebrationMessage: 'Perfect order! You know the planets!',
        },
      },
      {
        id: 'space-moon',
        name: 'Our Moon',
        emoji: '🌙',
        introNarration:
          "Last stop in space — the Moon! The Moon is Earth's best friend. It goes around our planet over and over. People have even walked on the Moon!",
        funFact: 'The Moon is moving away from Earth a tiny bit every year!',
        game: {
          type: 'matching',
          instruction: 'Match each space thing to what it does!',
          pairs: [
            { id: 'p1', left: 'Sun', right: 'Gives us light' },
            { id: 'p2', left: 'Moon', right: 'Goes around Earth' },
            { id: 'p3', left: 'Earth', right: 'Where we live' },
          ],
          celebrationMessage: 'Match-tastic!',
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
      successNarration: "You did it! You are officially a Space Captain! Ready to explore Earth's animals next?",
      retryNarration: "Almost there, space cadet! Let's try those tricky ones again. You've got this!",
    },
  },
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
          "Welcome to the Animal Kingdom! First, let's meet the MAMMALS. Mammals have fur or hair, and most baby mammals drink milk from their mommy. You are a mammal too!",
        funFact: 'Blue whales are the biggest mammals — bigger than 3 school buses!',
        game: {
          type: 'question',
          instruction: 'Spot the mammal!',
          question: 'Which of these is a mammal?',
          options: ['Snake', 'Dog', 'Fish', 'Bird'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Dogs are mammals — they have fur!',
          hintOnWrong: 'Look for the one with FUR!',
        },
      },
      {
        id: 'animals-habitats',
        name: 'Animal Homes',
        emoji: '🏞️',
        introNarration:
          "Animals live in different places called HABITATS! Fish live in water, birds make nests in trees, and polar bears live on icy snow. Every animal has its perfect home!",
        funFact: 'A camel can go a whole week without drinking water!',
        game: {
          type: 'matching',
          instruction: 'Match each animal to its home!',
          pairs: [
            { id: 'p1', left: 'Fish', right: 'Ocean' },
            { id: 'p2', left: 'Polar Bear', right: 'Arctic ice' },
            { id: 'p3', left: 'Monkey', right: 'Jungle trees' },
          ],
          celebrationMessage: 'Every animal back home safely!',
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
          question: "An animal's home is called a...",
          options: ['Habitat', 'Hotel', 'House', 'Hat'],
          correctIndex: 0,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Starts with H... HAB-i-tat!',
        },
      ],
      successNarration: "AMAZING! You are an Animal Expert! Time to check the weather!",
      retryNarration: "Almost! Let's try those again — you are so close!",
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
          "Did you know water goes on a JOURNEY too? The Sun heats water in oceans and lakes. The water floats UP as steam, makes clouds, and then falls back down as rain! This is called the water cycle!",
        funFact: 'The water you drink today might be the same water a dinosaur drank long ago!',
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
          celebrationMessage: 'The water cycle, perfect!',
        },
      },
      {
        id: 'weather-storms',
        name: 'Stormy Skies',
        emoji: '⛈️',
        introNarration:
          "BOOM! Thunderstorms are wild! Lightning is a giant spark of electricity in the sky. Thunder is the LOUD sound lightning makes. You see lightning first because light travels faster than sound!",
        funFact: 'Lightning is hotter than the surface of the Sun!',
        game: {
          type: 'question',
          instruction: 'Storm question!',
          question: 'Which comes first in a thunderstorm?',
          options: ['Thunder sound', 'Lightning flash', 'Rainbow', 'Snow'],
          correctIndex: 1,
          celebrationMessage: 'Yes! We SEE lightning before we HEAR thunder!',
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
      successNarration: "Wonderful! You are a Weather Wizard! Next up: YOUR BODY!",
      retryNarration: "You are close! One more try, weather friend!",
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
          "Put your hand on your chest — feel that THUMP THUMP? That's your heart! Your heart is a muscle that pumps blood all around your body, all day, every day, without ever taking a break!",
        funFact: 'Your heart beats about 100,000 times every day!',
        game: {
          type: 'question',
          instruction: 'Heart smart question!',
          question: 'What does the heart pump?',
          options: ['Water', 'Air', 'Blood', 'Food'],
          correctIndex: 2,
          celebrationMessage: 'Yes! The heart pumps BLOOD!',
          hintOnWrong: 'It is the red stuff inside you!',
        },
      },
      {
        id: 'body-brain',
        name: 'The Big Brain',
        emoji: '🧠',
        introNarration:
          "Up in your head is your BRAIN! Your brain is like a super computer. It helps you think, remember, see, hear, and even wiggle your toes! Right now, your brain is learning new things!",
        funFact: 'Your brain has more connections than there are stars in the sky!',
        game: {
          type: 'matching',
          instruction: 'Match each body part to its job!',
          pairs: [
            { id: 'p1', left: 'Brain', right: 'Thinking' },
            { id: 'p2', left: 'Heart', right: 'Pumping blood' },
            { id: 'p3', left: 'Lungs', right: 'Breathing' },
          ],
          celebrationMessage: 'You know your body so well!',
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
      successNarration: "Incredible! You are a Body Boss! One last adventure: PLANTS!",
      retryNarration: "Almost! Your brain is working hard — try again!",
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
          "Did you know plants EAT sunlight? Plants need 3 things to grow: SUN, WATER, and SOIL. Their roots drink water, their leaves catch sunlight, and they grow up, up, UP!",
        funFact: 'The tallest tree in the world is taller than the Statue of Liberty!',
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
          celebrationMessage: 'Perfect growing order!',
        },
      },
      {
        id: 'plants-parts',
        name: 'Parts of a Plant',
        emoji: '🌻',
        introNarration:
          "Plants have parts that work as a team! ROOTS grab water from the ground. The STEM holds everything up. LEAVES make food from sunlight. And FLOWERS make seeds for new plants!",
        funFact: 'Some plants can eat bugs! Like the Venus flytrap!',
        game: {
          type: 'question',
          instruction: 'Plant part question!',
          question: 'Which part of the plant catches sunlight?',
          options: ['Roots', 'Leaves', 'Seeds', 'Dirt'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Leaves catch sunlight!',
          hintOnWrong: 'They are flat and green!',
        },
      },
    ],
    checkpoint: {
      id: 'cp-plants',
      topicId: 'plants',
      title: 'Plant Master Test! 🌱',
      introNarration: "Final test! If you pass, you will be a SCIENCE LEGEND!",
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
      successNarration: "YOU DID IT! You are officially a SCIENCE LEGEND! Thanks for adventuring with me!",
      retryNarration: "One more try! You are SO close to being a legend!",
    },
  },
]
