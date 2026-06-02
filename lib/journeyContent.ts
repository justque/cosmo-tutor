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

export type VisualKey =
  | 'solar-system'
  | 'sun-flare'
  | 'moon-phases'
  | 'constellations'
  | 'rocket-launch'
  | 'mars-rover'
  | 'comet-swoop'
  | 'black-hole'
  | 'saturn-rings'
  | 'jupiter-moons'
  | 'space-station'
  | 'mammal-parade'
  | 'habitat-zones'
  | 'bird-flock'
  | 'bug-garden'
  | 'ocean-reef'
  | 'reptile-rock'
  | 'frog-pond'
  | 'dino-walk'

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
        visual: 'sun-flare',
        introNarration:
          "3... 2... 1... WHOOSH! Our rocket has zoomed past the clouds, past the blue sky, and into the dark velvet of outer space. Look out the window — that giant blazing ball is the SUN! The Sun is a STAR — a humongous spinning ball of glowing hot gas, mostly hydrogen and helium. Inside the Sun's core, the temperature is a mind-melting 27 million degrees Fahrenheit — hot enough to smash tiny atoms together and burst out energy as light and warmth. That light takes about 8 whole minutes to travel all the way to Earth, helping every plant grow, every animal hunt, and YOU wake up to a bright sunny morning. Without the Sun, our whole planet would be a dark, frozen ice cube floating in the dark!",
        funFact: 'The Sun is so big that 1 million Earths could fit inside it — and it sends a solar wind of tiny particles racing through space at 1 million miles per hour!',
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
          "Now that we've said hello to the Sun, let's meet its 8 best friends — the PLANETS! Planets are giant balls of rock or swirly gas, and they all ZOOM around the Sun in their own giant circles called ORBITS. The first four — Mercury, Venus, Earth, and Mars — are little rocky planets like the one you live on. The next four — Jupiter, Saturn, Uranus, and Neptune — are GIANT balls of gas, so big that hundreds of Earths could fit inside! Saturn even has shimmering rings made of ice and rock zooming around it. Watch the quick tour, then tap any planet below to learn its secret. Pinch your fingers, drag the speed slider, and see them race around the Sun!",
        funFact: 'Jupiter has a big red storm that has been spinning for over 300 years — it is bigger than Earth!',
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
        id: 'space-saturn',
        name: "Saturn's Sparkly Rings",
        emoji: '🪐',
        visual: 'saturn-rings',
        introNarration:
          "Now zoom out to one of the most jaw-dropping planets in our solar system: SATURN! Saturn is a giant gas planet, almost as big as Jupiter, but what makes it FAMOUS is its dazzling RINGS. Those rings look like a glowing record spinning around Saturn — and they are made of TRILLIONS of icy chunks! Some pieces are tiny like specks of dust, others are as big as a house. The rings stretch 175,000 miles wide but are only about 30 feet thick — so thin that if you stood on the edge, you could almost see through them! Tiny moons called shepherd moons swim in the gaps and keep the rings tidy. Here's the sad-but-amazing twist: in about 100 million years, all that ice will rain down onto Saturn and the rings will vanish forever. So we're SO lucky to see them today!",
        funFact: 'Saturn is the only planet that could FLOAT in a giant bathtub — it is less dense than water!',
        game: {
          type: 'question',
          instruction: 'Saturn quiz!',
          question: "What are Saturn's rings made of?",
          options: ['Cotton candy', 'Icy rocks', 'Plastic', 'Stars'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Trillions of icy chunks make the rings!',
          hintOnWrong: 'It is something cold you might find in your freezer!',
        },
      },
      {
        id: 'space-jupiter',
        name: 'Jupiter & Its Moons',
        emoji: '🟠',
        visual: 'jupiter-moons',
        introNarration:
          "Hold on tight — we're zooming to the KING of all planets: JUPITER! Jupiter is so huge that ALL the other planets in our solar system could fit inside it. It's a giant swirly ball of gas with stormy bands of clouds, and the most famous spot is the GREAT RED SPOT — a hurricane bigger than Earth that has been spinning for over 350 years! Jupiter is also the planet with the MOST moons: 95 known so far! The four biggest are called the Galilean moons because Galileo spotted them through his telescope 400 years ago. Tap them to meet each one — Io with its volcanoes, frozen Europa with a hidden ocean, mighty Ganymede (the BIGGEST moon in the whole solar system, bigger than Mercury!), and cratered Callisto.",
        funFact: 'Jupiter has a faint ring system too — it is just very hard to see because it is made of dark dust!',
        game: {
          type: 'matching',
          instruction: 'Match each Jupiter moon to its special trait!',
          pairs: [
            { id: 'p1', left: 'Io', right: 'Most volcanoes' },
            { id: 'p2', left: 'Europa', right: 'Hidden ocean' },
            { id: 'p3', left: 'Ganymede', right: 'Biggest moon' },
            { id: 'p4', left: 'Callisto', right: 'Most craters' },
          ],
          celebrationMessage: 'Galilean moon expert!',
        },
      },
      {
        id: 'space-mars',
        name: 'Red Planet Mars',
        emoji: '🔴',
        visual: 'mars-rover',
        introNarration:
          "Speaking of planets — let's pay a special visit to MARS, the rusty Red Planet! Mars is our next-door neighbor, and it's red because the dirt all over its surface is full of IRON that has rusted, just like an old bicycle left out in the rain. Mars has the BIGGEST volcano in the whole solar system — a giant called Olympus Mons that is three times taller than Mount Everest! It even has two tiny lumpy moons named Phobos and Deimos. Right now, real robot ROVERS are driving around on Mars, taking photos, drilling rocks, and looking for clues that tiny life might once have lived there. One day soon, real human astronauts might walk on Mars too. Could that be YOU?",
        funFact: 'A day on Mars is only 40 minutes longer than a day on Earth — so a Martian afternoon would feel just like yours!',
        game: {
          type: 'question',
          instruction: 'Mars question!',
          question: 'Why is Mars red?',
          options: ['It is on fire', 'Its dirt is full of rust', 'It is shy', 'Its sky is red'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Rusty iron dirt makes Mars look red!',
          hintOnWrong: 'Think about what happens to a metal bike left out in the rain!',
        },
      },
      {
        id: 'space-moon',
        name: 'Our Moon',
        emoji: '🌙',
        visual: 'moon-phases',
        introNarration:
          "Whew — after zooming past all 8 planets, we're cruising back toward our home, Earth. And look right outside the rocket window! That bright, glowing ball is the MOON, Earth's best buddy. Here's a sneaky secret — the Moon doesn't actually make its own light! It shines because sunlight bounces off its dusty gray surface like a giant night-light. The Moon goes around Earth once every 27 days, and as it travels, the Sun lights up different parts of it. That's why the Moon seems to change shape! These are called PHASES — from invisible New Moon, to a thin crescent, to a glowing Full Moon, then back again. Tap each moon below to watch the cycle unfold!",
        funFact: 'Twelve brave humans have walked on the Moon, and their footprints are STILL there because there is no wind to blow them away!',
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
        visual: 'constellations',
        introNarration:
          "When the Sun sets behind Earth and the sky goes dark, something magical appears: thousands of twinkly STARS! Here's the wildest part — every single star is actually a giant Sun, just like ours. They look tiny because they are SO far away that their light takes YEARS and years to reach us. Some of the stars you see tonight stopped shining long, long ago — but their light is still zooming across space to your eyes! Long ago, people noticed that some stars team up to make sky pictures called CONSTELLATIONS — like the Big Dipper (a giant soup spoon), Orion's Belt (three stars in a perfect row), and Cassiopeia (a queen on her throne). Tap the buttons below to draw each one in the sky!",
        funFact: 'There are more stars in the sky than grains of sand on every beach on Earth — over a billion trillion!',
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
        id: 'space-comets',
        name: 'Comets & Asteroids',
        emoji: '☄️',
        visual: 'comet-swoop',
        introNarration:
          "Look up there — WHOOSH! What is that streaking through the stars? It's a COMET! Comets are like dirty cosmic snowballs made of ice, rock, and dust, leftover from when the planets were born. When a comet gets close to the Sun, the warmth boils away its ice, leaving a long sparkly TAIL that stretches for millions of miles. And those rocky lumps tumbling below? Those are ASTEROIDS — chunks of space rock that didn't quite become planets. Most of them hang out in a giant ring between Mars and Jupiter called the Asteroid Belt. Some are tiny like a pebble; others are the size of a whole city. Cool but scary, right?",
        funFact: 'A famous comet named Halley swings past Earth only once every 76 years — the next visit is in 2061!',
        game: {
          type: 'matching',
          instruction: 'Match each cosmic visitor to what it is!',
          pairs: [
            { id: 'p1', left: 'Comet', right: 'Icy snowball with a tail' },
            { id: 'p2', left: 'Asteroid', right: 'Chunk of space rock' },
            { id: 'p3', left: 'Meteor', right: 'Shooting star streak' },
          ],
          celebrationMessage: 'Space rock expert!',
        },
      },
      {
        id: 'space-blackholes',
        name: 'Black Holes & Galaxies',
        emoji: '🌌',
        visual: 'black-hole',
        introNarration:
          "Buckle up, because we are about to meet the SPOOKIEST thing in space — a BLACK HOLE! A black hole is a place where gravity pulls SO hard that not even light can escape. That's why it looks like a perfect dark circle in the middle of the glow! Black holes form when a giant star runs out of fuel and squishes itself smaller, smaller, smaller. Don't worry — they are very, very far away. And speaking of far... the Sun, all 8 planets, and billions of other stars all live together in a giant swirly group called a GALAXY. Our galaxy is called the MILKY WAY, and it looks like a glowing river of starlight across the night sky. Beyond it are billions MORE galaxies. Space is HUGE!",
        funFact: 'There is a giant black hole at the center of our Milky Way galaxy — it is 4 million times heavier than the Sun!',
        game: {
          type: 'question',
          instruction: 'Galaxy quiz!',
          question: 'What is the name of our galaxy?',
          options: ['Chocolate Bar', 'Milky Way', 'Cosmic River', 'Big Burger'],
          correctIndex: 1,
          celebrationMessage: 'Yes! We live in the MILKY WAY galaxy!',
          hintOnWrong: 'It sounds like a yummy candy bar...',
        },
      },
      {
        id: 'space-iss',
        name: 'Living in Space',
        emoji: '🛰️',
        visual: 'space-station',
        introNarration:
          "Wait — did you know that RIGHT NOW, there are real humans LIVING in space? Look up at the night sky and you might spot a tiny moving dot — that's the INTERNATIONAL SPACE STATION, or ISS, a giant floating science lab the size of a football field, zooming 250 miles above Earth at 17,500 miles per hour. It circles our planet so fast that astronauts on board see 16 SUNRISES every day! Inside, they float because they are constantly falling around Earth (gravity still works — they just keep missing the ground). They sleep in zipped sleeping bags strapped to the wall so they don't bonk into things, drink juice from special pouches, eat sticky food, and even step OUTSIDE in puffy spacesuits to fix the station. Tap the cards below to peek at life floating in orbit!",
        funFact: 'The ISS has been continuously occupied by humans since the year 2000 — so for over 25 years, someone has always been living in space!',
        game: {
          type: 'question',
          instruction: 'Space station quiz!',
          question: 'Why do astronauts float inside the ISS?',
          options: [
            'There is no gravity in space',
            'The station is falling around Earth',
            'They wear special floating shoes',
            'The air is extra fluffy',
          ],
          correctIndex: 1,
          celebrationMessage: 'Yes! They are constantly falling — like a roller coaster that never lands!',
          hintOnWrong: 'Gravity actually still works up there — what matters is they keep missing Earth!',
        },
      },
      {
        id: 'space-rockets',
        name: 'Rockets & Astronauts',
        emoji: '🚀',
        visual: 'rocket-launch',
        introNarration:
          "We've toured the Sun, the planets, the Moon, the stars, and even the spooky black holes — but hey, wait... how did we even GET out here?! With a ROCKET! Rockets are giant tubes that blast roaring hot fire out their bottoms, and that fire PUSHES them up, up, UP into space. The faster a rocket flies, the higher it climbs — it has to zoom 25 times faster than the speediest jet to break free of Earth's gravity! The brave humans riding inside are called ASTRONAUTS. Once they reach space, they FLOAT around because there's no gravity to pull them down. They sleep in zipped-up sleeping bags strapped to the wall, drink juice from special pouches, and sometimes step OUTSIDE in big puffy spacesuits to fix things. Ready? Let's count down a launch — tap the rocket button below!",
        funFact: 'Astronauts grow about 2 inches taller in space because there is no gravity squishing them — then they shrink back when they come home!',
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
        "Wow, you finished all 11 space stops! Now let's see if you remember everything. Answer these 6 questions to earn your Space Captain badge!",
      passingScore: 4,
      questions: [
        {
          type: 'question',
          instruction: 'Question 1 of 6',
          question: 'How many planets go around our Sun?',
          options: ['5', '8', '12', '100'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Think about all the planets we visited!',
        },
        {
          type: 'question',
          instruction: 'Question 2 of 6',
          question: 'The Sun is a...',
          options: ['Planet', 'Star', 'Moon', 'Comet'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It is the same kind of thing you see twinkling at night!',
        },
        {
          type: 'question',
          instruction: 'Question 3 of 6',
          question: 'Which planet has the most amazing icy rings?',
          options: ['Mercury', 'Earth', 'Saturn', 'Neptune'],
          correctIndex: 2,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Trillions of ice chunks make its famous sparkly belt!',
        },
        {
          type: 'question',
          instruction: 'Question 4 of 6',
          question: 'Which is the BIGGEST planet in our solar system?',
          options: ['Mars', 'Jupiter', 'Earth', 'Pluto'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Its Great Red Spot is bigger than Earth!',
        },
        {
          type: 'question',
          instruction: 'Question 5 of 6',
          question: 'Why do astronauts float in the ISS?',
          options: [
            'There is no gravity in space',
            'They are constantly falling around Earth',
            'They wear floating shoes',
            'The air is fluffier',
          ],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Gravity still works — they just keep missing the ground!',
        },
        {
          type: 'question',
          instruction: 'Question 6 of 6',
          question: 'What is the name of our galaxy?',
          options: ['Milky Way', 'Andromeda', 'Cosmic Pizza', 'Big Dipper'],
          correctIndex: 0,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It sounds like a yummy candy bar!',
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
        visual: 'mammal-parade',
        introNarration:
          "Back on Earth! Let's swap our space helmets for safari hats — we're off to explore the wild ANIMAL KINGDOM. Earth has over 8 MILLION different kinds of animals, so we'll start with one super fluffy family: the MAMMALS. Mammals share four big things in common: they have FUR or HAIR, they are WARM-blooded (their bodies make their own heat like little furnaces), they breathe AIR with lungs, and most baby mammals drink MILK from their mom. Mammals come in every shape — tiny mouse-sized bats, enormous blue whales bigger than three school buses, fluffy puppies, even slow-poke sloths that nap upside-down! Here's the secret of secrets — YOU are a mammal too. Dogs, cats, lions, whales, and you are all in the same warm, furry family.",
        funFact: 'Blue whales are the biggest mammals — and the biggest animal EVER to live on Earth, bigger even than the dinosaurs!',
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
        visual: 'habitat-zones',
        introNarration:
          "Now that we've met the mammals, here's a big question — where do all the animals LIVE? The special place each animal calls home is called a HABITAT. Some habitats are freezing cold, some are baking hot, some are wet, some are dry — and every single animal has a body PERFECTLY designed for its own habitat. A polar bear has SO much thick fur and even a layer of fat to stay cozy in the icy Arctic. A camel has humps that store fat for snacks and can drink 30 gallons of water at once in the burning desert. A jungle monkey has super-long arms to swing from vine to vine, and fish have GILLS to breathe underwater. Tap each habitat below to meet its champion!",
        funFact: 'A camel can drink 30 gallons of water in just 13 minutes — that\'s 480 cups in the time you eat a snack!',
        game: {
          type: 'matching',
          instruction: 'Match each animal to its home!',
          pairs: [
            { id: 'p1', left: 'Fish', right: 'Ocean' },
            { id: 'p2', left: 'Polar Bear', right: 'Arctic ice' },
            { id: 'p3', left: 'Monkey', right: 'Jungle trees' },
            { id: 'p4', left: 'Camel', right: 'Desert sand' },
          ],
          celebrationMessage: 'Every animal back home safely!',
        },
      },
      {
        id: 'animals-birds',
        name: 'Feathered Friends',
        emoji: '🦜',
        visual: 'bird-flock',
        introNarration:
          "Look UP into the SKY habitat — tweet tweet, that's the BIRDS calling! Birds have something no other animal on Earth has: FEATHERS, soft and fluffy and perfect for flying. They hatch from hard-shelled eggs, they have hollow bones that make them light enough to soar, and they have BEAKS instead of teeth — different shapes for different snacks. From the tiny hummingbird (no bigger than your thumb!) to bald eagles soaring above mountains, birds are masters of the sky. Some birds even fly together in a V-shape, taking turns at the front to share the work — just like cyclists in a race!",
        funFact: 'The hummingbird flaps its wings 80 times every SECOND — so fast they hum like a tiny motor!',
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
        id: 'animals-bugs',
        name: 'Buzzing Bugs',
        emoji: '🐝',
        visual: 'bug-garden',
        introNarration:
          "Look DOWN at the grass and flowers — buzz buzz, flutter flutter! There are MORE INSECTS on Earth than every other animal combined. Insects have 3 body parts (head, chest, belly), 6 legs, and most have antennae for smelling and feeling. Bees buzz from flower to flower collecting sugary nectar and helping plants make seeds. Butterflies start life as wriggly caterpillars, then build a chrysalis and transform into colorful flying jewels — that's called METAMORPHOSIS! Ants are mighty for their size — they can lift things 50 times heavier than themselves. That's like YOU lifting a hippo!",
        funFact: 'There are 10 quintillion insects alive on Earth right now — that\'s 1.4 billion bugs for every single person!',
        game: {
          type: 'ordering',
          instruction: 'Put a butterfly\'s life cycle in order!',
          items: [
            { id: 'egg', label: 'Egg', emoji: '🥚' },
            { id: 'caterpillar', label: 'Caterpillar', emoji: '🐛' },
            { id: 'chrysalis', label: 'Chrysalis', emoji: '🛏️' },
            { id: 'butterfly', label: 'Butterfly', emoji: '🦋' },
          ],
          correctOrder: ['egg', 'caterpillar', 'chrysalis', 'butterfly'],
          celebrationMessage: 'Magnificent metamorphosis!',
        },
      },
      {
        id: 'animals-ocean',
        name: 'Ocean Wonders',
        emoji: '🐠',
        visual: 'ocean-reef',
        introNarration:
          "SPLASH! Let's dive DOWN into the OCEAN — the biggest habitat on the planet, covering 70% of Earth! Below the waves live some of the strangest, most beautiful animals you can imagine. Wiggly octopuses have 8 arms, 3 hearts, BLUE blood, and can squeeze through cracks the size of a coin. Smiley dolphins talk to each other in clicks and whistles, and they sleep with only HALF their brain at a time. Giant whales sing deep songs that travel for hundreds of miles underwater. Rainbow-colored fish dart between coral reefs like little swimming jewels. And glowing jellyfish drift through the dark like ghosts. The ocean is FULL of magic!",
        funFact: 'An octopus has 3 hearts and BLUE blood — and can taste with its arms!',
        game: {
          type: 'matching',
          instruction: 'Match each ocean animal to its special trick!',
          pairs: [
            { id: 'p1', left: 'Octopus', right: '8 wiggly arms' },
            { id: 'p2', left: 'Dolphin', right: 'Super smart swimmer' },
            { id: 'p3', left: 'Shark', right: 'Lots of sharp teeth' },
            { id: 'p4', left: 'Whale', right: 'Sings songs for miles' },
          ],
          celebrationMessage: 'You are a sea-creature genius!',
        },
      },
      {
        id: 'animals-reptiles',
        name: 'Cool Reptiles',
        emoji: '🦎',
        visual: 'reptile-rock',
        introNarration:
          "Splash — back on dry land! Time to meet the COLD-BLOODED crew: the REPTILES. Snakes that slither, lizards that dart, turtles that move slow and steady, and crocodiles that smile with very sharp teeth — they all have SCALY skin and most lay eggs. Here's the trick that makes reptiles special: their bodies can't make their own heat like mammals can. So they sunbathe on warm rocks to power UP, then slow down and rest when it's cold. Reptile super-powers? Some snakes have venom strong enough to make their dinner sleepy. Some lizards can drop their tail to escape (it grows back!). And chameleons can change color RIGHT in front of your eyes!",
        funFact: 'A baby chameleon can change colors just minutes after it hatches — born ready to disguise!',
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
      {
        id: 'animals-amphibians',
        name: 'Pond Amphibians',
        emoji: '🐸',
        visual: 'frog-pond',
        introNarration:
          "Hop on over to the POND for one of the most amazing animal groups: AMPHIBIANS. Amphibians are double-trouble — they can live BOTH in water AND on land! That's actually what their name means in Greek: 'two lives.' Frogs, toads, salamanders, and newts are all amphibians. They have smooth, slimy skin (which helps them breathe!), they hatch from jelly-soft eggs in the water, and they go through a wild change as they grow. A baby frog is called a TADPOLE — it has a tail and lives underwater. Then slowly it sprouts legs, loses its tail, hops onto land, and BOOP — it's a frog! That's another kind of metamorphosis. Magic!",
        funFact: 'A frog drinks water by SOAKING it through its skin — like a tiny living sponge!',
        game: {
          type: 'ordering',
          instruction: 'Put the frog life cycle in order!',
          items: [
            { id: 'egg', label: 'Frog egg', emoji: '🥚' },
            { id: 'tadpole', label: 'Tadpole', emoji: '🐟' },
            { id: 'legs', label: 'Tadpole with legs', emoji: '🦵' },
            { id: 'frog', label: 'Frog', emoji: '🐸' },
          ],
          correctOrder: ['egg', 'tadpole', 'legs', 'frog'],
          celebrationMessage: 'Hop, hop, hooray!',
        },
      },
      {
        id: 'animals-dinosaurs',
        name: 'Mighty Dinosaurs',
        emoji: '🦖',
        visual: 'dino-walk',
        introNarration:
          "ROAR! Hop in our time-machine — we're going back 65 million years to meet the most LEGENDARY animals ever: the DINOSAURS! Dinosaurs were giant reptile-cousins who ruled the Earth for 165 MILLION years (humans have only been around for a couple hundred thousand). Some, like Tyrannosaurus Rex, had bone-crushing jaws and sharp teeth the size of bananas. Others like the long-necked Brachiosaurus were as tall as buildings but only ate plants. Some had armor plates, some had spikes, some had feathers, and some even flew! Then one day, a HUGE space rock crashed into Earth and changed the weather forever. Most dinosaurs went extinct... but their tiny cousins — BIRDS — are still here today. Yep, every bird you see is a baby T-Rex!",
        funFact: 'A T-Rex tooth was longer than a banana — and it could grow a new one every time one fell out!',
        game: {
          type: 'question',
          instruction: 'Dino quiz!',
          question: 'Which animals alive today are related to dinosaurs?',
          options: ['Cats', 'Birds', 'Fish', 'Spiders'],
          correctIndex: 1,
          celebrationMessage: 'Yes! Birds are tiny modern-day dinosaurs!',
          hintOnWrong: 'Look up at the sky — they have feathers and lay eggs!',
        },
      },
    ],
    checkpoint: {
      id: 'cp-animals',
      topicId: 'animals',
      title: 'Animal Expert Test! 🦁',
      introNarration: "You met SO many animals! Time for 5 questions to earn your Animal Expert badge!",
      passingScore: 3,
      questions: [
        {
          type: 'question',
          instruction: 'Question 1 of 5',
          question: 'Mammals have what on their body?',
          options: ['Scales', 'Feathers', 'Fur or hair', 'Slime'],
          correctIndex: 2,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Think about a fluffy puppy!',
        },
        {
          type: 'question',
          instruction: 'Question 2 of 5',
          question: "An animal's home is called a...",
          options: ['Habitat', 'Hotel', 'House', 'Hat'],
          correctIndex: 0,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Starts with H... HAB-i-tat!',
        },
        {
          type: 'question',
          instruction: 'Question 3 of 5',
          question: 'How many legs does an insect have?',
          options: ['4', '6', '8', '10'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Count them: head, chest, belly... 6!',
        },
        {
          type: 'question',
          instruction: 'Question 4 of 5',
          question: 'A baby frog is called a...',
          options: ['Puppy', 'Tadpole', 'Cub', 'Kit'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It swims like a tiny fish before growing legs!',
        },
        {
          type: 'question',
          instruction: 'Question 5 of 5',
          question: 'Which animals alive today are related to dinosaurs?',
          options: ['Cats', 'Fish', 'Birds', 'Spiders'],
          correctIndex: 2,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'They have feathers and lay eggs!',
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
          "Look UP at the sky, cadet! Sunshine, clouds, rain — but where does it all come from? Here's a magical secret: water goes on a forever JOURNEY called the WATER CYCLE. The Sun heats up oceans and lakes, the warm water rises UP as invisible steam, it gathers into fluffy clouds, and when the clouds get heavy enough — SPLASH! — it rains back down. Then the whole journey starts over again. The water you drank today might've been a raindrop yesterday!",
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
          "Sometimes those rain clouds get extra HUGE and dark — and then the sky throws a wild party called a THUNDERSTORM! Inside a storm cloud, billions of tiny ice crystals rub against each other so fast they make ELECTRICITY. That electricity ZAPS down as LIGHTNING, a giant blue-white spark hotter than the Sun! The lightning is SO hot it makes the air explode, and that explosion is the loud BOOM of THUNDER. You always see lightning before you hear thunder because light zooms faster than sound!",
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
          "Now that the storm has passed, let's look at the CLOUDS more closely. Did you know clouds are made of millions of itty-bitty water drops and ice crystals floating in the air? Even though clouds look soft and pillowy, a regular puffy cloud can weigh as much as a hundred elephants! Different cloud shapes tell you different weather stories: fluffy white = sunny day, dark gray = rain coming, and thin wispy ones way up high mean fair skies ahead.",
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
          "Clouds and storms come and go each day — but Earth's weather also changes in a BIGGER pattern across the whole year. We call these the four SEASONS! In SPRING, flowers bloom and animals wake up. SUMMER is hot and sunny — perfect for swimming. In FALL, the leaves turn fiery orange and red, then float down. WINTER blankets everything in cold, white snow. The seasons take turns because Earth is TILTED like a spinning top, and that little tilt is the secret recipe for our seasons!",
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
          "And speaking of winter — when the air gets really REALLY cold, the rain freezes into something straight out of a fairy tale: SNOWFLAKES! Each snowflake is a teeny six-sided star made of ice crystals. And here's the wildest thing of all: NO TWO SNOWFLAKES have ever been exactly the same. Every single one is a unique tiny work of art quietly drifting down from the clouds. Catch one on your tongue — it's a one-of-a-kind treasure!",
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
          "Ready for the smallest, coolest adventure yet? We're going INSIDE your own body! Put your hand right on your chest. Feel that? THUMP THUMP, THUMP THUMP. That's your HEART! Your heart is a tireless muscle about the size of your fist. Its full-time job is to PUMP blood through your whole body — like a tiny brave engine that NEVER takes a break, not even when you're sleeping. Your heart is the captain of Team You!",
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
          "Now let's travel UP from your heart, all the way to your head. There, snuggled safely inside your skull, is the BOSS of your whole body: your BRAIN! Your brain is like a squishy supercomputer. It tells your heart to pump, your legs to run, your eyes to blink, and even helps you remember your best friend's name. Right this second, your brain is doing something amazing — it's learning all about ITSELF!",
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
          "Your brain is the boss and your heart is the engine — but how do you stand up tall? With your skeleton! Inside your body is a strong frame made of 206 BONES, all working together. Without bones, you'd flop down like a wet noodle! Some bones are SUPER tiny — the smallest one is inside your ear and is smaller than a grain of rice. The biggest is in your leg, and it helps you run, jump, and dance. Bones are awesome!",
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
          "Okay! Bones hold you up, your heart pumps, and your brain bosses everything — but how do you actually KNOW what's happening around you? With FIVE super-powers called SENSES! You SEE with your eyes, HEAR with your ears, SMELL with your nose, TASTE with your tongue, and FEEL with your skin. Each sense rushes little messages up to your brain, faster than a text message, so you always know what's going on in the world. Your senses are like Team You's spies!",
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
          "There's one last hero to meet on Team You! Take a big breath in... and slowly out. That was your LUNGS at work! Lungs are like two big squishy balloons inside your chest. When you breathe in, they grab OXYGEN from the air — the magic gas your blood carries to every part of your body, including your heart and brain. Without lungs, the whole team would run out of fuel. So next time you take a deep breath — thank your lungs!",
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
          "Look around! Green leaves, soft grass, towering trees — plants are EVERYWHERE on Earth. But how does a tiny seed turn into a giant plant? Here's the recipe: plants need just 3 ingredients! SUNLIGHT to make food, WATER to drink, and SOIL to grow in. Roots slurp up the water, leaves catch the sunlight, and slowly... slowly... they grow up, up, UP. The wildest secret? Plants actually EAT sunlight — they're the only living things that can!",
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
          "Now that we know what plants NEED, let's meet the team that does all the work! Every plant has 4 parts working together. The ROOTS dig down deep into the soil and slurp up water like a thousand little straws. The STEM stands tall and carries water up to the top. The LEAVES are flat green solar panels that catch sunlight and turn it into food. And the FLOWERS are where new SEEDS are made to start the next generation. Teamwork!",
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
          "Let's zoom in on those FLOWERS for a closer look! Flowers aren't just pretty — they have a secret sneaky mission. Their bright colors and sweet smells are like a sign saying 'BEES, COME HERE!' When a bee lands to slurp sugary nectar, it accidentally collects yellow dust called POLLEN on its furry legs. When the bee flies to the next flower, the pollen drops off, and that's how new seeds start! Bees and flowers are best friends helping each other.",
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
          "After bees help flowers make SEEDS, here's the next big question — how do seeds get to NEW places to grow? Plants can't walk, so they got SUPER clever! Some seeds have tiny fluffy parachutes and FLY on the wind for miles. Some seeds are sticky burrs that hitchhike on the fur of animals walking by. And some seeds are bright tasty berries that birds gobble up, then... ahem... plant in their poop! 💩 Seeds are sneaky little travelers.",
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
          "When a tiny seed lands in the perfect spot — sunny, watered, snuggled into rich soil — it can grow into the biggest plant of all: a TREE! Trees can live for hundreds, even THOUSANDS of years and grow taller than tall buildings. They give us shade on hot days, fruit to eat, and cozy homes for birds, squirrels, and bugs. And best of all? Their leaves make OXYGEN — the same magic gas your lungs LOVE. Thank you, trees!",
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
