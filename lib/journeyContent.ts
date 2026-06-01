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

export type VisualKey = 'solar-system'

export interface LocationVideo {
  youtubeId: string
  title: string
}

export interface Location {
  id: string
  name: string
  emoji: string
  introNarration: string
  funFact: string
  game: GameData
  visual?: VisualKey
  video?: LocationVideo
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

export interface TopicIntro {
  tagline: string
  narration: string
  animationEmojis: string[]
}

export interface Topic {
  id: string
  name: string
  emoji: string
  themeColor: string
  order: number
  intro: TopicIntro
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
    intro: {
      tagline: '3... 2... 1... BLAST OFF!',
      narration:
        "Buckle up, space explorer! We are zooming into OUTER SPACE! Get ready to meet the Sun, the planets, and the Moon. Are you ready to explore?",
      animationEmojis: ['🚀', '⭐', '🪐', '☄️', '🌟', '🌙', '☀️', '✨'],
    },
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
        visual: 'solar-system',
        video: {
          youtubeId: 'j5ueashD6w4',
          title: 'Watch a quick tour of our Solar System!',
        },
        introNarration:
          "Next stop — the planets! There are 8 planets that zoom around our Sun. Watch the video, then play with the planets below! Tap any planet to learn more about it.",
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
          "Next stop — the Moon! The Moon is Earth's best friend. It goes around our planet over and over. People have even walked on the Moon!",
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
      {
        id: 'space-stars',
        name: 'Twinkle Stars',
        emoji: '⭐',
        introNarration:
          "Look up at night and you'll see thousands of TWINKLY stars! Stars are giant balls of glowing gas, just like our Sun — but they look tiny because they are SO far away. Some stars team up to make pictures called constellations!",
        funFact: 'There are more stars in the sky than grains of sand on every beach on Earth!',
        game: {
          type: 'question',
          instruction: 'Starry question!',
          question: 'Why do stars look so tiny?',
          options: ['They are very small', 'They are very far away', 'They are sleeping', 'They are hiding'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Stars are HUGE — they just look tiny because they are super far!',
          hintOnWrong: 'Think about how a big airplane looks tiny in the sky!',
        },
      },
      {
        id: 'space-rockets',
        name: 'Rockets & Astronauts',
        emoji: '🚀',
        introNarration:
          "How do people GET to space? In a ROCKET! Rockets blast off with a huge BOOM and fly faster than a jet. The brave people who ride them are called astronauts, and they float because there's no gravity up there!",
        funFact: 'Astronauts grow about 2 inches taller in space because there is no gravity squishing them!',
        game: {
          type: 'ordering',
          instruction: 'Put a rocket launch in order!',
          items: [
            { id: 'count', label: 'Countdown', emoji: '🔢' },
            { id: 'fire', label: 'Engines fire', emoji: '🔥' },
            { id: 'liftoff', label: 'Lift off!', emoji: '🚀' },
            { id: 'orbit', label: 'In orbit', emoji: '🛰️' },
          ],
          correctOrder: ['count', 'fire', 'liftoff', 'orbit'],
          celebrationMessage: 'Mission successful, astronaut!',
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
    intro: {
      tagline: 'Roar! The Animal Kingdom awaits!',
      narration:
        "Welcome to the wild, wild ANIMAL KINGDOM! We'll meet mammals with fluffy fur and discover where every animal calls home. Let's go on a safari!",
      animationEmojis: ['🦁', '🐘', '🐒', '🐼', '🐻', '🦒', '🐯', '🦊', '🐰', '🐶'],
    },
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
      {
        id: 'animals-birds',
        name: 'Feathered Friends',
        emoji: '🦜',
        introNarration:
          "Tweet tweet! Time to meet the BIRDS! Birds have feathers, lay eggs, and most of them can FLY. From tiny hummingbirds to giant eagles, birds zoom through the sky on their wings!",
        funFact: 'The hummingbird flaps its wings 80 times every SECOND!',
        game: {
          type: 'question',
          instruction: 'Bird brain question!',
          question: 'What do birds have that no other animal has?',
          options: ['Feathers', 'Eyes', 'Teeth', 'Tails'],
          correctIndex: 0,
          celebrationMessage: 'Yes! Only birds have feathers!',
          hintOnWrong: 'It is soft and fluffy and helps them fly!',
        },
      },
      {
        id: 'animals-ocean',
        name: 'Ocean Wonders',
        emoji: '🐠',
        introNarration:
          "Splash! Below the waves live some of the COOLEST creatures on Earth. Wiggly octopuses, smiley dolphins, gentle whales, and zillions of colorful fish all call the ocean home!",
        funFact: 'An octopus has 3 hearts and BLUE blood!',
        game: {
          type: 'matching',
          instruction: 'Match each ocean animal to its special trick!',
          pairs: [
            { id: 'p1', left: 'Octopus', right: '8 wiggly arms' },
            { id: 'p2', left: 'Dolphin', right: 'Super smart swimmer' },
            { id: 'p3', left: 'Shark', right: 'Lots of sharp teeth' },
          ],
          celebrationMessage: 'You are a sea-creature genius!',
        },
      },
      {
        id: 'animals-reptiles',
        name: 'Cool Reptiles',
        emoji: '🦎',
        introNarration:
          "Hissss! Reptiles like snakes, lizards, and turtles have scaly skin and lay eggs. They are COLD-BLOODED, which means they love sunbathing on rocks to warm up!",
        funFact: 'A baby chameleon can change colors just minutes after it hatches!',
        game: {
          type: 'question',
          instruction: 'Reptile riddle!',
          question: 'Why do reptiles like to sit in the sun?',
          options: ['To get a tan', 'To warm up their cold bodies', 'To take a nap', 'To eat sunlight'],
          correctIndex: 1,
          celebrationMessage: 'Right! Reptiles need the Sun to stay warm!',
          hintOnWrong: 'Reptiles are COLD-blooded — they need help to feel toasty!',
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
    intro: {
      tagline: 'Look up at the sky!',
      narration:
        "Time for some WILD WEATHER! We'll see how rain is made, watch clouds dance, and even meet some thunder and lightning. Grab your raincoat!",
      animationEmojis: ['☁️', '🌧️', '⛈️', '🌩️', '🌈', '☀️', '❄️', '💧', '🌪️', '⚡'],
    },
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
      {
        id: 'weather-clouds',
        name: 'Cloud Watching',
        emoji: '☁️',
        introNarration:
          "Look up! Clouds are made of TINY water drops and ice crystals. Some are fluffy like cotton balls, some are wispy like cat tails, and some are dark and stormy. Each shape tells you what the weather will do!",
        funFact: 'A small puffy cloud can weigh as much as a HUNDRED elephants!',
        game: {
          type: 'matching',
          instruction: 'Match each cloud to the weather it brings!',
          pairs: [
            { id: 'p1', left: 'Fluffy white cloud', right: 'Sunny day' },
            { id: 'p2', left: 'Dark gray cloud', right: 'Rain coming' },
            { id: 'p3', left: 'Thin wispy cloud', right: 'High up sky' },
          ],
          celebrationMessage: 'Cloud expert!',
        },
      },
      {
        id: 'weather-seasons',
        name: 'Four Seasons',
        emoji: '🍂',
        introNarration:
          "Earth has four SEASONS that take turns all year! Spring brings flowers, summer is hot and sunny, autumn paints leaves orange, and winter blankets everything in cold snow!",
        funFact: 'Earth is tilted! That tilt is what gives us our seasons.',
        game: {
          type: 'ordering',
          instruction: 'Put the seasons in order, starting with Spring!',
          items: [
            { id: 'spring', label: 'Spring', emoji: '🌸' },
            { id: 'summer', label: 'Summer', emoji: '☀️' },
            { id: 'fall', label: 'Fall', emoji: '🍂' },
            { id: 'winter', label: 'Winter', emoji: '❄️' },
          ],
          correctOrder: ['spring', 'summer', 'fall', 'winter'],
          celebrationMessage: 'Perfect seasons!',
        },
      },
      {
        id: 'weather-snow',
        name: 'Snowflake Magic',
        emoji: '❄️',
        introNarration:
          "When it gets really cold, rain freezes into beautiful SNOWFLAKES! Every single snowflake has 6 sides, and no two snowflakes are exactly the same. They're tiny works of art falling from the sky!",
        funFact: 'The biggest snowflake ever recorded was 15 inches wide — bigger than a frisbee!',
        game: {
          type: 'question',
          instruction: 'Snowy question!',
          question: 'How many sides does a snowflake have?',
          options: ['3', '6', '8', '100'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Every snowflake has 6 sides!',
          hintOnWrong: 'It is half of twelve!',
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
    intro: {
      tagline: 'Inside YOU is amazing!',
      narration:
        "Now we go on the smallest, coolest adventure — INSIDE YOUR OWN BODY! Your heart, your brain, your lungs — they all work together as a team. Let's meet them!",
      animationEmojis: ['❤️', '🧠', '🫁', '🦴', '👁️', '👂', '🦷', '💪', '🫀', '🧬'],
    },
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
      {
        id: 'body-bones',
        name: 'The Skeleton Crew',
        emoji: '🦴',
        introNarration:
          "Inside your body is a SKELETON made of bones! Bones are super strong and they hold you up. Without bones, you'd be a wiggly blob! You have 206 bones — that's a LOT!",
        funFact: 'Babies are born with about 300 bones — some fuse together as they grow!',
        game: {
          type: 'question',
          instruction: 'Bone-tastic question!',
          question: 'How many bones do grown-ups have?',
          options: ['10', '50', '206', '1,000'],
          correctIndex: 2,
          celebrationMessage: 'Yes! 206 bones hold you up!',
          hintOnWrong: 'It is more than 200!',
        },
      },
      {
        id: 'body-senses',
        name: 'Five Super Senses',
        emoji: '👁️',
        introNarration:
          "You have FIVE super-powers called SENSES! You SEE with your eyes, HEAR with your ears, SMELL with your nose, TASTE with your tongue, and TOUCH with your skin. Your senses help you understand the world!",
        funFact: 'Your tongue has about 10,000 tiny taste buds!',
        game: {
          type: 'matching',
          instruction: 'Match each sense to the body part that does it!',
          pairs: [
            { id: 'p1', left: 'See', right: 'Eyes' },
            { id: 'p2', left: 'Hear', right: 'Ears' },
            { id: 'p3', left: 'Smell', right: 'Nose' },
            { id: 'p4', left: 'Taste', right: 'Tongue' },
          ],
          celebrationMessage: 'All five senses, sensational!',
        },
      },
      {
        id: 'body-lungs',
        name: 'The Big Breath',
        emoji: '🫁',
        introNarration:
          "Breathe in... breathe out... that's your LUNGS at work! Lungs are like two big balloons in your chest. They suck in air so your body can get oxygen — the gas that keeps you alive!",
        funFact: 'You take about 20,000 breaths every single day!',
        game: {
          type: 'question',
          instruction: 'Breathe and answer!',
          question: 'What gas do your lungs grab from the air?',
          options: ['Helium', 'Oxygen', 'Bubble gas', 'Smoke'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Oxygen keeps us alive!',
          hintOnWrong: 'It starts with O and it is in the air!',
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
    intro: {
      tagline: 'Welcome to the green world!',
      narration:
        "Last adventure — PLANT POWER! From tiny seeds to towering trees, plants are everywhere. Let's discover how they grow and what their parts do!",
      animationEmojis: ['🌱', '🌿', '🌳', '🌲', '🌻', '🌷', '🌹', '🍀', '🌵', '🪴'],
    },
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
      {
        id: 'plants-flowers',
        name: 'Pretty Flowers',
        emoji: '🌸',
        introNarration:
          "FLOWERS aren't just pretty — they have a secret job! Their bright colors and sweet smells call BEES and butterflies to come visit. The bees carry tiny dust called pollen from flower to flower, helping new plants grow!",
        funFact: 'A single sunflower can have up to 2,000 tiny seeds inside it!',
        game: {
          type: 'question',
          instruction: 'Flower power question!',
          question: 'Who helps flowers by carrying pollen?',
          options: ['Bees', 'Sharks', 'Cats', 'Cars'],
          correctIndex: 0,
          celebrationMessage: 'Yes! Buzzy bees are flower helpers!',
          hintOnWrong: 'They go BUZZ BUZZ!',
        },
      },
      {
        id: 'plants-seeds',
        name: 'Seed Travelers',
        emoji: '🌰',
        introNarration:
          "SEEDS are baby plants in little packages! But how do they get to new places? Some FLY on the wind like tiny parachutes. Some HITCH a ride on animal fur. And some get gobbled up by birds, then planted in their poop! 💩",
        funFact: 'A coconut seed can FLOAT across an entire ocean before growing into a tree!',
        game: {
          type: 'matching',
          instruction: 'Match each seed to how it travels!',
          pairs: [
            { id: 'p1', left: 'Dandelion fluff', right: 'Floats on wind' },
            { id: 'p2', left: 'Burr sticker', right: 'Sticks to fur' },
            { id: 'p3', left: 'Coconut', right: 'Floats on water' },
          ],
          celebrationMessage: 'Seed traveler expert!',
        },
      },
      {
        id: 'plants-trees',
        name: 'Tall Trees',
        emoji: '🌳',
        introNarration:
          "Trees are GIANTS of the plant world! They can grow for hundreds of years and become taller than a building. Their leaves make OXYGEN for us to breathe, and their branches are home to birds, squirrels, and bugs!",
        funFact: 'The oldest tree in the world is over 5,000 years old — older than the pyramids!',
        game: {
          type: 'question',
          instruction: 'Tree-mendous question!',
          question: 'What gas do trees make for us to breathe?',
          options: ['Smoke', 'Oxygen', 'Helium', 'Bubble gum'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Trees make the oxygen we breathe!',
          hintOnWrong: 'It is the same gas your LUNGS love!',
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
