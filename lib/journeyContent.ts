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
        "Wow, you finished all 8 space stops! Now let's see if you remember everything. Answer these 5 questions to earn your Space Captain badge!",
      passingScore: 3,
      questions: [
        {
          type: 'question',
          instruction: 'Question 1 of 5',
          question: 'How many planets go around our Sun?',
          options: ['5', '8', '12', '100'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Think about all the planets we visited!',
        },
        {
          type: 'question',
          instruction: 'Question 2 of 5',
          question: 'What goes around the Earth?',
          options: ['The Sun', 'The Moon', 'Mars', 'Jupiter'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It glows at night...',
        },
        {
          type: 'question',
          instruction: 'Question 3 of 5',
          question: 'The Sun is a...',
          options: ['Planet', 'Star', 'Moon', 'Comet'],
          correctIndex: 1,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'It is the same kind of thing you see twinkling at night!',
        },
        {
          type: 'question',
          instruction: 'Question 4 of 5',
          question: 'Which planet is called the Red Planet?',
          options: ['Venus', 'Saturn', 'Mars', 'Mercury'],
          correctIndex: 2,
          celebrationMessage: 'Correct!',
          hintOnWrong: 'Its rusty dirt makes it look red!',
        },
        {
          type: 'question',
          instruction: 'Question 5 of 5',
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
        introNarration:
          "Back on Earth! Let's swap our space helmets for safari hats — we're off to explore the wild ANIMAL KINGDOM. Earth has MILLIONS of different animals, so we'll start with one super fluffy family: the MAMMALS. Mammals are warm-bodied, have FUR or HAIR, breathe air, and most baby mammals drink milk from their mom. Here's a secret — YOU are a mammal too! Dogs, cats, lions, whales, and you are all in the same furry family.",
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
          "Now that we've met the mammals, here's a big question — where do all the animals LIVE? The special place each animal calls home is called a HABITAT. A polar bear's habitat is freezing icy snow. A monkey's habitat is the warm leafy jungle. A fish's habitat is a wet, salty ocean. Every animal has a body perfectly built for its own habitat. A polar bear has thick fur for the cold, and a monkey has long arms for swinging in trees!",
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
          "Speaking of habitats — let's look UP at the sky habitat! Tweet tweet, that's the BIRDS calling. Birds have something no other animal has: FEATHERS — light, fluffy, perfect for flying. They also hatch from eggs and they have beaks instead of teeth. From the tiny hummingbird (the size of your thumb!) to giant eagles that soar above mountains, birds are masters of the sky.",
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
          "Birds rule the sky — now let's dive DOWN into the ocean habitat! SPLASH! Below the waves live some of the strangest, most beautiful animals on the planet. Wiggly octopuses with 8 arms can squeeze through tiny cracks. Smiley dolphins talk to each other in clicks and whistles. Giant whales sing songs that travel for miles underwater. And rainbow-colored fish dart between coral reefs like little swimming jewels!",
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
          "Splash — back on dry land! Time to meet the COLD-BLOODED crew: the REPTILES. Snakes that slither, lizards that dart, turtles that go slow and steady, and crocodiles that smile with sharp teeth — they all have SCALY skin and lay eggs. Here's the trick: reptile bodies can't make their own heat like mammal bodies can. So they sunbathe on warm rocks to power up, and slow down when it's cold. Pretty smart, right?",
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
